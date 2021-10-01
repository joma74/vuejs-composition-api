<template>
  <nav class="is-primary panel">
    <span class="panel-tabs">
      <a
        v-for="period in periods"
        :key="period"
        :class="{ 'is-active': period === currentPeriod }"
        @click="setPeriod(period)"
        >{{ period }}</a
      >
    </span>
    <a v-for="post in posts" :key="post.id" class="panel-block">
      <a>{{ post.title }}</a
      >&nbsp;
      <div>{{ post.created.format("Do MMM") }}</div>
    </a>
  </nav>
</template>

<script lang="ts">
import { defineComponent, ref, computed } from "vue"
import moment from "moment"
import { today, thisWeek, thisMonth } from "../mock"

type Period = "Today" | "This Week" | "This Month"

export default defineComponent({
  name: "Timeline",
  setup() {
    const periods: Period[] = ["Today", "This Week", "This Month"]
    const currentPeriod = ref<Period>("Today")
    const posts = computed(() => {
      return [today, thisWeek, thisMonth].filter((periodOfPost) => {
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
