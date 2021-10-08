import { createApp } from "vue"
import App from "@/App.vue"
import axios from "axios"
import { today, thisWeek, thisMonth, Post } from "@/mock"
import { router } from "@/router"
import { store, storeKey } from "@/store"
import random from "lodash/random.js"
import "highlight.js/styles/atom-one-dark.css"

function delay() {
  return new Promise((resolve) => {
    setTimeout(resolve, 1000)
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
axios.post = async (url: string, post: Post) => {
  if (url === "/posts") {
    const id = random(100, 10000)
    await delay()
    return Promise.resolve({
      data: { ...post, id },
    })
  }
}

createApp(App)
  .use(router)
  .provide(storeKey, store)
  .mount("#app")
