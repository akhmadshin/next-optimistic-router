const o = (n, e, u) => {
  const t = Object.keys(e).reduce((c, r) => c.replace(`[${r}]`, e[r]), n);
  return u ? `${t}/` : t;
};
export {
  o as buildRoute
};
