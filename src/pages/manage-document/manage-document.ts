import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AlertController, IonicPage, NavController, NavParams } from 'ionic-angular';
import { DatabaseProvider } from '../../providers/database/database';
import { HomePage } from '../home/home';
import { InscriptionPage } from '../Inscription/Inscription';


@IonicPage({
	name: "manage-document"
})
@Component({
  selector: 'page-manage-document',
  templateUrl: 'manage-document.html',
})
export class ManageDocumentPage {



   /**
    * @name form
    * @type {object}
    * @public
    * @description     Defines an object for handling form validation
    */
   public form          : any;



   /**
    * @name records
    * @type {object}
    * @public
    * @description     Defines an object for returning documents from Cloud Firestore database
    */
   public records       : any;



   /**
    * @name NCIN
    * @type {string}
    * @public
    * @description     Model for NCIN form field
    */
   public NCIN          : string          = '';



   /**
    * @name Classe
    * @type {string}
    * @public
    * @description     Model for Classe form field
    */
   public Classe    : string          = '';



   /**
    * @name Nom
    * @type {string}
    * @public
    * @description     Model for Nom form field
    */
   public Nom 	: string          = '';

/**
    * @name Prenom
    * @type {string}
    * @public
    * @description     Model for Nom form field
    */
   public Prenom 	: string          = '';

   /**
    * @name Faculte
    * @type {string}
    * @public
    * @description     Model for Nom form field
    */
   public Faculte 	: string          = '';


   

 /**
    * @name Departement
    * @type {string}
    * @public
    * @description     Model for Nom form field
    */
   public Departement 	: string          = '';

   /**
    * @name docID
    * @type {string}
    * @public
    * @description     property that stores an edited document's ID
    */
   public docID         : string          = '';



   /**
    * @name isEditable
    * @type {boolean}
    * @public
    * @description     property that stores value to signify whether
                       we are editing an existing document or not
    */
   public isEditable    : boolean         = false;



   /**
    * @name title
    * @type {string}
    * @public
    * @description     property that defines the template title value
    */
   public title 		: string		   = 'Add a new membre';



   /**
    * @name _COLL
    * @type {string}
    * @private
    * @description     property that stores the value for the database collection
    */
   private _COLL 		: string 			= "Membre";


   constructor(public navCtrl        : NavController,
               public params         : NavParams,
               private _FB 	         : FormBuilder,
               private _DB           : DatabaseProvider,
               private _ALERT        : AlertController)
   {

      // Use Formbuilder API to create a FormGroup object
      // that will be used to programmatically control the
      // form / form fields in the component template
      this.form 		= _FB.group({
         'NCIN' 		        : ['', Validators.required],
         'Classe' 	        : ['', Validators.required],
         'Nom'	        : ['', Validators.required],
         'Prenom'      : ['', Validators.required],
         'Faculte'      : ['', Validators.required],
         'Departement' : ['', Validators.required],
      });


      // If we have navigation parameters then we need to
      // parse these as we know these will be used for
      // editing an existing record
      if(params.get('isEdited'))
      {
          let record 		        = params.get('record');

          this.NCIN	            = record.location.NCIN;
          this.Classe   	  = record.location.Classe;
          this.Nom      = record.location.Nom;
          this.Prenom      = record.location.Prenom;
          this.Faculte      = record.location.Faculte;
          this.Departement  = record.location.Departement;
          this.docID            = record.location.id;
          this.isEditable       = true;
          this.title            = 'Update this document';
      }
   }



   /**
    * Saves form data as newly added/edited record within Firebase Realtime
    * database and handles uploading of media asset to Firebase Storage
    *
    * @public
    * @method saveDocument
    * @param  val          {any}              Form data
    * @return {none}
    */
   saveDocument(val : any) : void
   {
      let NCIN	            : string		= this.form.controls["NCIN"].value,
	 	      Classe        : string 		= this.form.controls["Classe"].value,
              Nom       : string		= this.form.controls["Nom"].value,
              Prenom       : string		= this.form.controls["Prenom"].value,
              Faculte       : string		= this.form.controls["Faculte"].value,
              Departement    : string		= this.form.controls["Departement"].value;

      // If we are editing an existing record then handle this scenario
      if(this.isEditable)
      {

         // Call the DatabaseProvider service and pass/format the data for use
         // with the updateDocument method
         this._DB.updateDocument(this._COLL,
                               this.docID,
                               {
	                               NCIN    		 : NCIN,
	                               Classe    : Classe,
                                   Nom   : Nom,
                                   Prenom : Prenom,
                                   Faculte: Faculte,
                                   Departement :Departement
	                           })
         .then((data) =>
         {
            this.clearForm();
            this.displayAlert('Success', 'The member ' +  Nom +' ' +  Prenom +' was successfully updated');
         })
         .catch((error) =>
         {
            this.displayAlert('Updating member failed', error.message);
         });
      }

      // Otherwise we are adding a new record
      else
      {

         // Call the DatabaseProvider service and pass/format the data for use
         // with the addDocument method
         this._DB.addDocument(this._COLL,
                            {
	                           NCIN    		 : NCIN,
	                           Classe    : Classe,
                               Nom   : Nom,
                               Prenom :Prenom,
                               Faculte: Faculte,
                               Departement:Departement
	                        })
         .then((data) =>
         {
            this.clearForm();
            this.displayAlert('Record added', 'The member ' +  Nom +' ' +  Prenom + ' was successfully added');
         })
         .catch((error) =>
         {
            this.displayAlert('Adding member failed', error.message);
         });
      }
   }



   /**
    * Provide feedback to user after an operation has succeeded/failed
    *
    * @public
    * @method displayAlert
    * @param  title          {String}           Heading for alert message
    * @param  message        {String}           Content for alert message
    * @return {none}
    */
   displayAlert(title      : string,
                message    : string) : void
   {
      let alert : any     = this._ALERT.create({
         title      : title,
         subTitle   : message,
         buttons    : ['Got it!']
      });
      alert.present();
   }



   /**
    * Clear all form data
    *
    * @public
    * @method clearForm
    * @return {none}
    */
   clearForm() : void
   {
      this.NCIN  					= '';
      this.Classe				= '';
      this.Nom 				= '';
      this.Prenom ='';
      this.Faculte='';
      this.Departement='';
   }

   goToInscription() {
    this.navCtrl.push(InscriptionPage);
   
  }
}