const f = (r, e) => {
  const o = e == null ? void 0 : e.router;
  if (!o)
    throw new Error("router singleton is undefined");
  o._bps = (t) => (o && (o.getRouteInfo = o.getRouteInfoOnly), window.__NEXT_OPTIMISTIC_LINK_RENDERED_PATHNAME = window.location.pathname, r(t));
};
export {
  f as beforePopStateModified
};
