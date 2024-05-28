import { resolveDynamicRoute as m } from "../router-utils/resolve-dynamic-route.js";
const O = async ({ singletonRouter: t, ...r }) => {
  const {
    pathname: l,
    query: i,
    as: f,
    resolvedAs: g,
    locale: h,
    pathnameModifier: c
  } = r;
  console.log("getRouteInfoOnly start = ", t);
  const p = g.split("#")[0].split("?")[0], u = c ? c(p) : p, n = await m(u, t), e = t == null ? void 0 : t.router;
  if (!e)
    throw new Error("router singleton is undefined");
  e.getRouteInfo = e.getRouteInfoOrig, e.onlyAHashChange = e.onlyAHashChangeOrig;
  try {
    const o = await e.fetchComponent(n).then(
      (s) => ({
        Component: s.page,
        styleSheets: s.styleSheets,
        __N_SSG: !1,
        __N_SSP: !1
      })
    );
    if (process.env.NODE_ENV !== "production") {
      const d = (await import("../index-Dth3kwzf.js").then((y) => y.i)).isValidElementType;
      if (!d(o.Component))
        throw new Error(
          `The default export is not a React Component in page: "${l}"`
        );
    }
    const a = await e.getInitialProps(
      o.Component,
      // we provide AppTree later so PageRouter.router! needs to be `any`
      {
        pathname: l,
        query: i,
        asPath: f,
        locale: h,
        locales: e.locales,
        defaultLocale: e.defaultLocale
      }
    );
    return a.pageProps = Object.assign({}, a.pageProps), o.props = a, o.route = n, o.query = i, o.resolvedAs = u, e.components[n] = o, o;
  } catch (o) {
    return console.log("getRouteInfoOnly error = ", o), e.getRouteInfo = e.getRouteInfoOrig, e.onlyAHashChange = e.onlyAHashChangeOrig, e.getRouteInfoOrig(r);
  }
};
export {
  O as getRouteInfoOnly
};
