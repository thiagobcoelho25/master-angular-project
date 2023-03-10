import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AlertComponent } from '../shared/alert/alert/alert.component';
import { AuthResponseData, AuthService } from './auth.service';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.scss']
})
export class AuthComponent {

  isLoginMode: boolean = true
  isLoading: boolean = false
  error: string | null = null

  constructor(private auth_service: AuthService, private router: Router) { }

  onSwitchMode() {
    this.isLoginMode = !this.isLoginMode
  }

  onSubmit(form: NgForm) {
    if (!form.valid) {
      return;
    }

    const email = form.value.email
    const password = form.value.password

    this.isLoading = true
    let authObs: Observable<AuthResponseData>


    if (this.isLoginMode) {
      authObs = this.auth_service.login(email, password)
    } else {
      authObs = this.auth_service.signup(email, password)
    }

    authObs.subscribe({
      next: (v) => {
        console.log(v)
        this.isLoading = false
        this.router.navigate(['/recipes']);
      },
      error: (e) => {
        console.error(e)
        this.error = e
        this.isLoading = false
      },
    })

    form.reset()
  }

  onHandleError(){
    this.error = null
  }

}
