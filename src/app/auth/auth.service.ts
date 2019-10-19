import { Router } from '@angular/router';
import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { catchError, tap } from 'rxjs/operators';
import { throwError, BehaviorSubject } from 'rxjs';
import { User } from './user.model';
import { environment } from '../../environments/environment';
 
export interface AuthResponseData {
    kind: string;
    idToken: string;
    email: string;
    refreshToken: string;
    expiresIn: number;
    localId: string;
    registered?: boolean;
}

@Injectable({providedIn: 'root'})
export class AuthService {
    user = new BehaviorSubject<User>(null);
    private tokenExpTimer: any;

    constructor(private router: Router, private http: HttpClient) {}
    signupUser(email: string, password: string) {
        return this.http.post<AuthResponseData>('https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=' + environment.firebaseAPIKey,{
            email: email,
            password: password,
            returnSecureToken: true
        }).pipe(catchError(this.handleError), tap(resData => {
            this.handleAuth(resData.email, resData.localId, resData.idToken, +resData.expiresIn);
        }));
       
    }

    singInUser(email: string, password: string) {
        return this.http.post<AuthResponseData>('https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=' + environment.firebaseAPIKey, {
            email: email,
            password: password,
            returnSecureToken: true
        }).pipe(catchError(this.handleError), tap(resData => {
            this.handleAuth(resData.email, resData.localId, resData.idToken, +resData.expiresIn);}));

    }

    private handleError(errorResponse: HttpErrorResponse) {
        let errorMessage = 'An error occured!';
            if(!errorResponse || !errorResponse.error.error) {
                return throwError(errorMessage);
            }
            switch(errorResponse.error.error.message) {
                case 'EMAIL_EXISTS':
                    errorMessage = 'This email already exists';
                    break;
                case 'EMAIL_NOT_FOUND':
                    errorMessage = 'This email doesnot exist';
                    break;
                case 'INVALID_PASSWORD':
                    errorMessage = 'Wrong password entered';
                    break;
            }

            return throwError(errorMessage);
        
    }

    autoLogin() {
        const userdata: {
            email: string; id: string; _token: string; _tokenExpirationDate: string;
        } = JSON.parse(localStorage.getItem('userData'));
        if(!userdata) {
            return;
        }

        const loadedUser = new User(
            userdata.email, 
            userdata.id, 
            userdata._token, 
            new Date(userdata._tokenExpirationDate)
        );

        if(loadedUser.token) {
            this.user.next(loadedUser);
            const expDuration = new Date(userdata._tokenExpirationDate).getTime() - new Date().getTime();
            this.autoLogOut(expDuration);
        }

    }

    autoLogOut(expDuration: number) {
        this.tokenExpTimer = setTimeout(() => {
            this.logOut();
        } ,expDuration);
    }

    private handleAuth(email: string, userId: string, token: string, expiresIn: number) {
        const expDate = new Date(new Date().getTime() + expiresIn * 1000);
        const user  = new User(email, userId, token, expDate);
        this.user.next(user);
        this.autoLogOut(expiresIn * 1000);
        localStorage.setItem('userData', JSON.stringify(user));
    }

    logOut() {
        this.user.next(null);
        this.router.navigate(['/auth']);
        localStorage.removeItem('userData');
        if(this.tokenExpTimer) {
            clearTimeout(this.tokenExpTimer);
        }
        this.tokenExpTimer = null;
    }

}