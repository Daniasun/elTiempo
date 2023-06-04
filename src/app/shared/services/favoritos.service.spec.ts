import { TestBed } from '@angular/core/testing';
import { FavoritosService } from './favoritos.service';

describe('FavoritosService', () => {
  let service: FavoritosService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FavoritosService);
  })

  it('crea el servicio FavoritosService', () => {
    expect(service).toBeTruthy();
  });
  it('aniade un item a favoritesArr si este no existe', () => {
    const item = 'example item';
    service.favoritesArr = [];
    service.onFavorite(item);
    expect(service.favoritesArr.includes(item)).toBe(true);
  });

  it('elimina el item de favoritesArr si existe', () => {
    const item = 'example item 2';
    service.favoritesArr = [item];
    service.onFavorite(item);
    expect(service.favoritesArr.includes(item)).toBe(false);
  });

  it('emite favoritesArr actualizado cuando onFavorite es llamado', () => {
    const item = 'example item';
    let emittedFavorites: string[] = [];
    service.favorites$.subscribe(favorites => {
      emittedFavorites = favorites;
    });
    service.onFavorite(item);
    expect(emittedFavorites).toEqual(service.favoritesArr);
  });
});
