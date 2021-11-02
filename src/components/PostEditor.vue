<template><post-writer @save="save" :post="post"></post-writer></template>

<script lang="ts">
import { defineComponent, computed, inject } from "@vue/runtime-core"
import PostWriter from "@/components/PostWriter.vue"
import { Post } from "../mock"
import { useRoute, useRouter } from "vue-router"
import { useStore } from "@/store"

export default defineComponent({
  components: {
    PostWriter,
  },
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

    const save = async (post: Post) => {
      await store.updatePost(post)
      router.push("/")
    }

    return {
      post,
      save,
    }
  },
})
</script>
