import { resolveDynamicRoute as y } from "../router-utils/resolve-dynamic-route.js";
const C = async ({ singletonRouter: o, ...r }) => {
  const {
    pathname: i,
    query: l,
    as: h,
    resolvedAs: f,
    locale: d,
    pathnameModifier: c
  } = r, p = f.split("#")[0].split("?")[0], u = c ? c(p) : p, n = await y(u, o), e = o == null ? void 0 : o.router;
  if (!e)
    throw new Error("router singleton is undefined");
  e.getRouteInfo = e.getRouteInfoOrig, e.onlyAHashChange = e.onlyAHashChangeOrig;
  try {
    const t = await e.fetchComponent(n).then(
      (s) => ({
        Component: s.page,
        styleSheets: s.styleSheets,
        __N_SSG: !1,
        __N_SSP: !1
      })
    );
    if (process.env.NODE_ENV !== "production") {
      const g = (await import("../index-Dth3kwzf.js").then((m) => m.i)).isValidElementType;
      if (!g(t.Component))
        throw new Error(
          `The default export is not a React Component in page: "${i}"`
        );
    }
    const a = await e.getInitialProps(
      t.Component,
      // we provide AppTree later so PageRouter.router! needs to be `any`
      {
        pathname: i,
        query: l,
        asPath: h,
        locale: d,
        locales: e.locales,
        defaultLocale: e.defaultLocale
      }
    );
    return a.pageProps = Object.assign({}, a.pageProps), t.props = a, t.route = n, t.query = l, t.resolvedAs = u, e.components[n] = t, setTimeout(() => {
      delete e.components[n];
    }, 0), t;
  } catch {
    return e.getRouteInfo = e.getRouteInfoOrig, e.onlyAHashChange = e.onlyAHashChangeOrig, e.getRouteInfoOrig(r);
  }
};
export {
  C as getRouteInfoOnly
};
