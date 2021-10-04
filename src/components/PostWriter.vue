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
      <div contenteditable ref="contentEditable" @input="handleInput" />
    </div>
    <div class="column"><div v-html="html"></div></div></div
></template>

<script lang="ts">
import { defineComponent, ref, onMounted, watch, watchEffect } from "vue"
import { Post } from "@/mock"
import { parse } from "marked"

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

    watchEffect(() => {
      html.value = parse(content.value)
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

    // contentEditable is null until DOM mounted
    onMounted(() => {
      if (!contentEditable.value) {
        throw Error("This should never happen!")
      }
      contentEditable.value.textContent = content.value
    })

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
