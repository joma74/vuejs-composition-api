import { mount, flushPromises } from "@vue/test-utils"
import Navbar from "@/components/Navbar.vue"
import { store } from "@/store"
import { spyOnHandler, expectNoErrorOrWarnOccured } from "./jest.setup"

describe("Navbar", () => {
  it("shows a signup modal via teleport", async (done) => {
    let errorSpy = jest.fn()
    let warnSpy = jest.fn()

    const wrapper = mount(
      Navbar,
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
})
