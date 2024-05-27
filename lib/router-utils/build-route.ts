export const buildRoute = (route: string, params: Record<string, string>): string => {
  return Object.keys(params).reduce((acc, key) => {

    return acc.replace(`[${key}]`, params[key]);
  }, route);
};