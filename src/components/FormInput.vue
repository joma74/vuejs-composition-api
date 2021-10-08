<template>
  <div class="field">
    <label :for="name" class="label">{{ name }}</label>
    <div class="control">
      <input
        class="input"
        :id="name"
        :type="type"
        :name="name"
        :value="modelValue"
        @input="updateModelValue"
      />
    </div>
    <p class="is-danger help">{{ error ? error : "&nbsp;" }}</p>
  </div>
</template>
<script lang="ts">
import { defineComponent } from "@vue/runtime-core"

export default defineComponent({
  props: {
    name: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      default: "text",
    },
    modelValue: {
      type: String,
      required: true,
    },
    error: {
      type: String,
    },
  },
  emits: ["update:modelValue"],
  setup(props, ctx) {
    // Alternative to @input
    const updateModelValue = (e: Event) => {
      ctx.emit("update:modelValue", (e.target as HTMLInputElement).value)
    }
    return {
      updateModelValue,
    }
  },
})
</script>
<style scoped></style>
