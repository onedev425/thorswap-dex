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

- Test production build locally

```sh
yarn build; yarn preview
```

- Linting

```sh
yarn lint && yarn typescript
```

- Testing

```sh
TODO: Add and integrate [vitest](https://vitest.dev/)
```
