import {User} from "./user";

export interface Task {
  _id: string,
  title: string,
  description: string,
  status_id: string,
  creator_id: string,
  assignee_id: string,
  assignee_as_user?: User
}
