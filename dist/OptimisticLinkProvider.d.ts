import { FC, PropsWithChildren } from 'react';
import { SingletonRouter } from 'next/router';

interface Props {
    pathnameModifier: (pathname: string) => string;
    singletonRouter?: SingletonRouter;
}
export declare const OptimisticLinkContext: import('react').Context<Props>;
export declare const patchRouter: (pathnameModifier?: (pathname: string) => string, singletonRouter?: SingletonRouter) => void;
export declare const OptimisticLinkProvider: FC<PropsWithChildren<Props>>;
export {};
