import { Injectable } from '@angular/core';
import {User} from "../models/user";

@Injectable({
  providedIn: 'root'
})
export class UserService {

  setUserToStorage(user: User): void {
    localStorage.setItem('user', JSON.stringify(user))
  }

  getUserFromStorage(): User | null {
    let user = localStorage.getItem('user')

    if (user) {
      return JSON.parse(user)
    } else {
      return null
    }
  }

  deleteUserFromStorage(): void {
    localStorage.removeItem('user')
  }
}
