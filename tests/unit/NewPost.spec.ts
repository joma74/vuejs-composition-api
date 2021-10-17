import { mount, flushPromises } from "@vue/test-utils"
import NewPost from "@/components/NewPost.vue"
import { store } from "@/store"
import { spyOnHandler, expectNoErrorOrWarnOccured } from "./jest.setup"

let routes: string[] = []

jest.mock("vue-router", () => ({
  useRouter: () => {
    return {
      push: (route: string) => {
        routes.push(route)
      },
    }
  },
}))

jest.mock("axios", () => ({
  post: (url: string, payload: any) => {
    return {
      data: payload,
    }
  },
}))

describe("NewPost.vue", () => {
  beforeEach(() => {
    routes = []
  })

  it("creates a post and redirects to /", async (done) => {
    let errorSpy = jest.fn()
    let warnSpy = jest.fn()

    // const store = getInitialStoreCopy()
    const wrapper = mount(
      NewPost,
      spyOnHandler(
        {
          global: {
            plugins: [store],
          },
        },
        errorSpy,
        warnSpy,
      ),
    )
    //
    expect(store.getState().posts.ids).toHaveLength(0)
    //
    wrapper.find("[data-test='submitElement'").trigger("click")
    // needed!
    await flushPromises()
    // needed!
    await new Promise((r) => setTimeout(r, 500))
    //
    expect(store.getState().posts.ids).toHaveLength(1)
    //
    expect(routes).toEqual(["/"])
    //
    expectNoErrorOrWarnOccured(errorSpy, warnSpy)
    done()
  })
})
