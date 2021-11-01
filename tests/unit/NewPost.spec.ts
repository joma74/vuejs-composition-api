import { mount, flushPromises } from "@vue/test-utils"
import NewPost from "@/components/NewPost.vue"
import { Store } from "@/store"
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
  let errorSpy: jest.Mock<any, any>
  let warnSpy: jest.Mock<any, any>

  beforeEach(() => {
    routes = []
    errorSpy = jest.fn()
    warnSpy = jest.fn()
  })

  afterEach(() => {
    expectNoErrorOrWarnOccured(errorSpy, warnSpy)
  })

  it("creates a post and redirects to /", async (done) => {
    //
    const store = new Store({
      posts: {
        ids: [],
        all: new Map(),
        loaded: false,
      },
      authors: {
        ids: ["100"],
        all: new Map([["100", { id: "100", username: "username" }]]),
        loaded: true,
        currentUserId: "100",
      },
    })
    //
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
    //
    setTimeout(async () => {
      //
      expect(store.getState().posts.ids).toHaveLength(1)
      //
      expect(routes).toEqual(["/"])
      //
      done()
    }, 300)
  })
})
