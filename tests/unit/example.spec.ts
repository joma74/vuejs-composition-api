import { nextTick } from "vue"
import { mount } from "@vue/test-utils"
import Timeline from "@/components/Timeline.vue"
import { today, thisWeek, thisMonth } from "@/mock"

describe("Timeline.vue", () => {
  it("renders today post default", () => {
    const wrapper = mount(Timeline)
    expect(wrapper.html()).toContain(today.created.format("Do MMM"))
  })

  it("update when the week period is clicked", async () => {
    const wrapper = mount(Timeline)
    // wait for the next frame, like so (1)
    await wrapper.get("[data-test='This Week'").trigger("click")

    // OR, wait for the next frame, like so (2)
    // await nextTick()

    expect(wrapper.html()).toContain(today.created.format("Do MMM"))
    expect(wrapper.html()).toContain(thisWeek.created.format("Do MMM"))
  })

  it("update when the month period is clicked", async () => {
    const wrapper = mount(Timeline)
    // wait for the next frame, like so (1)
    await wrapper.get("[data-test='This Month'").trigger("click")

    expect(wrapper.html()).toContain(today.created.format("Do MMM"))
    expect(wrapper.html()).toContain(thisWeek.created.format("Do MMM"))
    expect(wrapper.html()).toContain(thisMonth.created.format("Do MMM"))
  })
})
