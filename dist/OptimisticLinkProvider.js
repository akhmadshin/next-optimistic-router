import { jsx as d } from "react/jsx-runtime";
import { createContext as a } from "react";
import { getRouteInfoOnly as b } from "./router-extensions/getRouteInfoOnly.js";
import { getRouteInfoWithOnLoad as h } from "./router-extensions/getRouteInfoWithOnLoad.js";
import { subModified as r } from "./router-extensions/subModified.js";
import { onlyAHashChangeNever as m } from "./router-extensions/onlyAHashChangeNever.js";
import { beforePopStateModified as u } from "./router-extensions/beforePopStateModified.js";
const g = (t) => t, p = a({ pathnameModifier: g, singletonRouter: void 0 }), s = (t = (o) => o, i) => {
  const o = i == null ? void 0 : i.router;
  o && (o.getRouteInfoOrig || (o.getRouteInfoOrig = o.getRouteInfo.bind(o)), o.getRouteInfoOnly || (o.getRouteInfoOnly = ((e) => b({
    ...e,
    pathnameModifier: t,
    singletonRouter: i
  })).bind(o)), o.getRouteInfoWithOnLoad || (o.getRouteInfoWithOnLoad = h.bind(o)), !o.subOrig && o.sub && (o.subOrig = o.sub.bind(o)), o.subModified || (o.subModified = ((e, f, n) => r(e, f, n, i)).bind(o)), o.sub = ((e, f, n) => r(e, f, n, i)).bind(o), o.onlyAHashChangeOrig || (o.onlyAHashChangeOrig = o.onlyAHashChange.bind(o)), o.onlyAHashChangeNever || (o.onlyAHashChangeNever = m.bind(o)), o.beforePopState = ((e) => u(e, i)).bind(o));
}, H = ({ pathnameModifier: t, singletonRouter: i, children: o }) => (s(t, i), /* @__PURE__ */ d(p.Provider, { value: { pathnameModifier: t, singletonRouter: i }, children: o }));
export {
  p as OptimisticLinkContext,
  H as OptimisticLinkProvider,
  s as patchRouter
};
