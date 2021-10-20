import { mount, flushPromises, DOMWrapper } from "@vue/test-utils"
import Navbar from "@/components/Navbar.vue"
import Signup from "@/components/Signup.vue"
import { store } from "@/store"
import { spyOnHandler, expectNoErrorOrWarnOccured } from "./jest.setup"

describe("Navbar", () => {
  it("shows a signup modal via teleport", async (done) => {
    let errorSpy = jest.fn()
    let warnSpy = jest.fn()

    const el = document.createElement("div")
    el.id = "modal"
    document.body.appendChild(el)

    const wrapper = mount(
      Navbar,
      spyOnHandler(
        {
          // else the Nabar component is only rendered as a virual dom
          attachTo: document.body,
          global: {
            plugins: [store],
            components: {
              // Fixes "Failed to resolve component: router-link"
              RouterLink: {
                template: `<div></div>`,
              },
            },
          },
        },
        errorSpy,
        warnSpy,
      ),
    )

    // does not work -> wrapper.get("form")
    const form = wrapper.getComponent(Signup)

    expect(document.body.outerHTML).toContain("This value is required.")

    let usernameInput = form.get("[name='Username']")
    await usernameInput.setValue("Username")
    //
    let passwordInput = form.get("[name='Password']")
    await passwordInput.setValue("1")
    //
    expect(document.body.outerHTML).toContain(
      "This value must be between 5 and 25.",
    )
    await passwordInput.setValue("12345678901")
    //
    expect(document.body.outerHTML).not.toContain("This value")
    //
    await form.trigger("submit.prevent")
    //
    expectNoErrorOrWarnOccured(errorSpy, warnSpy)
    done()
  })
})
