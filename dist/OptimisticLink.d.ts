import { AnchorHTMLAttributes, default as React } from 'react';
import { UrlObject } from 'url';

type Url = string | UrlObject;
type InternalLinkProps = {
    href: Url;
    as?: Url;
    replace?: boolean;
    scroll?: boolean;
    shallow?: boolean;
    passHref?: boolean;
    prefetch?: boolean;
    locale?: string | false;
    legacyBehavior?: boolean;
    onMouseEnter?: React.MouseEventHandler<HTMLAnchorElement>;
    onTouchStart?: React.TouchEventHandler<HTMLAnchorElement>;
    onClick?: React.MouseEventHandler<HTMLAnchorElement>;
};
export declare const OptimisticLink: React.ForwardRefExoticComponent<Omit<AnchorHTMLAttributes<HTMLAnchorElement>, keyof {
    href: string | UrlObject;
    as?: (string | UrlObject) | undefined;
    replace?: boolean | undefined;
    scroll?: boolean | undefined;
    shallow?: boolean | undefined;
    passHref?: boolean | undefined;
    prefetch?: boolean | undefined;
    locale?: string | false | undefined;
    legacyBehavior?: boolean | undefined;
    onMouseEnter?: React.MouseEventHandler<HTMLAnchorElement> | undefined;
    onTouchStart?: React.TouchEventHandler<HTMLAnchorElement> | undefined;
    onClick?: React.MouseEventHandler<HTMLAnchorElement> | undefined;
}> & {
    href: string | UrlObject;
    as?: (string | UrlObject) | undefined;
    replace?: boolean | undefined;
    scroll?: boolean | undefined;
    shallow?: boolean | undefined;
    passHref?: boolean | undefined;
    prefetch?: boolean | undefined;
    locale?: string | false | undefined;
    legacyBehavior?: boolean | undefined;
    onMouseEnter?: React.MouseEventHandler<HTMLAnchorElement> | undefined;
    onTouchStart?: React.TouchEventHandler<HTMLAnchorElement> | undefined;
    onClick?: React.MouseEventHandler<HTMLAnchorElement> | undefined;
} & {
    link: React.ForwardRefExoticComponent<Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, keyof InternalLinkProps> & InternalLinkProps & {
        children?: React.ReactNode;
    } & React.RefAttributes<HTMLAnchorElement>>;
} & React.RefAttributes<HTMLAnchorElement>>;
export {};
