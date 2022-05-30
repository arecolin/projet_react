import React, { useState, useEffect } from 'react';
import styles from './styles/Controle.module.css';

type ControleProps = {
  solde: number,
  etatJeu: number,
  boutonEtat: any,
  miseEvent: any,
  piocheEvent: any,
  stopEvent: any,
  resetEvent: any
};

const Controle: React.FC<ControleProps> = ({ solde, etatJeu, boutonEtat, miseEvent, piocheEvent, stopEvent, resetEvent }) => {
  const [montant, setMontant] = useState(10);
  const [styleEntree, setStyleEntree] = useState(styles.entree);

  useEffect(() => {
    validation();
  }, [montant, solde]);

  const validation = () => {
    if (montant > solde) {
      setStyleEntree(styles.entreeErreur);
      return false;
    }
    if (montant < 0.01) {
      setStyleEntree(styles.entreeErreur);
      return false;
    }
    setStyleEntree(styles.entree);
    return true;
  }

  const montantChange = (e: any) => {
    setMontant(e.target.value);
  }

  const onMiseClick = () => {
    if (validation()) {
      miseEvent(Math.round(montant * 100) / 100);
    }
  }

  const getControle = () => {
    if (etatJeu === 0) {
      return (
        <div className={styles.controleContainer}>
          <div className={styles.miseContainer}>
            <h4>Montant:</h4>
            <input autoFocus type='number' value={montant} onChange={montantChange} className={styleEntree} />
          </div>
          <button onClick={() => onMiseClick()} className={styles.bouton}>Mise</button>
        </div>
      );
    }
    else {
      return (
        <div className={styles.controleContainer}>
          <button onClick={() => piocheEvent()} disabled={boutonEtat.piocheInactif} className={styles.bouton}>Pioche</button>
          <button onClick={() => stopEvent()} disabled={boutonEtat.stopInactif} className={styles.bouton}>Stop</button>
          <button onClick={() => resetEvent()} disabled={boutonEtat.resetInactif} className={styles.bouton}>Reinitialiser</button>
        </div>
      );
    }
  }

  return (
    <>
      {getControle()}
    </>
  );
}

export default Controle;