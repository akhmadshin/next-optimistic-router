# next-optimistic-router

> This library makes navigation truly instantaneous, without prefetching or caching. Also you can think about that library as a glue between next.js and tanstack-query/swr.

## Installation


```sh
$ npm install next-optimistic-router
```
```sh
$ yarn add next-optimistic-router
```

## Usage with @tanstack/react-query

### 1) Wrap _app into OptimisticRouterProvider

```tsx
import "@/styles/globals.css";
import type { AppProps } from "next/app";
import singletonRouter from 'next/dist/client/router';
import { OptimisticRouterProvider } from 'next-optimistic-router';

export default function App({ Component, pageProps }: AppProps) {
  return (
    <OptimisticRouterProvider singletonRouter={singletonRouter}>
      <Component {...pageProps} />
    </OptimisticRouterProvider>
  );
}
```

### 2) Wrap getServerSideProps/getStaticProps functions

#### Handling getServerSideProps
Create a file withSSRTanStackQuery.ts
```ts
import { ParsedUrlQuery } from 'querystring';
import { GetServerSideProps, GetServerSidePropsContext, GetServerSidePropsResult } from 'next';
import { dehydrate, QueryClient } from '@tanstack/react-query';

function removeTrailingSlash(route: string) {
  return route.replace(/\/$/, '') || '/'
}

const normalizeResolvedUrl = (resolvedUrl: string) => {
  const normalizedResolvedUrl = removeTrailingSlash(resolvedUrl);
  const pathnameAndQuery = normalizedResolvedUrl.split('?') as [string, string];
  let pathname = pathnameAndQuery[0];
  const query = pathnameAndQuery[1];

  if (process.env.__NEXT_TRAILING_SLASH && pathname !== '/') {
    pathname = `${pathname}/`
  }

  if (query) {
    return `${pathname}?${query}`
  }
  return pathname;
}

export const withSSRTanStackQuery = <T extends object, Q extends ParsedUrlQuery = ParsedUrlQuery>(getServerSideProps: GetServerSideProps<T, Q>) => async (
  props: GetServerSidePropsContext<Q>,
) => {
  const queryKey = normalizeResolvedUrl(props.resolvedUrl);
  let result: GetServerSidePropsResult<T> | undefined = undefined;
  const queryClient = new QueryClient();

  await queryClient.prefetchQuery({
    queryKey: [queryKey],
    queryFn: async () => {
      result = await getServerSideProps(props) as { props: T | Promise<T> };
      return result?.props;
    }
  })

  if (!result) {
    return;
  }

  if (!(result as { props: T | Promise<T> }).props) {
    return result;
  }

  return {
    props: {
      dehydratedState: dehydrate(queryClient),
    },
  }
}
```
Wrap getServersideProps functions like this
```ts
export const getServerSideProps = withSSRTanStackQuery<ArticleItemApi, { slug: string }>(async ({ params }) => {
  const { slug } = params ?? {};
  try {
    const article = await fetchArticle(slug);
    return {
      props: article,
    }
  } catch (e) {
    return {
      notFound: true,
    }
  }
})
```

#### Handling getStaticProps
Create file withSSGTanStackQuery.ts
```ts
import { ParsedUrlQuery } from 'querystring';
import {
  GetServerSidePropsResult,
  GetStaticProps,
  GetStaticPropsContext
} from 'next';
import { dehydrate, QueryClient } from '@tanstack/react-query';

function removeTrailingSlash(route: string) {
  return route.replace(/\/$/, '') || '/'
}

const normalizePathname = (resolvedUrl: string) => {
  const normalizedResolvedUrl = removeTrailingSlash(resolvedUrl);
  let pathname = normalizedResolvedUrl.split('?')[0];
  if (process.env.__NEXT_TRAILING_SLASH) {
    pathname = `${pathname}/`
  }
  return pathname;
}

export const withSSGTanStackQuery = <T extends object, Q extends ParsedUrlQuery = ParsedUrlQuery>(getPath: (context: Q) => string, getStaticProps: GetStaticProps<T, Q>) => async (
  props: GetStaticPropsContext<Q>,
) => {
  const queryKey = normalizePathname(getPath(props.params!));
  let result: GetServerSidePropsResult<T> | undefined = undefined;
  const queryClient = new QueryClient();

  await queryClient.prefetchQuery({
    queryKey: [queryKey],
    queryFn: async () => {
      result = await getStaticProps(props) as { props: T | Promise<T> };
      return result?.props;
    }
  })

  if (!result) {
    return;
  }

  if (!(result as { props: T | Promise<T> }).props) {
    return result;
  }

  return {
    props: {
      dehydratedState: dehydrate(queryClient),
    },
  }
}
```
And wrap getStaticProps functions like this

```ts
export const getStaticProps = withSSGTanStackQuery<ArticleItemApi, { slug: string }>(({ slug }) => `/blog/${slug}/`, async ({ params }) => {
  const { slug } = params ?? {};
  try {
    const article = await fetchArticle(slug)
    return {
      props: article,
    }
  } catch (e) {
    return {
      notFound: true,
    }
  }
})
```
You must pass getPath function. That callback gets params as an argument and must return path of the page. In example above we return `/blog/${slug}/`
```text
pages/
└── blog/
    └── [slug]/
        └── index.tsx
```

### 3) Create usePageData hook
```ts
import { DehydratedState, useQuery } from '@tanstack/react-query';
import { usePageDataOptions } from '@/components/next-optimistic-router';
import { useRouter } from 'next/router';

export const usePageData = <T>() => {
  const router = useRouter();
  const { queryKey, queryFn } = usePageDataOptions(router, Boolean(process.env.__NEXT_TRAILING_SLASH));
  const placeholderData = typeof window === 'undefined' ? undefined : window.placeholderData;

  return useQuery<unknown, unknown, T>({
    queryKey,
    queryFn: () => queryFn().then((props: { dehydratedState: DehydratedState}) => {
      return props?.dehydratedState ? props.dehydratedState.queries[0].state.data : props;
    }),
    placeholderData,
    staleTime: 5 * 60 * 1000,
  });
}
```
And use it to get data from getServerSideProps/getStaticProps functions

```ts
const { data: article, isLoading, isFetching, isStale} = usePageData<BlogItemPageProps>();
```

### 4) Create OptimisticLink component

```tsx
import type { LinkProps } from 'next/link';
import NextLink from 'next/link';
import singletonRouter from 'next/router';
import { handleOptimisticNavigation } from 'next-optimistic-router';
import type { AnchorHTMLAttributes, MouseEvent, PropsWithChildren } from 'react';
import React from 'react';
import console = require('console');

type NextLinkProps = PropsWithChildren<Omit<AnchorHTMLAttributes<HTMLAnchorElement>, keyof LinkProps> &
  LinkProps>

export const Link: React.FC<PropsWithChildren<NextLinkProps>> = (props) => {
  const {
    onClick,
    children,
    ...restProps
  } = props;

  const handleClick = (e: MouseEvent<HTMLAnchorElement>) => {
    if (onClick) {
      onClick(e);
    }
    handleOptimisticNavigation(props.href, singletonRouter);
  }

  return (
    <NextLink
      onClick={handleClick}
      {...restProps}
    >
      {children}
    </NextLink>
  )
}
```

Use OptimisticLink component like regular next/link component