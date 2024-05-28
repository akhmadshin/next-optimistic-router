import { NextRouter, SingletonRouter } from 'next/router';

export declare const usePageDataOptions: <T>(router: NextRouter, singletonRouter: SingletonRouter, withTrailingSlash: boolean) => {
    queryKey: string[];
    queryFn: () => Promise<never>;
};
