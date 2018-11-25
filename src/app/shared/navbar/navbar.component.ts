import { Component, OnInit, OnDestroy } from '@angular/core';
import { AuthService } from '../../auth/auth.service';
import { User } from '../../auth/user.model';
import { Store } from '@ngrx/store';
import { AppState } from '../../app.reducer';
import { Subscription } from 'rxjs';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styles: []
})
export class NavbarComponent implements OnInit, OnDestroy {
  user: any;
  susbcription: Subscription = new Subscription();

  constructor( private store: Store<AppState> ) { }

  ngOnInit() {
    this.susbcription = this.store.select('auth')
        .pipe(
          filter(auth=> auth.user != null)
        )
        .subscribe(data=>{
      this.user = data.user;
    });
    
  }
  ngOnDestroy() {
    this.susbcription.unsubscribe();
  }

}
