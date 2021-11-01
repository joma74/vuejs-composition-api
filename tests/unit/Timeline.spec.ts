import { mount, flushPromises, RouterLinkStub } from "@vue/test-utils"
import Timeline from "@/components/Timeline.vue"
import { today, thisWeek, thisMonth } from "@/mock"
import { Store } from "@/store"
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
  const store = new Store({
    posts: {
      ids: [],
      all: new Map(),
      loaded: false,
    },
    authors: {
      ids: [],
      all: new Map(),
      loaded: false,
      currentUserId: undefined,
    },
  })

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
      {
        global: {
          plugins: [store],
          components: {
            // Fixes "Failed to resolve component: router-link" AND renders content of router-link, BUT NOT to
            // gives `<div class="is-flex is-flex-direction-column is-align-items-flex-start"><a>Today</a><div>1st Nov</div></div>`
            RouterLink: RouterLinkStub,
            // Fixes "Failed to resolve component: router-link" AND renders to attribute, BUT NOT content of router-link
            // gives `<div to="/posts/1" class="panel-block"></div>`
            // RouterLink: {
            //   template: `<div></div>`,
            // },
          },
        },
      },
      errorSpy,
      warnSpy,
    ),
  )
}

describe("Timeline.vue", () => {
  let errorSpy: jest.Mock<any, any>
  let warnSpy: jest.Mock<any, any>

  beforeEach(() => {
    errorSpy = jest.fn()
    warnSpy = jest.fn()
  })

  afterEach(() => {
    expectNoErrorOrWarnOccured(errorSpy, warnSpy)
  })

  it("renders today post default", async (done) => {
    const wrapper = mountTimeline(errorSpy, warnSpy)
    // nextTick only flushes vue promises, flushPromises also flushes all other promises
    await flushPromises()
    // DEBUG
    // console.log(wrapper.html())
    expect(wrapper.html()).toContain(today.created.format("Do MMM"))
    done()
  })

  it("update when the week period is clicked", async (done) => {
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
    done()
  })

  it("update when the month period is clicked", async (done) => {
    const wrapper = mountTimeline(errorSpy, warnSpy)
    // nextTick only flushes vue promises, flushPromises also flushes all other promises
    await flushPromises()
    // wait for the next frame, like so (1)
    await wrapper.get("[data-test='This Month'").trigger("click")

    expect(wrapper.html()).toContain(today.created.format("Do MMM"))
    expect(wrapper.html()).toContain(thisWeek.created.format("Do MMM"))
    expect(wrapper.html()).toContain(thisMonth.created.format("Do MMM"))
    //
    done()
  })
})
