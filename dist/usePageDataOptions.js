import { useContext as g, useCallback as y, useMemo as m } from "react";
import { OptimisticLinkContext as P } from "./OptimisticLinkProvider.js";
import { resolveDynamicRoute as C } from "./router-utils/resolve-dynamic-route.js";
import { buildRoute as R } from "./router-utils/build-route.js";
const I = (n, p) => {
  const { pathModifier: a, singletonRouter: r } = g(P), u = y(async () => {
    const t = r == null ? void 0 : r.router;
    if (!t)
      throw new Error("router singleton is undefined");
    let e;
    t.onlyAHashChange = t.onlyAHashChangeNever, t.getRouteInfo = async (f) => t.getRouteInfoWithOnLoad({
      singletonRouter: r,
      ...f,
      onLoad: async (o) => {
        var i;
        if ("type" in o && o.type === "redirect-internal") {
          t.getRouteInfo = t.getRouteInfoOrig, t.onlyAHashChange = t.onlyAHashChangeOrig;
          return;
        }
        if ("props" in o) {
          if ((i = o.props) != null && i.notFound) {
            e = { notFound: !0 };
            return;
          }
          o.props && o.props.pageProps.dehydratedState && (e = o.props.pageProps.dehydratedState.queries[0].state.data);
        }
      }
    });
    const h = t.asPath.split("#")[0].split("?")[0], d = await C(a(h), r), l = t.asPath, c = s();
    return delete t.components[d], await n.push(c, l), t.getRouteInfo = t.getRouteInfoOrig, t.onlyAHashChange = t.onlyAHashChangeOrig, !e || "notFound" in e ? Promise.reject() : e;
  }, []), s = () => {
    const t = n.asPath.split("#")[0].split("?")[1];
    let e = R(n.route, n.query);
    return p && !e.endsWith("/") && (e = `${e}/`), t && (e = `${e}?${t}`), a(e);
  };
  return {
    queryKey: m(() => [s()], [n, a]),
    queryFn: u
  };
};
export {
  I as usePageDataOptions
};
