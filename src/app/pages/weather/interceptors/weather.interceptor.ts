import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { environment } from '@env/environment';
import { Observable } from 'rxjs';

export class WeatherInterceptor implements HttpInterceptor {
    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        const cloneReq = req.clone({
            params: req.params.appendAll({
                'key': environment.weatherapi.key
            })
        });
        return next.handle(cloneReq);
    }
}