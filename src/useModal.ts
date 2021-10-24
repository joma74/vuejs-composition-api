import { ref, readonly } from "@vue/reactivity"

const _show = ref(false)
const show = readonly(_show)
const currentComponent = ref()

export function useModal() {
  return {
    currentComponent,
    show,
    showModal: () => (_show.value = true),
    hideModal: () => (_show.value = false),
  }
}
