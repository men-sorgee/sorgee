
import React, { forwardRef, useRef, ButtonHTMLAttributes } from 'react';
import mergeRefs from 'react-merge-refs';
import LoadingDots from '@/components/ui/LoadingDots';
import { tw } from 'twind'

interface Props extends ButtonHTMLAttributes<HTMLButtonElement> {
  children?: React.ReactNode;
  variant?: 'slim' | 'flat';
  active?: boolean;
  width?: number;
  loading?: boolean
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
    ...rest
  } = props;
  const ref = useRef(null);
  //const rootClassName = cn(
  //  styles.root,
  //  {
  //    [styles.slim]: variant === 'slim',
  //    [styles.loading]: loading,
  //    [styles.disabled]: disabled
  //  },
  //  className
  //);
  return (
    <button
      aria-pressed={active}
      data-variant={variant}
      ref={mergeRefs([ref, buttonRef])}
      className={tw`bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded`}
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

    </button>
  );
});

export default Button;
