import { mount } from "@vue/test-utils"
import ShowPost from "@/components/ShowPost.vue"
import { Store } from "@/store"
import { today } from "@/mock"
import { routerWithStore } from "@/router"
import { spyOnHandler, expectNoErrorOrWarnOccured } from "./jest.setup"

describe("ShowPost", () => {
  let errorSpy: jest.Mock<any, any>
  let warnSpy: jest.Mock<any, any>

  beforeEach(() => {
    errorSpy = jest.fn()
    warnSpy = jest.fn()
  })
  it("does not show edit button when not authenticated", async (done) => {
    //
    const store = new Store({
      posts: {
        ids: [today.id],
        all: new Map([[today.id, today]]),
        loaded: true,
      },
      authors: {
        ids: [],
        all: new Map(),
        loaded: true,
        currentUserId: undefined,
      },
    })
    //
    const router = routerWithStore(store)
    router.push(`/posts/${today.id}`)
    // Returns a Promise that resolves when the router has completed the initial navigation
    await router.isReady()
    //
    const wrapper = mount(
      ShowPost,
      spyOnHandler(
        {
          global: {
            plugins: [store, router],
          },
        },
        errorSpy,
        warnSpy,
      ),
    )
    //
    setTimeout(async () => {
      expect(wrapper.find("[data-test='can-edit']").exists()).toBe(false)
      expectNoErrorOrWarnOccured(errorSpy, warnSpy)
      done()
    }, 300)
  })

  it("does not show edit button when not authorized", async (done) => {
    //
    const store = new Store({
      posts: {
        ids: [today.id],
        all: new Map([[today.id, today]]),
        loaded: true,
      },
      authors: {
        ids: ["-10000"],
        all: new Map([
          ["-10000", { id: "-10000", username: "unit test user" }],
        ]),
        loaded: true,
        currentUserId: undefined,
      },
    })
    //
    const router = routerWithStore(store)
    router.push(`/posts/${today.id}`)
    // Returns a Promise that resolves when the router has completed the initial navigation
    await router.isReady()
    //
    const wrapper = mount(
      ShowPost,
      spyOnHandler(
        {
          global: {
            plugins: [store, router],
          },
        },
        errorSpy,
        warnSpy,
      ),
    )
    //
    setTimeout(async () => {
      expect(wrapper.find("[data-test='can-edit']").exists()).toBe(false)
      expectNoErrorOrWarnOccured(errorSpy, warnSpy)
      done()
    }, 300)
  })

  it("shows edit button when authorized", async (done) => {
    //
    const store = new Store({
      posts: {
        ids: [today.id],
        all: new Map([[today.id, today]]),
        loaded: true,
      },
      authors: {
        ids: ["1"],
        all: new Map([["1", { id: "1", username: "unit test user" }]]),
        loaded: true,
        currentUserId: "1",
      },
    })
    //
    const router = routerWithStore(store)
    router.push(`/posts/${today.id}`)
    // Returns a Promise that resolves when the router has completed the initial navigation
    await router.isReady()
    //
    const wrapper = mount(
      ShowPost,
      spyOnHandler(
        {
          global: {
            plugins: [store, router],
          },
        },
        errorSpy,
        warnSpy,
      ),
    )
    //
    setTimeout(async () => {
      expect(wrapper.find("[data-test='can-edit']").exists()).toBe(true)
      expectNoErrorOrWarnOccured(errorSpy, warnSpy)
      done()
    }, 300)
  })
})
