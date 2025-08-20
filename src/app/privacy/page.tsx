// src/pages/Privacy/PrivacyPage.tsx

import styles from "./PrivacyPage.module.css";

export default function PrivacyPage() {
  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Privacy Policy</h1>
      <p className={styles.text}>
        Use this page to detail your site's privacy policy.
      </p>
      <ul className={styles.list}>
        <li className={styles.listItem}>Exemplo de item 1</li>
        <li className={styles.listItem}>Exemplo de item 2</li>
      </ul>
    </div>
  );
}
