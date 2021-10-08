<template>
  <form @submit="submit">
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
  </form>
</template>
<script lang="ts">
import { required, length, Status, validate } from "@/validation"

import { defineComponent, computed, ref } from "vue"

import FormInput from "@/components/FormInput.vue"

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

    const submit = (evt: Event) => {}
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
