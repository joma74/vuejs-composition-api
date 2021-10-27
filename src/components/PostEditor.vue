<template>Editor</template>

<script lang="ts">
import { defineComponent, computed, inject } from "@vue/runtime-core"
import { useRoute, useRouter } from "vue-router"
import { useStore } from "@/store"

export default defineComponent({
  async setup() {
    const router = useRouter()
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

    if (post.authorId !== store.getState().authors.currentUserId) {
      router.push("/")
    }

    return {
      post,
    }
  },
})
</script>
