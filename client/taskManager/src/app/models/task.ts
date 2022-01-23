import {User} from "./user";
import {TaskStatus} from "./task-status";

export interface Task {
  _id: string,
  title: string,
  description: string,
  status: TaskStatus | null,
  creator: User | null,
  assignee: User | null
}
