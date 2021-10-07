<template>
  <div class="modal" :style="toggleModal">
    <div class="modal-background">
      <div class="modal-content">
        <div id="modal"></div>
      </div>
      <button @click="hideModal" class="modal-close is-large"></button>
    </div>
  </div>
  <section class="section">
    <div class="container">
      <form-input
        name="Username"
        v-model="username"
        error="There is an error"
      />
      {{ username }}
      <navbar />
      <router-view />
    </div>
  </section>
</template>

<script lang="ts">
import { defineComponent, computed, ref } from "vue"
import Navbar from "@/components/Navbar.vue"
import FormInput from "@/components/FormInput.vue"
import { useModal } from "@/useModal"

export default defineComponent({
  name: "App",
  components: {
    Navbar,
    FormInput,
  },

  setup() {
    const modal = useModal()
    const username = ref("username")

    const toggleModal = computed(() => {
      return {
        display: modal.show.value == true ? "block" : "none",
      }
    })
    const hideModal = () => {
      modal.hideModal()
    }
    return {
      toggleModal,
      hideModal,
      username,
    }
  },
})
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
}
</style>
