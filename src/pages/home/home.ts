import { Component } from '@angular/core';
import { NavController,AlertController } from 'ionic-angular';
import { DatabaseProvider } from '../../providers/database/database';
import { IntegrationPage } from '../integration/Integration';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  private _COLL 		: string 			= "Article";
  
   private _DOC 		: string 			= "";

   private _CONTENT  	: any;

   public locations     : any;


  constructor(public navCtrl: NavController,
              private _DB     : DatabaseProvider,
              private _ALERT  : AlertController) 
              {
                this._CONTENT = {
                  Titre 			: "",
                  Desc 	: "",
                  Photo    : "",
                 };

  }


  ionViewDidEnter()
  {
     this.retrieveCollection();
  }



  
  gotointegration(){
    this.navCtrl.push(IntegrationPage);
  }

  generateCollectionAndDocument() : void
  {
     this._DB.createAndPopulateDocument(this._COLL,
                                        this._DOC,
                                        this._CONTENT)
     .then((data : any) =>
     {
        console.dir(data);
     })
     .catch((error : any) =>
     {
        console.dir(error);
     });
  }


 retrieveCollection() : void
   {
      this._DB.getArticles(this._COLL)
      .then((data) =>
      {

        
         if(data.length === 0)
         {
            this.generateCollectionAndDocument();
         }

         
         else
         {
            this.locations = data;
         }
      })
      .catch();
   }

   

   displayAlert(title      : string,
    message    : string) : void
{
let alert : any     = this._ALERT.create({
title      : title,
subTitle   : message,
buttons    : [{
text      : 'Got It!',
handler   : () =>
{
this.retrieveCollection();
}
}]
});
alert.present();
} 



}
