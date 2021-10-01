# vuejs-composition-api

## Project setup

See https://github.com/lmiller1990/vuejs-composition-api-course

```
yarn install
```

### Compiles and hot-reloads for development

```
yarn serve
```

### Compiles and minifies for production

```
yarn build
```

### Run your unit tests

```
yarn test:unit
```

## Findings

### @/ as replacement for ./src

```ts
import { today, thisWeek, thisMonth } from "@/mock"
```

### source-map support for vue components in browser

See [configureWebpack section in ./vue.config.js](./vue.config.js)
