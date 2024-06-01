import { jsx as d } from "react/jsx-runtime";
import { createContext as a } from "react";
import { getRouteInfoOnly as b } from "./router-extensions/getRouteInfoOnly.js";
import { getRouteInfoWithOnLoad as u } from "./router-extensions/getRouteInfoWithOnLoad.js";
import { subModified as n } from "./router-extensions/subModified.js";
import { onlyAHashChangeNever as h } from "./router-extensions/onlyAHashChangeNever.js";
import { beforePopStateModified as m } from "./router-extensions/beforePopStateModified.js";
const p = a({ pathModifier: void 0, singletonRouter: void 0 }), g = (t = (o) => o, i) => {
  if (typeof window > "u")
    return;
  const o = i == null ? void 0 : i.router;
  o && (o.getRouteInfoOrig || (o.getRouteInfoOrig = o.getRouteInfo.bind(o)), o.getRouteInfoOnly || (o.getRouteInfoOnly = ((e) => b({
    ...e,
    pathnameModifier: t,
    singletonRouter: i
  })).bind(o)), o.getRouteInfoWithOnLoad || (o.getRouteInfoWithOnLoad = u.bind(o)), !o.subOrig && o.sub && (o.subOrig = o.sub.bind(o)), o.subModified || (o.subModified = ((e, r, f) => n(e, r, f, i)).bind(o)), o.sub = ((e, r, f) => n(e, r, f, i)).bind(o), o.onlyAHashChangeOrig || (o.onlyAHashChangeOrig = o.onlyAHashChange.bind(o)), o.onlyAHashChangeNever || (o.onlyAHashChangeNever = h.bind(o)), o.beforePopState = ((e) => m(e, i)).bind(o));
}, A = ({ pathModifier: t, singletonRouter: i, children: o }) => (g(t, i), /* @__PURE__ */ d(p.Provider, { value: { pathModifier: t, singletonRouter: i }, children: o }));
export {
  p as OptimisticRouterContext,
  A as OptimisticRouterProvider,
  g as patchRouter
};
