import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { NgModule, Optional, SkipSelf } from '@angular/core';

import { throwIfAlreadyLoaded } from './module-import-guard';
import { TopNavigationComponent } from './top-navigation/top-navigation.component';
import { FooterComponent } from './footer/footer.component';

@NgModule({
  declarations: [TopNavigationComponent, FooterComponent],
  imports: [
    CommonModule,
    RouterModule
  ],
  exports: [TopNavigationComponent, FooterComponent]
})
export class CoreModule {
  constructor(@Optional() @SkipSelf() parentModule: CoreModule) {
    throwIfAlreadyLoaded(parentModule, 'CoreModule');
  }
}
