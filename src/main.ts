import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { AppModule } from './app/app.module';
import { environment } from './environments/environment';

if (environment.production) {
  enableProdMode();
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('/elTiempo/ngsw-worker.js');
  }
}

platformBrowserDynamic().bootstrapModule(AppModule);