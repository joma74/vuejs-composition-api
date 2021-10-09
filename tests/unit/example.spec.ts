import { mount, flushPromises } from "@vue/test-utils"
import Timeline from "@/components/Timeline.vue"
import { today, thisWeek, thisMonth } from "@/mock"
import { getInitialStoreCopy } from "@/store"

/**
 * Note the () around the return function
 */
jest.mock("axios", () => ({
  get: (url: string) => {
    return Promise.resolve({
      data: [today, thisWeek, thisMonth],
    })
  },
}))

function mountTimeline() {
  const initialStoreCopy = getInitialStoreCopy()

  const testComponent = {
    components: { Timeline },
    template: `
              <suspense>
                  <template #default>
                      <timeline/>
                  </template>
                  <template #fallback>
                      Loading...
                  </template>
              </suspense>`,
  }
  return mount(testComponent, { global: { plugins: [initialStoreCopy] } })
}

describe("Timeline.vue", () => {
  it("renders today post default", async () => {
    const wrapper = mountTimeline()
    // nextTick only flushes vue promises, flushPromises also flushes all other promises
    await flushPromises()
    // DEBUG
    // console.log(wrapper.html())
    expect(wrapper.html()).toContain(today.created.format("Do MMM"))
  })

  it("update when the week period is clicked", async () => {
    const wrapper = mountTimeline()
    await flushPromises()
    // wait for the next frame, like so (1)
    await wrapper.get("[data-test='This Week'").trigger("click")

    // OR, wait for the next frame, like so (2)
    // import { nextTick } from "vue"
    // await nextTick()

    expect(wrapper.html()).toContain(today.created.format("Do MMM"))
    expect(wrapper.html()).toContain(thisWeek.created.format("Do MMM"))
  })

  it("update when the month period is clicked", async () => {
    const wrapper = mountTimeline()
    // nextTick only flushes vue promises, flushPromises also flushes all other promises
    await flushPromises()
    // wait for the next frame, like so (1)
    await wrapper.get("[data-test='This Month'").trigger("click")

    expect(wrapper.html()).toContain(today.created.format("Do MMM"))
    expect(wrapper.html()).toContain(thisWeek.created.format("Do MMM"))
    expect(wrapper.html()).toContain(thisMonth.created.format("Do MMM"))
  })
})
