import { createApp } from "vue"
import App from "@/App.vue"
import axios from "axios"
import { today, thisWeek, thisMonth } from "@/mock"
import { router } from "@/router"

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

createApp(App)
  .use(router)
  .mount("#app")
