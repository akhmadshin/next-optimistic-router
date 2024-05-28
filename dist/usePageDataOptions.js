import { useContext as g, useCallback as y, useMemo as m } from "react";
import { OptimisticLinkContext as P } from "./OptimisticLinkProvider.js";
import { resolveDynamicRoute as C } from "./router-utils/resolve-dynamic-route.js";
import { buildRoute as R } from "./router-utils/build-route.js";
const I = (n, p) => {
  const { pathnameModifier: a, singletonRouter: r } = g(P), u = y(async () => {
    const e = r == null ? void 0 : r.router;
    if (!e)
      throw new Error("router singleton is undefined");
    let t;
    e.onlyAHashChange = e.onlyAHashChangeNever, e.getRouteInfo = async (f) => e.getRouteInfoWithOnLoad({
      singletonRouter: r,
      ...f,
      onLoad: async (o) => {
        var i;
        if ("type" in o && o.type === "redirect-internal") {
          e.getRouteInfo = e.getRouteInfoOrig, e.onlyAHashChange = e.onlyAHashChangeOrig;
          return;
        }
        if ("props" in o) {
          if ((i = o.props) != null && i.notFound) {
            t = { notFound: !0 };
            return;
          }
          o.props && o.props.pageProps.dehydratedState && (t = o.props.pageProps.dehydratedState.queries[0].state.data);
        }
      }
    });
    const h = e.asPath.split("#")[0].split("?")[0], d = await C(a(h), r), l = e.asPath, c = s();
    return delete e.components[d], await n.push(c, l), e.getRouteInfo = e.getRouteInfoOrig, e.onlyAHashChange = e.onlyAHashChangeOrig, !t || "notFound" in t ? Promise.reject() : t;
  }, []), s = () => {
    const e = n.asPath.split("#")[0].split("?")[1];
    let t = R(n.route, n.query);
    return p && !t.endsWith("/") && (t = `${t}/`), e && (t = `${t}?${e}`), a(t);
  };
  return {
    queryKey: m(() => [s()], [n, a]),
    queryFn: u
  };
};
export {
  I as usePageDataOptions
};
