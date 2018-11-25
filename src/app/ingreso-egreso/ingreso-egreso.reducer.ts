import * as fromIngresoEgreso from './ingreso-egreso.actions';
import { IngresoEgreso } from './ingreso-egreso.model';
import { Action } from '@ngrx/store';
import { AppState } from '../app.reducer';

export interface IngresoEgresoState {
    items: IngresoEgreso[];
}

export interface AppState extends AppState {
    ingresoEgreso: IngresoEgresoState;
}

const estadoInicial: IngresoEgresoState = {
    items: []
};

export function IngresoEgresoReducer( state = estadoInicial, action: fromIngresoEgreso.acciones  ) : IngresoEgresoState {
    switch (action.type) {
        case fromIngresoEgreso.SET_ITEMS:
            return {
                items: [
                    ...action.items.map( item => {
                        return {
                            ...item
                        };
                    })
                ]
            };

        case fromIngresoEgreso.UNSET_ITEMS:
            return estadoInicial;
    
        default:
            return state;
    }
}