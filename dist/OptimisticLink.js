import { jsx as k } from "react/jsx-runtime";
import { forwardRef as d, useContext as C } from "react";
import { OptimisticLinkContext as g } from "./OptimisticLinkProvider.js";
const P = d(function(c, f) {
  const {
    onClick: e,
    onKeyPress: i,
    children: l,
    link: p,
    ...a
  } = c, { pathnameModifier: r, singletonRouter: o } = C(g), m = (n) => {
    e && e(n), s();
  }, u = (n) => {
    i && i(n);
    const { key: t } = n;
    ["Space", "Enter"].includes(t) && s();
  }, s = () => {
    const n = o == null ? void 0 : o.router;
    console.log("singletonRouter = ", o), n && r && (n.getRouteInfo = (t) => n.getRouteInfoOnly({
      ...t,
      singletonRouter: o,
      pathnameModifier: r
    }));
  };
  return /* @__PURE__ */ k(
    p,
    {
      onClick: m,
      onKeyPress: u,
      ref: f,
      ...a,
      children: l
    }
  );
});
export {
  P as OptimisticLink
};
