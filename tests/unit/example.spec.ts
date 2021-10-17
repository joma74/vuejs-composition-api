import { mount, flushPromises } from "@vue/test-utils"
import Timeline from "@/components/Timeline.vue"
import { today, thisWeek, thisMonth } from "@/mock"
import { getInitialStoreCopy } from "@/store"
import { spyOnHandler, expectNoErrorOrWarnOccured } from "./jest.setup"

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

function mountTimeline(
  errorSpy: jest.Mock<any, any>,
  warnSpy: jest.Mock<any, any>,
) {
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
  return mount(
    testComponent,
    spyOnHandler(
      { global: { plugins: [initialStoreCopy] } },
      errorSpy,
      warnSpy,
    ),
  )
}

describe("Timeline.vue", () => {
  it("renders today post default", async (done) => {
    let errorSpy = jest.fn()
    let warnSpy = jest.fn()
    const wrapper = mountTimeline(errorSpy, warnSpy)
    // nextTick only flushes vue promises, flushPromises also flushes all other promises
    await flushPromises()
    // DEBUG
    // console.log(wrapper.html())
    expect(wrapper.html()).toContain(today.created.format("Do MMM"))
    //
    expectNoErrorOrWarnOccured(errorSpy, warnSpy)
    done()
  })

  it("update when the week period is clicked", async (done) => {
    let errorSpy = jest.fn()
    let warnSpy = jest.fn()
    const wrapper = mountTimeline(errorSpy, warnSpy)
    await flushPromises()
    // wait for the next frame, like so (1)
    await wrapper.get("[data-test='This Week'").trigger("click")

    // OR, wait for the next frame, like so (2)
    // import { nextTick } from "vue"
    // await nextTick()

    expect(wrapper.html()).toContain(today.created.format("Do MMM"))
    expect(wrapper.html()).toContain(thisWeek.created.format("Do MMM"))
    //
    expectNoErrorOrWarnOccured(errorSpy, warnSpy)
    done()
  })

  it("update when the month period is clicked", async (done) => {
    let errorSpy = jest.fn()
    let warnSpy = jest.fn()
    const wrapper = mountTimeline(errorSpy, warnSpy)
    // nextTick only flushes vue promises, flushPromises also flushes all other promises
    await flushPromises()
    // wait for the next frame, like so (1)
    await wrapper.get("[data-test='This Month'").trigger("click")

    expect(wrapper.html()).toContain(today.created.format("Do MMM"))
    expect(wrapper.html()).toContain(thisWeek.created.format("Do MMM"))
    expect(wrapper.html()).toContain(thisMonth.created.format("Do MMM"))
    //
    expectNoErrorOrWarnOccured(errorSpy, warnSpy)
    done()
  })
})
