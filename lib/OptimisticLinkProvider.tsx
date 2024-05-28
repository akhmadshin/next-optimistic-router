import { createContext, FC, PropsWithChildren } from 'react';
import { getRouteInfoOnly } from './router-extensions/getRouteInfoOnly';
import { getRouteInfoWithOnLoad } from './router-extensions/getRouteInfoWithOnLoad';
import {
  GetRouteInfoProps,
  ModifiedRouter
} from './router-extensions/types';
import { subModified } from './router-extensions/subModified';
import { onlyAHashChangeNever } from './router-extensions/onlyAHashChangeNever';
import { BeforePopStateCallback, beforePopStateModified } from './router-extensions/beforePopStateModified';
import type { SingletonRouter } from 'next/router';
import type { AppComponent, PrivateRouteInfo } from 'next/dist/shared/lib/router/router';

interface Props {
  pathnameModifier: (pathname: string) => string;
  singletonRouter?: SingletonRouter;
}

const defaultPathnameModified = (route: string) => route;
export const OptimisticLinkContext = createContext<Props>({ pathnameModifier: defaultPathnameModified, singletonRouter: undefined });

export const patchRouter = (pathnameModifier: (pathname: string) => string = (route) => route, singletonRouter?: SingletonRouter) => {
  // if (typeof window === 'undefined') {
  //   return;
  // }

  const pageRouter = singletonRouter?.router as ModifiedRouter | null;
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
      singletonRouter,
    })).bind(pageRouter);
  }

  if (!pageRouter.getRouteInfoWithOnLoad) {
    pageRouter.getRouteInfoWithOnLoad = getRouteInfoWithOnLoad.bind(pageRouter);
  }
  if (!pageRouter.subOrig && pageRouter.sub) {
    pageRouter.subOrig = pageRouter.sub.bind(pageRouter);
  }
  if (!pageRouter.subModified) {
    pageRouter.subModified = ((info: PrivateRouteInfo, App: AppComponent, scroll: { x: number; y: number } | null) => subModified(info, App, scroll, singletonRouter)).bind(pageRouter);
  }
  pageRouter.sub = ((info: PrivateRouteInfo, App: AppComponent, scroll: { x: number; y: number } | null) => subModified(info, App, scroll, singletonRouter)).bind(pageRouter);

  if (!pageRouter.onlyAHashChangeOrig) {
    pageRouter.onlyAHashChangeOrig = pageRouter.onlyAHashChange.bind(pageRouter);
  }
  if (!pageRouter.onlyAHashChangeNever) {
    pageRouter.onlyAHashChangeNever = onlyAHashChangeNever.bind(pageRouter);
  }
  pageRouter.beforePopState = ((cb: BeforePopStateCallback) => beforePopStateModified(cb, singletonRouter)).bind(pageRouter);
}

export const OptimisticLinkProvider: FC<PropsWithChildren<Props>> = ({ pathnameModifier, singletonRouter, children }) => {
  patchRouter(pathnameModifier, singletonRouter);

  return (
    <OptimisticLinkContext.Provider value={{ pathnameModifier, singletonRouter }}>
      {children}
    </OptimisticLinkContext.Provider>
  )
}

