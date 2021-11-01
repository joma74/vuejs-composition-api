import { mount, flushPromises, DOMWrapper } from "@vue/test-utils"
import Navbar from "@/components/Navbar.vue"
import Signup from "@/components/Signup.vue"
import { Store } from "@/store"
import { spyOnHandler, expectNoErrorOrWarnOccured } from "./jest.setup"

describe("Navbar", () => {
  let errorSpy: jest.Mock<any, any>
  let warnSpy: jest.Mock<any, any>

  beforeEach(() => {
    errorSpy = jest.fn()
    warnSpy = jest.fn()
  })

  afterEach(() => {
    expectNoErrorOrWarnOccured(errorSpy, warnSpy)
  })

  it("shows a signup modal via teleport", async (done) => {
    const store = new Store({
      posts: {
        ids: [],
        all: new Map(),
        loaded: false,
      },
      authors: {
        ids: ["100"],
        all: new Map(),
        loaded: false,
        currentUserId: undefined,
      },
    })
    // make bogus modal element
    const el = document.createElement("div")
    el.id = "modal"
    document.body.appendChild(el)
    //
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
    // trigger sign up button
    await wrapper.get("[data-test='sign-up'").trigger("click")
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
    done()
  })
})
