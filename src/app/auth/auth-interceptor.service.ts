import { HttpEvent, HttpHandler, HttpInterceptor, HttpParams, HttpRequest } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { exhaustMap, Observable, take } from "rxjs";
import { AuthService } from "./auth.service";

@Injectable()
export class AuthInterceptorService implements HttpInterceptor {

    constructor(private auth_service: AuthService) { }

    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        return this.auth_service.user.pipe(take(1), exhaustMap(user => {
            if(!user){
                return next.handle(req)
            }

            const modified_request = req.clone({ params: new HttpParams().set('auth', user?.token!) })
            return next.handle(modified_request);
        }))

        // const user = this.authService.user.value;
        // if (user && user.token) {
        //     req = req.clone({
        //         params: new HttpParams().set('auth', user.token);
        //     });
        // }
        // return next.handle(req);
    }
}
