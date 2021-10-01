import { mount } from "@vue/test-utils"
import Timeline from "@/components/Timeline.vue"
import { today } from "@/mock"

describe("Timeline.vue", () => {
  it("renders today post default", () => {
    const msg = "new message"
    const wrapper = mount(Timeline)
    expect(wrapper.html()).toContain(today.created.format("Do MMM"))
  })
})
