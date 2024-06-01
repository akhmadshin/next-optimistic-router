import { useContext as g, useCallback as y, useMemo as m } from "react";
import { OptimisticRouterContext as P } from "./OptimisticRouterProvider.js";
import { resolveDynamicRoute as R } from "./router-utils/resolve-dynamic-route.js";
import { buildRoute as C } from "./router-utils/build-route.js";
const I = (n, u) => {
  const { pathModifier: r, singletonRouter: a } = g(P), h = y(async () => {
    const t = a == null ? void 0 : a.router;
    if (!t)
      throw new Error("router singleton is undefined");
    let e;
    t.onlyAHashChange = t.onlyAHashChangeNever, t.getRouteInfo = async (f) => t.getRouteInfoWithOnLoad({
      singletonRouter: a,
      ...f,
      onLoad: async (o) => {
        var p;
        if ("type" in o && o.type === "redirect-internal") {
          t.getRouteInfo = t.getRouteInfoOrig, t.onlyAHashChange = t.onlyAHashChangeOrig;
          return;
        }
        if ("props" in o) {
          if ((p = o.props) != null && p.notFound) {
            e = { notFound: !0 };
            return;
          }
          o.props && o.props.pageProps.dehydratedState && (e = o.props.pageProps.dehydratedState.queries[0].state.data);
        }
      }
    });
    const i = t.asPath.split("#")[0].split("?")[0], d = await R(r ? r(i) : i, a), l = t.asPath, c = s();
    return delete t.components[d], await n.push(c, l), t.getRouteInfo = t.getRouteInfoOrig, t.onlyAHashChange = t.onlyAHashChangeOrig, !e || "notFound" in e ? Promise.reject() : e;
  }, []), s = () => {
    const t = n.asPath.split("#")[0].split("?")[1];
    let e = C(n.route, n.query);
    return u && !e.endsWith("/") && (e = `${e}/`), t && (e = `${e}?${t}`), r ? r(e) : e;
  };
  return {
    queryKey: m(() => [s()], [n, r]),
    queryFn: h
  };
};
export {
  I as usePageDataOptions
};
