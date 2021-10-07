import { ref, readonly } from "@vue/reactivity"

const _show = ref(false)
const show = readonly(_show)

export function useModal() {
  return {
    show,
    showModal: () => (_show.value = true),
    hideModal: () => (_show.value = false),
  }
}
