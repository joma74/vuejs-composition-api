<template
  ><div class="columns">
    <div class="column"></div>
    <div class="column is-two-thirds">
      <router-link
        v-if="canEdit"
        :to="`/posts/${post.id}/edit`"
        class="button is-link is-rounded"
        data-test="can-edit"
        >Edit</router-link
      >
      <h1>{{ post.title }}</h1>
      <div v-html="post.html" class="markdownHtmlElement"></div>
    </div>
    <div class="column"></div></div
></template>

<script lang="ts">
import { defineComponent, computed, inject } from "@vue/runtime-core"
import { useRoute } from "vue-router"
import { useStore } from "@/store"

export default defineComponent({
  async setup() {
    const store = useStore()
    // See https://github.com/vuejs/vue-router-next/issues/257: useRoute must be before await
    const id = useRoute().params.id as string

    if (!store.getState().posts.loaded) {
      await store.fetchPosts()
    }

    const post = store.getState().posts.all.get(id)

    if (!post) {
      throw Error("Post was not found")
    }

    const canEdit = post.authorId === store.getState().authors.currentUserId

    return {
      post,
      canEdit,
    }
  },
})
</script>

<style scoped>
.markdownHtmlElement:deep(ul) {
  list-style: revert;
  list-style-position: inside;
}
.markdownHtmlElement:deep(h1),
.markdownHtmlElement:deep(h2),
.markdownHtmlElement:deep(h3),
.markdownHtmlElement:deep(h4),
.markdownHtmlElement:deep(h5),
.markdownHtmlElement:deep(h6) {
  font-size: revert;
  margin: 10px 0 !important;
}

.markdownHtmlElement:deep(pre) {
  margin: 10px 0 !important;
}

.markdownHtmlElement:deep(p) {
  margin: 10px 0;
}
</style>
