import { Component } from '@angular/core';
import { NavController, AlertController } from 'ionic-angular';
import { DatabaseProvider } from '../../providers/database/database';


@Component({
  selector: 'page-Inscription',
  templateUrl: 'Inscription.html'
})
export class InscriptionPage {

   private _COLL 		: string 			= "Membre";
  
   private _DOC 		: string 			= "";

   private _CONTENT  	: any;

   public locations     : any;

   
   constructor(public navCtrl  : NavController,
               private _DB     : DatabaseProvider,
               private _ALERT  : AlertController)
   {
      this._CONTENT = {
         NCIN 			: "",
         Classe 	: "",
         Nom    : "",
         Prenom: "",
         Faculte:"",
         Departement :""
      };
   }




   
   ionViewDidEnter()
   {
      this.retrieveCollection();
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
      this._DB.getDocuments(this._COLL)
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




   
   addDocument() : void
   {
      this.navCtrl.push('manage-document');
   }




   
   updateDocument(obj) : void
   {
      let params : any = {
         collection   : this._COLL,
         location     : obj
      };
      this.navCtrl.push('manage-document', { record : params, isEdited : true });
   }




  
   deleteDocument(obj) : void
   {
      this._DB.deleteDocument(this._COLL,
      						obj.id)
      .then((data : any) =>
      {
         this.displayAlert('Success', 'The record ' + obj.NCIN + ' was successfully removed');
      })
      .catch((error : any) =>
      {
         this.displayAlert('Error', error.message);
      });
   }




    // Provide feedback to user after an operation has succeeded/failed
    
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