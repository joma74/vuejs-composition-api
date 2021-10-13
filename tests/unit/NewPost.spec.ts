import { mount, flushPromises } from "@vue/test-utils"
import NewPost from "@/components/NewPost.vue"
import { store } from "@/store"
import { spyOnErrorHandler, expectNoErrorOccured } from "./jest.setup"

jest.mock("vue-router", () => ({
  useRouter: () => {
    return {
      push: () => {},
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
  it("creates a post and redirects to /", async (done) => {
    let errorSpy = jest.fn()

    // const store = getInitialStoreCopy()
    const wrapper = mount(
      NewPost,
      spyOnErrorHandler(
        {
          global: {
            plugins: [store],
          },
        },
        errorSpy,
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
    expectNoErrorOccured(errorSpy)
    done()
  })
})
