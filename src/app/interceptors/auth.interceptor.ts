import { Injectable } from '@angular/core';
import { HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { catchError, filter, take, switchMap, tap } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { AuthenticationService } from '../services/authentication-service';


@Injectable()

export class AuthInterceptor implements HttpInterceptor {

    private isRefreshing = false;
    private refreshTokenSubject: BehaviorSubject<any> = new BehaviorSubject<any>(null);
    constructor(private authenticationService: AuthenticationService) {
        
    }

    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {      
        request = this.addToken(request, 'I8794@&8jHGGFgh%_');        
        return next.handle(request).pipe(
            tap({
                next: (x) => {
                    if (x.type != 0) {
                        //   if (!this.dadosCompartilhadosService.desabilitarLoading)
                        //  this.spinner.hide();
                    }
                },
                error: (err) => {
                    //  if (!this.dadosCompartilhadosService.desabilitarLoading)
                    //  this.spinner.hide();
                }
            }),
            catchError(error => {
                if (error instanceof HttpErrorResponse && (error.status === 401 || error.status === 403)) {
                    return this.handle401Error(request, next);
                } else {
                    return throwError(error);
                }
            }));
    }


    private addToken(request: HttpRequest<any>, token: string) {
        return request.clone({
            setHeaders: {
                'sessionId': token
            }
        });
    }

    private handle401Error(request: HttpRequest<any>, next: HttpHandler) {
        if (!this.isRefreshing) {
            this.isRefreshing = true;
            this.refreshTokenSubject.next(null);
            return null;
            // return this.authenticationService.refreshToken().pipe(
            //     switchMap((token: any) => {
            //         this.isRefreshing = false;
            //         this.refreshTokenSubject.next(token.jwt);
            //         return next.handle(this.addToken(request, token.jwt));
            //     }));

        } else {
            return this.refreshTokenSubject.pipe(
                filter(token => token != null),
                take(1),
                switchMap(jwt => {
                    return next.handle(this.addToken(request, jwt));
                }));
        }
    }

    private getURLBase(): string {
        return environment.API_URL;
    }


}
