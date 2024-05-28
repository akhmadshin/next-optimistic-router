import type { LinkProps } from 'next/link';
import type {
  AnchorHTMLAttributes,
  KeyboardEvent,
  MouseEvent,
} from 'react';
import React, { forwardRef, useContext } from 'react';

import { OptimisticLinkContext } from './OptimisticLinkProvider';
import type { GetRouteInfoProps, ModifiedRouter } from './router-extensions/types';
import { UrlObject } from 'url';

type NextLinkProps = Omit<AnchorHTMLAttributes<HTMLAnchorElement>, keyof LinkProps> & LinkProps

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

type Props = NextLinkProps & {
  link: React.ForwardRefExoticComponent<Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, keyof InternalLinkProps> & InternalLinkProps & {
    children?: React.ReactNode;
  } & React.RefAttributes<HTMLAnchorElement>>
}

export const OptimisticLink = forwardRef<HTMLAnchorElement, Props>(function LinkComponent(props, forwardedRef) {
  const {
    onClick,
    onKeyPress,
    children,
    link: Link,
    ...restProps
  } = props;
  const { pathnameModifier, singletonRouter } = useContext(OptimisticLinkContext);

  const handleClick = (e: MouseEvent<HTMLAnchorElement>) => {
    if (onClick) {
      onClick(e);
    }
    handleNavigation();
  }

  const handleKeyPress = (e: KeyboardEvent<HTMLAnchorElement>) => {
    if (onKeyPress) {
      onKeyPress(e);
    }

    const { key } = e;
    if (['Space', 'Enter'].includes(key)) {
      handleNavigation();
    }
  }

  const handleNavigation = () => {
    const pageRouter = singletonRouter?.router as ModifiedRouter | null;
    if (!pageRouter) {
      return;
    }
    // On 404 page pathnameModifier is undefined
    if (!pathnameModifier) {
      return;
    }
    pageRouter.getRouteInfo = (props: GetRouteInfoProps) => pageRouter.getRouteInfoOnly({
      ...props,
      singletonRouter,
      pathnameModifier,
    });
  }

  return (
    <Link
      onClick={handleClick}
      onKeyPress={handleKeyPress}
      ref={forwardedRef}
      {...restProps}
    >
      {children}
    </Link>
  )
})