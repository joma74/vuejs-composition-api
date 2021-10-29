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

## Unresolved Findings

### Sourcemap in unit tests does not work

- No stop at some breakpoints
- Sometime "steps out" from ts code into cjs.js code e.g. `runtime-core.cjs.js`

### Console output in jest test is sometimes not shown

TBD

### Adding a vue component to jest expect gives endless recursion

`expect([errorCallParams: [Error, (Vue)Component, string]]...`

## Resolved Findings

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

### What does `[Vue warn]: Extraneous non-emits...` mean

```
runtime-core.esm-bundler.js:6551 [Vue warn]: Extraneous non-emits event listeners (save) were passed to component but could not be automatically inherited because component renders fragment or text root nodes. If the listener is intended to be a component custom event listener only, declare it using the "emits" option.
```

Means: The emitting component misses an emit declaration.

### v-model on component, a most confusing construct

See https://v3.vuejs.org/guide/migration/v-model.html

> BREAKING: When used on custom components, v-model prop and event default names are changed:
>
> - prop: value -> modelValue;
> - event: input -> update:modelValue;

See https://v3.vuejs.org/guide/component-basics.html#using-v-model-on-components

> ```ts
> <custom-input v-model="searchText" />
> ```
>
> When used on a component, v-model instead does this:
>
> ```ts
> <custom-input
>   :model-value="searchText"
>   @update:model-value="searchText = $event"
> </custom-input>
> ```
>
> For this to actually work though, the \<input\> inside the component must:
>
> - Bind the `value` attribute to the `modelValue` prop
> - On input, emit an `update:modelValue` event with the new value
>
> ```ts
> app.component("custom-input", {
>   props: ["modelValue"],
>   emits: ["update:modelValue"],
>   template: `
>    <input
>      :value="modelValue"
>      @input="$emit('update:modelValue', $event.target.value)"
>     >
>   `,
> })
> ```

### How to check for uncaught error in a vue component test?

```ts
it("it baz", async (done) => {
  let globalErrorSpy = jest.fn()
  ...
  const wrapper = mount(NewPost, {
    global: {
      plugins: [initialStoreCopy],
      config: { errorHandler: globalErrorSpy },
    },
  })
  wrapper.find("[foo='bar'").trigger("click")
  // needed!
  await flushPromises()
  // needed!
  await new Promise((r) => setTimeout(r, 500))
  //
  expect(globalErrorSpy).toHaveBeenCalledTimes(1)
  //
  let error: Error = globalErrorSpy.mock.calls[0][0]
  expect(error).toBeInstanceOf(Error)
  expect(error).toHaveProperty("message", "Network Error")
  expect(globalErrorSpy.mock.calls[0][2]).toBe("component event handler")
  done()
})
```

### How to debug jest test via vue-cli-service in vs code

1. Open a Javascript Debug Terminal
2. Run therein

```
node ./node_modules/.bin/vue-cli-service test:unit --runInBand --no-cache --coverage false
```

P.S. `--no-cache` and `--coverage false` do provide better sourcemap compatibility.

### How to use an inject/provide object inside the router

To receive the inject/provide object, the object must be an argument to a function, which is returning the so configured router. Essentially one must do function parameter binding.

### useRoute/useRouter return undefined if called before/after an await

See https://github.com/vuejs/vue-router-next/issues/257

> In the following situation, useRoute will work because it's called before the await, while
> useRouter will not work because it's called after the await.

### How do you JSON.stringify an ES6 Map?

See https://stackoverflow.com/a/56150320

### Fix 'SyntaxError: Unexpected identifier'

Cause was a cyclic dependency(main<.ts <-> store.ts) which eneded up in this test havoc. Extracted function to utils.ts, which is ok.

### Failed to resolve component: router-link

Add

```
...
    global: {
        ...
        components: {
            // Fixes "Failed to resolve component: router-link"
                RouterLink: {
                template: `<div></div>`,
            },
    },
    ...
```

to MountingOptions.

### Setup vue router in unit test

```
const router = ...
router.push(`/posts/${today.id}`)
// Returns a Promise that resolves when the router has completed the initial navigation
await router.isReady()
```
