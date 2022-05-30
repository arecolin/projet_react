import React, { useState, useEffect } from 'react';
import Statut from './Statut';
import Controle from './Controle';
import Main from './Main';
import jsonData from '../cartes.json';

const App: React.FC = () => {
  enum EtatJeu {
    mise,
    init,
    tourJoueur,
    tourDealer
  }

  enum PossessionCarte {
    joueur,
    dealer,
    cache
  }

  enum Message {
    mise = 'Place ta mise!',
    piocheStop = 'pioche ou stop?',
    dommage = 'Dommage!',
    joueurGagne = 'Tu as gagné!',
    dealerGagne = 'le dealer a gagné!',
    egalite = 'Egalité!'
  }

  const data = JSON.parse(JSON.stringify(jsonData.cartes));
  const [cartes, setCartes]: any[] = useState(data);

  const [joueurCartes, setJoueurCartes]: any[] = useState([]);
  const [joueurScore, setJoueurScore] = useState(0);
  const [joueurCompte, setJoueurCompte] = useState(0);

  const [dealerCartes, setDealerCartes]: any[] = useState([]);
  const [dealerScore, setDealerScore] = useState(0);
  const [dealerCompte, setDealerCompte] = useState(0);

  const [solde, setSolde] = useState(100);
  const [mise, setMise] = useState(0);

  const [etatJeu, setEtatJeu] = useState(EtatJeu.mise);
  const [message, setMessage] = useState(Message.mise);
  const [boutonEtat, setBoutonEtat] = useState({
    piocheInactif: false,
    stopInactif: false,
    resetInactif: true
  });

  useEffect(() => {
    if (etatJeu === EtatJeu.init) {
      newCarte(PossessionCarte.joueur);
      newCarte(PossessionCarte.cache);
      newCarte(PossessionCarte.joueur);
      newCarte(PossessionCarte.dealer);
      setEtatJeu(EtatJeu.tourJoueur);
      setMessage(Message.piocheStop);
    }
  }, [etatJeu]);

  useEffect(() => {
    calcul(joueurCartes, setJoueurScore);
    setJoueurCompte(joueurCompte + 1);
  }, [joueurCartes]);

  useEffect(() => {
    calcul(dealerCartes, setDealerScore);
    setDealerCompte(dealerCompte + 1);
  }, [dealerCartes]);

  useEffect(() => {
    if (etatJeu === EtatJeu.tourJoueur) {
      if (joueurScore === 21) {
        boutonEtat.piocheInactif = true;
        setBoutonEtat({ ...boutonEtat });
      }
      else if (joueurScore > 21) {
        dommage();
      }
    }
  }, [joueurCompte]);

  useEffect(() => {
    if (etatJeu === EtatJeu.tourDealer) {
      if (dealerScore >= 17) {
        verifGagne();
      }
      else {
        newCarte(PossessionCarte.dealer);
      }
    }
  }, [dealerCompte]);

  const resetJeu = () => {
    console.clear();
    setCartes(data);

    setJoueurCartes([]);
    setJoueurScore(0);
    setJoueurCompte(0);

    setDealerCartes([]);
    setDealerScore(0);
    setDealerCompte(0);

    setMise(0);

    setEtatJeu(EtatJeu.mise);
    setMessage(Message.mise);
    setBoutonEtat({
      piocheInactif: false,
      stopInactif: false,
      resetInactif: true
    });
  }

  const placeMise = (montant: number) => {
    setMise(montant);
    setSolde(Math.round((solde - montant) * 100) / 100);
    setEtatJeu(EtatJeu.init);
  }

  const newCarte = (possessionType: PossessionCarte) => {
    if (cartes.length > 0) {
      const aleatoireIndice = Math.floor(Math.random() * cartes.length);
      const carte = cartes[aleatoireIndice];
      cartes.splice(aleatoireIndice, 1);
      setCartes([...cartes]);
      console.log('Cartes restantes : ', cartes.length);
      switch (carte.couleur) {
        case 'pique':
          distributionCarte(possessionType, carte.valeur, '♠');
          break;
        case 'carreau':
          distributionCarte(possessionType, carte.valeur, '♦');
          break;
        case 'trefle':
          distributionCarte(possessionType, carte.valeur, '♣');
          break;
        case 'coeur':
          distributionCarte(possessionType, carte.valeur, '♥');
          break;
        default:
          break;
      }
    }
    else {
      alert('Toutes les cartes ont été distribuées');
    }
  }

  const distributionCarte = (possessionType: PossessionCarte, valeur: string, couleur: string) => {
    switch (possessionType) {
      case PossessionCarte.joueur:
        joueurCartes.push({ 'valeur': valeur, 'couleur': couleur, 'cache': false });
        setJoueurCartes([...joueurCartes]);
        break;
      case PossessionCarte.dealer:
        dealerCartes.push({ 'valeur': valeur, 'couleur': couleur, 'cache': false });
        setDealerCartes([...dealerCartes]);
        break;
      case PossessionCarte.cache:
        dealerCartes.push({ 'valeur': valeur, 'couleur': couleur, 'cache': true });
        setDealerCartes([...dealerCartes]);
        break;
      default:
        break;
    }
  }

  const reveleCarte = () => {
    dealerCartes.filter((carte: any) => {
      if (carte.cache === true) {
        carte.cache = false;
      }
      return carte;
    });
    setDealerCartes([...dealerCartes])
  }

  const calcul = (cartes: any[], setScore: any) => {
    let total = 0;
    cartes.forEach((carte: any) => {
      if (carte.cache === false && carte.valeur !== 'A') {
        switch (carte.valeur) {
          case 'K':
            total += 10;
            break;
          case 'Q':
            total += 10;
            break;
          case 'J':
            total += 10;
            break;
          default:
            total += Number(carte.valeur);
            break;
        }
      }
    });
    const aces = cartes.filter((carte: any) => {
      return carte.valeur === 'A';
    });
    aces.forEach((carte: any) => {
      if (carte.cache === false) {
        if ((total + 11) > 21) {
          total += 1;
        }
        else if ((total + 11) === 21) {
          if (aces.length > 1) {
            total += 1;
          }
          else {
            total += 11;
          }
        }
        else {
          total += 11;
        }
      }
    });
    setScore(total);
  }

  const pioche = () => {
    newCarte(PossessionCarte.joueur);
  }

  const stop = () => {
    boutonEtat.piocheInactif = true;
    boutonEtat.stopInactif = true;
    boutonEtat.resetInactif = false;
    setBoutonEtat({ ...boutonEtat });
    setEtatJeu(EtatJeu.tourDealer);
    reveleCarte();
  }

  const dommage = () => {
    boutonEtat.piocheInactif = true;
    boutonEtat.stopInactif = true;
    boutonEtat.resetInactif = false;
    setBoutonEtat({ ...boutonEtat });
    setMessage(Message.dommage);
  }

  const verifGagne = () => {
    if (joueurScore > dealerScore || dealerScore > 21) {
      setSolde(Math.round((solde + (mise * 2)) * 100) / 100);
      setMessage(Message.joueurGagne);
    }
    else if (dealerScore > joueurScore) {
      setMessage(Message.dealerGagne);
    }
    else {
      setSolde(Math.round((solde + (mise * 1)) * 100) / 100);
      setMessage(Message.egalite);
    }
  }

  return (
    <>
      <Statut message={message} solde={solde} />
      <Controle
        solde={solde}
        etatJeu={etatJeu}
        boutonEtat={boutonEtat}
        miseEvent={placeMise}
        piocheEvent={pioche}
        stopEvent={stop}
        resetEvent={resetJeu}
      />
      <Main titre={`Main du dealer (${dealerScore})`} cartes={dealerCartes} />
      <Main titre={`Votre main (${joueurScore})`} cartes={joueurCartes} />
    </>
  );
}

export default App;
