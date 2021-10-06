import moment from "moment"

export interface Post {
  id: string
  title: string
  created: moment.Moment
  html?: string
  markdown?: string
}

export const today: Post = {
  id: "1",
  title: "Today",
  // reactivity.esm-bundler.js:512 Set operation on key "_isValid" failed: target is readonly.
  created: moment().subtract("seconds", 1),
}

export const thisWeek: Post = {
  id: "2",
  title: "This Week",
  created: moment().subtract("days", 2),
}

export const thisMonth: Post = {
  id: "3",
  title: "This Month",
  created: moment().subtract("days", 12),
}
