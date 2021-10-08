import { reactive, readonly } from "vue"
import axios from "axios"
import { DeepReadonly, DeepWritable } from "ts-essentials"
import { Post } from "@/mock"
import cloneDeep from "lodash/cloneDeep"

interface State {
  posts: PostState
}

interface PostState {
  ids: string[]
  all: Map<string, Post>
  loaded: boolean
}

export interface User {
  id: string
  username: string
  password: string
}

class Store {
  private state: State

  constructor(initial: State) {
    this.state = reactive(initial)
  }

  getState() {
    return readonly(this.state)
  }

  async createPost(post: Post) {
    const response = await axios.post<Post>("/posts", post)
    this.state.posts.ids.push(response.data.id)
    this.state.posts.all.set(response.data.id, response.data)
  }

  async createUser(user: User) {
    console.log(user)
    // const response = await axios.put<User>("/user", user)
  }

  async fetchPosts() {
    if (!this.state.posts.loaded) {
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
