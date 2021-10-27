<template
  ><suspense
    ><template #default><post-viewer /></template
    ><template #fallback><spinner /></template></suspense
></template>

<script lang="ts">
import { defineComponent } from "@vue/runtime-core"
import PostViewer from "@/components/PostViewer.vue"
import Spinner from "@/components/Spinner.vue"

export default defineComponent({
  components: { PostViewer, Spinner },
})
</script>
