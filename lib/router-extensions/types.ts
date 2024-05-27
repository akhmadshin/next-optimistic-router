import type { Router } from 'next/router';
import type { AppComponent, PrivateRouteInfo } from 'next/dist/shared/lib/router/router';
import type { ParsedUrlQuery } from 'querystring';

export interface GetRouteInfoProps {
  route: string
  pathname: string
  query: ParsedUrlQuery
  as: string
  resolvedAs: string
  hasMiddleware?: boolean
  routeProps: RouteProperties
  locale: string | undefined
  isPreview: boolean
  unstable_skipClientCache?: boolean
  isQueryUpdating?: boolean
  isMiddlewareRewrite?: boolean
  isNotFound?: boolean
}

interface RouteProperties {
  shallow: boolean;
}

export type PathnameModifier = (pathname: string) => string;

export type GetRouteInfo<T extends GetRouteInfoProps = GetRouteInfoProps> = (props: T) => Promise<GetRouteInfoResponse>

export type GetRouteInfoResponse = {
  type: "redirect-external";
  destination: string;
} | {
  type: "redirect-internal";
  newAs: string;
  newUrl: string;
} | PrivateRouteInfo;

export type GetRouteInfoWithPathnameModifierProps = GetRouteInfoProps & { pathnameModifier: PathnameModifier };
export type GetRouteInfoWithOnLoadProps = GetRouteInfoProps & {
  onLoad: (res: GetRouteInfoResponse) => void;
};

type Subscription = (data: PrivateRouteInfo, App: AppComponent, resetScroll: {
  x: number;
  y: number;
} | null) => Promise<void>;


export type ModifiedRouter = Router & {
  getRouteInfoOrig: GetRouteInfo
  getRouteInfoOnly: GetRouteInfo<GetRouteInfoProps & { pathnameModifier: (pathname: string) => string }>
  getRouteInfoWithOnLoad: GetRouteInfo<GetRouteInfoWithOnLoadProps>
  onlyAHashChangeNever: () => boolean
  onlyAHashChangeOrig: (as: string) => boolean
  subOrig: Subscription
  subModified: Subscription
}