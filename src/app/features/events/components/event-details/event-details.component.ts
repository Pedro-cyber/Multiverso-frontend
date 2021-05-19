import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { UserService } from 'src/app/features/user/services/user.service';
import { Event } from '../../models/event.model';
import { EventService } from '../../services/event.service';

@Component({
  selector: 'app-event-details',
  templateUrl: './event-details.component.html',
  styleUrls: ['./event-details.component.css']
})
export class EventDetailsComponent implements OnInit, OnDestroy {
  public event: Event = new Event();
  public isLoading= false;
  public eventId: string;
  public userId: string;
  public isSignedUp: boolean;
  public count: number;
  public playerCompleteInfo: any;
  public message: string = '';
  public userIsAuthenticated: boolean = false;
  private authListenerSubs: Subscription;
  public eventComplete: boolean = false;

  constructor( private eventService: EventService,
                private userService: UserService,
                private route: ActivatedRoute,
                private router: Router) { }

  ngOnInit(): void {
    this.isLoading= true;
    this.userIsAuthenticated = this.userService.getIsAuth();
    this.userId = this.userService.getUserId();
    this.authListenerSubs = this.userService.getAuthStatusListener()
    .subscribe(isAuthenticated => {
      this.userIsAuthenticated = isAuthenticated;
    });

    this.eventId = this.route.snapshot.paramMap.get('id');
    this.getInfoEvent(this.eventId);
  }

  getInfoEvent(id: string){
    this.eventService.getEventById(id).subscribe( eventData => {
      this.event= {
        id: eventData._id,
        title: eventData.title,
        game: eventData.game,
        platform: eventData.platform,
        genre: eventData.genre,
        description: eventData.description,
        connectionData: eventData.connectionData,
        numberPlayersMax: eventData.numberPlayersMax,
        date: eventData.date,
        image: eventData.image,
        creator: eventData.creator.username,
        popular: eventData.popular,
        players: eventData.players.map( (player)=> {
            return player._id
        })
      }
      this.isLoading= false;
      this.playerCompleteInfo= eventData.players;
      this.count = this.playerCompleteInfo.length;
      this.isSignedUp = this.event.players.includes(this.userId);
      if(this.event.players.length == this.event.numberPlayersMax){
        this.eventComplete = true;
      }
    });
  }

  join(){
    this.event.players.push(this.userId);
    this.eventService.updatePlayers(this.event.id, this.event.players).subscribe((response)=>{
      this.isSignedUp = true;
      this.message = "Te has unido a la partida";
      this.getInfoEvent(this.eventId);
    });
  }

  profile(username: string){
    const userDetail= this.playerCompleteInfo.filter(player => player.username == username);
    const id= userDetail[0]._id;
    this.router.navigateByUrl(`profile/${id}`);
  }

  ngOnDestroy(){
    this.authListenerSubs.unsubscribe();
  }
}
