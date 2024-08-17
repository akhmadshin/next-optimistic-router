import { useContext as m, useCallback as y, useMemo as d } from "react";
import { OptimisticRouterContext as P } from "./OptimisticRouterProvider.js";
import { resolveDynamicRoute as R } from "./router-utils/resolve-dynamic-route.js";
import { buildRoute as v } from "./router-utils/build-route.js";
const q = (n) => {
  const { pathModifier: r, singletonRouter: s } = m(P), l = y(async () => {
    const e = s == null ? void 0 : s.router;
    if (!e)
      throw new Error("router singleton is undefined");
    let o;
    e.onlyAHashChange = e.onlyAHashChangeNever, e.getRouteInfo = async (g) => e.getRouteInfoWithOnLoad({
      singletonRouter: s,
      ...g,
      onLoad: (t) => {
        var u, p;
        if ("type" in t && t.type === "redirect-internal")
          return e.getRouteInfo = e.getRouteInfoOrig, e.onlyAHashChange = e.onlyAHashChangeOrig, Promise.resolve();
        if ("props" in t) {
          if ((u = t.props) != null && u.notFound)
            return o = { notFound: !0 }, Promise.resolve();
          (p = t.props) != null && p.pageProps && (o = t.props.pageProps);
        }
        return Promise.resolve();
      }
    });
    const a = e.asPath.split("#")[0].split("?")[0], c = await R(r ? r(a) : a, s), h = e.asPath, f = i();
    return delete e.components[c], await n.push(f, h, { scroll: !1 }), e.getRouteInfo = e.getRouteInfoOrig, e.onlyAHashChange = e.onlyAHashChangeOrig, !o || "notFound" in o ? Promise.reject() : o;
  }, []), i = () => {
    const e = n.asPath.split("#")[0].split("?")[1];
    let o = v(n.route, n.query);
    return e && (o = `${o}?${e}`), r ? r(o) : o;
  };
  return {
    queryKey: d(() => [i()], [n, r]),
    queryFn: l
  };
};
export {
  q as usePageDataOptions
};
