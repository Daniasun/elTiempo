import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { AppComponent } from './app.component';
import { WeatherService } from './pages/weather/services/weather.service';
import { HttpClientModule } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of, take } from 'rxjs';
import { Coord, WeatherData } from './shared/interfaces/weather.interface';
import { GeoLocationService } from './shared/services/geo-location.service';
import { FormControl } from '@angular/forms';
import { ConnectionState } from 'ng-connection-service';
import { SearchComponent } from './components/search/search.component';
import { WeatherComponent } from './pages/weather/weather.component';

describe('AppComponent', () => {
  let component: AppComponent;
  let fixture: ComponentFixture<AppComponent>;
  let weatherServiceSpy: jasmine.SpyObj<WeatherService>;
  let geoLocationServiceSpy: jasmine.SpyObj<GeoLocationService>;

  const coords: Coord = { latitude: 43.36, longitude: -3.01 }
  const weatherData: WeatherData = {
    current: {
      temp_c: 21,
      condition: {
        text: "Overcast",
        icon: "//cdn.weatherapi.com/weather/64x64/night/122.png",
        code: 1009
      },
      humidity: 88,
    },
    forecast: {
      forecastday: [
          {
            date: "2023-06-03",
            day: {
              maxtemp_c: 25.8,
              mintemp_c: 15.7,
              condition: {
                text: "Sunny",
                icon: "//cdn.weatherapi.com/weather/64x64/day/113.png",
                code: 1000
              }
            }
          },
          {
            date: "2023-06-04",
            day: {
              maxtemp_c: 25.8,
              mintemp_c: 15.7,
              condition: {
                text: "Sunny",
                icon: "//cdn.weatherapi.com/weather/64x64/day/113.png",
                code: 1000
              }
            }
          },{
            date: "2023-06-05",
            day: {
              maxtemp_c: 25.8,
              mintemp_c: 15.7,
              condition: {
                text: "Sunny",
                icon: "//cdn.weatherapi.com/weather/64x64/day/113.png",
                code: 1000
              }
            }
          },{
            date: "2023-06-06",
            day: {
              maxtemp_c: 25.8,
              mintemp_c: 15.7,
              condition: {
                text: "Sunny",
                icon: "//cdn.weatherapi.com/weather/64x64/day/113.png",
                code: 1000
              }
            }
          },
      ]
    },
    location: {
      name: 'Bilbao',
    }
  }

  beforeEach(async () => {
    const weatherSpy = jasmine.createSpyObj('WeatherService', ['getForecastByName', 'getForecastByCoords']);
    const geoLocationSpy = jasmine.createSpyObj('GeoLocationService', ['getCurrentPosition']);

    await TestBed.configureTestingModule({
      imports: [
        RouterTestingModule,
        HttpClientModule,
        HttpClientTestingModule,
      ],
      declarations: [
        AppComponent, SearchComponent, WeatherComponent
      ],
      providers: [
        { provide: WeatherService, useValue: weatherSpy },
        { provide: GeoLocationService, useValue: geoLocationSpy }
      ]
    }).compileComponents();
    weatherServiceSpy = TestBed.inject(WeatherService) as jasmine.SpyObj<WeatherService>;
    geoLocationServiceSpy = TestBed.inject(GeoLocationService) as jasmine.SpyObj<GeoLocationService>;
    fixture = TestBed.createComponent(AppComponent);
    component = fixture.componentInstance;
    component.city = new FormControl('Madrid');
    component.search = TestBed.createComponent(SearchComponent).componentInstance;
    component.weather = TestBed.createComponent(WeatherComponent).componentInstance;
    fixture.detectChanges();
  });

  beforeEach(() => {
    component.weather = TestBed.createComponent(WeatherComponent).componentInstance;
    component.weather.weather = weatherData;
    component.weather$ = of(weatherData);
    component.city = new FormControl('Madrid');
  });

  it('Crear la app El tiempo', () => {
    expect(component).toBeTruthy();
  });

  it('establece isConnected en false y llamar a getCachedForecast cuando no se disponga de conexión a Internet o a la red', () => {
    const connState = {
      hasInternetAccess: false,
      hasNetworkConnection: false
    };
    spyOn(component.connectionService,'monitor').and.returnValue(of(connState));
    spyOn(component, 'getCachedForecast');
    component.ngOnInit();
    expect(component.isConnected).toBeFalse();
    expect(component.getCachedForecast).toHaveBeenCalled();
  });

  it('llama a navLocation cuando internet y la conexión de red están disponibles', () => {
    const connState = {
      hasInternetAccess: true,
      hasNetworkConnection: true
    };
    spyOn(component.connectionService,'monitor').and.returnValue(of(connState));
    spyOn(component, 'navLocation');
    component.ngOnInit();
    expect(component.navLocation).toHaveBeenCalled();
  });

  it('llama a navLocation cuando la longitud de la ciudad sea inferior a 3', () => {
    const city = 'NY';
    spyOn(component, 'navLocation');
    component.weather$ = of(weatherData);
    component.onSearch(city);
    expect(component.navLocation).toHaveBeenCalled();
  });

  it('llama a weatherSvc.getForecastByName cuando la ciudad es diferente del nombre de la ubicación meteorológica actual', () => {
    const city = 'London';
    component.weather$ = of(weatherData);
    const getForecastByNameSpy = weatherServiceSpy.getForecastByName.and.returnValue(of(weatherData));
    component.onSearch(city);
    expect(getForecastByNameSpy).toHaveBeenCalledWith(city);
  });

  it('establece el valor del FormControl city con el nombre de la ubicación meteorológica actual', () => {
    const city = 'Bilbao';
    component.weather$ = of(weatherData);
    component.onSearch(city);
    expect(component.city.value).toEqual('Bilbao');
  });

  it('llama a getCachedForecast cuando no esté conectado a Internet', () => {
    component.isConnected = false;
    const city = 'London';
    spyOn(component, 'getCachedForecast');
    component.onSearch(city);
    expect(component.getCachedForecast).toHaveBeenCalledWith(city);
  });


  it('establece weather$ en la previsión almacenada en caché cuando se especifica la ciudad', () => {
    const city = 'London';
    spyOn(localStorage, 'getItem').and.returnValue(JSON.stringify([weatherData, {current: undefined,forecast: undefined, location: {name: "otra"}}]));
    const setValueSpy = spyOn(component.city, 'setValue');
    component.getCachedForecast(city);
    expect(setValueSpy).toHaveBeenCalledWith('Bilbao');
  });

  it('establecer weather$ en la primera posicion de los datos de cache cuando no se especifica la ciudad', () => {
    spyOn(localStorage, 'getItem').and.returnValue(JSON.stringify([weatherData, {current: undefined,forecast: undefined, location: {name: "otra"}}]));
    component.getCachedForecast();
    let actualWeatherData: any;
    component.weather$.pipe(take(1)).subscribe((data: any) => {
      actualWeatherData = data;
    });
    expect(actualWeatherData).toEqual(weatherData);
  });





  it('Llama a getLocation() si navigator.geolocation esta disponible', () => {
    spyOnProperty(window.navigator, 'geolocation', 'get').and.returnValue({
      getCurrentPosition: jasmine.createSpy('getCurrentPosition').and.callFake((successCallback) => {
        successCallback({coords});
      }),
      // tslint:disable-next-line:no-empty
      clearWatch: () => {},
      watchPosition: (): number => { return 1 }
    });
    spyOn(component, 'getLocation');
    component.navLocation();
    expect(component.getLocation).toHaveBeenCalled();
  });

  it('llama a weatherSvc.getForecastByCoords() cuando se llama a getLocation()', async () => {
    const currentPosition = { coords: { latitude: 123, longitude: 456 } };
    geoLocationServiceSpy.getCurrentPosition.and.returnValue(Promise.resolve(currentPosition));
    weatherServiceSpy.getForecastByCoords.and.returnValue(of(weatherData));
    await component.getLocation();
    expect(geoLocationServiceSpy.getCurrentPosition).toHaveBeenCalled();
    expect(weatherServiceSpy.getForecastByCoords).toHaveBeenCalledWith(currentPosition.coords);
  });

  it('llama a getCurrentPosition y getForecastByCoords', async () => {
    const currentPosition = { coords: { latitude: 123, longitude: 456 } };
    geoLocationServiceSpy.getCurrentPosition.and.returnValue(Promise.resolve(currentPosition));
    weatherServiceSpy.getForecastByCoords.and.returnValue(of(weatherData));
    await component.getLocation();
    expect(geoLocationServiceSpy.getCurrentPosition).toHaveBeenCalled();
    expect(weatherServiceSpy.getForecastByCoords).toHaveBeenCalledWith(currentPosition.coords);
    component.weather$.subscribe((data) => {
      expect(data).toEqual(weatherData);
    });
  });

  it('lanzar un error si se produce una excepción', async () => {
    const errorMessage = 'Error message';
    geoLocationServiceSpy.getCurrentPosition.and.throwError(errorMessage);
    try {
      await component.getLocation();
    } catch (error: any) {
      expect(error.message).toBe(errorMessage);
    }
  });
  it('activar el input de búsqueda cuando esté conectado a Internet', () => {
    const connState: ConnectionState = {
      hasNetworkConnection: true,
      hasInternetAccess: true
    }
    spyOn(component.connectionService,'monitor').and.returnValue(of(connState));
    component.ngOnInit();
    expect(component.search.inputSearch.disabled).toBe(false);
    expect(component.connectionService.monitor).toHaveBeenCalled();
  });
});
