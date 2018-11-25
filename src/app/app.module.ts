import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
// NGRX
import { StoreModule } from '@ngrx/store';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { appReducers } from './app.reducer';
// Firebase
import { AngularFireModule } from '@angular/fire';
import { AngularFirestoreModule } from '@angular/fire/firestore';
// Modulos
import { AppRoutingModule } from './app-routing.module';
// Modulos personalizados
import { AuthModule } from './auth/auth.module';

// Enviroment
import { environment } from '../environments/environment';


import { AppComponent } from './app.component';

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    AuthModule,
    AppRoutingModule,
    AngularFireModule.initializeApp(environment.firebase),
    AngularFirestoreModule,
    StoreModule.forRoot(appReducers),
    StoreDevtoolsModule.instrument({
      maxAge: 25, // Retains last 25 states
      logOnly: environment.production, // Restrict extension to log-only mode
    }),

  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
