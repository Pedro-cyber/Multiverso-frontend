import { Component, OnDestroy, OnInit } from '@angular/core';
import { Event } from '../../models/event.model';
import { PageEvent } from '@angular/material/paginator';
import { Subscription, Observable } from 'rxjs';
import { EventService } from '../../services/event.service';
import { FormControl } from '@angular/forms';
import { map, startWith } from 'rxjs/operators';
import { Router } from '@angular/router';

@Component({
  selector: 'app-event-list',
  templateUrl: './event-list.component.html',
  styleUrls: ['./event-list.component.css']
})
export class EventListComponent implements OnInit, OnDestroy {

  public events: Event[]=[];
  public popularEvents: any;
  public isLoading= false;
  public totalEvents= 40;
  public eventsPerPage= 10;
  public currentPage= 1;
  public pageSizeOptions= [10, 14, 18];

  public searchGame = '';
  public searchPlatform = new FormControl('');
  public optionsPlatform = ['PC', 'Playstation', 'Xbox', 'Nintendo', 'Crossplay', 'Android', 'iOS'];
  public filteredPlatformOptions: Observable<string[]>;
  public searchGenre = new FormControl('');
  public optionsGenre = ["Action", "Shooter", "Arcade", "Strategy", "MMORPG", "Adventure", "RPG", "Sports", "Puzzle", "Fighting", "Card", "Casual", "Indie"]
  public filteredGenreOptions: Observable<string[]>;

  private eventsSub: Subscription;

  constructor( public eventService: EventService,
              public router: Router ) { }

  ngOnInit(): void {
    this.isLoading = true;
    this.eventService.getEvents(this.eventsPerPage, this.currentPage, this.searchGame, this.searchPlatform.value, this.searchGenre.value );
    this.eventsSub= this.eventService.getEventsUpdateListener()
    .subscribe((eventData: {events: Event[], eventCount: number})=> {
      this.isLoading= false;
      this.totalEvents = eventData.eventCount;
      this.events = eventData.events;
    });
    this.eventService.findPopularEvents().subscribe( (events) =>  {
      this.popularEvents = events;
    });

    this.filteredPlatformOptions = this.searchPlatform.valueChanges
      .pipe(
        startWith(''),
        map(value => this._filterPlatform(value))
      );
    this.filteredGenreOptions = this.searchGenre.valueChanges
      .pipe(
        startWith(''),
        map(value => this._filterGenre(value))
      );
  }

  private _filterPlatform(value: string): string[] {
    const filterValue = value.toLowerCase();
    return this.optionsPlatform.filter(option => option.toLowerCase().includes(filterValue));
  }

  private _filterGenre(value: string): string[] {
    const filterValue = value.toLowerCase();
    return this.optionsGenre.filter(option => option.toLowerCase().includes(filterValue));
  }

  onChangedPage (pageData: PageEvent) {
    this.isLoading= true;
    this.currentPage= pageData.pageIndex + 1;
    this.eventsPerPage= pageData.pageSize;
    this.eventService.getEvents(this.eventsPerPage, this.currentPage,this.searchGame, this.searchPlatform.value, this.searchGenre.value);
  }

  search (){
    this.eventService.getEvents(this.eventsPerPage, this.currentPage, this.searchGame, this.searchPlatform.value, this.searchGenre.value);
  }

  eventDetails (id: string){
    this.router.navigateByUrl(`events/events/${id}`);
  }

  toggleList() {
    document.getElementById("list").style.display = 'block';
    document.getElementById("cards").style.display = 'none';
  }

  toggleCards(){
    document.getElementById("list").style.display = 'none';
    document.getElementById("cards").style.display = 'flex';
  }

  ngOnDestroy() {
    this.eventsSub.unsubscribe();
  }

}
