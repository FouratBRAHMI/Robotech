import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { IntegrationPage } from '../integration/Integration';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  constructor(public navCtrl: NavController) {

  }

  gotointegration(){
    this.navCtrl.push(IntegrationPage);
  }
}
