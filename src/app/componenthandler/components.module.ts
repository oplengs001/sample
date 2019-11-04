import { NgModule } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { FooterComponent } from "../footer/footer.component"
@NgModule({
    imports: [IonicModule,CommonModule],
    declarations:[FooterComponent],
    exports:[FooterComponent]

})
export class ComponentsModule{}
