import React from 'react';
import styles from './styles/Statut.module.css';

type StatutProps = {
  message: string,
  solde: number
};

const Statut: React.FC<StatutProps> = ({ message, solde }) => {
  return (
    <div className={styles.statutContainer}>
      <div className={styles.statut}>
        <h1 className={styles.valeur}>{message}</h1>
      </div>
      <div className={styles.solde}>
        <h1 className={styles.valeur}>${solde}</h1>
      </div>
    </div>
  );
}

export default Statut;