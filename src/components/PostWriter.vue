<template
  ><div class="columns">
    <div class="column">
      <div class="field">
        <div class="label">New | Edit post</div>
        <input
          type="text"
          class="input"
          v-model="title"
          data-test="title-element"
        />
      </div>
    </div>
  </div>
  <div class="columns">
    <div class="column">
      <!-- v-model is not applicable here. Input to this div are forwarded to handleInput -->
      <div
        contenteditable
        style="white-space: pre;"
        ref="markdownRawElement"
        @input="handleInput"
        data-test="markdownRawElement"
      />
    </div>
    <div class="column">
      <div
        v-html="markdownHtmlContent"
        data-test="markdownHtmlElement"
        class="markdownHtmlElement"
      ></div>
    </div>
    <div class="columns">
      <div class="column">
        <button
          @click="save"
          class="button is-primary is-pulled-right"
          data-test="submitElement"
        >
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

const POST_MARKDOWN_DEFAULT =
  "## Title\nEnter your post content...\n```js\nlet a = 1\nconst f = () => {\n   console.log(a)\n}\nf()\n```\n"

export default defineComponent({
  name: "PostWriter",
  props: {
    post: {
      type: Object as () => Post,
      required: true,
    },
  },
  emits: {
    save: (post: Post) => {
      //validation
      return true
    },
  },
  setup(props, ctx) {
    const title = ref(props.post.title)
    const markdownRawContent = ref(props.post.markdown || POST_MARKDOWN_DEFAULT)
    const markdownHtmlContent = ref("")
    // Ref to a DOM node, see template above
    const markdownRawElement = ref<HTMLDivElement | null>(null)

    const parseHtml = (_newMarkdownRawContent: string) => {
      let _markdownHtmlContent = parse(_newMarkdownRawContent, {
        gfm: true,
        breaks: true,
        highlight: (code: string, lang: string) => {
          const language = highlight.getLanguage(lang) ? lang : "plaintext"
          return highlight.highlight(code, { language }).value
        },
        langPrefix: "hljs language-",
      })
      markdownHtmlContent.value = _markdownHtmlContent
    }

    watch(
      markdownRawContent,
      debounce((_newMarkdownRawContent: string) => {
        parseHtml(_newMarkdownRawContent)
      }, 250),
      {
        immediate: true,
      },
    )

    // watchEffect(() => { ... }
    // ... is equivalent to
    // watch(
    //   markdown,
    //   (newContent) => {
    //     markdownHtmlContent.value = parse(newContent)
    //   },
    //   {
    //     immediate: true, // update immediate, even on first render
    //   },
    // )

    /**
     * markdownRawElement is null until DOM mounted
     * The text of markdown.value is set in the textContent of DOM element markdownRawElement
     */
    onMounted(() => {
      if (!markdownRawElement.value) {
        throw Error("This should never happen!")
      }
      markdownRawElement.value.textContent = markdownRawContent.value
    })

    /**
     * The input from DOM element markdownRawElement is saved in markdownRawContent.value
     */
    const handleInput = () => {
      if (!markdownRawElement.value) {
        throw Error("This should never happen!")
      }
      markdownRawContent.value = markdownRawElement.value.textContent || ""
    }

    const save = () => {
      // create post
      const newPost: Post = {
        ...props.post,
        title: title.value,
        html: markdownHtmlContent.value,
        markdown: markdownRawContent.value,
      }
      // emit event
      ctx.emit("save", newPost)
    }

    return {
      markdownHtmlContent,
      title,
      markdownRawContent,
      markdownRawElement,
      handleInput,
      save,
    }
  },
})
</script>

<style scoped>
.markdownHtmlElement::v-deep ul {
  list-style: revert;
  list-style-position: inside;
}
.markdownHtmlElement::v-deep h1,
.markdownHtmlElement::v-deep h2,
.markdownHtmlElement::v-deep h3,
.markdownHtmlElement::v-deep h4,
.markdownHtmlElement::v-deep h5,
.markdownHtmlElement::v-deep h6 {
  font-size: revert;
  margin: 10px 0 !important;
}

.markdownHtmlElement::v-deep pre {
  margin: 10px 0 !important;
}

.markdownHtmlElement::v-deep p {
  margin: 10px 0;
}
</style>
