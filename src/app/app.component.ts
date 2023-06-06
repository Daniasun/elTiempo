import { Component, OnInit, ViewChild } from '@angular/core';
import { Observable, of, take } from 'rxjs';
import { WeatherData } from '@shared/interfaces/weather.interface';
import { WeatherService } from './pages/weather/services/weather.service';
import { GeoLocationService } from '@shared/services/geo-location.service';
import { FormControl } from '@angular/forms';
import { WeatherComponent } from './pages/weather/weather.component';
import { ConnectionService } from 'ng-connection-service';
import { SearchComponent } from './components/search/search.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit{
  @ViewChild(SearchComponent) search!: SearchComponent;
  @ViewChild(WeatherComponent) weather!: WeatherComponent;
  public weather$!: Observable<WeatherData>;
  public weatherData!: WeatherData;
  public city = new FormControl('Madrid');
  public isConnected = true;
  public loaded = false;
  public errorText = 'No se ha encontrado ningún resultado con esta búsqueda.';

  constructor(readonly weatherSvc: WeatherService,
              readonly geoLocationSvc: GeoLocationService,
              readonly connectionService: ConnectionService) {}
  ngOnInit(): void {
    this.connectionService.monitor().subscribe(isConnected => {
      if (!(isConnected.hasInternetAccess && isConnected.hasNetworkConnection)) {
        this.isConnected = false;
        this.getCachedForecast();
      }else{
        this.navLocation();
      }
    });
  }

  public navLocation(): void {
    if (navigator.geolocation) {
      this.getLocation();
    }
  }
  public recargar(): void {
    window.location.reload();
  }
  public onSearch(city: string): void {
    if(this.isConnected){
      this.weather$.pipe(take(1)).subscribe((valorActual: any) => {
        if(city.length < 3){
          this.navLocation();
        }else if(city !== this.weather.weather.location.name){
          this.weather$ = this.weatherSvc.getForecastByName(city);
        }
        this.city.setValue(valorActual.location.name);
      });
    }else {
      this.getCachedForecast(city);
    }
  }

  public async getLocation(): Promise<void> {
    try {
      const position = await this.geoLocationSvc.getCurrentPosition();
      if (position && position.coords) {
        const { coords } = position;
        this.weather$ = this.weatherSvc.getForecastByCoords(coords);
      }
    } catch (error: any) {
      this.errorText = error.message;
    }
    this.loaded = true;
  }

  public getCachedForecast(city?:string):void {
    let weatherForecast: WeatherData[] = [];
    const weatherForecastArr = localStorage.getItem('weatherForecast');
    if(weatherForecastArr){
      weatherForecast = JSON.parse(weatherForecastArr);
    }
    if (weatherForecast.length) {
      if(city){
        const index = weatherForecast.findIndex((object: WeatherData) => object.location.name === city);
        const indexOtra = weatherForecast.findIndex((object: WeatherData) => object.location.name !== city);
        this.weather$ = of(weatherForecast[index]);
        this.city.setValue(weatherForecast[indexOtra].location.name);
      }else {
        this.weather$ = of(weatherForecast[0]);
      }
    }
  }
}
