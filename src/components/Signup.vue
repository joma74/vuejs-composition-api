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
      type="password"
      :error="passwordValidationStatus.message"
    />
    <button
      class="button is-primary"
      :disabled="
        !usernameValidationStatus.valid || !passwordValidationStatus.valid
      "
    >
      Sign Up
    </button>
  </form>
</template>
<script lang="ts">
import { required, length, Status, validate } from "@/validation"

import { defineComponent, computed, ref } from "vue"

import FormInput from "@/components/FormInput.vue"
import { User, useStore } from "@/store"
import { useModal } from "@/useModal"

export default defineComponent({
  name: "Signup",
  components: {
    FormInput,
  },
  setup() {
    const username = ref("")
    const usernameValidationStatus = computed<Status>(() => {
      return validate(username.value, [required(), length({ min: 5, max: 25 })])
    })
    const password = ref("")
    const passwordValidationStatus = computed<Status>(() => {
      return validate(password.value, [required(), length({ min: 5, max: 25 })])
    })

    const store = useStore()
    const modal = useModal()

    const submit = async (evt: Event) => {
      if (
        !usernameValidationStatus.value.valid ||
        !passwordValidationStatus.value.valid
      ) {
        return
      }
      const newUser: User = {
        id: "-1",
        username: username.value,
        password: password.value,
      }

      await store.createUser(newUser)

      modal.hideModal()
    }
    return {
      username,
      usernameValidationStatus,
      password,
      passwordValidationStatus,
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
