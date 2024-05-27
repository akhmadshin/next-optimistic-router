import { createContext, FC, PropsWithChildren } from 'react';
import { getRouteInfoOnly } from './router-extensions/getRouteInfoOnly';
import { getRouteInfoWithOnLoad } from './router-extensions/getRouteInfoWithOnLoad';
import {
  GetRouteInfoProps,
  ModifiedRouter
} from './router-extensions/types';
import { subModified } from './router-extensions/subModified';
import { onlyAHashChangeNever } from './router-extensions/onlyAHashChangeNever';
import { beforePopStateModified } from './router-extensions/beforePopStateModified';
import PageRouter from 'next/router';

interface Props {
  pathnameModifier: (pathname: string) => string
}

const defaultPathnameModified = (route: string) => route;
export const OptimisticLinkContext = createContext(defaultPathnameModified);

export const patchRouter = (pathnameModifier: (pathname: string) => string = (route) => route) => {
  // if (typeof window === 'undefined') {
  //   return;
  // }

  const pageRouter = PageRouter.router as ModifiedRouter | null;
  if (!pageRouter) {
    return;
  }

  if (!pageRouter.getRouteInfoOrig) {
    pageRouter.getRouteInfoOrig = pageRouter.getRouteInfo.bind(pageRouter);
  }

  if (!pageRouter.getRouteInfoOnly) {
    pageRouter.getRouteInfoOnly = ((props: GetRouteInfoProps) => getRouteInfoOnly({
      ...props,
      pathnameModifier,
    })).bind(pageRouter);
  }

  if (!pageRouter.getRouteInfoWithOnLoad) {
    pageRouter.getRouteInfoWithOnLoad = getRouteInfoWithOnLoad.bind(pageRouter);
  }
  if (!pageRouter.subOrig && pageRouter.sub) {
    pageRouter.subOrig = pageRouter.sub.bind(pageRouter);
  }
  if (!pageRouter.subModified) {
    pageRouter.subModified = subModified.bind(pageRouter);
  }
  pageRouter.sub = subModified.bind(pageRouter)!;

  if (!pageRouter.onlyAHashChangeOrig) {
    pageRouter.onlyAHashChangeOrig = pageRouter.onlyAHashChange.bind(pageRouter);
  }
  if (!pageRouter.onlyAHashChangeNever) {
    pageRouter.onlyAHashChangeNever = onlyAHashChangeNever.bind(pageRouter);
  }
  pageRouter.beforePopState = beforePopStateModified.bind(pageRouter);
}

export const OptimisticLinkProvider: FC<PropsWithChildren<Props>> = ({ pathnameModifier, children }) => {
  patchRouter(pathnameModifier);

  return (
    <OptimisticLinkContext.Provider value={pathnameModifier}>
      {children}
    </OptimisticLinkContext.Provider>
  )
}

