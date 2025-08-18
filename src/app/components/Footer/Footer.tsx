// app/components/Footer/Footer.tsx

"use client";

import { FC } from "react";
import styles from "./Footer.module.css";

const Footer: FC = () => {
  return (
    <footer className={styles.footer}>
      © {new Date().getFullYear()} Minha Escola
    </footer>
  );
};

export default Footer;
