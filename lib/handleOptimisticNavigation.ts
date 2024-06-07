import { isLocalURL } from 'next/dist/shared/lib/router/utils/is-local-url';
import type { ModifiedRouter } from './router-extensions/types.ts';
import type { SingletonRouter } from 'next/router';
import type { Url } from 'next/dist/shared/lib/router/router';
import { formatWithValidation } from 'next/dist/shared/lib/router/utils/format-url';

export const handleOptimisticNavigation = (
  href: Url,
  singletonRouter: SingletonRouter,
  beforeOptimisticNavigation?: () => void
) => {
  const urlAsString = typeof href === 'string' ? href : formatWithValidation(href)
  const isLocal = isLocalURL(urlAsString);
  if (!isLocal) {
    return;
  }

  if (urlAsString.startsWith('#')) {
    return;
  }

  if (beforeOptimisticNavigation) {
    beforeOptimisticNavigation();
  }

  const pageRouter = singletonRouter?.router as ModifiedRouter | null;
  if (!pageRouter || !pageRouter.getRouteInfoOnly) {
    return;
  }

  pageRouter.getRouteInfo = pageRouter.getRouteInfoOnly;
}