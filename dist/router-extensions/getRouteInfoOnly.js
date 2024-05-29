import { resolveDynamicRoute as y } from "../router-utils/resolve-dynamic-route.js";
const C = async ({ singletonRouter: o, ...r }) => {
  const {
    pathname: i,
    query: l,
    as: u,
    resolvedAs: f,
    locale: g,
    pathnameModifier: c
  } = r, p = f.split("#")[0].split("?")[0], h = c ? c(p) : p, a = await y(h, o), e = o == null ? void 0 : o.router;
  if (!e)
    throw new Error("router singleton is undefined");
  e.getRouteInfo = e.getRouteInfoOrig, e.onlyAHashChange = e.onlyAHashChangeOrig;
  try {
    const t = await e.fetchComponent(a).then(
      (s) => ({
        Component: s.page,
        styleSheets: s.styleSheets,
        __N_SSG: !1,
        __N_SSP: !1
      })
    );
    if (process.env.NODE_ENV !== "production") {
      const d = (await import("../index-Dth3kwzf.js").then((m) => m.i)).isValidElementType;
      if (!d(t.Component))
        throw new Error(
          `The default export is not a React Component in page: "${i}"`
        );
    }
    const n = await e.getInitialProps(
      t.Component,
      // we provide AppTree later so PageRouter.router! needs to be `any`
      {
        pathname: i,
        query: l,
        asPath: u,
        locale: g,
        locales: e.locales,
        defaultLocale: e.defaultLocale
      }
    );
    return n.pageProps = Object.assign({}, n.pageProps), t.props = n, t.route = a, t.query = l, t.resolvedAs = h, e.components[a] = t, t;
  } catch {
    return e.getRouteInfo = e.getRouteInfoOrig, e.onlyAHashChange = e.onlyAHashChangeOrig, e.getRouteInfoOrig(r);
  }
};
export {
  C as getRouteInfoOnly
};
