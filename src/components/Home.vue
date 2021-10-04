<template
  ><suspense
    ><template #default><timeline /></template
    ><template #fallback><spinner /></template></suspense
></template>

<script lang="ts">
import { defineComponent } from "@vue/runtime-core"
import Timeline from "@/components/Timeline.vue"
import Spinner from "@/components/Spinner.vue"

export default defineComponent({
  name: "App",
  components: {
    Timeline,
    Spinner,
  },
})
</script>
