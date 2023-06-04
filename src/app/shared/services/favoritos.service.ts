import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FavoritosService {
  public favoritesArr!: string[];
  readonly favorites = new Subject<any>();
  public favorites$ = this.favorites.asObservable();

  constructor() {
    const favoritosStr = localStorage.getItem('favoritos');
    if (favoritosStr) {
      this.favoritesArr = JSON.parse(favoritosStr);
    }else{
      this.favoritesArr = [];
    }
  }

  public getFavoritos() {
    this.favorites.next(this.favoritesArr);
  }
  public onFavorite(item: any): void {
    this.favoritesArr.indexOf(item) === -1 ? this.favoritesArr.push(item) : this.favoritesArr.splice(this.favoritesArr.indexOf(item),1);
    localStorage.setItem('favoritos', JSON.stringify(this.favoritesArr));
    this.favorites.next(this.favoritesArr);
  }
}
