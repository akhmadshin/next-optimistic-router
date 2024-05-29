const o = async ({ onLoad: r, singletonRouter: a, ...n }) => {
  const e = a == null ? void 0 : a.router;
  if (!e)
    throw new Error("router singleton is undefined");
  return e.getRouteInfoOrig({
    ...n
  }).then(async (t) => (r && await r(t), t)).catch((t) => {
    throw t.message.startsWith("Invariant: attempted to hard navigate to the same URL") && window.__NEXT_OPTIMISTIC_LINK_RENDERED_PATHNAME === window.location.pathname && e.reload(), new Error(t);
  });
};
export {
  o as getRouteInfoWithOnLoad
};
