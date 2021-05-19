import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { UserService } from './features/user/services/user.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

  constructor (private userService: UserService){}

  ngOnInit() {
    this.userService.autoAuthUser();
  }

}
