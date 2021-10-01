import moment from "moment"

export interface Post {
  id: string
  title: string
  created: moment.Moment
}

export const today: Post = {
  id: "1",
  title: "Today",
  created: moment(),
}

export const thisWeek: Post = {
  id: "1",
  title: "This Week",
  created: moment().subtract("days", 2),
}

export const thisMonth: Post = {
  id: "1",
  title: "This Month",
  created: moment().subtract("days", 12),
}
