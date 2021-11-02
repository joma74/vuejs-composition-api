<template>
  <form @submit.prevent="submit">
    <form-input
      name="Username"
      v-model="username"
      :error="usernameValidationStatus.message"
    />
    <form-input
      name="Password"
      v-model="password"
      :error="passwordValidationStatus.message"
    />
    <button
      class="button is-primary"
      :disabled="
        !usernameValidationStatus.valid || !passwordValidationStatus.valid
      "
    >
      Sign In
    </button>
  </form>
</template>

<script lang="ts">
import { defineComponent, ref, computed } from "@vue/runtime-core"
import { User, useStore } from "@/store"
import { useModal } from "@/useModal"
import { required, Status, validate } from "@/validation"
import FormInput from "@/components/FormInput.vue"

export default defineComponent({
  name: "Signin",
  components: { FormInput },
  setup() {
    const username = ref("")
    const usernameValidationStatus = computed<Status>(() => {
      return validate(username.value, [required()])
    })
    //
    const password = ref("")
    const passwordValidationStatus = computed<Status>(() => {
      return validate(password.value, [required()])
    })
    //
    const store = useStore()
    const modal = useModal()

    const submit = async (evt: Event) => {
      if (
        !usernameValidationStatus.value.valid ||
        !passwordValidationStatus.value.valid
      ) {
        return
      }
      //
      const user: User = {
        id: "tbv",
        username: username.value,
        password: password.value,
      }
      await store.signIn(user)

      modal.hideModal()
    }
    return {
      username,
      usernameValidationStatus,
      passwordValidationStatus,
      password,
      submit,
    }
  },
})
</script>

<style scoped>
form {
  padding: 2em;
  background-color: white;
}
</style>
