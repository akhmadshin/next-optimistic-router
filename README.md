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
If you have middleware file with NextResponse.rewrite calls for some routes, you won't see changes in link behaviour when
navigating to those routes. To fix it, you need to duplicate rewrite logic from middleware in pathModifier function.
Let's consider you have middleware file like this

```ts
import { NextRequest, NextResponse } from 'next/server'

const PUBLIC_FILE = /\.(.*)$/

export async function middleware(req: NextRequest) {
  if (
    req.nextUrl.pathname.startsWith('/_next') ||
    req.nextUrl.pathname.includes('/api/') ||
    PUBLIC_FILE.test(req.nextUrl.pathname)
  ) {
    return
  }

  if (req.nextUrl.locale === 'default') {
    const locale = 'en'

    return NextResponse.redirect(
      new URL(`/${locale}${req.nextUrl.pathname}${req.nextUrl.search}`, req.url)
    )
  }
}
```
And your _app file will look like this
```tsx
import "@/styles/globals.css";
import type { AppProps } from "next/app";
import process from 'process';
import singletonRouter from 'next/dist/client/router';
import { useCallback } from 'react';
import { OptimisticRouterProvider } from 'next-optimistic-router';

export default function App({ Component, pageProps }: AppProps) {
  const pathModifier = useCallback((pathname: string) => {
    const defaultLocale = process.env.NEXT_PUBLIC_DEFAULT_LOCALE;
    const localeCodes = process.env.NEXT_PUBLIC_LOCALES!.split(',');

    if (localeCodes.every((code) => !pathname.startsWith(`/${code}`))) {
      pathname = `/${defaultLocale}${pathname}`;
    }

    return pathname;
  }, []);

  return (
    <OptimisticRouterProvider pathModifier={pathModifier} singletonRouter={singletonRouter}>
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
  if (process.env.__NEXT_TRAILING_SLASH) {
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
      try {
        result = await getServerSideProps(props) as { props: T | Promise<T> };
        return result?.props;
      } catch (e) {
        console.log('e = ', e);
      }
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

export const withSSGTanStackQuery = <T extends object, Q extends ParsedUrlQuery = ParsedUrlQuery>(getPathname: (context: Q) => string, getStaticProps: GetStaticProps<T, Q>) => async (
  props: GetStaticPropsContext<Q>,
) => {
  const queryKey = normalizePathname(getPathname(props.params!));
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
import { useQuery } from '@tanstack/react-query';
import { usePageDataOptions } from 'next-optimistic-router';
import { useRouter } from 'next/router';

export const usePageData = <T>() => {
  const router = useRouter();
  const { queryKey, queryFn } = usePageDataOptions(router, Boolean(process.env.__NEXT_TRAILING_SLASH));
  const placeholderData = typeof window === 'undefined' ? undefined : window.placeholderData;

  return useQuery<unknown, unknown, T>({
    queryKey,
    queryFn,
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
    handleOptimisticNavigation(props.href, singletonRouter, handleLocalNavigation);
  }
  const handleLocalNavigation = () => {}

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