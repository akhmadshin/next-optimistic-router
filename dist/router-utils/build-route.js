const c = (t, e) => Object.keys(e).reduce((u, r) => u.replace(`[${r}]`, e[r]), t);
export {
  c as buildRoute
};
