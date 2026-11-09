# React + Vite

## Customer and wholesaler accounts

Run `npm run dev` to start the Vite app and its account API. Customers and
wholesalers can create accounts with different email addresses and passwords.
Accounts are saved by the backend in `server/data/accounts.json`; passwords
are stored as salted scrypt hashes. Successful sign-in dates are saved
separately in `server/data/login-history.json`. These runtime files are ignored
by Git.

Worker accounts are available from signup and open a staff workspace after
sign-in. Worker attendance, daily dress-code checklists, and manually entered
in-store sales are stored in separate JSON files under `server/data/`. Each
sale records its revenue and total cost so the admin workers report can show
profit and daily growth. Admins can open the report from the admin profile.

If the frontend shows an account-server error, stop any older Vite process and
restart with `npm run dev` from the `hynistore` directory. Use the frontend URL
printed by Vite after it starts.

The API listens on port 3001 by default. Set `PORT` to change it, and update
the `/api` proxy in `vite.config.js` if using a different port. Deployments
must run the API with persistent storage and serve the frontend/API over HTTPS.

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/)

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.
