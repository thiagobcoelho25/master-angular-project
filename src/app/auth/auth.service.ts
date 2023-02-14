import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, catchError, tap, throwError } from 'rxjs';
import { User } from './user.model';

export interface AuthResponseData {
  idToken: string
  email: string
  refreshToken: string
  expiresIn: string
  localId: string
  registered?: boolean
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  user = new BehaviorSubject<User|null>(null)
  private token_expiration_timer: any

  constructor(private http_client: HttpClient, private router: Router) { }

  signup(email: string, password: string) {
    return this.http_client.post<AuthResponseData>(`https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=AIzaSyAtP3Ue4t5xpTFWgYzA07jH9PxuE_OdNM8`,
      { email: email, password: password, returnSecureToken: true }).pipe(catchError(this.handleError))
  }

  login(email: string, password: string) {
    return this.http_client.post<AuthResponseData>(`https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=AIzaSyAtP3Ue4t5xpTFWgYzA07jH9PxuE_OdNM8`,
      { email: email, password: password, returnSecureToken: true }).pipe(tap(res => {
        this.handleAuthentication(res.email, res.localId, res.idToken, +res.expiresIn)
      }), catchError(this.handleError))
  }

  logout(){
    this.user.next(null);
    localStorage.removeItem('user_data')
    if(this.token_expiration_timer){
      clearTimeout(this.token_expiration_timer)
    }
    this.token_expiration_timer = null
    this.router.navigate(['/auth'])
  }

  autoLogout(expiration_duration: number){
    this.token_expiration_timer = setTimeout(() => {
      this.logout()
    }, expiration_duration);
  }

  autoLoginIn(){
    const user_data: {
      email: string,
      id: string,
      _token: string,
      _tokenExpirationDate: string
    } = JSON.parse(localStorage.getItem('user_data') || "");

    if(!user_data){
      return
    }

    const loaded_user = new User(user_data.email, user_data.id, user_data._token, new Date(user_data._tokenExpirationDate));

    if(loaded_user.token){
      const expiration_duration: number = new Date(user_data._tokenExpirationDate).getTime() - new Date().getTime()

      this.autoLogout(expiration_duration)
      this.user.next(loaded_user);
    }
  }

  private handleAuthentication(email: string, userId: string, token: string, expiresIn: number) {
    const expiration_date = new Date(new Date().getTime() + (expiresIn * 1000))
    const user = new User(email, userId, token, expiration_date)
    
    localStorage.setItem('user_data', JSON.stringify(user))
    this.autoLogout(expiresIn * 1000)

    this.user.next(user);
  }

  private handleError(error: HttpErrorResponse) {
    let error_message: string = 'An unknown error occurred!'

    if (!error.error || !error.error.error) {
      return throwError(() => new Error(error_message))
    }

    switch (error.error.error.message) {
      case 'EMAIL_EXISTS':
        error_message = 'This email already exists';
        break;
      case 'EMAIL_NOT_FOUND':
        error_message = 'This email does not exists';
        break;
      case 'INVALID_PASSWORD':
        error_message = 'This password is not correct';
        break;
      case 'INVALID_EMAIL':
        error_message = 'This email is invalid';
        break;
    }

    return throwError(() => new Error(error_message))
  }

}
