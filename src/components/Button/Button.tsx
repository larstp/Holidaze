import type { ButtonHTMLAttributes, ReactNode } from 'react';
import styles from './Button.module.css';

type ButtonVariant = 'primary' | 'secondary' | 'icon';
type ButtonSize = 'default' | 'small';

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: ButtonVariant;
  size?: ButtonSize;
  icon?: ReactNode;
};

function Button({
  children,
  className = '',
  icon,
  size = 'default',
  variant = 'primary',
  ...buttonProps
}: ButtonProps) {
  const buttonClassName = [
    styles.button,
    styles[variant],
    styles[size],
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <button className={buttonClassName} {...buttonProps}>
      {icon && <span className={styles.icon}>{icon}</span>}
      {children}
    </button>
  );
}

export default Button;
