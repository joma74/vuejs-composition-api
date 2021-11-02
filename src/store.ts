import { reactive, readonly, inject, App } from "vue"
import axios from "axios"
import { DeepReadonly, DeepWritable } from "ts-essentials"
import { Post } from "@/mock"
import { replacer } from "@/utils"
import cloneDeep from "lodash/cloneDeep"

interface BaseState<T> {
  ids: string[]
  all: Map<string, T>
  loaded: boolean
}

type PostState = BaseState<Post>

export interface User {
  id: string
  username: string
  password: string
}

export function isAUser(obj: any): obj is User {
  return obj.username !== undefined
}

export type Author = Omit<User, "password">

interface AuthorState extends BaseState<Author> {
  currentUserId: string | undefined
}

export interface State {
  posts: PostState
  authors: AuthorState
}

export class Store {
  private state: State

  constructor(initial: State) {
    this.state = reactive(initial)
  }

  install(app: App) {
    app.provide(storeKey, this)
  }

  getState() {
    return readonly(this.state)
  }

  async createPost(post: Post) {
    const response = await axios.post<Post>("/posts", post)
    this.state.posts.all.set(response.data.id, response.data)
    this.state.posts.ids.push(response.data.id)
    console.debug(
      `Created post: ${JSON.stringify(this.state.posts, replacer, 2)}`,
    )
  }

  async updatePost(post: Post) {
    const response = await axios.put<Post>("/posts", post)
    this.state.posts.all.set(response.data.id, response.data)
    console.debug(
      `Updated post: ${JSON.stringify(this.state.posts, replacer, 2)}`,
    )
  }

  async createUser(user: User) {
    const response = await axios.post<User>("/users", user)
    this.state.authors.ids.push(response.data.id)
    this.state.authors.all.set(response.data.id, response.data)
    this.state.authors.currentUserId = response.data.id
    console.debug(
      `Created user: ${JSON.stringify(this.state.authors, replacer, 2)}`,
    )
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
      console.debug(
        `Fetched posts: ${JSON.stringify(this.state.posts, replacer, 2)}`,
      )
    }
  }
}

const initialPosts = {
  ids: [],
  all: new Map<string, Post>(),
  loaded: false,
} as DeepReadonly<PostState>

const initialAuthors = {
  ids: [],
  all: new Map<string, Author>(),
  loaded: false,
  currentUserId: undefined,
} as DeepReadonly<AuthorState>

const initialState = {
  posts: initialPosts,
  authors: initialAuthors,
} as DeepReadonly<State>

const deepClone = <T>(obj: T): DeepWritable<T> => {
  // return JSON.parse(JSON.stringify(obj))
  return cloneDeep(obj) as DeepWritable<T>
}

export const getInitialStoreCopy = () => {
  return new Store(deepClone(initialState))
}

export const storeKey = Symbol("store")
export const store = getInitialStoreCopy()

/**
 * use... for composables, later for provide/inject
 */
export function useStore(): Store {
  const _store = inject<Store>(storeKey)
  if (!_store) {
    throw Error("Did you forogot to call provide?")
  }
  return _store
}
