import { Component, OnInit } from '@angular/core';
import { UserService } from 'src/app/features/user/services/user.service';
import { EventService } from '../../services/event.service';
import { Router } from '@angular/router';


@Component({
  selector: 'app-my-events',
  templateUrl: './my-events.component.html',
  styleUrls: ['./my-events.component.css']
})
export class MyEventsComponent implements OnInit {

  public createdEvents: any;
  public playerEvents: any;
  public userId: string;
  public isLoading= false;

  constructor(
    private eventService: EventService,
    private userService: UserService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.isLoading = true;
    this.userId = this.userService.getUserId();

    this.updateEventsByCreator();
    this.updateEventsByPlayer();
  }

  updateEventsByCreator(){
    this.eventService.findEventsByCreator(this.userId).subscribe((events)=> {
      this.createdEvents = events;
      this.isLoading = false;
    });
  }

  updateEventsByPlayer(){
    this.eventService.findEventsByPlayer(this.userId).subscribe((events)=> {
      this.playerEvents = events;
      this.isLoading = false;
    });
  }

  eventDetails (id: string){
    this.router.navigateByUrl(`events/events/${id}`);
  }

  cancelParticipation (id: string, players:string []){
    const index = players.indexOf(this.userId);
    if (index > -1) {
      players.splice(index, 1);
    }
    this.eventService.updatePlayers(id, players).subscribe( (response)=> {
      this.updateEventsByPlayer();
    });
  }

  editEvent (id: string){
    this.router.navigateByUrl(`events/newevent/${id}`);
  }

  deleteEvent (id: string){
    this.eventService.deleteEventById(id).subscribe( (response)=> {
      this.updateEventsByCreator();
    });
  }

}
