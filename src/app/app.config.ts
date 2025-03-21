// app.config.ts
import {ApplicationConfig, provideZoneChangeDetection} from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideAnimations } from '@angular/platform-browser/animations';
import {provideFirebaseApp, initializeApp, FirebaseApp} from '@angular/fire/app';
import {routes} from './app.routes';
import {provideHttpClient} from '@angular/common/http';
import {Auth, getAuth, provideAuth} from '@angular/fire/auth';
import {firebaseConfig} from '../../firebase/firebase-config';

export const appConfig: ApplicationConfig = {


  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideHttpClient(),
    provideAnimations(),
    provideFirebaseApp(() :FirebaseApp => initializeApp(firebaseConfig)),
    provideAuth(() : Auth=> getAuth())



  ]
};
