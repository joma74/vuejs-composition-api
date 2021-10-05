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
      <div v-html="html"></div>
    </div></div
></template>

<script lang="ts">
import { defineComponent, ref, onMounted, watch, watchEffect } from "vue"
import { Post } from "@/mock"
import { parse } from "marked"
import highlight from "highlight.js"

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
    const content = ref("## Title\nEnter your post content...")
    // const html = ref(parse(content.value))
    const html = ref("")
    // Ref to a DOM node, see template above
    const contentEditable = ref<HTMLDivElement | null>(null)

    /**
     * Everytime the text in content changes, the html ref is updated
     */
    watchEffect(() => {
      let markdown = parse(content.value, {
        gfm: true,
        breaks: true,
        highlight: (code: string) => {
          return highlight.highlightAuto(code).value
        },
        langPrefix: "hljs language-",
      })
      html.value = markdown
    })
    // ... is equivalent to
    // watch(
    //   content,
    //   (newContent) => {
    //     html.value = parse(newContent)
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

    return {
      html,
      title,
      content,
      contentEditable,
      handleInput,
    }
  },
})
</script>
