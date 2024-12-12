# TODO
### Database:
    1. Creare docker compose con mongodb ✔
    2. Creare le struttura e le collezione workflow.
### Nest:
    3. Creare una API fatta bene e tenere quella
    6. Implementare le CRUD per il workflow
### Agente:
    7. Vedremo

# API
L'endpoint è `localhost:3000`. \
Per provare le api c'è la collezione di `posting` in `poc/backend/posting-api/` (c'è lo script per avviarla velocemente).

- GET `/workflows` restituisce un array con gli id dei workflow disponibili
- GET `workflows/{workflow}/execute` Esegue il workflow e restituisce il risultato dell'esecuzione: 200 OK, 500 se c'è un errore o 501 se è chiesta una cosa non implementata (vedere come fare)

Operazioni CRUD sui workflow
- Create: POST `/workflows/new` Il backend riceve un workflow e ritorna 201 e l'id del workflow creato o 400 se è malformato
- Rread: GET `/workflows/{workflow}` Restituisce il JSON che descrive il workflow
- Update: POST `workflows/{workflow}` aggorna il workflow
- Delete: DELETE `/workflows/{workflow}` Cancella il workflow.

# Project setup
Da eseguire dentro la cartella poc-backend.
## Installare le dipendenze

```bash
$ npm install
```

## Avviare il server

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```