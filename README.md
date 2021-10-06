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

See [configureWebpack section in ./vue.config.js](./vue.config.js#L6)

### ts-essentials delivers DeepReadonly and DeepWritable

Ever wanted to implement the design pattern "Prototype"? Note that the prototype is then immutable at TS design time only, not at runtime.

### Mock Rest Services with Mock Service Worker

See https://github.com/mswjs/msw

### DO-NOT use JSON.stringify->JSON.parse for deep cloneing

See https://flaviocopes.com/how-to-clone-javascript-object/#json-serialization states

> By doing this you will lose any Javascript property that has no equivalent type in JSON, like Function or Infinity. Any property that’s assigned to undefined will be ignored by JSON.stringify, causing them to be missed on the cloned object.
>
> Also, some objects are converted to strings, like Date objects for example (also, not taking into account the timezone and defaulting to UTC), Set, Map and many others: ...

### vue's nextTick() vs vue-util's flushPromises()

nextTick only flushes vue promises. flushPromises also flushes all other promises.

### import of vue component must end with .vue

Example: `import Home from "@/components/Home.vue"`

### Vs-code volar extension misses code completion for vue-router

See

- https://github.com/johnsoncodehk/volar, "Define Global Components"
- https://github.com/johnsoncodehk/volar/issues/547#issuecomment-932773344

### Where is `this.$options` gone?

See https://v3.vuejs.org/api/composition-api.html#getcurrentinstance

```ts
import { getCurrentInstance } from "vue"
console.log(getCurrentInstance()?.proxy?.$options.__scopeId)
```
