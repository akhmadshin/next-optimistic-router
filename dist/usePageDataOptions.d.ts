import { NextRouter } from 'next/router';

export declare const usePageDataOptions: <T>(router: NextRouter, withTrailingSlash: boolean) => {
    queryKey: string[];
    queryFn: () => Promise<never>;
};
