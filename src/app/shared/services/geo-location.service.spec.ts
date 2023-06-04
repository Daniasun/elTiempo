import { TestBed } from '@angular/core/testing';
import { GeoLocationService } from './geo-location.service';

describe('GeoLocationService', () => {
  let service: GeoLocationService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [GeoLocationService]
    });

    service = TestBed.inject(GeoLocationService);
  });

  it('crea el servicio GeoLocationService', () => {
    expect(service).toBeTruthy();
  });
  it('devuelve la posicion cuando  getCurrentPosition es llamado', (done) => {
    spyOn(navigator.geolocation, 'getCurrentPosition').and.callFake((successCallback, errorCallback) => {
      if (errorCallback) {
        successCallback({
          coords: {
            accuracy: 0,
            latitude: 51.5074,
            longitude: -0.1278,
            altitude: 0,
            altitudeAccuracy: 0,
            speed: 0,
            heading: 0
          },
          timestamp: 0
        });
      } else {
        done.fail('errorCallback is not defined');
      }
    });
    service.getCurrentPosition().then((position: any) => {
      expect(position).toBeDefined();
      expect(position.coords).toBeDefined();
      expect(position.coords.latitude).toBeDefined();
      expect(position.coords.longitude).toBeDefined();
      done();
    });
  });

  it('rechaza la promesa si getCurrentPosition encuentra un error', (done) => {
    spyOn(navigator.geolocation, 'getCurrentPosition').and.callFake((successCallback, errorCallback) => {
      if (errorCallback) {
        errorCallback({
          code: 1, // Código de error específico (ejemplo: 1 para PERMISSION_DENIED)
          PERMISSION_DENIED: 1,
          POSITION_UNAVAILABLE: 2,
          TIMEOUT: 3,
          message: 'Geolocation error'
        });
      } else {
        done.fail('errorCallback is not defined');
      }
    });
    service.getCurrentPosition().catch((error: any) => {
      expect(error).toBeDefined();
      expect(error.message).toBe('Geolocation error');
      done();
    });
  });
});
