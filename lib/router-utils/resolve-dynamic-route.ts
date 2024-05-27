import { denormalizePagePath } from 'next/dist/shared/lib/page-path/denormalize-page-path';
import { removeTrailingSlash } from './remove-trailing-slash';
import { isDynamicRoute } from 'next/dist/shared/lib/router/utils';
import PageRouter from 'next/dist/client/router';
import { ModifiedRouter } from '../router-extensions/types.ts';
import { getRouteRegex } from './route-regex.ts';

export async function resolveDynamicRoute(pathname: string) {
  const pageRouter = PageRouter.router as ModifiedRouter | null;
  if (!pageRouter) {
    return '/404';
  }

  const pageLoader = pageRouter.pageLoader;
  const pages = await pageLoader.getPageList();

  const cleanPathname = removeTrailingSlash(denormalizePagePath(pathname))
  if (cleanPathname === '/404' || cleanPathname === '/_error') {
    return pathname
  }

  // handle resolving href for dynamic routes
  if (!pages.includes(cleanPathname)) {
    pages.some((page) => {
      if (isDynamicRoute(page) && getRouteRegex(page).re.test(cleanPathname)) {
        pathname = page
        return true
      }
    })
  }
  return removeTrailingSlash(pathname)
}