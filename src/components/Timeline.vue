<template>
  <nav class="is-primary panel">
    <span class="panel-tabs">
      <a
        v-for="period in periods"
        :key="period"
        :class="{ 'is-active': period === currentPeriod }"
        @click="setPeriod(period)"
        :data-test="period"
        >{{ period }}</a
      >
    </span>
    <timeline-post
      v-for="post in posts"
      :key="post.id"
      :post="post"
      class="panel-block"
    >
    </timeline-post>
  </nav>
</template>

<script lang="ts">
import { defineComponent, ref, computed } from "vue"
import moment from "moment"
import { Post } from "@/mock"
import { useStore } from "@/store"
import TimelinePost from "@/components/TimelinePost.vue"

type Period = "Today" | "This Week" | "This Month"

export default defineComponent({
  name: "Timeline",
  components: {
    TimelinePost,
  },
  async setup() {
    const periods: Period[] = ["Today", "This Week", "This Month"]
    const currentPeriod = ref<Period>("Today")
    const store = useStore()
    if (!store.getState().posts.loaded) {
      await store.fetchPosts()
    }
    const allPosts = store.getState().posts.ids.reduce<Post[]>((acc, id) => {
      const thePost = store.getState().posts.all.get(id)
      if (!thePost) {
        throw new Error("This post was not found")
      }
      return acc.concat(thePost)
    }, [])
    const posts = computed(() => {
      return allPosts.filter((periodOfPost) => {
        if (currentPeriod.value === periods[0]) {
          return periodOfPost.created.isSame(moment(), "day")
        }
        if (currentPeriod.value === periods[1]) {
          return periodOfPost.created.isAfter(moment().subtract(1, "week"))
        }
        if (currentPeriod.value === periods[2]) {
          return periodOfPost.created.isAfter(moment().subtract(1, "month"))
        }
        return false
      })
    })

    const setPeriod = (period: Period) => {
      currentPeriod.value = period
    }
    return {
      periods,
      currentPeriod,
      setPeriod,
      posts,
    }
  },
})
</script>

<style scoped></style>
