import { Component, OnInit, Input, OnDestroy, ViewChild, NgZone } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { Subscription } from 'rxjs';
import { UserService } from 'src/app/features/user/services/user.service';
import { Chat } from '../../models/chat.model';
import { ChatService } from '../../services/chat.service';
import { CdkTextareaAutosize } from '@angular/cdk/text-field';
import { take } from 'rxjs/operators';
import { io } from 'node_modules/socket.io/client-dist/socket.io.js';
import { environment } from '../../../../../environments/environment';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css']
})
export class ChatComponent implements OnInit, OnDestroy {

  public chat: Chat = new Chat();
  public chats: Chat[]=[];
  public message: FormControl;
  public chatForm: FormGroup;
  public username: string;
  public avatar: string;

  private chatsSub: Subscription;

  @Input() eventId: string;
  @Input() userId: string;
  @Input() isSignedUp: boolean;

  constructor(private formBuilder: FormBuilder,
              private chatService: ChatService,
              private userService: UserService,
              private _ngZone: NgZone) {
              }

  @ViewChild('autosize', {static: false}) autosize: CdkTextareaAutosize;

  triggerResize() {
    this._ngZone.onStable.pipe(take(1))
        .subscribe(() => this.autosize.resizeToFitContent(true));
  }

  ngOnInit(): void {

    var socket = io(environment.apiURL);

    socket.removeAllListeners();

    socket.on('chat message', ( (message) => {
      if(message.operationType == 'insert'){
      this.chatService.getMessagesChat(this.eventId);
      }
    }));

    this.chatService.getMessagesChat(this.eventId);
    this.chatsSub= this.chatService.getChatsUpdateListener()
    .subscribe((chatData: {chats: Chat[]})=> {
      this.chats = chatData.chats.reverse();
    });

    this.userService.getProfile(this.userId).subscribe ( userData => {
    this.username= userData.username;
    });

    this.message = new FormControl('', [Validators.required]);
    this.chatForm = this.formBuilder.group(
      {
        message: this.message
      });
  }

  sendMessage(){

    this.chat.username = this.userId;
    this.chat.event = this.eventId;
    this.chat.message = this.message.value;

    const now= new Date();
    var offset= (new Date()).getTimezoneOffset() * 60000;
    var date= (new Date(now.getTime() - offset)).toISOString().replace('T', ' ').slice(5,-8);
    this.chat.date = date;

    this.chatService.createMessageChat(this.chat).subscribe( (response)=> {
      this.chatForm.reset();
    });
  }

  ngOnDestroy() {
    this.chatsSub.unsubscribe();
  }

}
