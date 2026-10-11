
## Build a basic version of PayTM

### Peer-to-peer wallet app: a basic Paytm clone

![React](https://img.shields.io/badge/React-20232A?logo=react&logoColor=61DAFB) ![Vite](https://img.shields.io/badge/Vite-646CFF?logo=vite&logoColor=white) ![Tailwind](https://img.shields.io/badge/Tailwind-06B6D4?logo=tailwindcss&logoColor=white) ![Node.js](https://img.shields.io/badge/Node.js-339933?logo=nodedotjs&logoColor=white) ![Express](https://img.shields.io/badge/Express-000?logo=express&logoColor=white) ![MongoDB](https://img.shields.io/badge/MongoDB-47A248?logo=mongodb&logoColor=white)

Users sign up, get a wallet balance, search for other users, and send them money. Transfers run inside a **MongoDB transaction**, so a failed debit or credit never leaves balances inconsistent.

```mermaid
flowchart LR
    FE["React + Vite + Tailwind<br/>signup · signin · dashboard · send"] -->|JWT| API["Express API<br/>/api/v1/user · /api/v1/account"]
    API --> Z["Zod validation"]
    API --> DB[("MongoDB · Mongoose<br/>users · accounts")]
    API -->|"session.startTransaction()"| DB
```

```bash
cd backend && npm install && node index.js      # set MongoDB URL + JWT secret in config.js / .env
cd frontend && npm install && npm run dev
```
