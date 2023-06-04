import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { WeatherRoutingModule } from './weather-routing.module';
import { WeatherComponent } from './weather.component';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { WeatherInterceptor } from './interceptors/weather.interceptor';
import { HttpErrorsInterceptor } from '@app/pages/weather/interceptors/http-errors-interceptor';
import { NgxBootstrapIconsModule, star, starFill } from 'ngx-bootstrap-icons';


@NgModule({
  declarations: [
    WeatherComponent
  ],
  imports: [
    CommonModule,
    WeatherRoutingModule,
    NgxBootstrapIconsModule.pick({star, starFill})
  ],
  exports: [WeatherComponent],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: WeatherInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: HttpErrorsInterceptor, multi: true }
  ]
})
export class WeatherModule { }
