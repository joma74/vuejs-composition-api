import { mount } from "@vue/test-utils"
import ShowPost from "@/components/ShowPost.vue"
import { store } from "@/store"
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
    const wrapper = mount(
      ShowPost,
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
    expectNoErrorOrWarnOccured(errorSpy, warnSpy)
    done()
  })

  it("does not show edit button when not authorized", async (done) => {
    //
    expectNoErrorOrWarnOccured(errorSpy, warnSpy)
    done()
  })

  it("shows edit button when authorized", async (done) => {
    //
    expectNoErrorOrWarnOccured(errorSpy, warnSpy)
    done()
  })
})
