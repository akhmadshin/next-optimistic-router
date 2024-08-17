export const buildRoute = (route: string, params: Record<string, string>, withTrailingSlah: boolean): string => {
  const pathname = Object.keys(params).reduce((acc, key) => {
    return acc.replace(`[${key}]`, params[key]);
  }, route);

  if (withTrailingSlah) {
    return `${pathname}/`
  }
  return pathname;
};