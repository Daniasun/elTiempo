import { HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { PopUpErrorComponent } from '@app/components/pop-up-error/pop-up-error.component';
import { BsModalService } from 'ngx-bootstrap/modal';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';


@Injectable()
export class HttpErrorsInterceptor implements HttpInterceptor {
  constructor(readonly modalService: BsModalService) {}

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(request).pipe(
      catchError((httpError: HttpErrorResponse) => {
        if (!(httpError.error instanceof ErrorEvent)) {
          if(httpError.status === 400) {
            this.modalService.show(PopUpErrorComponent);
            setTimeout(() => {window.location.reload(); }, 3000);
          }
        }
        return throwError(() => new Error(httpError.message));
      }));
  }
}

