import { Component, OnInit, Output, EventEmitter} from '@angular/core';
import { FormControl } from '@angular/forms';
import { ConnectionService } from 'ng-connection-service';
import { debounceTime, tap } from 'rxjs';


@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss']
})
export class SearchComponent implements OnInit {
  public inputSearch = new FormControl('');
  public placeholder = 'Busca el tiempo en otras ciudades...';
  @Output() submitted = new EventEmitter<string>();

  constructor(readonly connectionService: ConnectionService){}
  ngOnInit(): void {
    this.connectionService.monitor().subscribe(isConnected => {
      if (!(isConnected.hasInternetAccess && isConnected.hasNetworkConnection)) {
        this.inputSearch.disable();
        this.placeholder = 'Búsqueda desactivada en modo sin conexión'
      }
    });
    this.onChange();
  }

  public onChange(): void {
    this.inputSearch.valueChanges
      .pipe(
        debounceTime(850),
        tap((search: string) => this.submitted.emit(search))
      )
      .subscribe();
  }
}
