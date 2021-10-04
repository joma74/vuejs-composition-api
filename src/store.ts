import { reactive, readonly } from "vue"
import axios from "axios"
import { DeepReadonly, DeepWritable } from "ts-essentials"
import { today, thisWeek, thisMonth, Post } from "@/mock"
import cloneDeep from "lodash/cloneDeep"

interface State {
  posts: PostState
}

interface PostState {
  ids: string[]
  all: Map<string, Post>
  loaded: boolean
}

class Store {
  private state: State

  constructor(initial: State) {
    this.state = reactive(initial)
  }

  getState() {
    return readonly(this.state)
  }

  async fetchPosts() {
    this.state.posts.loaded = false
    const respones = await axios.get<Post[]>("/posts")
    const postsState: PostState = deepClone(initialPosts)
    for (const post of respones.data) {
      // Use postState instead of this.state.posts as postsState is not reactive and hence more efficient.
      postsState.ids.push(post.id)
      postsState.all.set(post.id, post)
    }
    postsState.loaded = true
    this.state.posts = postsState
  }
}

const initialPosts = {
  ids: [],
  all: new Map(),
  loaded: false,
} as DeepReadonly<PostState>

const initialState = {
  posts: initialPosts,
} as DeepReadonly<State>

const deepClone = <T>(obj: T): DeepWritable<T> => {
  // return JSON.parse(JSON.stringify(obj))
  return cloneDeep(obj) as DeepWritable<T>
}

const store = new Store(deepClone(initialState))

/**
 * use... for composables, later for provide/inject
 */
export function useStore() {
  return store
}
