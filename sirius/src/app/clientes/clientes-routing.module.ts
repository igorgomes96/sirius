import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CommonModule } from '@angular/common';

import { ClientesFormComponent } from './clientes-form/clientes-form.component';
import { ClientesListComponent } from './clientes-list/clientes-list.component';
import { ClienteResolverService } from './cliente-resolver.service';

const routes: Routes = [
    { path: '', component: ClientesListComponent },
    { path: 'novo', component: ClientesFormComponent },
    {
        path: ':id',
        component: ClientesFormComponent,
        resolve: {
            cliente: ClienteResolverService
        }
    }
];

@NgModule({
    imports: [CommonModule, RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class ClientesRoutingModule { }
