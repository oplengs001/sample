import { Injectable } from '@angular/core';
import * as firebase from 'firebase/app';
import 'firebase/storage';
@Injectable({
  providedIn: 'root'
})
export class ImagesService {
  storageRef = firebase.storage().ref();
  folderRef
  constructor() { }
  getFiles (){

    var listRef = this.storageRef.child('image');
    listRef.listAll().then(function(res) {
      console.log(res)

      res.prefixes.forEach(function(folderRef) {
        console.log(folderRef)
   

      });
      res.items.forEach(function(itemRef) {

        // All the items under listRef.
      });

    }).catch(function(error) {
      console.log(error)
      // Uh-oh, an error occurred!
    });
  }
  uploadImage(imageURI){
    return new Promise<any>((resolve, reject) => {

      let imageRef = this.storageRef.child('image').child('imageName');
      this.encodeImageUri(imageURI, function(image64){
        imageRef.putString(image64, 'data_url')
        .then(snapshot => {
          resolve(snapshot.downloadURL)
        }, err => {
          reject(err);
        })
      })
    })
  }
  encodeImageUri(imageUri, callback) {
    var c = document.createElement('canvas');
    var ctx = c.getContext("2d");
    var img = new Image();
    img.onload = function () {
      var aux:any = this;
      c.width = aux.width;
      c.height = aux.height;
      ctx.drawImage(img, 0, 0);
      var dataURL = c.toDataURL("image/jpeg");
      callback(dataURL);
    };
    img.src = imageUri;
  };
}
