import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PopUpErrorComponent } from './pop-up-error.component';
import { BsModalRef } from 'ngx-bootstrap/modal';

describe('PopUpErrorComponent', () => {
  let component: PopUpErrorComponent;
  let fixture: ComponentFixture<PopUpErrorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PopUpErrorComponent ],
      providers: [BsModalRef]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PopUpErrorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('crea el componente PopUpErrorComponent', () => {
    expect(component).toBeTruthy();
  });
});
