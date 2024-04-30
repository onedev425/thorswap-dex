# Thorswap

## Pre-requisites

- [Bun](https://bun.sh) (`curl -fsSL https://bun.sh/install | bash`)

## Installation

```sh
bun install;
```

## Development

Create `.env` and `.env.stagenet` file from `.env.copy` - adjust at our own variables or ask for copy from team.

- Start dev server:

```sh
bun start
```

- Start server with environment variables from .env.stagenet

```sh
bun start:stagenet
```

- Start server with for ledger live development

Enable developer mode in ledger live
<https://developers.ledger.com/docs/live-app/developer-mode/>

```sh
bun start:ledger
```

Go to settings -> Developer -> Add local app -> select the manifest json of this project

- Test production build locally

```sh
bun run build; bun preview
```

- Test ledger production build locally

Change manifest json to use port 4173 instead of 5173

```sh
bun build:ledger; bun preview:ledger
```

- Linting

```sh
bun lint && bun typescript
```

