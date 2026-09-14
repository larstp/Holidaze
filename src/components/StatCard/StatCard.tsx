import type { LucideIcon } from 'lucide-react';
import styles from './StatCard.module.css';

type StatCardProps = {
  icon: LucideIcon;
  value: string | number;
  label: string;
};

function StatCard({ icon: Icon, value, label }: StatCardProps) {
  return (
    <div className={styles.card}>
      <span className={styles.icon}>
        <Icon aria-hidden="true" />
      </span>
      <strong>{value}</strong>
      <small>{label}</small>
    </div>
  );
}

export default StatCard;
