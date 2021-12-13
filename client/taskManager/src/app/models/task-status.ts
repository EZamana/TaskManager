import {Task} from "./task";

export interface TaskStatus {
  _id: string,
  title: string,
  priority: number,
  tasks?: Task[]
}
