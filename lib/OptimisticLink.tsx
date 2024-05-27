import type { LinkProps } from 'next/link';
import NextLink from 'next/link';
import type {
  AnchorHTMLAttributes,
  KeyboardEvent,
  MouseEvent,
} from 'react';
import React, { forwardRef, useContext } from 'react';

import { OptimisticLinkContext } from './OptimisticLinkProvider';
import type { GetRouteInfoProps, ModifiedRouter } from './router-extensions/types';
import PageRouter from 'next/router';

type NextLinkProps = Omit<AnchorHTMLAttributes<HTMLAnchorElement>, keyof LinkProps> & LinkProps & {
  children: React.ReactNode;
}

export const OptimisticLink = forwardRef<HTMLAnchorElement, NextLinkProps>(function LinkComponent(props, forwardedRef) {
  const {
    onClick,
    onKeyPress,
    children,
    ...restProps
  } = props;
  const pathnameModifier = useContext(OptimisticLinkContext);

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
    const pageRouter = PageRouter.router as ModifiedRouter | null;
    if (!pageRouter) {
      return;
    }
    // On 404 page pathnameModifier is undefined
    if (!pathnameModifier) {
      return;
    }
    pageRouter.getRouteInfo = (props: GetRouteInfoProps) => pageRouter.getRouteInfoOnly({
      ...props,
      pathnameModifier,
    });
  }

  return (
    <NextLink
      onClick={handleClick}
      onKeyPress={handleKeyPress}
      ref={forwardedRef}
      {...restProps}
    >
      {children}
    </NextLink>
  )
})