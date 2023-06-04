import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Coord, WeatherData } from '@app/shared/interfaces/weather.interface';
import { environment } from '@env/environment';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class WeatherService {
    readonly API_URL = environment.weatherapi.url;

    constructor(private readonly http: HttpClient) { }

    public getForecastByName(city: string): Observable<WeatherData> {
        const params = new HttpParams()
            .set('q', city)
            .set('days', '4')
        return this.http.get<WeatherData>(this.API_URL, { params });

    }
    public getForecastByCoords(coord: Coord): Observable<WeatherData> {
        const params = new HttpParams()
            .set('q', `${coord.latitude},${coord.longitude}`)
            .set('days', '4')
        return this.http.get<WeatherData>(this.API_URL, { params });
    }
}