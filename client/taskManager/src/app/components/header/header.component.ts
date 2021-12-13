import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import {AuthService} from "../../services/auth.service";
import {User} from "../../models/user";


@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  user!: User | null
  userName!: string

  constructor(private router: Router, private authService: AuthService ) { }

  ngOnInit(): void {
    this.authService.user.subscribe(user => {
      this.user = user;
      if (user) {
        this.userName = user.name as string
      }
    })
  }

  toLogin() {
    this.router.navigate(['/login'])
  }

  toRegister() {
    this.router.navigate(['/register'])
  }

  logout() {
    this.authService.logout()
  }
}
