'use client';

import Link from 'next/link';
import type { ButtonHTMLAttributes, ReactNode } from 'react';

type ButtonVariant = 'filled' | 'unfilled';
type ButtonSize = 'sm' | 'md' | 'lg';

type CommonProps = {
  children: ReactNode;
  variant?: ButtonVariant;
  size?: ButtonSize;
  fullWidth?: boolean;
  className?: string;
  ariaLabel?: string;
};

type LinkProps = CommonProps & {
  href: string;
  target?: string;
  rel?: string;
  onClick?: never;
  type?: never;
};

type NativeButtonProps = CommonProps &
  ButtonHTMLAttributes<HTMLButtonElement> & {
    href?: never;
  };

type SeemeButtonProps = LinkProps | NativeButtonProps;

function joinClassNames(...values: Array<string | undefined | false>) {
  return values.filter(Boolean).join(' ');
}

export default function SeemeButton(props: SeemeButtonProps) {
  const {
    children,
    variant = 'filled',
    size = 'md',
    fullWidth = false,
    className,
    ariaLabel,
  } = props;

  const classes = joinClassNames(
    'seeme-button',
    variant === 'filled' ? 'seeme-button--filled' : 'seeme-button--unfilled',
    size === 'sm' ? 'seeme-button--sm' : size === 'lg' ? 'seeme-button--lg' : 'seeme-button--md',
    fullWidth && 'seeme-button--full',
    className
  );

  if ('href' in props && props.href) {
    const isInternal = props.href.startsWith('/');
    if (isInternal) {
      return (
        <Link href={props.href} className={classes} aria-label={ariaLabel}>
          {children}
        </Link>
      );
    }

    return (
      <a href={props.href} target={props.target} rel={props.rel} className={classes} aria-label={ariaLabel}>
        {children}
      </a>
    );
  }

  const nativeProps = { ...props } as NativeButtonProps;
  delete nativeProps.children;
  delete nativeProps.variant;
  delete nativeProps.size;
  delete nativeProps.fullWidth;
  delete nativeProps.className;
  delete nativeProps.ariaLabel;
  delete nativeProps.href;

  const { type = 'button', ...buttonProps } = nativeProps;
  return (
    <button type={type} {...buttonProps} className={classes} aria-label={ariaLabel}>
      {children}
    </button>
  );
}
