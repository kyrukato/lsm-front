import { inject, Injectable } from '@angular/core';
import { MemoryApiGame, MemoryLevel } from './models/memory-api.model';
import { forkJoin, map, Observable } from 'rxjs';
import { MemoryLocalGame } from './memory-api.interface';
import { HttpClient } from '@angular/common/http';
import { ApiDictionaryContent } from '../../dictionary/infrastructure/models/dictionary-api.model';
import { environment } from '../../environments/environment.development';

@Injectable({
  providedIn: 'root',
})
export class MemoryApiService implements MemoryLocalGame {
  private _httpClient = inject(HttpClient);
  private URL_DICTIONARY = environment.URL_DICTIONARY;
  private URL_MEMORY_LOCAL = environment.URL_MEMORY_LOCAL;

  getAllContent(level:number): Observable<ApiDictionaryContent[]> {
    // Devuelve todas las palabras del diccionario de todas las categorías
    let category = ''
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
    console.log('level: ',level, ' Categoría: ',category)
    return this._httpClient.get<ApiDictionaryContent[]>(
        `${this.URL_DICTIONARY}/${category}`);
  }

  getUserPoints(id: string): Observable<MemoryApiGame> {
    return this._httpClient.get<MemoryApiGame>(
      `${this.URL_MEMORY_LOCAL}/${id}`
    );
  }
  getLevels(id:string): Observable<MemoryLevel[]>{
    return this._httpClient.get<MemoryLevel[]>(`${this.URL_MEMORY_LOCAL}/level/${id}`);
  }
  updateUserPoints(data: MemoryApiGame): Observable<MemoryApiGame> {
    return this._httpClient.patch<MemoryApiGame>(
      `${this.URL_MEMORY_LOCAL}/update`,
      data
    );
  }
  compareWords(word: string, wordToCompare: string): boolean {
    return word === wordToCompare;
  }
}
