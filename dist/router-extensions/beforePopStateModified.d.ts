import { SingletonRouter } from 'next/router';

interface TransitionOptions {
    shallow?: boolean;
    locale?: string | false;
    scroll?: boolean;
    unstable_skipClientCache?: boolean;
}
interface NextHistoryState {
    url: string;
    as: string;
    options: TransitionOptions;
}
export type BeforePopStateCallback = (state: NextHistoryState) => boolean;
export declare const beforePopStateModified: (cb: BeforePopStateCallback, singletonRouter?: SingletonRouter) => void;
export {};
