import { jsx as d } from "react/jsx-runtime";
import { createContext as u } from "react";
import { getRouteInfoOnly as a } from "./router-extensions/getRouteInfoOnly.js";
import { getRouteInfoWithOnLoad as b } from "./router-extensions/getRouteInfoWithOnLoad.js";
import { subModified as f } from "./router-extensions/subModified.js";
import { onlyAHashChangeNever as h } from "./router-extensions/onlyAHashChangeNever.js";
const g = u({ pathModifier: void 0, singletonRouter: void 0 }), m = (t = (o) => o, i) => {
  if (typeof window > "u")
    return;
  const o = i == null ? void 0 : i.router;
  o && (o.getRouteInfoOrig || (o.getRouteInfoOrig = o.getRouteInfo.bind(o)), o.getRouteInfoOnly || (o.getRouteInfoOnly = ((e) => a({
    ...e,
    pathnameModifier: t,
    singletonRouter: i
  })).bind(o)), o.getRouteInfoWithOnLoad || (o.getRouteInfoWithOnLoad = b.bind(o)), !o.subOrig && o.sub && (o.subOrig = o.sub.bind(o)), o.subModified || (o.subModified = ((e, n, r) => f(e, n, r, i)).bind(o)), o.sub = ((e, n, r) => f(e, n, r, i)).bind(o), o.onlyAHashChangeOrig || (o.onlyAHashChangeOrig = o.onlyAHashChange.bind(o)), o.onlyAHashChangeNever || (o.onlyAHashChangeNever = h.bind(o)));
}, v = ({ pathModifier: t, singletonRouter: i, children: o }) => (m(t, i), /* @__PURE__ */ d(g.Provider, { value: { pathModifier: t, singletonRouter: i }, children: o }));
export {
  g as OptimisticRouterContext,
  v as OptimisticRouterProvider,
  m as patchRouter
};
