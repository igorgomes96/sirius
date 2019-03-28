import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CommonModule } from '@angular/common';

import { UsuariosListComponent } from './usuarios-list/usuarios-list.component';
import { UsuariosFormComponent } from './usuarios-form/usuarios-form.component';
import { UsuarioResolverService } from './usuario-resolver.service';

const routes: Routes = [
    { path: '', component: UsuariosListComponent },
    { path: 'novo', component: UsuariosFormComponent },
    {
        path: ':id',
        component: UsuariosFormComponent,
        resolve: {
            usuario: UsuarioResolverService
        }
    }
];

@NgModule({
    imports: [CommonModule, RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class UsuariosRoutingModule {}
