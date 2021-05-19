import { Component, OnInit,  ViewChild, NgZone } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { RawgApiService } from 'src/app/features/rawg-api/rawg.api.service';
import { UserService } from 'src/app/features/user/services/user.service';
import { Event } from '../../models/event.model';
import { EventService } from '../../services/event.service';
import { MatDialog } from "@angular/material/dialog";
import { ErrorComponent } from 'src/app/core/components/error/error.component';
import { ActivatedRoute } from '@angular/router';
import { CdkTextareaAutosize } from '@angular/cdk/text-field';
import { take } from 'rxjs/operators';


@Component({
  selector: 'app-new-event',
  templateUrl: './new-event.component.html',
  styleUrls: ['./new-event.component.css']
})
export class NewEventComponent implements OnInit {

  public event: Event = new Event();
  public title: FormControl;
  public game: FormControl;
  public platform: FormControl;
  public description: FormControl;
  public connectionData: FormControl;
  public date: FormControl;
  public numberPlayersMax: FormControl;

  public newEventForm: FormGroup;
  public eventId: string;
  public editMode: boolean = false;

  public isLoading = false;

  constructor(  private formBuilder: FormBuilder,
                private userService: UserService,
                private eventService: EventService,
                private RawgApiService: RawgApiService,
                private route: ActivatedRoute,
                private dialog: MatDialog,
                private _ngZone: NgZone
    ) { }
    @ViewChild('autosize', {static: false}) autosize: CdkTextareaAutosize;

  triggerResize() {
    this._ngZone.onStable.pipe(take(1))
        .subscribe(() => this.autosize.resizeToFitContent(true));
  }

  ngOnInit(): void {

    this.title = new FormControl('', [
      Validators.required,
      Validators.minLength(5),
      Validators.maxLength(34)
    ]);

    this.game = new FormControl('', [
      Validators.required
    ]);

    this.platform = new FormControl('', [
      Validators.required
    ]);

    this.description = new FormControl('');
    this.connectionData = new FormControl('');

    this.numberPlayersMax = new FormControl('', [
      Validators.required, Validators.min(2), Validators.max(100)
    ]);

    this.date = new FormControl('', [
      Validators.required
    ]);

    this.newEventForm = this.formBuilder.group(
      {
        title: this.title,
        game: this.game,
        platform: this.platform,
        description: this.description,
        connectionData: this.connectionData,
        numberPlayersMax: this.numberPlayersMax,
        date: this.date
      });

      this.eventId = this.route.snapshot.paramMap.get('id');
      if(this.eventId){
        this.editMode = true;
        this.getEvent(this.eventId);
      }
    }

  getEvent(id: string){
    this.eventService.getEventById(id).subscribe( eventData => {
      this.event= {
        id: eventData._id,
        title: eventData.title,
        game: eventData.game,
        platform: eventData.platform,
        genre: eventData.genre,
        description: eventData.description,
        connectionData: eventData.connectionData,
        date: eventData.date,
        numberPlayersMax: eventData.numberPlayersMax,
        image: eventData.image,
        creator: eventData.creator.username,
        popular: eventData.popular,
        players: eventData.players.map( (player)=> {
            return player._id
        })
      }

      var date = new Date(this.event.date);

      this.newEventForm.setValue({
        title: this.event.title,
        game: this.event.game,
        platform: this.event.platform,
        description: this.event.description,
        connectionData: this.event.connectionData,
        numberPlayersMax: this.event.numberPlayersMax,
        date: date,
      })
    });
  }

  newEventOrUpdate() {

    //Information from form
    this.event.title = this.title.value;
    this.event.platform = this.platform.value;
    this.event.description = this.description.value;
    this.event.connectionData = this.connectionData.value;
    this.event.numberPlayersMax = this.numberPlayersMax.value;

    //Transform date from form
    var offset= (new Date()).getTimezoneOffset() * 60000;
    var date= (new Date(this.date.value - offset)).toISOString().replace('T', ' ').slice(0,-8);
    this.event.date= date;

    //Get creator userId
    this.event.creator= this.userService.getUserId();

    //Init players array and popular boolean
    if(this.editMode == false){
    this.event.players= new Array();
    this.event.players.push(this.event.creator);
    this.event.popular = false;
      }

    //Handling information from RAWG API
    let gameSlug = this.game.value;
    gameSlug= gameSlug.replace(/\s/g, '-').replace(':','').toLowerCase();
    this.getInfoFromRawg(gameSlug);
  }

  getInfoFromRawg (gameSlug: string) {
    this.RawgApiService.getInfoGames(gameSlug).then( (data) => {
      if(data.resultado.redirect == true){
        this.getInfoFromRawg(data.resultado.slug)
      } else {
      this.event.game = data.resultado.name;
      if(data.resultado.genres.length > 1){
        this.event.genre = data.resultado.genres[1].name;
      }else {
      this.event.genre = data.resultado.genres[0].name;
      }
      this.event.image = data.resultado.background_image;
      if(this.editMode){
        this.event.id = this.eventId;
        this.eventService.updateEvent(this.event);
      }else {
      this.eventService.createEvent(this.event);
      }
    }
    }).catch((error)=> this.dialog.open(ErrorComponent, {data: {message: "Juego no encontrado"}}))
  }
}
