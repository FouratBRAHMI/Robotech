import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AlertController, IonicPage, NavController, NavParams } from 'ionic-angular';
import { DatabaseProvider } from '../../providers/database/database';
import { HomePage } from '../home/home';
import { InscriptionPage } from '../Inscription/Inscription';


@IonicPage({
	name: "manage-article"
})
@Component({
  selector: 'page-manage-article',
  templateUrl: 'manage-article.html',
})
export class ManageArticlePage {



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
    * @name Titre
    * @type {string}
    * @public
    * @description     Model for Titre form field
    */
   public Titre          : string          = '';



   /**
    * @name Photo
    * @type {string}
    * @public
    * @description     Model for Photo form field
    */
   public Photo    : string          = '';



   /**
    * @name Desc
    * @type {string}
    * @public
    * @description     Model for Desc form field
    */
   public Desc 	: string          = '';



   


   

 

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
   public title 		: string		   = 'Add a new Article';



   /**
    * @name _COLL
    * @type {string}
    * @private
    * @description     property that stores the value for the database collection
    */
   private _COLL 		: string 			= "Article";


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
         'Titre' 		        : ['', Validators.required],
         'Photo' 	        : ['', Validators.required],
         'Desc'	        : ['', Validators.required],
       
        
        
      });


      // If we have navigation parameters then we need to
      // parse these as we know these will be used for
      // editing an existing record
      if(params.get('isEdited'))
      {
          let record 		        = params.get('record');

          this.Titre	            = record.location.Titre;
          this.Photo   	  = record.location.Photo;
          this.Desc      = record.location.Desc;
          
         
          
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
      let Titre	            : string		= this.form.controls["Titre"].value,
      Photo        : string 		= this.form.controls["Photo"].value,
             Desc       : string		= this.form.controls["Desc"].value
            
             
            

      // If we are editing an existing record then handle this scenario
      if(this.isEditable)
      {

         // Call the DatabaseProvider service and pass/format the data for use
         // with the updateDocument method
         this._DB.updateDocument(this._COLL,
                               this.docID,
                               {
                                 Titre    		 : Titre,
                                 Photo    : Photo,
                                  Desc   : Desc,
                                   
                                 
                                  
	                           })
         .then((data) =>
         {
            this.clearForm();
            this.displayAlert('Success', 'The member ' +  Titre +' was successfully updated');
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
	                           Titre    		 : Titre,
	                           Photo    : Photo,
                              Desc   : Desc,
                              
                              

                      
	                        })
         .then((data) =>
         {
            this.clearForm();
            this.displayAlert('Record added', 'The member ' +  Titre + ' was successfully added');
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
      this.Titre  					= '';
      this.Photo				= '';
      this.Desc 				= '';
      
     
     
   }

   goToHome() {
    this.navCtrl.push(HomePage);
   
  }
}