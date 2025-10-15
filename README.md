# UniCalc
UniCalc è una web app semplice e intuitiva progettata per aiutare gli studenti universitari a monitorare e pianificare la loro carriera accademica. Offre strumenti essenziali per calcolare la media ponderata in tempo reale e per proiettare il voto di laurea desiderato.

## Funzionalità
### Calcolo della Media Ponderata
- **Aggiunta Esami**: Inserisci gli esami sostenuti con nome (opzionale), voto e CFU.
  
  > [!NOTE] Gestione lode
  Gli esami con lode (30 e lode) sono trattati come 31/32 nel campo voto per permettere alla media di riflettere il bonus.

- **Aggiunta Attività**: Aggiungi attività come tirocini, certificazioni, idoneità linguistiche o laboratori che forniscono CFU ma non hanno un voto numerico.

  > [!NOTE] Attività, Tirocini, Certificazioni
  Le attività senza voto contribuiscono solo al conteggio CFU e non alla media.

- **Riepilogo Dinamico**: Visualizza un elenco chiaro e aggiornato di tutti gli esami e le attività inserite, con la possibilità di rimuovere ogni voce singolarmente.
- **Statistiche**: Aggiornamento istantaneo di media ponderata e totale dei CFU acquisiti.

![](/assets/images/image1.png)

### Proiezione del Voto di Laurea
Inserisci i CFU totali del tuo corso di laurea e il voto di laurea che desideri ottenere (es. 110). L'applicazione calcolerà istantaneamente la media che dovrai mantenere negli esami futuri per raggiungere il tuo obiettivo. Inoltre, ricevi un feedback chiaro sulla fattibilità del tuo obiettivo (se è realistico, difficile o già superato).

![](/assets/images/image2.png)

### Progresso CFU e Voto di Laurea Previsto
Mostra in modo chiaro e aggiornato il tuo progresso verso il conseguimento dei CFU totali richiesti dal corso di laurea e stima un voto di laurea previsto basato sui voti già registrati.

> [!NOTE] Esempio 
Se i CFU totali richiesti sono 180 e i CFU acquisiti sono 120 i CFU rimanenti sono 60 (33%). Se la media corrente è 27.5 il voto di laurea previsto sarà circa 108.

L'app calcola il totale dei CFU acquisiti (esami + attività) e lo confronta con il totale richiesto dal corso. Se l'utente inserisce anche una stima della media che manterrà nei restanti esami, l'app stima il voto di laurea finale. In assenza di una stima, viene mostrata la proiezione basata sull'attuale media ponderata.
- **Input**: elenco di esami (voto e CFU), elenco attività (CFU), CFU totali richiesti dal corso (es. 180), opzionalmente la media stimata per gli esami futuri.
- **Output**:
	- CFU acquisiti e CFU rimanenti
	- Percentuale di completamento del piano di studi
	- Media ponderata corrente
	- Voto di laurea previsto (stima) e spiegazione sul calcolo
	- Indicazione di fattibilità

![](/assets/images/image3.png)

> [!WARNING] Importante
Il calcolo del voto di laurea è una **stima**: diverse università applicano regole diverse (bonus per lode, commissioni, crediti della tesi). *UniCalc* fornisce una proiezione basata sulla media ponderata e sui CFU, ma **non sostituisce il regolamento ufficiale dell'ateneo**.

## Come usare UniCalc
Essendo una web app statica contenuta in un unico file HTML, non richiede installazione né un server. Clona la repo, salvala e fai doppio click sul file `index.html` per aprirla in qualsiasi browser.

## Tecnologie
- **HTML5**: Struttura
- **Tailwind CSS**: Styling
- **JavaScript**: Logica di calcolo e interattività

## Contatti
Se vuoi connetterti con me, puoi utilizzare uno tra i seguenti:
- [LinkedIn](https://www.linkedin.com/in/emmaprivitera/)
- [E-mail](mailto:emma.privitera.505@gmail.com)
- [Telegram](https://t.me/t3staocr0ce)