import cn from 'classnames';
import React, { forwardRef, useRef, ButtonHTMLAttributes, ReactNode, ComponentType } from 'react';
import mergeRefs from 'react-merge-refs';
import styles from './Button.module.css';

import LoadingDots from '@/components/ui/LoadingDots';
import { tw } from 'twind'

interface Props extends ButtonHTMLAttributes<HTMLButtonElement> {
  children?: ReactNode;
  variant?: 'slim' | 'flat';
  active?: boolean;
  width?: number;
  loading?: boolean;
  Component?: ComponentType;
}

// eslint-disable-next-line react/display-name
const Button = forwardRef<HTMLButtonElement, Props>((props, buttonRef) => {
  const {
    className,
    variant = 'flat',
    children,
    active,
    width,
    loading = false,
    disabled = false,
    style = {},
    Component = 'button',
    ...rest
  } = props;
  const ref = useRef(null);
  const rootClassName = cn(
    styles.root,
    {
      [styles.slim]: variant === 'slim',
      [styles.loading]: loading,
      [styles.disabled]: disabled
    },
    className
  );
  return (
    <Component
      aria-pressed={active}
      data-variant={variant}
      ref={mergeRefs([ref, buttonRef])}
      className={rootClassName}
      disabled={disabled}
      style={{
        width,
        ...style
      }}
      {...rest}
    >
      { loading?  
        <i className={tw`pl-2 m-0 flex`}>
          <LoadingDots />
        </i> : children } 

    </Component>
  );
});

export default Button;
