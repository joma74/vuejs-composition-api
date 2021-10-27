import { mount } from "@vue/test-utils"
import PostWriter from "@/components/PostWriter.vue"
import { Post } from "@/mock"
import { spyOnHandler, expectNoErrorOrWarnOccured } from "./jest.setup"

describe("PostWriter.vue", () => {
  it("emits a save event with new post", async (done) => {
    let errorSpy = jest.fn()
    let warnSpy = jest.fn()

    const wrapper = mount(
      PostWriter,
      spyOnHandler(
        {
          props: {
            post: {
              title: "New title",
            },
          },
        },
        errorSpy,
        warnSpy,
      ),
    )

    /**
     * Change title
     * Works only b/c title-element uses v-model
     */
    wrapper.find("[data-test='title-element']").setValue("My new post")

    /**
     * Change markdownRawContent
     */
    const _markdownRawElement = wrapper.find<HTMLDivElement>(
      "[data-test='markdownRawElement']",
    )
    _markdownRawElement.element.innerHTML = "## New content"
    _markdownRawElement.trigger("input")

    /**
     * Wait for debounce t.i. 250 ms
     */
    setTimeout(async () => {
      /**
       * Trigger submit
       */
      wrapper.find("[data-test='submitElement']").trigger("click")

      const _emittedPost = (wrapper.emitted()[
        "save"
      ] as unknown[][])[0][0] as Post

      // DEBUG
      // console.log(_emittedPost)

      expect(_emittedPost.title).toBe("My new post")
      expect(_emittedPost.markdown).toBe("## New content")
      expect(_emittedPost.html).toBe('<h2 id="new-content">New content</h2>\n')
      //
      expectNoErrorOrWarnOccured(errorSpy, warnSpy)
      done()
    }, 300)
  })
})
