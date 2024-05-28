import { useContext as l, useCallback as g, useMemo as m } from "react";
import { OptimisticLinkContext as P } from "./OptimisticLinkProvider.js";
import { resolveDynamicRoute as C } from "./router-utils/resolve-dynamic-route.js";
import { buildRoute as O } from "./router-utils/build-route.js";
const w = (n, a, u) => {
  const { pathnameModifier: r } = l(P), c = g(async () => {
    const e = a == null ? void 0 : a.router;
    if (!e)
      throw new Error("router singleton is undefined");
    let t;
    e.onlyAHashChange = e.onlyAHashChangeNever, e.getRouteInfo = async (s) => e.getRouteInfoWithOnLoad({
      singletonRouter: a,
      ...s,
      onLoad: async (o) => {
        var p;
        if ("type" in o && o.type === "redirect-internal") {
          e.getRouteInfo = e.getRouteInfoOrig, e.onlyAHashChange = e.onlyAHashChangeOrig;
          return;
        }
        if ("props" in o) {
          if ((p = o.props) != null && p.notFound) {
            t = { notFound: !0 };
            return;
          }
          o.props && o.props.pageProps.dehydratedState && (t = o.props.pageProps.dehydratedState.queries[0].state.data);
        }
      }
    });
    const h = e.asPath.split("#")[0].split("?")[0], d = await C(r(h), a), y = e.asPath, f = i();
    delete e.components[d];
    try {
      await n.push(f, y);
    } catch (s) {
      console.log("usePageDataOptions e = ", s);
    }
    return e.getRouteInfo = e.getRouteInfoOrig, e.onlyAHashChange = e.onlyAHashChangeOrig, !t || "notFound" in t ? Promise.reject() : t;
  }, []), i = () => {
    const e = n.asPath.split("#")[0].split("?")[1];
    let t = O(n.route, n.query);
    return u && !t.endsWith("/") && (t = `${t}/`), e && (t = `${t}?${e}`), r(t);
  };
  return {
    queryKey: m(() => {
      const e = i();
      return console.log("usePageDataOptions queryKey = ", e), [e];
    }, [n, r]),
    queryFn: c
  };
};
export {
  w as usePageDataOptions
};
