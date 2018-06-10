import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';

import { Card } from '../shared/models/card.model';

@Injectable()
export class CardService {

  constructor(private http: HttpClient) { }

  getCards(): Observable<Card[]> {
    return this.http.get<Card[]>('/api/cards');
  }

  countCards(): Observable<number> {
    return this.http.get<number>('/api/cards/count');
  }

  addCard(card: Card): Observable<Card> {
    return this.http.post<Card>('/api/card', card);
  }

  getCard(card: Card): Observable<Card> {
    return this.http.get<Card>(`/api/card/${card._id}`);
  }

  editCard(card: Card): Observable<string> {
    return this.http.put(`/api/card/${card._id}`, card, { responseType: 'text' });
  }

  deleteCard(card: Card): Observable<string> {
    return this.http.delete(`/api/card/${card._id}`, { responseType: 'text' });
  }

}
