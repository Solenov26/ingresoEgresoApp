import { Component, OnInit, OnDestroy } from '@angular/core';
import { AuthService } from '../auth.service';
import { AppState } from '../../app.reducer';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styles: []
})
export class LoginComponent implements OnInit, OnDestroy {
  cargando: boolean;
  subscription: Subscription;

  constructor(public authservice: AuthService,
              public store: Store<AppState>) { }

  ngOnInit() {
     this.subscription = this.store.select('ui').subscribe( iu => this.cargando = iu.isLoading );
  }
  logIn(data){
    this.authservice.logIn(data.email, data.password)
  }
  ngOnDestroy(){
    this.subscription.unsubscribe();
  }

}
