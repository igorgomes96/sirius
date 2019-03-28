import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CommonModule } from '@angular/common';

import { ReservasFormComponent } from './reservas-form/reservas-form.component';
import { ReservasListComponent } from './reservas-list/reservas-list.component';
import { ReservaResolverService } from './reserva-resolver.service';

const routes: Routes = [
    { path: '', component: ReservasListComponent },
    { path: 'novo', component: ReservasFormComponent },
    {
        path: ':id',
        component: ReservasFormComponent,
        resolve: {
            reserva: ReservaResolverService
        }
    }
];

@NgModule({
    imports: [CommonModule, RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class ReservasRoutingModule { }
