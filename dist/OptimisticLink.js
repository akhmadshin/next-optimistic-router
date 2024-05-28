import { jsx as u } from "react/jsx-runtime";
import { forwardRef as d, useContext as C } from "react";
import { OptimisticLinkContext as h } from "./OptimisticLinkProvider.js";
const g = d(function(c, f) {
  const {
    onClick: e,
    onKeyPress: i,
    children: p,
    link: a,
    ...m
  } = c, { pathnameModifier: r, singletonRouter: t } = C(h), k = (n) => {
    e && e(n), s();
  }, l = (n) => {
    i && i(n);
    const { key: o } = n;
    ["Space", "Enter"].includes(o) && s();
  }, s = () => {
    const n = t == null ? void 0 : t.router;
    n && r && (n.getRouteInfo = (o) => n.getRouteInfoOnly({
      ...o,
      singletonRouter: t,
      pathnameModifier: r
    }));
  };
  return /* @__PURE__ */ u(
    a,
    {
      onClick: k,
      onKeyPress: l,
      ref: f,
      ...m,
      children: p
    }
  );
});
export {
  g as OptimisticLink
};
