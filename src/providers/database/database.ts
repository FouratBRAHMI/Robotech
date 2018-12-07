import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import 'rxjs/add/operator/map';

// We MUST import both the firebase AND firestore modules like so
import * as firebase from 'firebase';
import 'firebase/firestore';

@Injectable()
export class DatabaseProvider {



   /**
    * @name _DB
    * @type {object}
    * @private
    * @description     Defines an object for handling interfacing with the
    				   Cloud Firestore database service
    */
   private _DB : any;



   constructor(public http: HttpClient)
   {
      // Initialise access to the firestore service
      this._DB = firebase.firestore();
   }



   /**
    * Create the database collection and defines an initial document
    * Note the use of merge : true flag within the returned promise  - this
    * is needed to ensure that the collection is not repeatedly recreated should
    * this method be called again (we DON'T want to overwrite our documents!)
    *
    * @public
    * @method createAndPopulateDocument
    * @param  collectionObj    {String}           The database collection we want to create
    * @param  docID            {String}           The document ID
    * @param  dataObj          {Any}              The document key/values to be added
    * @return {Promise}
    */
   createAndPopulateDocument(collectionObj : string,
                             docID         : string,
                             dataObj       : any) : Promise<any>
   {
      return new Promise((resolve, reject) =>
      {
         this._DB
         .collection(collectionObj)
         .doc(docID)
         .set(dataObj, { merge: true })
         .then((data : any) =>
         {
            resolve(data);
         })
         .catch((error : any) =>
         {
            reject(error);
         });
      });
   }



   /**
    * Return documents from specific database collection
    *
    * @public
    * @method getDocuments
    * @param  collectionObj    {String}           The database collection we want to retrieve records from
    * @return {Promise}
    */
   getDocuments(collectionObj : string) : Promise<any>
   {
      return new Promise((resolve, reject) =>
      {
         this._DB.collection(collectionObj)
         .get()
         .then((querySnapshot) =>
         {

            // Declare an array which we'll use to store retrieved documents
            let obj : any = [];


            // Iterate through each document, retrieve the values for each field
            // and then assign these to a key in an object that is pushed into the
            // obj array
            querySnapshot
            .forEach((doc : any) =>
            {
                obj.push({
                   id             : doc.id,
                   NCIN           : doc.data().NCIN,
                   Classe     : doc.data().Classe,
                   Nom    : doc.data().Nom,
                   Prenom : doc.data().Prenom,
                   Faculte:doc.data().Faculte,
                   Departement :doc.data().Departement
                });
            });


            // Resolve the completed array that contains all of the formatted data
            // from the retrieved documents
            resolve(obj);
         })
         .catch((error : any) =>
         {
            reject(error);
         });
      });
   }



   /**
    * Add a new document to a selected database collection
    *
    * @public
    * @method addDocument
    * @param  collectionObj    {String}           The database collection we want to add a new document to
    * @param  docObj           {Any}              The key/value object we want to add
    * @return {Promise}
    */
   addDocument(collectionObj : string,
             dataObj       : any) : Promise<any>
   {
      return new Promise((resolve, reject) =>
      {
         this._DB.collection(collectionObj).add(dataObj)
         .then((obj : any) =>
         {
            resolve(obj);
         })
         .catch((error : any) =>
         {
            reject(error);
         });
      });
   }



   /**
    * Delete an existing document from a selected database collection
    *
    * @public
    * @method deleteDocument
    * @param  collectionObj    {String}           The database collection we want to delete a document from
    * @param  docObj           {Any}              The document we wish to delete
    * @return {Promise}
    */
   deleteDocument(collectionObj : string,
                docID         : string) : Promise<any>
   {
      return new Promise((resolve, reject) =>
      {
         this._DB
         .collection(collectionObj)
         .doc(docID)
         .delete()
         .then((obj : any) =>
         {
            resolve(obj);
         })
         .catch((error : any) =>
         {
            reject(error);
         });
      });
   }



   /**
    * Update an existing document within a selected database collection
    *
    * @public
    * @method updateDocument
    * @param  collectionObj    {String}           The database collection to be used
    * @param  docID            {String}           The document ID
    * @param  dataObj          {Any}              The document key/values to be updated
    * @return {Promise}
    */
   updateDocument(collectionObj : string,
                docID         : string,
                dataObj       : any) : Promise<any>
   {
      return new Promise((resolve, reject) =>
      {
         this._DB
         .collection(collectionObj)
         .doc(docID)
         .update(dataObj)
         .then((obj : any) =>
         {
            resolve(obj);
         })
         .catch((error : any) =>
         {
            reject(error);
         });
      });
   }

}