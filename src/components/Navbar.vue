<template
  ><div class="navbar">
    <div class="navbar-end">
      <div class="buttons">
        <button class="button" @click="show">Sign Up</button>
        <router-link class="button" to="/posts/new">New Post</router-link>
      </div>
    </div>
  </div>
  <teleport to="#modal"><signup /></teleport
></template>

<script lang="ts">
import { defineComponent } from "@vue/runtime-core"
import Signup from "@/components/Signup.vue"
import { useModal } from "@/useModal"

export default defineComponent({
  name: "Navbar",
  components: {
    Signup,
  },
  setup() {
    const modal = useModal()

    return {
      show: () => {
        modal.showModal()
      },
    }
  },
})
</script>
