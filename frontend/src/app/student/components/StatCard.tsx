import styles from "../student.module.css";

type Props = {
  label: string;
  value: string | number;
};

export default function StatCard({ label, value }: Props) {
  return (
    <div className={styles.statCard}>
      <h3>{value}</h3>
      <p>{label}</p>
    </div>
  );
}
