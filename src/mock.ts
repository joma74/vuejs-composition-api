import moment from "moment"

export interface Post {
  id: string
  title: string
  created: moment.Moment
  html?: string
  markdown?: string
  authorId: string
}

export function isAPost(obj: any): obj is Post {
  return obj.title !== undefined
}

export const today: Post = {
  id: "1",
  title: "Today",
  //  moment() -> reactivity.esm-bundler.js:512 Set operation on key "_isValid" failed: target is readonly.
  created: moment().subtract(1, "seconds"),
  authorId: "1",
}

export const thisWeek: Post = {
  id: "2",
  title: "This Week",
  created: moment().subtract(2, "days"),
  authorId: "1",
}

export const thisMonth: Post = {
  id: "3",
  title: "This Month",
  created: moment().subtract(12, "days"),
  authorId: "1",
}
