import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormControl } from '@angular/forms';
import { WeatherData } from '@app/shared/interfaces/weather.interface';
import { FavoritosService } from '@app/shared/services/favoritos.service';
import { ConnectionService } from 'ng-connection-service';


@Component({
  selector: 'app-weather',
  templateUrl: './weather.component.html',
  styleUrls: ['./weather.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class WeatherComponent implements OnInit{
  @Input() public weather!: WeatherData;
  @Output() cambio = new EventEmitter<string>();
  @Input() public city!: FormControl;
  public favoritos!: string[];
  public favFound = false;

  constructor(readonly favoritosService: FavoritosService,
              readonly connectionService: ConnectionService) { }

  ngOnInit(): void {
    this.connectionService.monitor().subscribe(isConnected => {
      if (isConnected.hasInternetAccess && isConnected.hasNetworkConnection) {
        const weatherForecastArr = localStorage.getItem('weatherForecast');
        const weatherForecast: WeatherData[] = weatherForecastArr ? JSON.parse(weatherForecastArr) : [];
        if (weatherForecast.findIndex((object: WeatherData) => object.location.name === this.weather.location.name) === -1) {
          weatherForecast.push(this.weather);
        }
        localStorage.setItem('weatherForecast', JSON.stringify(weatherForecast));
      }
    });
    this.favoritosService.favorites$.subscribe((value: any) => {
      this.favoritos = value;
      this.favFoundCheck();
    });
    this.getCachedData();
  }

  public getCachedData(): void {
    const favoritosStr = localStorage.getItem('favoritos');
    if (favoritosStr) {
      this.favoritos = JSON.parse(favoritosStr);
      this.favFoundCheck();
    }else{
      this.favoritosService.getFavoritos();
    }
  }
  public onClick(): void {
    this.cambio.emit(this.city.value);
  }
  public selFavorito(value: string): void {
    if(value !== this.weather.location.name){
      this.cambio.emit(value);
    }
  }
  public onFavorite(favorito: string): void {
    this.favoritosService.onFavorite(favorito);
  }
  public favFoundCheck(): void {
    this.favFound = this.favoritos.indexOf(this.weather.location.name) !== -1;
  }
}
