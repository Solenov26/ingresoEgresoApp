import { Component, OnInit, OnDestroy } from '@angular/core';
import { AuthService } from '../../auth/auth.service';
import { AppState } from '../../app.reducer';
import { Store } from '@ngrx/store';
import { User } from '../../auth/user.model';
import { Subscription } from 'rxjs';
import { IngresoEgresoService } from '../../ingreso-egreso/ingreso-egreso.service';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styles: []
})
export class SidebarComponent implements OnInit, OnDestroy {
  user: User;
  susbcription: Subscription = new Subscription();


  constructor( public authService: AuthService,
               public ingresoegresoService: IngresoEgresoService,
               private store: Store<AppState>) { }

  ngOnInit() {
    this.susbcription = this.store.select('auth').subscribe(data=>{
      this.user=data.user;
    })
  }
  
  logOut(){
    this.authService.logOut();
    this.ingresoegresoService.cancelarSubscription();
  }

  ngOnDestroy(){
    this.susbcription.unsubscribe();
  }
}
