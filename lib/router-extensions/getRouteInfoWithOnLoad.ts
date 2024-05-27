import { GetRouteInfoWithOnLoadProps, ModifiedRouter } from './types';
import PageRouter from 'next/dist/client/router';

export const getRouteInfoWithOnLoad = async ({ onLoad, ...props}: GetRouteInfoWithOnLoadProps,
) => {
  const pageRouter = PageRouter.router as ModifiedRouter | null;

  if (!pageRouter) {
    throw new Error('router singleton is undefined');
  }

  return pageRouter.getRouteInfoOrig({
    ...props,
  }).then(async (res) => {
    if (onLoad) {
      await onLoad(res);
    }
    return res;
  }).catch((err) => {
    if (
      err.message.startsWith('Invariant: attempted to hard navigate to the same URL') &&
      window.__NEXT_OPTIMISTIC_LINK_RENDERED_PATHNAME === window.location.pathname
    ) {
      pageRouter.reload();
    }
    throw new Error(err);
  });
}