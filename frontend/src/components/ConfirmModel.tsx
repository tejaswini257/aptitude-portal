"use client";

import styles from "./confirmModal.module.css";

type Props = {
  title: string;
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
};

export default function ConfirmModal({
  title,
  message,
  onConfirm,
  onCancel,
}: Props) {
  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        <h3>{title}</h3>
        <p>{message}</p>

        <div className={styles.actions}>
          <button onClick={onCancel}>Cancel</button>
          <button className={styles.danger} onClick={onConfirm}>
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}
