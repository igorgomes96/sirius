import { CardapioListComponent } from './cardapio-list/cardapio-list.component';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CommonModule } from '@angular/common';
import { CardapioFormComponent } from './cardapio-form/cardapio-form.component';
import { CardapioResolverService } from './cardapio-resolver.service';

const routes: Routes = [
    { path: '', component: CardapioListComponent },
    { path: 'novo', component: CardapioFormComponent },
    {
        path: ':id',
        component: CardapioFormComponent,
        resolve: {
            itemCardapio: CardapioResolverService
        }
    }
];

@NgModule({
    imports: [CommonModule, RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class CardapioRoutingModule {}
