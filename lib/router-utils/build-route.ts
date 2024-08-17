export const buildRoute = (route: string, params: Record<string, string>): string => {
  const pathname = Object.keys(params).reduce((acc, key) => {

    return acc.replace(`[${key}]`, params[key]);
  }, route);

  if (process.env.__NEXT_TRAILING_SLASH) {
    return `${pathname}/`
  }
  return pathname;
};