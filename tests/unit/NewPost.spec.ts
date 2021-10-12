import { config, mount, flushPromises } from "@vue/test-utils"
import NewPost from "@/components/NewPost.vue"
import { getInitialStoreCopy } from "@/store"

jest.mock("vue-router", () => ({
  useRouter: () => {},
}))

describe("New Post", () => {
  it("creates a post and redirects to /", async (done) => {
    let globalErrorSpy = jest.fn()

    const initialStoreCopy = getInitialStoreCopy()
    const wrapper = mount(NewPost, {
      global: {
        plugins: [initialStoreCopy],
        config: { errorHandler: globalErrorSpy },
      },
    })
    wrapper.find("[data-test='submitElement'").trigger("click")
    // needed!
    await flushPromises()
    // needed!
    await new Promise((r) => setTimeout(r, 500))
    //
    expect(globalErrorSpy).toHaveBeenCalledTimes(1)
    //
    let error: Error = globalErrorSpy.mock.calls[0][0]
    expect(error).toBeInstanceOf(Error)
    expect(error).toHaveProperty("message", "Network Error")
    expect(globalErrorSpy.mock.calls[0][2]).toBe("component event handler")
    done()
  })
})
