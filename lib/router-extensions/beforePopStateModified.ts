import { ModifiedRouter } from './types';
import PageRouter from 'next/dist/client/router';

interface TransitionOptions {
  shallow?: boolean
  locale?: string | false
  scroll?: boolean
  unstable_skipClientCache?: boolean
}

interface NextHistoryState {
  url: string
  as: string
  options: TransitionOptions
}

type BeforePopStateCallback = (state: NextHistoryState) => boolean

// Because beforePopState supports only one callback
// https://github.com/vercel/next.js/discussions/34835
export const beforePopStateModified = (cb: BeforePopStateCallback) => {
  const pageRouter = PageRouter.router as ModifiedRouter | null;

  if (!pageRouter) {
    throw new Error('router singleton is undefined');
  }

  pageRouter._bps = (state: NextHistoryState) => {
    if (pageRouter) {
      pageRouter.getRouteInfo = pageRouter.getRouteInfoOnly;
    }

    window.__NEXT_OPTIMISTIC_LINK_RENDERED_PATHNAME = window.location.pathname;

    return cb(state);
  }
}