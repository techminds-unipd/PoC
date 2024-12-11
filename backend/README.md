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
- GET `/workflows/{workflow}` Restituisce il JSON che descrive il workflow
- DELETE `/workflows/{workflow}` Cancella il workflow.
- GET `workflows/{workflow}/execute` Restituisce il risultato dell'esecuzione (enum da definire)

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