import { Component, OnInit, OnDestroy } from '@angular/core';
import { Store } from '@ngrx/store';
import { AppState } from '../../app.reducer';
import { IngresoEgreso } from '../ingreso-egreso.model';
import { Subscription } from 'rxjs';
import { IngresoEgresoService } from '../ingreso-egreso.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-detalle',
  templateUrl: './detalle.component.html',
  styles: []
})
export class DetalleComponent implements OnInit, OnDestroy {
  items: IngresoEgreso[];
  detallesSubscription: Subscription= new Subscription();

  constructor( private store: Store<AppState>,
               public ingresoEgresoService: IngresoEgresoService) { }

  ngOnInit() {
    this.detallesSubscription = this.store.select('ingresoEgreso').subscribe(ingresoEgreso=>{
      this.items = ingresoEgreso.items;
    })
  }

  borrarItem(item: any){
    console.log(item.uid);
    this.ingresoEgresoService.borrarIngresoEgreso(item.uid)
        .then( ()=>{
          Swal(`Se borro el ${item.tipo} correctamente`, `${item.descripcion} ha sido borrado`, 'success' );
        });
  }

  ngOnDestroy(){
    this.detallesSubscription.unsubscribe();
    // this.ingresoEgresoService.cancelarSubscription();
  }

}
