<template>
  <a :key="post.id" class="panel-block">
    <a>{{ post.title }}</a
    >&nbsp;
    <div>{{ post.created.format("Do MMM") }}</div>
  </a>
</template>

<script lang="ts">
import { defineComponent } from "vue"
import { Post } from "../mock"

type Period = "Today" | "This Week" | "This Month"

export default defineComponent({
  name: "TimelinePost",
  props: {
    post: {
      type: Object as () => Post,
      required: true,
    },
  },
})
</script>

<style scoped>
h3 {
  margin: 40px 0 0;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}
</style>
