import React from 'react';
import styles from './styles/Carte.module.css';

type CarteProps = {
  valeur: string;
  couleur: string;
  cache: boolean;
};

const Carte: React.FC<CarteProps> = ({ valeur, couleur, cache }) => {
  const getCouleur = () => {
    if (couleur === '♠' || couleur === '♣') {
      return styles.noir;
    }
    else {
      return styles.rouge;
    }
  }

  const getCarte = () => {
    if (cache) {
      return (
        <div className={styles.carteCache} />
      );
    }
    else {
      return (
        <div className={styles.carte}>
          <div className={getCouleur()}>
            <h1 className={styles.valeur}>{valeur}</h1>
            <h1 className={styles.suit}>{couleur}</h1>
          </div>
        </div>
      );
    }
  }

  return (
    <>
      {getCarte()}
    </>
  );
}

export default Carte;