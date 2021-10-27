<template><post-writer @save="save" :post="newPost"></post-writer></template>

<script lang="ts">
import { defineComponent } from "@vue/runtime-core"

import PostWriter from "@/components/PostWriter.vue"
import { Post } from "../mock"
import { useStore } from "@/store"
import moment from "moment"
import { useRouter } from "vue-router"

export default defineComponent({
  name: "NewPost",
  components: {
    PostWriter,
  },
  setup() {
    const store = useStore()
    const router = useRouter()
    const authorId = store.getState().authors.currentUserId

    if (!authorId) {
      throw Error("currentUserId was not set")
    }

    const newPost: Post = {
      id: "-1",
      title: "Enter your title here",
      created: moment().subtract(1, "second"),
      authorId,
    }

    const save = async (post: Post) => {
      await store.createPost(post)
      router.push("/")
    }

    return {
      newPost,
      save,
    }
  },
})
</script>
