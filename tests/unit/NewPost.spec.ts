import { config, mount, flushPromises } from "@vue/test-utils"
import NewPost from "@/components/NewPost.vue"
import { getInitialStoreCopy } from "@/store"

jest.mock("vue-router", () => ({
  useRouter: () => {},
}))

jest.mock("axios", () => ({
  post: () => {},
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
    expectNoErrorOccured(globalErrorSpy)
    done()
  })
})

function expectErrorOccured(
  globalErrorSpy: jest.Mock<any, any>,
  message?: string,
  source?: string,
) {
  let error: Error = globalErrorSpy.mock.calls[0][0]
  logError(error)
  expect(error).toBeInstanceOf(Error)
  if (message) expect(error).toHaveProperty("message", message)
  if (source)
    expect(globalErrorSpy.mock.calls[0][2]).toBe("component event handler")
}

function expectNoErrorOccured(globalErrorSpy: jest.Mock<any, any>) {
  let error: Error = globalErrorSpy.mock.calls[0][0]
  logError(error)
  expect(error).toBeUndefined()
}

function logError(error: Error) {
  error ? console.info("Vue' caught error is >> ", error) : () => {}
}
