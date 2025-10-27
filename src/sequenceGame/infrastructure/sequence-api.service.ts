import { Injectable, inject } from '@angular/core';
import { SequenceLocalGame } from './sequence-api.interface';
import { Observable, forkJoin, map } from 'rxjs';
import { ApiDictionaryContent } from '../../dictionary/infrastructure/models/dictionary-api.model';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment.development';
import { SequenceGame, SequenceLevel } from './models/sequence-local-api.modal';

@Injectable({
  providedIn: 'root',
})
export class SequenceApiService implements SequenceLocalGame {
  private _httpClient = inject(HttpClient);
  private URL_DICTIONARY = environment.URL_DICTIONARY;
  private URL_SEQUENCE_LOCAL = environment.URL_SEQUENCE_LOCAL;

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
    return this._httpClient.get<ApiDictionaryContent[]>(
        `${this.URL_DICTIONARY}/${category}`
      );
  }
  // getAllContent(): Observable<ApiDictionaryContent[]> {
  //   // Devuelve todas las palabras del diccionario de todas las categorías
  //   const categories = [
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

  getUserPoints(id: string): Observable<SequenceGame> {
    return this._httpClient.get<SequenceGame>(
      `${this.URL_SEQUENCE_LOCAL}/${id}`
    );
  }

  getLevels(id:string): Observable<SequenceLevel[]> {
    return this._httpClient.get<SequenceLevel[]>(
      `${this.URL_SEQUENCE_LOCAL}/level/${id}`
    );
  }

  saveUserPoints(data: SequenceGame): Observable<SequenceGame> {
    return this._httpClient.patch<SequenceGame>(
      `${this.URL_SEQUENCE_LOCAL}/update`,
      data
    );
  }
}
