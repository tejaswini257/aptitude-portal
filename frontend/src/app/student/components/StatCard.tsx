import styles from "../student.module.css";

type Props = {
  label: string;
  value: string | number;
};

export default function StatCard({ label, value }: Props) {
  return (
   <div className={styles.statCard}>
  <p className={styles.statLabel}>{label}</p>
  <h3 className={styles.statValue}>{value}</h3>
</div>
  );
}
