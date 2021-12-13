import {Component} from '@angular/core';
import {FormControl, Validators} from '@angular/forms';
import {AuthService} from "../../services/auth.service";
import {Router} from "@angular/router";
import {Subscription} from "rxjs";

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent {
  email!: string;
  password!: string;
  name!: string;

  subscription!: Subscription

  errMessage!: string;

  constructor(private authService: AuthService, private router: Router) {
  }

  nameFormControl = new FormControl('', [
    Validators.required
  ])

  emailFormControl = new FormControl('', [
    Validators.required,
    Validators.pattern('\\b[\\w\\.-]+@[\\w\\.-]+\\.\\w{2,4}\\b')
  ])

  passwordFormControl = new FormControl('', [
    Validators.required,
    Validators.minLength(3),
    Validators.maxLength(12)
  ])

  register() {
    this.subscription = this.authService.register(this.email, this.password, this.name).subscribe(user => {
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
