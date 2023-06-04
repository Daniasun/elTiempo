import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WeatherComponent } from './weather.component';
import { FormControl } from '@angular/forms';
import { FavoritosService } from '@app/shared/services/favoritos.service';
import { HttpClientModule } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('WeatherComponent', () => {
  let component: WeatherComponent;
  let fixture: ComponentFixture<WeatherComponent>;
  let favoritosService: FavoritosService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ WeatherComponent ],
      imports: [
        HttpClientModule,
        HttpClientTestingModule
      ],
      providers: [FavoritosService]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(WeatherComponent);
    component = fixture.componentInstance;
    favoritosService = TestBed.inject(FavoritosService);
    component.city = new FormControl('Madrid');
    component.weather = {
      current: {
        "temp_c": 24,
        "condition": {
            "text": "Partly cloudy",
            "icon": "//cdn.weatherapi.com/weather/64x64/day/116.png",
            "code": 1003
        },
        "humidity": 57
    },
      forecast: {
        forecastday: [
          {
            date: "2023-06-01",
            day: {
              "maxtemp_c": 22.4,
              "mintemp_c": 13.7,
              "condition": {
                "text": "Patchy rain possible",
                "icon": "//cdn.weatherapi.com/weather/64x64/day/176.png",
                "code": 1063
              }
            }
          },
          {
            date: "2023-06-02",
            day: {
              "maxtemp_c": 22.4,
              "mintemp_c": 13.7,
              "condition": {
                "text": "Patchy rain possible",
                "icon": "//cdn.weatherapi.com/weather/64x64/day/176.png",
                "code": 1063
              }
            }
          },
          {
            date: "2023-06-03",
            day: {
              "maxtemp_c": 22.4,
              "mintemp_c": 13.7,
              "condition": {
                "text": "Patchy rain possible",
                "icon": "//cdn.weatherapi.com/weather/64x64/day/176.png",
                "code": 1063
              }
            }
          },
          {
            date: "2023-06-04",
            day: {
              "maxtemp_c": 22.4,
              "mintemp_c": 13.7,
              "condition": {
                "text": "Patchy rain possible",
                "icon": "//cdn.weatherapi.com/weather/64x64/day/176.png",
                "code": 1063
              }
            }
          }
        ]
      },
      location: { name: "Bilbao"}
    };
    fixture.detectChanges();
  });

  it('crea el componente WeatherComponent', () => {
    expect(component).toBeTruthy();
  });

  it('emite el valor de la ciudad al pulsar el botón', () => {
    const mockCity = 'London';
    const cityControl = new FormControl();
    component.city = cityControl;
    spyOn(component.cambio, 'emit');
    fixture.detectChanges();
    const button = fixture.nativeElement.querySelector('#otra');
    cityControl.setValue(mockCity);
    button.click();
    expect(component.cambio.emit).toHaveBeenCalledWith(mockCity);
  });

  it('borra el valor de la ciudad si coincide con el nombre de la ubicación meteorológica al pulsar el botón', () => {
    const mockCity = 'Bilbao';
    const cityControl = new FormControl(mockCity);
    component.city = cityControl;
    spyOn(component.cambio, 'emit');
    fixture.detectChanges();
    component.onClick();
    expect(cityControl.value).toEqual('Bilbao');
    expect(component.cambio.emit).toHaveBeenCalledWith('Bilbao');
  });

  it('emite el valor seleccionado al llamar a selFavorito', () => {
    spyOn(component.cambio, 'emit');
    const value = 'favorito';
    component.selFavorito(value);
    expect(component.cambio.emit).toHaveBeenCalledWith(value);
  });

  it('llama al método onFavorite de FavoritosService al llamar a onFavorite', () => {
    spyOn(favoritosService, 'onFavorite');
    const favorito = 'favorito';
    component.onFavorite(favorito);
    expect(favoritosService.onFavorite).toHaveBeenCalledWith(favorito);
  });

  it('llama a favoritosService.getFavoritos() cuando localStorage está vacío', () => {
    spyOn(localStorage, 'getItem').and.returnValue(null);
    spyOn(favoritosService, 'getFavoritos');
    component.getCachedData();
    expect(localStorage.getItem).toHaveBeenCalledWith('favoritos');
    expect(favoritosService.getFavoritos).toHaveBeenCalled();
  });

  it('analiza y establece favoritos cuando favoritosStr no está vacío', () => {
    const favoritosStr = '["favorito1", "favorito2"]';
    spyOn(localStorage, 'getItem').and.returnValue(favoritosStr);
    component.getCachedData();
    expect(localStorage.getItem).toHaveBeenCalledWith('favoritos');
    expect(component.favoritos).toEqual(['favorito1', 'favorito2']);
  });

  it('llama a favFoundCheck() cuando favoritosStr no está vacío', () => {
    spyOn(localStorage, 'getItem').and.returnValue('["favorito1", "favorito2"]');
    spyOn(component, 'favFoundCheck');
    component.getCachedData();
    expect(component.favFoundCheck).toHaveBeenCalled();
  });

  it('establece favoritos en un array vacío cuando favoritosStr está vacío', () => {
    spyOn(localStorage, 'getItem').and.returnValue(null);
    component.getCachedData();
    component.favoritos = [];
    expect(localStorage.getItem).toHaveBeenCalledWith('favoritos');
    expect(component.favoritos).toEqual([]);
  });

  it('llama a favoritosService.getFavoritos() cuando favoritosStr está vacío', () => {
    spyOn(localStorage, 'getItem').and.returnValue(null);
    spyOn(favoritosService, 'getFavoritos');
    component.getCachedData();
    expect(localStorage.getItem).toHaveBeenCalledWith('favoritos');
    expect(favoritosService.getFavoritos).toHaveBeenCalled();
  });
});
