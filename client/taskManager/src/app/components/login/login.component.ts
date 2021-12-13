import {Component} from '@angular/core';
import {FormControl, Validators} from '@angular/forms';
import {AuthService} from "../../services/auth.service";
import {Router} from "@angular/router";
import {Subscription} from "rxjs";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent  {
  email!: string;
  password!: string;

  subscription!: Subscription

  errMessage!: string;

  constructor(private authService: AuthService, private router: Router) { }

  emailFormControl = new FormControl('', [
    Validators.required,
    Validators.pattern('\\b[\\w\\.-]+@[\\w\\.-]+\\.\\w{2,4}\\b')
  ])

  passwordFormControl = new FormControl('', [
    Validators.required,
    Validators.minLength(3),
    Validators.maxLength(12)
  ])

  login() {
    this.subscription = this.authService.login(this.email, this.password).subscribe(user => {
      this.router.navigate(['/'])
    }, err => {
      this.errMessage = err
    })
  }

  removeMessage() {
    this.errMessage = ''
  }

  ngOnDestroy() {
    if (this.subscription) {
      this.subscription.unsubscribe()
    }
  }
}
