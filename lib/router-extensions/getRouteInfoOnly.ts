// The MIT License (MIT)
//
// Copyright (c) 2024 Vercel, Inc.
//
// Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:
//
// The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

import type { CompletePrivateRouteInfo, PrivateRouteInfo } from 'next/dist/shared/lib/router/router';
import { GetRouteInfoWithPathnameModifierProps, ModifiedRouter } from './types';
import { resolveDynamicRoute } from '../router-utils/resolve-dynamic-route';
import PageRouter from 'next/dist/client/router';


export const getRouteInfoOnly = async (props: GetRouteInfoWithPathnameModifierProps): Promise<{
  type: "redirect-external";
  destination: string;
} | {
  type: "redirect-internal";
  newAs: string;
  newUrl: string;
} | PrivateRouteInfo> => {
  const {
    pathname,
    query,
    as,
    resolvedAs: requestedResolvedAs,
    locale,
    pathnameModifier,
  } = props;
  /**
   * PageRouter.router! `route` binding can change if there's a rewrite
   * so we keep a reference to the original requested route
   * so we can store the cache for it and avoid re-requesting every time
   * for shallow routing purposes.
   */
  const requestedPathname = requestedResolvedAs.split('#')[0].split('?')[0];
  const resolvedAs = pathnameModifier ? pathnameModifier(requestedPathname) : requestedPathname
  const route = await resolveDynamicRoute(resolvedAs);

  const pageRouter = PageRouter.router as ModifiedRouter | null;

  if (!pageRouter) {
    throw new Error('router singleton is undefined');
  }

  pageRouter.getRouteInfo = pageRouter.getRouteInfoOrig;
  pageRouter.onlyAHashChange = pageRouter.onlyAHashChangeOrig;

  try {
    const routeInfo = await pageRouter.fetchComponent(route).then<CompletePrivateRouteInfo>(
      (res) => ({
        Component: res.page,
        styleSheets: res.styleSheets,
        __N_SSG: false,
        __N_SSP: false,
      })
    )

    if (process.env.NODE_ENV !== 'production') {
      // eslint-disable-next-line @typescript-eslint/no-var-requires
      // @ts-ignore
      const reactIsModule = await import('next/dist/compiled/react-is');
      const isValidElementType = reactIsModule.isValidElementType;
      if (!isValidElementType(routeInfo.Component)) {
        throw new Error(
          `The default export is not a React Component in page: "${pathname}"`
        )
      }
    }

    const initialProps = await pageRouter.getInitialProps(
      routeInfo.Component,
      // we provide AppTree later so PageRouter.router! needs to be `any`
      {
        pathname,
        query,
        asPath: as,
        locale,
        locales: pageRouter.locales,
        defaultLocale: pageRouter.defaultLocale,
      } as never
    )

    // we kick off a HEAD request in the background
    // when a non-prefetch request is made to signal revalidation
    initialProps.pageProps = Object.assign({}, initialProps.pageProps)
    routeInfo.props = initialProps
    routeInfo.route = route
    routeInfo.query = query
    routeInfo.resolvedAs = resolvedAs
    pageRouter.components[route] = routeInfo

    return routeInfo
  } catch (err) {
    pageRouter.getRouteInfo = pageRouter.getRouteInfoOrig;
    pageRouter.onlyAHashChange = pageRouter.onlyAHashChangeOrig;

    return pageRouter.getRouteInfoOrig(props);
  }
}