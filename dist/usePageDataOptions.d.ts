import { NextRouter } from 'next/router';

export declare const usePageDataOptions: (router: NextRouter) => {
    queryKey: string[];
    queryFn: () => Promise<object>;
};
