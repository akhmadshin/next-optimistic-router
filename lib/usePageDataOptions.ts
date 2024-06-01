import { useCallback, useContext, useMemo } from 'react';
import { OptimisticLinkContext } from './OptimisticRouterProvider';
import { resolveDynamicRoute } from './router-utils/resolve-dynamic-route';
import { GetRouteInfoProps, GetRouteInfoResponse, ModifiedRouter } from './router-extensions/types';
import { buildRoute } from './router-utils/build-route';
import type { NextRouter } from 'next/router';

export const usePageDataOptions = <T>(router: NextRouter, withTrailingSlash: boolean) => {
  const { pathModifier, singletonRouter } = useContext(OptimisticLinkContext);

  const queryFn = useCallback(async () => {
    const pageRouter = singletonRouter?.router as ModifiedRouter | null;
    if (!pageRouter) {
      throw new Error('router singleton is undefined');
    }

    let pageProps: T | { notFound: true } | undefined = undefined;

    pageRouter.onlyAHashChange = pageRouter.onlyAHashChangeNever;
    pageRouter.getRouteInfo = async (props: GetRouteInfoProps) => pageRouter.getRouteInfoWithOnLoad({
      singletonRouter,
      ...props,
      onLoad: async (res: GetRouteInfoResponse) => {
        if ('type' in res && res.type === 'redirect-internal') {
          pageRouter.getRouteInfo = pageRouter.getRouteInfoOrig;
          pageRouter.onlyAHashChange = pageRouter.onlyAHashChangeOrig;
          return;
        }
        if ('props' in res) {
          if (res.props?.notFound) {
            pageProps = { notFound: true };
            return;
          }
          if (res.props && res.props.pageProps.dehydratedState) {
            pageProps = res.props.pageProps.dehydratedState.queries[0].state.data;
          }
        }

      },
    });

    const modifiedAsPath = pageRouter.asPath.split('#')[0].split('?')[0];

    const componentPath = await resolveDynamicRoute(pathModifier ? pathModifier(modifiedAsPath) : modifiedAsPath, singletonRouter);
    const asPath = pageRouter.asPath;

    const url = getResolvedUrl();

    delete pageRouter.components[componentPath];

    await router.push(url, asPath);

    pageRouter.getRouteInfo = pageRouter.getRouteInfoOrig;
    pageRouter.onlyAHashChange = pageRouter.onlyAHashChangeOrig;

    if (!pageProps) {
      return Promise.reject()
    }

    if ('notFound' in pageProps) {
      // await pageRouter.push(url, asPath);
      return Promise.reject();
    }
    return pageProps;
  }, [])

  const getResolvedUrl = () => {
    const query = router.asPath.split('#')[0].split('?')[1];

    let pathname = buildRoute(router.route, router.query as Record<string, string>);

    if (withTrailingSlash && !pathname.endsWith('/')) {
      pathname = `${pathname}/`
    }

    if (query) {
      pathname = `${pathname}?${query}`
    }

    return pathModifier ? pathModifier(pathname) : pathname
  }

  const queryKey = useMemo(() => {
    const resolvedUrl = getResolvedUrl();
    return [resolvedUrl];
  }, [router, pathModifier])

  return {
    queryKey,
    queryFn,
  }
}