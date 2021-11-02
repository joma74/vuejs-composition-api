<template
  ><div class="navbar">
    <div class="navbar-end">
      <div class="buttons" v-if="auth">
        <router-link class="button" to="/posts/new">New Post</router-link>
        <button class="button" @click="signOut">Sign Out</button>
      </div>
      <div class="buttons" v-else>
        <button class="button" @click="signUp" data-test="sign-up">
          Sign Up
        </button>
        <button class="button" @click="signIn">Sign In</button>
      </div>
    </div>
  </div>
  <teleport to="#modal"
    ><component :is="currentModalComponent"></component></teleport
></template>

<script lang="ts">
import { defineComponent, computed, h, markRaw } from "@vue/runtime-core"
import Signup from "@/components/Signup.vue"
import Signin from "@/components/Signin.vue"
import { useModal } from "@/useModal"
import { useStore } from "@/store"
import { useRouter } from "vue-router"

export default defineComponent({
  name: "Navbar",
  components: {
    Signup,
    Signin,
  },
  setup() {
    const store = useStore()
    const modal = useModal()
    const router = useRouter()

    const auth = computed<boolean>(() => {
      return !!store.getState().authors.currentUserId
    })

    const signOut = () => {
      store.signOut()
      router.push("/")
    }
    const signUp = () => {
      modal.currentComponent.value = markRaw(Signup)
      modal.showModal()
    }
    const signIn = () => {
      //   const Demo = defineComponent({
      //     setup() {
      //       return () => h("div", "Demo")
      //     },
      //   })
      modal.currentComponent.value = markRaw(Signin)
      modal.showModal()
    }

    return {
      currentModalComponent: modal.currentComponent,
      auth,
      signOut,
      signUp,
      signIn,
    }
  },
})
</script>
