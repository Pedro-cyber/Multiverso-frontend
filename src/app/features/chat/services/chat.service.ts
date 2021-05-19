import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Subject} from 'rxjs';
import { map } from 'rxjs/operators';
import { Chat } from '../models/chat.model';
import { environment } from '../../../../environments/environment';


const BACKEND_URL = environment.apiURL + 'api/chat/';

@Injectable({
  providedIn: 'root'
})
export class ChatService {

  private chats: Chat []= [];
  private chatsUpdated = new Subject<{chats:Chat[]}>();

  constructor(private http: HttpClient) { }

  createMessageChat(chat: Chat){
    return this.http.post<{message: string, chatId: string}>(BACKEND_URL, chat);
  }

  getMessagesChat(eventId: string) {

    this.http.get<{message: string, chats: any}> (BACKEND_URL, {params: {event: eventId }})
    .pipe(map((chatData)=>{
      return { chat: chatData.chats.map(chat =>{
        return {
        id: chat._id,
        message: chat.message,
        username: chat.username.username,
        date: chat.date,
        event: chat.event
        };
      })
      };
    }))
    .subscribe((transformedChatData)=> {
      this.chats= transformedChatData.chat;
      this.chatsUpdated.next({
        chats: [...this.chats]
    });
  })
  }

  getChatsUpdateListener() {
    return this.chatsUpdated.asObservable();
  }
}
