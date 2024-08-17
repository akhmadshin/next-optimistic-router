const u = (n, e) => {
  const r = Object.keys(e).reduce((c, t) => c.replace(`[${t}]`, e[t]), n);
  return process.env.__NEXT_TRAILING_SLASH ? `${r}/` : r;
};
export {
  u as buildRoute
};
