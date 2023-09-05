# Thorswap

## Installation

```sh
yarn install
```

## Development

Create `.env` and `.env.stagenet` file from `.env.copy` - adjust at our own variables or ask for copy from team.

- Start dev server:

```sh
yarn start
```

- Start server with environment variables from .env.stagenet

```sh
yarn start:stagenet
```

- Start server with for ledger live development

Enable developer mode in ledger live
<https://developers.ledger.com/docs/live-app/developer-mode/>

```sh
yarn start:ledger
```

Go to settings -> Developer -> Add local app -> select the manifest json of this project

- Test production build locally

```sh
yarn build; yarn preview
```

- Test ledger production build locally

Change manifest json to use port 4173 instead of 5173

```sh
yarn build:ledger; yarn preview:ledger
```

- Linting

```sh
yarn lint && yarn typescript
```

