import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import{AcademyProvider} from '../providers/academy-provider'
 
const HTML_TEMPLATE = `
<ion-header>
  <ion-navbar color="primary">
    <ion-title>
      Ionic Academy
    </ion-title>
  </ion-navbar>
</ion-header>
 
<ion-content padding>
 
<div class="special-text">Welcome to the special Ionic Academy Module!</div>
  <button ion-button full icon-left (click)="leavePage()">
    <ion-icon name="close"></ion-icon>
  Close the Page</button>
</ion-content>
`;
 
const CSS_STYLE = `
.special-text {
    font-weight: 800;
    font-size: 15pt;
    text-align: center;
    color: #0000FF;
}
`;
 
@Component({
  selector: 'academy-component',
  template: HTML_TEMPLATE,
  styles: [CSS_STYLE]
})
export class AcademyComponent {
  constructor(private navCtrl: NavController,private _ap:AcademyProvider) {

//_ap.Test();
  }
 
  leavePage() {
      this.navCtrl.pop();
  }
}