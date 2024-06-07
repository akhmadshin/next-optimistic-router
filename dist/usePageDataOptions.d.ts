import { NextRouter } from 'next/router';

export declare const usePageDataOptions: (router: NextRouter, withTrailingSlash: boolean) => {
    queryKey: string[];
    queryFn: () => Promise<object>;
};
