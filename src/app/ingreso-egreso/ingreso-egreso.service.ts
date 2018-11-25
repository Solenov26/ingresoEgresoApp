import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { IngresoEgreso } from './ingreso-egreso.model';
import { AuthService } from '../auth/auth.service';
import { AppState } from '../app.reducer';
import { Store } from '@ngrx/store';
import { filter, map } from 'rxjs/operators';
import { SetItemsActions, UnsetItemsActions } from './ingreso-egreso.actions';
import { Subscription } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class IngresoEgresoService {
  ingresoEgresoListenerSubscription: Subscription = new Subscription();
  ingresoEgresoItemsSubscription: Subscription = new Subscription();


  constructor(private afDB: AngularFirestore,
              public authService: AuthService,
              private store: Store<AppState>) { }

  initIngresoEgresoListener(){
    // const user = this.authService.getUser();
    // console.log(user.uid);
    this.ingresoEgresoListenerSubscription = this.store.select('auth')
              .pipe(filter(auth => auth.user != null))
              .subscribe(auth=> this.ingresoEgresoItems(auth.user.uid) );
  }

  private ingresoEgresoItems (uid:string){
    this.ingresoEgresoItemsSubscription = this.afDB.collection(`${uid}/ingresos-egresos/items`)
             .snapshotChanges()
             .pipe( 
               map (docData => {
                 return docData.map( doc =>{
                   return {
                     uid: doc.payload.doc.id,
                     ...doc.payload.doc.data()
                   };
                 });
               })
              )
             .subscribe((coleccion: any[]) => {
               this.store.dispatch(new SetItemsActions(coleccion));
             });
  }

  cancelarSubscription(){
    this.ingresoEgresoItemsSubscription.unsubscribe();
    this.ingresoEgresoListenerSubscription.unsubscribe();
    this.store.dispatch(new UnsetItemsActions());
  }

  crearIngresoEgreso( ingresoEgreso :IngresoEgreso ){
    const user = this.authService.getUser();
    return this.afDB.doc(`${user.uid}/ingresos-egresos`)
        .collection('items').add({...ingresoEgreso});
  }

  borrarIngresoEgreso(uid:string){
    const user = this.authService.getUser();
    return this.afDB.doc( `${user.uid}/ingresos-egresos/items/${uid}`).delete();
  }

  
}
