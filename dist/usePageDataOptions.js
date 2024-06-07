import { useContext as d, useCallback as y, useMemo as P } from "react";
import { OptimisticRouterContext as R } from "./OptimisticRouterProvider.js";
import { resolveDynamicRoute as v } from "./router-utils/resolve-dynamic-route.js";
import { buildRoute as C } from "./router-utils/build-route.js";
const w = (n, l) => {
  const { pathModifier: r, singletonRouter: s } = d(R), h = y(async () => {
    const e = s == null ? void 0 : s.router;
    if (!e)
      throw new Error("router singleton is undefined");
    let o;
    e.onlyAHashChange = e.onlyAHashChangeNever, e.getRouteInfo = async (m) => e.getRouteInfoWithOnLoad({
      singletonRouter: s,
      ...m,
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
    const a = e.asPath.split("#")[0].split("?")[0], c = await v(r ? r(a) : a, s), f = e.asPath, g = i();
    return delete e.components[c], await n.push(g, f), e.getRouteInfo = e.getRouteInfoOrig, e.onlyAHashChange = e.onlyAHashChangeOrig, !o || "notFound" in o ? Promise.reject() : o;
  }, []), i = () => {
    const e = n.asPath.split("#")[0].split("?")[1];
    let o = C(n.route, n.query);
    return l && !o.endsWith("/") && (o = `${o}/`), e && (o = `${o}?${e}`), r ? r(o) : o;
  };
  return {
    queryKey: P(() => [i()], [n, r]),
    queryFn: h
  };
};
export {
  w as usePageDataOptions
};
