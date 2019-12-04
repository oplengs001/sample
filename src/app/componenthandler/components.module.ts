import { NgModule } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { FooterComponent } from "../footer/footer.component"
import { ExpandableComponent } from "../components/expandable/expandable.component";
@NgModule({
    imports: [IonicModule,CommonModule],
    declarations:[FooterComponent,ExpandableComponent],
    exports:[FooterComponent,ExpandableComponent]

})
export class ComponentsModule{}
