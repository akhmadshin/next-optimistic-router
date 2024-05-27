# next-optimistic-link

This library makes navigation truly instantaneous, without prefetching or caching. Also you can think about that library as a glue between next.js and tanstack-query/swr.

- [OptimisticLink.tsx](lib%2FOptimisticLink.tsx) - wrapper around next/link component. That link will skip getServerSideProps/getStaticProps and middleware.
- [usePageDataOptions.ts](lib%2FusePageDataOptions.ts) - a hook that returns queryFn and queryKey. queryFn is a fetch function that calls current page data with middleware. queryKey is an array containing the URL of the current page.
- [OptimisticLinkProvider.tsx](lib%2FOptimisticLinkProvider.tsx) - provider that accepts pathnameModifier
  `
  (pathname: string) => string
  `. With pathnameModifier you can handle your NextResponse.rewrite logic from middleware directly on the client.


## No more prop drilling
That library is not opinionated about the way you fetch the data. But to achieve the best performance and developer experience, it's recommended to use it with @tanstack/react-query or SWR.

#### usePageData.ts
```ts
import { useQuery } from '@tanstack/react-query';
import { usePageDataOptions } from 'next-optimistic-link';

export const usePageData = <T>() => {
  const { queryKey, queryFn } = usePageDataOptions();

  return useQuery<unknown, unknown, T>({
    queryKey,
    queryFn,
    staleTime: 5 * 60 * 1000,
  });
}
```

#### Some component
```ts
  ...
  const { data: article, isLoading, isFetching, isStale} = usePageData<HomePageProps>();
  ...
```