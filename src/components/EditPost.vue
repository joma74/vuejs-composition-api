<template
  ><suspense
    ><template #default><post-editor /></template
    ><template #fallback><spinner /></template></suspense
></template>

<script lang="ts">
import { defineComponent } from "@vue/runtime-core"
import PostEditor from "@/components/PostEditor.vue"
import Spinner from "@/components/Spinner.vue"

export default defineComponent({
  components: { PostEditor, Spinner },
})
</script>
