import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { IngresoEgreso } from './ingreso-egreso.model';
import { IngresoEgresoService } from './ingreso-egreso.service';
import Swal from 'sweetalert2';
import { AppState } from '../app.reducer';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs';
import { ActivarLoadingAction, DesactivarLoadingAction } from '../shared/ui.actions';

@Component({
  selector: 'app-ingreso-egreso',
  templateUrl: './ingreso-egreso.component.html',
  styles: []
})
export class IngresoEgresoComponent implements OnInit, OnDestroy {
  forma: FormGroup;
  tipo= 'ingreso';
  loadingSubs: Subscription= new Subscription();
  cargando:boolean;


  constructor(public ingresoEgresoService: IngresoEgresoService,
  private store: Store<AppState>) { }

  ngOnInit() {
    this.loadingSubs = this.store.select('ui').subscribe(ui=>{
      this.cargando=ui.isLoading;
    });
    this.forma = new FormGroup({
      'descripcion': new FormControl('', Validators.required),
      'monto': new FormControl(null, Validators.min(0))
    });
  }

  crearIngresoEgreso(){
    this.store.dispatch(new ActivarLoadingAction());
    const ingresoEgreso = new IngresoEgreso ({ ...this.forma.value, tipo: this.tipo });
    this.ingresoEgresoService.crearIngresoEgreso(ingresoEgreso)
        .then(()=>{
          this.store.dispatch(new DesactivarLoadingAction());

          this.forma.reset();
          Swal('Creado', ingresoEgreso.descripcion, 'success');
        }).catch( err => {
          this.store.dispatch(new DesactivarLoadingAction());

          Swal('Error', err.message , 'error');          
        });
    
    
  }
  ngOnDestroy(){
    this.loadingSubs.unsubscribe();
  }

}
