import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { UserService } from 'src/app/features/user/services/user.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})

export class HeaderComponent implements OnInit, OnDestroy {

  public userIsAuthenticated = false;
  private authListenerSubs: Subscription;
  public userId: string;
  public username: string;

  constructor(private userService: UserService) { }

  ngOnInit(): void {
    this.userIsAuthenticated = this.userService.getIsAuth();
    this.userId = this.userService.getUserId();
    if(this.userIsAuthenticated){
      this.userService.getProfile(this.userId).subscribe ( userData => {
        this.username= userData.username
      });
    }

    this.authListenerSubs = this.userService.getAuthStatusListener()
    .subscribe(isAuthenticated => {
      this.userIsAuthenticated = isAuthenticated;
      this.userId = this.userService.getUserId();
      this.userService.getProfile(this.userId).subscribe ( userData => {
        this.username= userData.username
      });
    });
  }

  logout()  {
    this.userService.logout();
    this.ngOnInit();
  }

  ngOnDestroy(){
    this.authListenerSubs.unsubscribe();
  }

}
