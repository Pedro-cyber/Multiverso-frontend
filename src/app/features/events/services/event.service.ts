import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Subject} from 'rxjs';
import { map } from 'rxjs/operators';
import { Event } from '../models/event.model';
import { environment } from '../../../../environments/environment';

const BACKEND_URL = environment.apiURL + 'api/events/';

@Injectable({
  providedIn: 'root'
})
export class EventService {
  private events: Event[] = [];
  private eventsUpdated = new Subject<{events:Event[], eventCount: number}>();

  constructor(private http: HttpClient, private router: Router) { }

  createEvent(event: Event){
    return this.http.post<{message: string, eventId: string}>(BACKEND_URL, event)
    .subscribe( (response)=> {
      this.router.navigate([`events/${response.eventId}`]);
    });
  }

  getEvents(eventsPerPage: number, currentPage: number, searchGame: string, searchPlatform: string, searchGenre: string) {
    const queryParams= `?pagesize=${eventsPerPage}&page=${currentPage}`;
    this.http.get<{message: string, events: any, maxEvents: number}> (BACKEND_URL+ queryParams, {params: {game: searchGame, platform: searchPlatform, genre: searchGenre}} )
    .pipe(map((eventData)=>{
      return { events: eventData.events.map(event =>{
        return {
        id: event._id,
        title: event.title,
        game: event.game,
        platform: event.platform,
        genre: event.genre,
        description: event.description,
        connectionData: event.connectionData,
        date: event.date,
        numberPlayersMax: event.numberPlayersMax,
        image: event.image,
        creator: event.creator,
        players: event.players,
        popular: event.popular
        };
      }), maxEvents: eventData.maxEvents
      };
    }))
    .subscribe((transformedEventData)=> {
      this.events= transformedEventData.events;
      this.eventsUpdated.next({
        events: [...this.events],
        eventCount: transformedEventData.maxEvents});
    });
  }

  getEventById(id: string){
    return this.http.get<({_id: string, title: string, game: string, platform: string, genre: string, description: string, connectionData: string, numberPlayersMax: number, date: string, image: string, creator: {username: string, _id: string}, players: {username: string, avatar: string, _id: string}[], popular: boolean })> (BACKEND_URL + id);
  }

  getEventsUpdateListener() {
    return this.eventsUpdated.asObservable();
  }

  updateEvent (event: Event) {
    return this.http.put(BACKEND_URL + event.id, event).subscribe(response => {
      this.router.navigate(["/myevents"]);
    });
  }

  deleteEventById(id: string){
    return this.http.delete(BACKEND_URL + id );
  }

  updatePlayers (id: string, players: string []){
    return this.http.patch(BACKEND_URL + id, players);
  }

  findEventsByCreator (id: string) {
    return this.http.get<{events: Event}>(BACKEND_URL + 'searchcreator/' + id)
  }

  findEventsByPlayer (id: string) {
    return this.http.get<{events: Event}>(BACKEND_URL + 'searchplayer/' + id)
  }

  findPopularEvents (){
    return this.http.get<{events: Event}>(BACKEND_URL + 'popular/true')
  }

}
