import React from 'react';
import styles from './styles/Main.module.css';
import Carte from './Carte';

type MainProps = {
  titre: string,
  cartes: any[]
};

const Main: React.FC<MainProps> = ({ titre, cartes }) => {
  const getTitre = () => {
    if (cartes.length > 0) {
      return (
        <h1 className={styles.titre}>{titre}</h1>
      );
    }
  }
  return (
    <div className={styles.mainContainer}>
      {getTitre()}
      <div className={styles.carteContainer}>
        {cartes.map((carte: any, indice: number) => {
          return (
            <Carte key={indice} valeur={carte.valeur} couleur={carte.couleur} cache={carte.cache} />
          );
        })}
      </div>
    </div>
  );
}

export default Main;