import { Component, OnInit, ViewChild, NgZone } from '@angular/core';
import { UserService } from 'src/app/features/user/services/user.service';
import { ActivatedRoute } from '@angular/router';
import { User } from '../../models/user.model';
import { FormControl, FormGroup, FormBuilder } from '@angular/forms';
import { EventService } from 'src/app/features/events/services/event.service';
import { CdkTextareaAutosize } from '@angular/cdk/text-field';
import { take } from 'rxjs/operators';


@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  public userId: string;
  public userDetailId: string;
  public user: User = new User();

  public favouritePlatform: FormControl;
  public favouritePlatformUsername: FormControl;
  public favouritesGenres: FormControl;
  public favouritesGames: FormControl;
  public aboutMe: FormControl;
  public avatar: FormControl;
  public profileForm: FormGroup;

  public message: string;
  public createdEvents: number;
  public playerEvents: number;

  public platformList: string[] = ['PC', 'Playstation', 'Xbox', 'Nintendo', 'Crossplay', 'Android', 'iOS'];

  constructor(private userService: UserService,
              private eventService: EventService,
              private formBuilder: FormBuilder,
              private route: ActivatedRoute,
              private _ngZone: NgZone) { }

  @ViewChild('autosize', {static: false}) autosize: CdkTextareaAutosize;

  triggerResize() {
    this._ngZone.onStable.pipe(take(1))
        .subscribe(() => this.autosize.resizeToFitContent(true));
  }

  ngOnInit(): void {

    this.userDetailId = this.route.snapshot.paramMap.get('id');
    if(this.userDetailId ){
      this.getProfileUser(this.userDetailId);
    } else {
      this.userId = this.userService.getUserId();
      this.getProfileUser(this.userId)
    }

    this.favouritePlatform = new FormControl({value: '', disabled: this.userDetailId});
    this.favouritePlatformUsername = new FormControl({value: '', disabled: this.userDetailId});
    this.favouritesGenres = new FormControl({value: '', disabled: this.userDetailId});
    this.favouritesGames = new FormControl({value: '', disabled: this.userDetailId});
    this.aboutMe = new FormControl({value: '', disabled: this.userDetailId});
    this.avatar = new FormControl({value: '', disabled: this.userDetailId});

    this.profileForm = this.formBuilder.group(
      {
        favouritePlatform: this.favouritePlatform,
        favouritePlatformUsername: this.favouritePlatformUsername,
        favouritesGenres: this.favouritesGenres,
        favouritesGames: this.favouritesGames,
        aboutMe: this.aboutMe,
        avatar: this.avatar
      });
  }

  getProfileUser(id:string){
    this.userService.getProfile(id).subscribe ( userData => {
      this.user = {
        id: userData._id,
        username: userData.username,
        avatar: userData.avatar,
        email: userData.email,
        password: userData.password,
        favouritePlatform:  userData.favouritePlatform,
        favouritePlatformUsername: userData.favouritePlatformUsername,
        favouritesGames: userData.favouritesGames,
        favouritesGenres: userData.favouritesGenres,
        aboutMe: userData.aboutMe
      }
      this.profileForm.setValue({
        favouritePlatform: this.user.favouritePlatform,
        favouritePlatformUsername: this.user.favouritePlatformUsername,
        favouritesGenres: this.user.favouritesGenres,
        favouritesGames: this.user.favouritesGames,
        aboutMe: this.user.aboutMe,
        avatar: this.user.avatar
      });
      this.eventService.findEventsByCreator(this.user.id).subscribe((events)=> {
        this.createdEvents= Object.keys(events).length;
      });
      this.eventService.findEventsByPlayer(this.user.id).subscribe((events)=> {
        this.playerEvents=Object.keys(events).length;
      });
    });
  }

  updateProfile(){
    this.user.favouritePlatform = this.favouritePlatform.value;
    this.user.favouritePlatformUsername = this.favouritePlatformUsername.value;
    this.user.favouritesGenres = this.favouritesGenres.value;
    this.user.favouritesGames = this.favouritesGames.value;
    this.user.aboutMe = this.aboutMe.value;
    this.user.avatar = this.avatar.value;

    this.userService.updateProfile(this.user.id, this.user);
    this.message= 'Perfil actualizado correctamente'
  }
}
