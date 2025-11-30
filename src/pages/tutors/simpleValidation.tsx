import styles from "@/styles/Home.module.css";
import { FC } from "react";

export const SimpleValidation: FC<{ title: string }> = ({ title }) => {
  return (
    <div className={styles.card}>
      <h5 className={styles.h5}>{title}</h5>
      <br />
    </div>
  );
};
