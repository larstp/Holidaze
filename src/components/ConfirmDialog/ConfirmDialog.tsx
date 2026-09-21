import type { ReactNode } from 'react';
import Button from '../Button/Button';
import styles from './ConfirmDialog.module.css';

type ConfirmDialogProps = {
  open: boolean;
  title: string;
  children: ReactNode;
  confirmLabel?: string;
  isComplete?: boolean;
  error?: string;
  onConfirm: () => void;
  onCancel: () => void;
};

function ConfirmDialog({
  open,
  title,
  children,
  confirmLabel = 'Confirm',
  isComplete = false,
  error,
  onConfirm,
  onCancel,
}: ConfirmDialogProps) {
  if (!open) return null;

  return (
    <div className={styles.backdrop} role="presentation" onMouseDown={onCancel}>
      <section
        className={styles.dialog}
        role="dialog"
        aria-modal="true"
        aria-labelledby="confirm-dialog-title"
        onMouseDown={(event) => event.stopPropagation()}
      >
        <h2 id="confirm-dialog-title">{title}</h2>
        {error && (
          <p className={styles.error} role="alert">
            {error}
          </p>
        )}
        <p>{children}</p>
        <div className={styles.actions}>
          {!isComplete && (
            <Button type="button" variant="secondary" onClick={onCancel}>
              Cancel
            </Button>
          )}
          <Button
            type="button"
            variant="primary"
            className={isComplete ? undefined : styles.deleteButton}
            onClick={isComplete ? onCancel : onConfirm}
          >
            {isComplete ? 'Done' : confirmLabel}
          </Button>
        </div>
      </section>
    </div>
  );
}

export default ConfirmDialog;
