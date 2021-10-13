import { config, mount, flushPromises } from "@vue/test-utils"
import NewPost from "@/components/NewPost.vue"
import { getInitialStoreCopy } from "@/store"
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

describe("New Post", () => {
  it("creates a post and redirects to /", async (done) => {
    let errorSpy = jest.fn()

    const initialStoreCopy = getInitialStoreCopy()
    const wrapper = mount(
      NewPost,
      spyOnErrorHandler(
        {
          global: {
            plugins: [initialStoreCopy],
          },
        },
        errorSpy,
      ),
    )
    wrapper.find("[data-test='submitElement'").trigger("click")
    // needed!
    await flushPromises()
    // needed!
    await new Promise((r) => setTimeout(r, 500))
    //
    expectNoErrorOccured(errorSpy)
    done()
  })
})
