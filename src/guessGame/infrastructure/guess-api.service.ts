import { inject, Injectable } from '@angular/core';
import { forkJoin, map, Observable } from 'rxjs';
import { ApiDictionaryContent } from '../../dictionary/infrastructure/models/dictionary-api.model';
import { GuessLocalGame } from './guess-api.interface';
import { GuessApiGame, GuessLevel, GuessPVP } from './models/guess-api.model';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment.development';

@Injectable({
  providedIn: 'root',
})
export class GuessApiService implements GuessLocalGame {
  private _httpClient = inject(HttpClient);
  private URL_DICTIONARY = environment.URL_DICTIONARY;
  private URL_GUESS_LOCAL = environment.URL_GUESS_LOCAL;
  private URL_GUESS_PVP = environment.URL_GUESS_PVP;

  getAllContent(level:number): Observable<ApiDictionaryContent[]> {
    // Devuelve todas las palabras del diccionario de todas las categorías
    let category = '';
    switch (level) {
      case 1:
        category = 'Abecedario'
        break;
      case 2:
        category = 'Numeros'
        break;
      case 3:
        category = 'Colores'
        break;
      case 4:
        category = 'Frutas-Verduras'
        break;
      case 5:
        category = 'Fechas'
        break;
    
      default:
        break;
    }

    return this._httpClient.get<ApiDictionaryContent[]>(`${this.URL_DICTIONARY}/${category}`);
  }
  // getAllContent(): Observable<ApiDictionaryContent[]> {
  //   // Devuelve todas las palabras del diccionario de todas las categorías
  //   const categoriy = [
  //     'Abecedario',
  //     'Numeros',
  //     'Colores',
  //     'Frutas-Verduras',
  //     'Fechas',
  //   ];
  //   const requests = categories.map((category) =>
  //     this._httpClient.get<ApiDictionaryContent[]>(
  //       `${this.URL_DICTIONARY}/${category}`
  //     )
  //   );

  //   return forkJoin(requests).pipe(map((responses) => responses.flat()));
  // }

  getUserPoints(id: string): Observable<GuessApiGame> {
    return this._httpClient.get<GuessApiGame>(`${this.URL_GUESS_LOCAL}/${id}`);
  }
  
  getLevels(id: string): Observable<GuessLevel[]>{
    return this._httpClient.get<GuessLevel[]>(`${this.URL_GUESS_LOCAL}/level/${id}`)
  }

  updateUserPoints(data: GuessApiGame): Observable<GuessApiGame> {
    return this._httpClient.patch<GuessApiGame>(
      `${this.URL_GUESS_LOCAL}/update`,
      data
    );
  }

  updatePVPVictorys(data: GuessPVP): Observable<GuessPVP> {
    return this._httpClient.patch<GuessPVP>(`${this.URL_GUESS_PVP}/update`,data);
  }

}
