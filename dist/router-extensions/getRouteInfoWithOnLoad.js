const i = async ({ onLoad: e, singletonRouter: t, ...o }) => {
  const a = t == null ? void 0 : t.router;
  if (!a)
    throw new Error("router singleton is undefined");
  return a.getRouteInfoOrig({
    ...o
  }).then((r) => (e && e(r).catch((n) => {
    throw n.message.startsWith("Invariant: attempted to hard navigate to the same URL") && window.__NEXT_OPTIMISTIC_LINK_RENDERED_PATHNAME === window.location.pathname && a.reload(), new Error(n);
  }), r));
};
export {
  i as getRouteInfoWithOnLoad
};
