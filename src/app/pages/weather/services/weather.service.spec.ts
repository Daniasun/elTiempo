import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { WeatherService } from './weather.service';
import { WeatherData } from '@app/shared/interfaces/weather.interface';

describe('WeatherService', () => {
    let service: WeatherService;
    let httpMock: HttpTestingController;

    beforeEach(() => {
    TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
        providers: [WeatherService]
    });
    service = TestBed.inject(WeatherService);
    httpMock = TestBed.inject(HttpTestingController);
    });

    afterEach(() => {
        httpMock.verify();
    });

    it('crea el servicio WeatherService', () => {
        expect(service).toBeTruthy();
    });

    it('recupera la previsión por nombre de ciudad', () => {
    const cityName = 'London';

    const expectedForecast: WeatherData = {
        current: undefined,
        forecast: undefined,
        location: undefined,
    };

    service.getForecastByName(cityName).subscribe((forecast) => {
        expect(forecast).toEqual(expectedForecast);
    });

    const request = httpMock.expectOne(`${service.API_URL}?q=${cityName}&days=4`);
    expect(request.request.method).toBe('GET');
    request.flush(expectedForecast);
    });

    it('obtener la previsión por coordenadas', () => {
    const coordinates = {
        latitude: 51.5074,
        longitude: -0.1278
    };

    const expectedForecast: WeatherData = {
        current: undefined,
        forecast: undefined,
        location: undefined,
    };

    service.getForecastByCoords(coordinates).subscribe((forecast) => {
        expect(forecast).toEqual(expectedForecast);
    });

    const request = httpMock.expectOne(
        `${service.API_URL}?q=${coordinates.latitude},${coordinates.longitude}&days=4`
    );
    expect(request.request.method).toBe('GET');
    request.flush(expectedForecast);
    });
});