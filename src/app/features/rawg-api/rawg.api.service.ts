
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class RawgApiService {
  APIkey="870d675c17a4470d8a121526933275dc";

  constructor(){}

  async getInfoGames(game:string){
  const url = `https://api.rawg.io/api/games/${game}?key=`+ this.APIkey;
  const urlGames= await fetch(url);
  const resultado = await urlGames.json();
  return {resultado}
  }

}
