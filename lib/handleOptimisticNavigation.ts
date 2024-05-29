import { isLocalURL } from 'next/dist/shared/lib/router/utils/is-local-url';
import { ModifiedRouter } from './router-extensions/types.ts';
import { SingletonRouter } from 'next/router';
import type { Url } from 'next/dist/shared/lib/router/router';
import { formatWithValidation } from 'next/dist/shared/lib/router/utils/format-url';

export const handleOptimisticNavigation = (href: Url, singletonRouter: SingletonRouter, onLocalNavigation: () => void) => {
  const urlAsString = typeof href === 'string' ? href : formatWithValidation(href)
  const isLocal = isLocalURL(urlAsString);
  if (!isLocal) {
    return;
  }

  onLocalNavigation();

  if (urlAsString.startsWith('#')) {
    return;
  }

  const pageRouter = singletonRouter?.router as ModifiedRouter | null;
  if (!pageRouter || !pageRouter.getRouteInfoOnly) {
    return;
  }

  pageRouter.getRouteInfo = pageRouter.getRouteInfoOnly;
}