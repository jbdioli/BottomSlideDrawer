import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { BottomSlideDrawerComponent } from './bottom-slide-drawer/bottom-slide-drawer.component';


@NgModule({
    declarations: [
      // Component
      BottomSlideDrawerComponent
    ],
    imports: [
        CommonModule,
        IonicModule,
        RouterModule,
        FormsModule,
    ],
    exports: [
      // Component
      BottomSlideDrawerComponent
    ],

  })
  export class ComponentsModule {}
