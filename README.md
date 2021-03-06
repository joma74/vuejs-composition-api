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

### How to access vue`s component scope id?

```ts
import { getCurrentInstance } from "vue"
console.log(getCurrentInstance()?.proxy?.$options.__scopeId)
```

At setup, the above code always returns `undefined`.header

TBD

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

My take at [shims-volar.d.ts](./src/shims-volar.d.ts)

### Where is `this.$options` gone?

See https://v3.vuejs.org/api/composition-api.html#getcurrentinstance

```ts
import { getCurrentInstance } from "vue"
console.log(getCurrentInstance()?.proxy?.$options.__scopeId)
```

### What does `[Vue warn]: Extraneous non-emits...` mean?

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

> ```xhtml
> <custom-input v-model="searchText" />
> ```
>
> When used on a component, v-model instead does this:
>
> ```xhtml
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

### How to check for uncaught error and warnings in a vue component test?

My take at [jest.d.ts](./tests/unit/jest.setup.ts)

Usage:

```ts
import { spyOnHandler, expectNoErrorOrWarnOccured } from "./jest.setup"

describe("ATestSuite", () => {
    let errorSpy: jest.Mock<any, any>
    let warnSpy: jest.Mock<any, any>

    beforeEach(() => {
        errorSpy = jest.fn()
        warnSpy = jest.fn()
    })

    afterEach(() => {
        expectNoErrorOrWarnOccured(errorSpy, warnSpy)
    })

    it("ATest", async (done) => {
        const wrapper = mount(
            spyOnHandler(
                {
                    global: {
                        plugins: [store, router],
                    },
                },
                errorSpy,
                warnSpy,
            ),
        )
        //
        done()
    }
}
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

My take at [utils.ts](./src/utils.ts).

### Fix 'SyntaxError: Unexpected identifier'

Cause was a cyclic dependency(main<.ts <-> store.ts) which eneded up in this test havoc. Extracted function to [utils.ts](./src/utils.ts), which is ok.

### Failed to resolve component: router-link

Add

```ts
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

```ts
const router = ...
router.push(`/posts/${today.id}`)
// Returns a Promise that resolves when the router has completed the initial navigation
await router.isReady()
```

### vue-test-utils in async mode - what must be awaited

See https://vue-test-utils.vuejs.org/guides/testing-async-components.html#updates-applied-by-vue

> Updates applied by Vue
> Vue batches pending DOM updates and applies them asynchronously to prevent unnecessary re-renders caused by multiple data mutations.
>
> You can read more about asynchronous updates in the Vue docs
>
> In practice, this means that after mutating a reactive property, to assert that change your test has to wait while Vue is performing updates.
>
> <em>One way is to use await Vue.nextTick(), <strong>but an easier and cleaner way is to just await the method that you mutated the state with, like trigger</strong></em>.
>
> Methods that can be awaited are:
>
> - setData
> - setValue
> - setChecked
> - setSelected
> - setProps
> - trigger

See https://vue-test-utils.vuejs.org/guides/testing-async-components.html#why-not-just-await-button-trigger

> Why not just await button.trigger() ?
> As explained above, there is a difference between the time it takes for Vue to update its components, and the time it takes for a Promise, like the one from axios to resolve.
>
> - <em>A nice rule to follow is to always await on mutations like trigger or setProps</em>.
>
> - <em>If your code relies on something async, like calling axios, <strong>add an await to the flushPromises call as well</strong></em>.

### Component's scoped style does not pierce through to marked.js content

Bulma.css resets quite some of user agent styles. This pierces to marked.js rendered content, e.g. `list-style` is `none`. Despite the component having scoped styles, the marked.js rendered content is not within the component's scope. Hence not getting the vue generated scopeId e.g. `<div class="column" data-v-2f5679e3>`. This relates to the generated style html header

```css
<style type="text/css">
ul[data-v-2f5679e3] {
  list-style: revert;
  list-style-position: inside;
}
h1[data-v-2f5679e3],
h2[data-v-2f5679e3],
h3[data-v-2f5679e3],
h4[data-v-2f5679e3],
h5[data-v-2f5679e3],
h6[data-v-2f5679e3] {
  font-size: revert;
  margin: 10px 0 !important;
}
pre[data-v-2f5679e3] {
  margin: 10px 0 !important;
}
p[data-v-2f5679e3] {
  margin: 10px 0;
}
</style>
```

Solution is working with CSS child selectors. See https://vue-loader.vuejs.org/guide/scoped-css.html#deep-selectors on how to make the scopeId generated in the appropriate slot.

```html
<div
  v-html="markdownHtmlContent"
  data-test="markdownHtmlElement"
  class="markdownHtmlElement"
></div>
```

```css
<style scoped>
.markdownHtmlElement::v-deep ul {
  list-style: revert;
  list-style-position: inside;
}
...
```

Generates

```css
<style type="text/css">
.markdownHtmlElement[data-v-2f5679e3] ul {
  list-style: revert;
  list-style-position: inside;
}
...
```

### How to type a vue component prop for TS

```ts
props: {
    post: {
        type: Object as () => Post,
        required: true,
    },
},
```

### Add a folder to git lfs

See https://stackoverflow.com/a/54452098

> If everything is set up correctly, you can verify that git LFS is going to work properly by:
>
> git add the file(s) in question.
> Do one of the following:
> Run git lfs status and ensure the file(s) in question appear under Git LFS objects to be committed, and that they have the LFS value in parenthesis; or
> Run git lfs ls-files and ensure the file(s) in question appear in this output.
> ⚠️ Important: After running git lfs track, you must run git add to refresh the state of files before calling git lfs status or git lfs ls-files. Otherwise you'll see irrelevant output from those commands.
>
> Also, for the record, looks like git lfs track "MyProject/Frameworks/\*\*" is the correct one for recursive matching.
