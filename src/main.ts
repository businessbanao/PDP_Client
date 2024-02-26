import 'hammerjs';
import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { AppModule } from './app/app.module';
import { environment } from './environments/environment';

if (environment.production) {
  enableProdMode();
}

// platformBrowserDynamic().bootstrapModule(AppModule)
//   .catch(err => console.log(err));


platformBrowserDynamic().bootstrapModule(AppModule)
.then(moduleRef => {
  if ('serviceWorker' in navigator && environment.production) {
    navigator.serviceWorker.register('/ngsw-worker.js')
      .then(registration => {
        console.log('Service Worker registered with scope: ', registration.scope);
      })
      .catch(err => {
        console.error('Service Worker registration failed: ', err);
      });

    navigator.serviceWorker.ready.then(registration => {
      console.log('Service Worker registration updated: ', registration);
      registration.update();
    });
  }
})
.catch(err => console.error(err));
