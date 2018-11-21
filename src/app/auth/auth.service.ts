import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore } from '@angular/fire/firestore';
import * as firebase from 'firebase';
import { Router } from '@angular/router';

import { Store } from '@ngrx/store';
import { ActivarLoadingAction, DesactivarLoadingAction } from '../shared/ui.actions';
import { SetUserAction } from './auth.actions';
import { AppState } from '../app.reducer';

import { map } from 'rxjs/operators'
import { Subscription } from 'rxjs';

import Swal from 'sweetalert2';

import { User } from './user.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private userSuscription: Subscription = new Subscription();

  constructor(private afAuth: AngularFireAuth,
              private router: Router,
              private afDB: AngularFirestore, 
              private store: Store<AppState>) { }

  initAuthListener(){
      this.afAuth.authState.subscribe((fbUser: firebase.User) =>{
      if(fbUser){
         this.userSuscription = this.afDB.doc(`${fbUser.uid}/usuario`).valueChanges()
            .subscribe( ( usuarioObj: any ) => {
              const newUser = new User(usuarioObj);
              this.store.dispatch( new SetUserAction(newUser));       
              console.log(newUser);
                     
            });
      }else {
        this.userSuscription.unsubscribe();
      }
      
    })
  }


  crearUsuario(nombre:string, email:string , password:string){
    this.store.dispatch(new ActivarLoadingAction());
    this.afAuth.auth.createUserWithEmailAndPassword(email, password).then(resp=>{
      // console.log(resp);
      const user: User = {
        uid: resp.user.uid,
        nombre: nombre,
        email: resp.user.email
      };
      // Crear base de datos
      this.afDB.doc(`${user.uid}/usuario`)
          .set(user)
          .then(()=>{
            this.router.navigate(['/']);
            this.store.dispatch(new DesactivarLoadingAction());
          });
    }).catch(error=>{
      console.log(error);
      Swal('Error en el login', error.message, 'error');
      this.store.dispatch(new DesactivarLoadingAction());
    });
  }

  logIn(email: string, password: string){
    this.store.dispatch(new ActivarLoadingAction());
    this.afAuth.auth.signInWithEmailAndPassword(email, password).then(resp=>{
      // console.log(resp);
      this.router.navigate(['/']);
      this.store.dispatch(new DesactivarLoadingAction());
    }).catch(error=>{
      console.log(error);
      Swal('Error en el login', error.message, 'error');
      this.store.dispatch(new DesactivarLoadingAction());      
    });
  }

  logOut(){
    this.router.navigate(['/login']);
    this.afAuth.auth.signOut();

  }

  isAuth(){
    return this.afAuth.authState.pipe( map(fbUser=> {
      if (fbUser === null){
        this.router.navigate(['/login'])
      }
      return fbUser != null
    }));
  }
}
