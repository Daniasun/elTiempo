import { Component } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal';

@Component({
  selector: 'app-pop-up-error',
  templateUrl: './pop-up-error.component.html',
  styleUrls: ['./pop-up-error.component.scss']
})
export class PopUpErrorComponent {
  constructor(readonly bsModalRef: BsModalRef) { }
}
