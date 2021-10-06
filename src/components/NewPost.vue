<template><post-writer @save="save" :post="newPost"></post-writer></template>

<script lang="ts">
import { defineComponent } from "@vue/runtime-core"

import PostWriter from "@/components/PostWriter.vue"
import { Post } from "../mock"
import moment from "moment"

export default defineComponent({
  name: "NewPost",
  components: {
    PostWriter,
  },
  setup() {
    const newPost: Post = {
      id: "-1",
      title: "Enter your title here",
      created: moment(),
    }

    const save = (post: Post) => {
      console.log(post)
    }

    return {
      newPost,
      save,
    }
  },
})
</script>
