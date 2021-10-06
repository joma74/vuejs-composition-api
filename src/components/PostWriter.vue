<template
  ><div class="columns">
    <div class="column">
      <div class="field">
        <div class="label">New post</div>
        <input type="text" class="input" v-model="title" />
      </div>
    </div>
  </div>
  <div class="columns">
    <div class="column">
      <!-- v-model is not applicable here. Input to this div are forwarded to handleInput -->
      <div
        contenteditable
        style="white-space: pre;"
        ref="contentEditable"
        @input="handleInput"
      />
    </div>
    <div class="column">
      <div v-html="markdownAsHtml"></div>
    </div>
    <div class="columns">
      <div class="column">
        <button @click="save" class="button is-primary is-pulled-right">
          Submit
        </button>
      </div>
    </div>
  </div></template
>

<script lang="ts">
import {
  defineComponent,
  ref,
  onMounted,
  watch,
  watchEffect,
  getCurrentInstance,
} from "vue"
import { Post } from "@/mock"
import { parse } from "marked"
import highlight from "highlight.js"
import debounce from "lodash/debounce.js"

export default defineComponent({
  name: "PostWriter",
  props: {
    post: {
      type: Object as () => Post,
      required: true,
    },
  },
  setup(props) {
    const title = ref(props.post.title)
    const content = ref(
      "## Title\nEnter your post content...\n```js\nlet a = 1\nconst f = () => {\n   console.log(a)\n}\nf()\n```\n",
    )
    // const markdownAsHtml = ref(parse(content.value))
    const markdownAsHtml = ref("")
    // Ref to a DOM node, see template above
    const contentEditable = ref<HTMLDivElement | null>(null)

    /**
     * Displays the scope id for this component instance e.g. data-v-2f5679e3
     */
    console.log(getCurrentInstance()?.proxy?.$options.__scopeId)

    const parseHtml = (_newMarkdown: string) => {
      let markdown = parse(_newMarkdown, {
        gfm: true,
        breaks: true,
        highlight: (code: string, lang: string) => {
          const language = highlight.getLanguage(lang) ? lang : "plaintext"
          return highlight.highlight(code, { language }).value
        },
        langPrefix: "hljs language-",
      })
      markdownAsHtml.value = markdown
    }

    watch(
      content,
      debounce((_newMarkdown: string) => {
        parseHtml(_newMarkdown)
      }, 250),
      {
        immediate: true,
      },
    )

    // watchEffect(() => { ... }
    // ... is equivalent to
    // watch(
    //   content,
    //   (newContent) => {
    //     markdownAsHtml.value = parse(newContent)
    //   },
    //   {
    //     immediate: true, // update immediate, even on first render
    //   },
    // )

    /**
     * contentEditable is null until DOM mounted
     * The text of content.value is set in the textContent of DOM element contentEditable
     */
    onMounted(() => {
      if (!contentEditable.value) {
        throw Error("This should never happen!")
      }
      contentEditable.value.textContent = content.value
    })

    /**
     * The input from DOM element contentEditable is saved in content.value
     */
    const handleInput = () => {
      if (!contentEditable.value) {
        throw Error("This should never happen!")
      }
      content.value = contentEditable.value.textContent || ""
    }

    const save = () => {
      // create post
      // emit event
    }

    return {
      markdownAsHtml,
      title,
      content,
      contentEditable,
      handleInput,
      save,
    }
  },
})
</script>

<style scoped="true">
ul {
  list-style: revert;
  list-style-position: inside;
}

h1,
h2,
h3,
h4,
h5,
h6 {
  font-size: revert;
  margin: 10px 0 !important;
}

pre {
  margin: 10px 0 !important;
}

p {
  margin: 10px 0;
}
</style>
