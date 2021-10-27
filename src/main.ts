import { createApp } from "vue"
import App from "@/App.vue"
import axios from "axios"
import { today, thisWeek, thisMonth, Post, isAPost } from "@/mock"
import { routerWithStore } from "@/router"
import { store, User, isAUser, Author } from "@/store"
import { replacer } from "@/utils"
import random from "lodash/random.js"
import "highlight.js/styles/atom-one-dark.css"

function delay() {
  return new Promise((resolve) => {
    setTimeout(resolve, 500)
  })
}

// @ts-ignore
axios.get = async (url: string) => {
  if (url === "/posts") {
    await delay()
    return Promise.resolve({
      data: [today, thisWeek, thisMonth],
    })
  }
}

// @ts-ignore
axios.post = async (url: string, param: Post | User) => {
  console.debug(
    `Processing axios post with: ${JSON.stringify(
      param,
      replacer,
      2,
    )} on url: >>${url}<<`,
  )
  if (url === "/posts" && isAPost(param)) {
    const id = random(100, 10000)
    await delay()
    const post: Post = {
      ...param,
      id: id.toString(),
    }
    return Promise.resolve<{ data: Post }>({
      data: post,
    })
  }
  if (url === "/users" && isAUser(param)) {
    const id = random(100, 10000)
    await delay()
    const author: Author = {
      username: param.username,
      id: id.toString(),
    }
    return Promise.resolve<{ data: Author }>({
      data: author,
    })
  }
  return Promise.reject(
    new Error(
      `Missing handler for ${JSON.stringify(
        param,
        replacer,
        2,
      )} on url: >>${url}<<`,
    ),
  )
}

createApp(App)
  .use(routerWithStore(store))
  .use(store)
  .mount("#app")
