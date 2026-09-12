import { forwardRef } from 'react';
import type { ButtonHTMLAttributes, ReactNode } from 'react';
import styles from './Button.module.css';

type ButtonVariant =
  'primary' | 'secondary' | 'secondaryDark' | 'tertiary' | 'light' | 'icon';
type ButtonSize = 'default' | 'small';

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: ButtonVariant;
  size?: ButtonSize;
  icon?: ReactNode;
};

const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  {
    children,
    className = '',
    icon,
    size = 'default',
    variant = 'primary',
    ...buttonProps
  }: ButtonProps,
  ref
) {
  const buttonClassName = [
    styles.button,
    styles[variant],
    styles[size],
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <button ref={ref} className={buttonClassName} {...buttonProps}>
      {icon && <span className={styles.icon}>{icon}</span>}
      {children}
    </button>
  );
});

Button.displayName = 'Button';

export default Button;
