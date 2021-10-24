import { createApp } from "vue"
import App from "@/App.vue"
import axios from "axios"
import { today, thisWeek, thisMonth, Post, isAPost } from "@/mock"
import { routerWithStore } from "@/router"
import { store, User, isAUser, Author } from "@/store"
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
      null,
      2,
    )} on url: >>${url}<<`,
  )
  if (url === "/posts" && isAPost(param)) {
    const id = random(100, 10000)
    await delay()
    return Promise.resolve({
      data: { ...param, id },
    })
  }
  if (url === "/users" && isAUser(param)) {
    const id = random(100, 10000)
    await delay()
    const author: Author = {
      id: id.toString(),
      username: param.username,
    }
    return Promise.resolve({
      data: author,
    })
  }
}

createApp(App)
  .use(routerWithStore(store))
  .use(store)
  .mount("#app")
