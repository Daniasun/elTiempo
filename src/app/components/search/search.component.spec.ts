import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SearchComponent } from './search.component';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { of, tap } from 'rxjs';
import { HttpClientModule } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('SearchComponent', () => {
  let component: SearchComponent;
  let fixture: ComponentFixture<SearchComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        FormsModule,
        ReactiveFormsModule,
        HttpClientModule,
        HttpClientTestingModule
      ],
      declarations: [ SearchComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SearchComponent);
    component = fixture.componentInstance;
    component.inputSearch = new FormControl()
    fixture.detectChanges();
  });

  it('crea el componente SearchComponent', () => {
    expect(component).toBeTruthy();
  });

  it('desactiva inputSearch y actualizar el marcador de posición cuando no hay acceso a Internet o conexión de red', () => {
    const connState = {
      hasInternetAccess: false,
      hasNetworkConnection: false
    };
    spyOn(component.connectionService,'monitor').and.returnValue(of(connState));
    component.ngOnInit();
    expect(component.inputSearch.disabled).toBeTrue();
    expect(component.placeholder).toEqual('Búsqueda desactivada en modo sin conexión');
  });

  it('activa inputSearch y establecer el valor inicial del marcador de posición cuando haya acceso a Internet y conexión a la red', () => {
    expect(component.inputSearch.enabled).toBeTrue();
    expect(component.placeholder).toEqual('Busca el tiempo en otras ciudades...');
  });

  it('llama al método onChange en ngOnInit', () => {
    spyOn(component, 'onChange');
    component.ngOnInit();
    expect(component.onChange).toHaveBeenCalled();
  });

  it('debe llamar al método onChange cuando cambie el valor del input', () => {
    spyOn(component, 'onChange').and.callThrough();
    spyOn(component.submitted, 'emit');
    const searchValue = 'example';
    component.inputSearch.valueChanges
      .pipe(
        tap((search: string) => {component.submitted.emit(search)})
      )
      .subscribe();
    component.inputSearch.setValue(searchValue);
    component.inputSearch.updateValueAndValidity();
    component.ngOnInit();
    expect(component.submitted.emit).toHaveBeenCalledWith(searchValue);
    fixture.detectChanges();
    expect(component.onChange).toHaveBeenCalled();
  });

  it('debe emitir el valor de búsqueda', (done) => {
    const emittedValue = 'test';
    component.submitted.subscribe((search) => {
      expect(search).toEqual(emittedValue);
      done();
    });
    component.inputSearch.setValue(emittedValue);
    fixture.detectChanges();
    fixture.whenStable().then(() => {
      fixture.detectChanges();
      expect(component.inputSearch.value).toEqual(emittedValue);
      fixture.whenStable().then(() => {
        expect(component.inputSearch.value).toEqual(emittedValue);
      });
    });
  });

});
