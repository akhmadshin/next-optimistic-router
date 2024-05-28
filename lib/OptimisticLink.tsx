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
  /**
   * The path or URL to navigate to. It can also be an object.
   *
   * @example https://nextjs.org/docs/api-reference/next/link#with-url-object
   */
  href: Url;
  /**
   * Optional decorator for the path that will be shown in the browser URL bar. Before Next.js 9.5.3 this was used for dynamic routes, check our [previous docs](https://github.com/vercel/next.js/blob/v9.5.2/docs/api-reference/next/link.md#dynamic-routes) to see how it worked. Note: when this path differs from the one provided in `href` the previous `href`/`as` behavior is used as shown in the [previous docs](https://github.com/vercel/next.js/blob/v9.5.2/docs/api-reference/next/link.md#dynamic-routes).
   */
  as?: Url;
  /**
   * Replace the current `history` state instead of adding a new url into the stack.
   *
   * @defaultValue `false`
   */
  replace?: boolean;
  /**
   * Whether to override the default scroll behavior
   *
   * @example https://nextjs.org/docs/api-reference/next/link#disable-scrolling-to-the-top-of-the-page
   *
   * @defaultValue `true`
   */
  scroll?: boolean;
  /**
   * Update the path of the current page without rerunning [`getStaticProps`](/docs/basic-features/data-fetching/get-static-props.md), [`getServerSideProps`](/docs/basic-features/data-fetching/get-server-side-props.md) or [`getInitialProps`](/docs/api-reference/data-fetching/get-initial-props.md).
   *
   * @defaultValue `false`
   */
  shallow?: boolean;
  /**
   * Forces `Link` to send the `href` property to its child.
   *
   * @defaultValue `false`
   */
  passHref?: boolean;
  /**
   * Prefetch the page in the background.
   * Any `<Link />` that is in the viewport (initially or through scroll) will be preloaded.
   * Prefetch can be disabled by passing `prefetch={false}`. When `prefetch` is set to `false`, prefetching will still occur on hover. Pages using [Static Generation](/docs/basic-features/data-fetching/get-static-props.md) will preload `JSON` files with the data for faster page transitions. Prefetching is only enabled in production.
   *
   * @defaultValue `true`
   */
  prefetch?: boolean;
  /**
   * The active locale is automatically prepended. `locale` allows for providing a different locale.
   * When `false` `href` has to include the locale as the default behavior is disabled.
   */
  locale?: string | false;
  /**
   * Enable legacy link behavior.
   * @defaultValue `false`
   * @see https://github.com/vercel/next.js/commit/489e65ed98544e69b0afd7e0cfc3f9f6c2b803b7
   */
  legacyBehavior?: boolean;
  /**
   * Optional event handler for when the mouse pointer is moved onto Link
   */
  onMouseEnter?: React.MouseEventHandler<HTMLAnchorElement>;
  /**
   * Optional event handler for when Link is touched.
   */
  onTouchStart?: React.TouchEventHandler<HTMLAnchorElement>;
  /**
   * Optional event handler for when Link is clicked.
   */
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
    console.log('singletonRouter = ', singletonRouter);
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