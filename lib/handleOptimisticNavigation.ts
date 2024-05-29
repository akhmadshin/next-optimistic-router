import { isLocalURL } from 'next/dist/shared/lib/router/utils/is-local-url';
import { ModifiedRouter } from './router-extensions/types.ts';
import { SingletonRouter } from 'next/router';

export const handleOptimisticNavigation = (href: string, singletonRouter: SingletonRouter) => {
  const isLocal = isLocalURL(href as string);

  if (!isLocal || href.startsWith('#')) {
    return;
  }
  const pageRouter = singletonRouter?.router as ModifiedRouter | null;
  if (!pageRouter || !pageRouter.getRouteInfoOnly) {
    return;
  }

  pageRouter.getRouteInfo = pageRouter.getRouteInfoOnly;
}