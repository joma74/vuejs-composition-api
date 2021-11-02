import { Post, today } from "@/mock"
import { State, Store } from "@/store"

const mockPost: Post = {
  ...today,
}

jest.mock("axios", () => ({
  get: (url: string) => {
    const _returnValue = {
      data: [mockPost],
    }
    return _returnValue
  },
}))

describe("store/fetchPosts", () => {
  it("fetches post and update state", async (done) => {
    const store = new Store({
      posts: {
        ids: [],
        all: new Map(),
        loaded: false,
      },
      authors: {
        ids: [],
        all: new Map(),
        loaded: true,
        currentUserId: undefined,
      },
    })
    //
    await store.fetchPosts()
    //
    const expected: State = {
      posts: {
        ids: ["1"],
        all: new Map([["1", mockPost]]),
        loaded: true,
      },
      authors: {
        ids: [],
        all: new Map(),
        loaded: true,
        currentUserId: undefined,
      },
    }
    expect(expected).toEqual(store.getState())
    done()
  })
})
