import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { User } from '../models/user.model';
import { environment } from '../../../../environments/environment';

const BACKEND_URL = environment.apiURL + 'api/user/';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private isAuthenticated = false;
  private token: string;
  private authStatusListener = new Subject<boolean>();
  private tokenTimer: any;
  private userId: string;

  constructor(private http: HttpClient, private router: Router) { }

  getToken(){
    return this.token;
  }

  getIsAuth(){
    return this.isAuthenticated;
  }

  getAuthStatusListener(){
    return this.authStatusListener.asObservable();
  }

  getUserId () {
    return this.userId;
  }

  createUser(user: User){
    return this.http.post(BACKEND_URL + '/signup', user)
    .subscribe( ()=> {
      this.router.navigate(['user','login']);
    }, error => {
      this.authStatusListener.next(false);
    })
  }

  loginUser(email: string, password: string){
    const loginData = {email: email, password: password};
    this.http.post<{token: string, expiresIn: number, userId: string, username: string}>( BACKEND_URL + "/login", loginData)
    .subscribe(response =>{
      const token = response.token;
      this.token = token;
      if(token){
      const expiresDuration = response.expiresIn;
      this.setAuthTimer(expiresDuration);
      this.userId = response.userId;
      this.isAuthenticated = true;
      this.authStatusListener.next(true);
      const now = new Date();
      const expirationDate = new Date(now.getTime() + expiresDuration * 1000);
      this.saveAuthData(token, expirationDate, this.userId);
      this.router.navigate(['/']);
      }
  })
  }

  logout() {
  this.token= null;
  this.isAuthenticated = false;
  this.authStatusListener.next(false);
  clearTimeout(this.tokenTimer);
  this.userId = null;
  this.clearAuthData();
  this.router.navigate(['/']);
  }

  autoAuthUser() {
  const authInformation = this.getAuthData();
  if(!authInformation){
    return;
  }
  const now = new Date();
  const expiresIn = authInformation.expirationDate.getTime() - now.getTime();
  if (expiresIn > 0){
    this.token = authInformation.token;
    this.isAuthenticated = true;
    this.userId = authInformation.userId;
    this.setAuthTimer(expiresIn / 1000);
    this.authStatusListener.next(true);
    }
  }

  private setAuthTimer (duration: number) {
    this.tokenTimer= setTimeout(()=> {
      this.logout();
    }, duration * 1000);
  }

  private saveAuthData(token: string, expirationDate: Date, userId: string) {
    localStorage.setItem('token', token);
    localStorage.setItem('expiration', expirationDate.toISOString());
    localStorage.setItem('userId', userId);
  }

  private clearAuthData() {
    localStorage.removeItem('token');
    localStorage.removeItem('expiration');
    localStorage.removeItem('userId');
  }

  private getAuthData() {
    const token = localStorage.getItem('token');
    const expirationDate = localStorage.getItem('expiration');
    const userId = localStorage.getItem('userId');
    if (!token || !expirationDate){
      return;
    }
    return {
      token: token,
      expirationDate: new Date(expirationDate),
      userId: userId
    }
  }

  getProfile (id: string){
    return this.http.get<{_id: string,username: string, avatar: string, email: string, password: string, favouritePlatform: string, favouritePlatformUsername: string, favouritesGames: string, favouritesGenres: string, aboutMe: string }>(BACKEND_URL + '/userprofile/' + id)
  }

  updateProfile (id: string, user:User){
    return this.http.put(BACKEND_URL + '/updateprofile/' + id, user).subscribe();
  }

}

