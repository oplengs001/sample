import { Injectable } from '@angular/core';
import * as firebase from 'firebase/app';
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument, DocumentReference } from '@angular/fire/firestore';
import { AuthService } from "../../services/auth/auth.service"
import { Observable ,combineLatest, of } from 'rxjs';
import 'firebase/storage';

import { map ,switchMap } from 'rxjs/operators';

export interface ImageItem {
  uid?: string,
  item_path: string,
  url : string,
  uploaded_by: string,
  date_uploaded: number,
  file_name : string
  comments?: [],
  likes?:[],
}
@Injectable({
  providedIn: 'root'
})

export class ImagesService {
  private imageItem: Observable<ImageItem[]>;
  private imageItemHome: Observable<ImageItem[]>;
  private ImageCollection: AngularFirestoreCollection<ImageItem>;
  storageRef = firebase.storage().ref();
  itemRef : ImageItem =
  {
    item_path: '',
    url : '',
    uploaded_by: '',
    file_name : '',
    date_uploaded: Date.now(),
  };
  
  constructor(
    private authServ: AuthService,
    private afs: AngularFirestore,
    ) {  
    this.ImageCollection = this.afs.collection<ImageItem>('images');
    this.imageItem = this.ImageCollection.snapshotChanges().pipe(
      map(actions => {
        return actions.map(a => {
          
          const data = a.payload.doc.data();                  
          const id = a.payload.doc.id;
              
          return { id, ...data};
        });
      })
    )
    this.imageItemHome = this.ImageCollection.snapshotChanges().pipe(
      map(actions => {
        return actions.map(a => {
          
          const data = a.payload.doc.data();                  
          const id = a.payload.doc.id;
              
          return { id, ...data};
        });
      })
    )
  }

  getReferences(): Observable<ImageItem[]> {
    return this.imageItem
  }
  getRefHome(): Observable<ImageItem[]> {
    return this.imageItemHome
  }
  addImageRef(imageRef: ImageItem[]): Promise<any> {
    return this.ImageCollection.doc(this.itemRef.file_name).set(imageRef);
  } 
  uploadImage(imageURI){
    return new Promise<any>((resolve, reject) => {
      var uid = this.makeid(10)
      var itemRef = this.itemRef
      var cUID = this.authServ.currentUserId()
      
      let imageRef = this.storageRef.child('image').child(uid);  
      this.encodeImageUri(imageURI, function(image64){
        imageRef.putString(image64, 'data_url')
        .then(async snapshot => {
          console.log(snapshot)
          var item_path = snapshot.metadata.fullPath        
          var file_name = snapshot.metadata.name
          await snapshot.ref.getDownloadURL().then((downloadURL) => {    
            itemRef.url = downloadURL
            itemRef.item_path = item_path       
            itemRef.uploaded_by = cUID
            itemRef.file_name  = file_name
          })
          resolve(itemRef)
        }, err => {
          console.log(err)
          reject(err);
        })
      })
    
    })
  }
  deleteImageRef(id: string): Promise<any> {    
    return this.ImageCollection.doc(id).delete();
  }
  deleteImageStorage(imageName:string){
    this.storageRef.child("image").child(imageName).delete()
    console.log("deleted")
  }
  getImage() :any{
    var storage = firebase.storage();
    var pathReference = storage.ref("image/uak1m8IGFr");
    pathReference.getDownloadURL().then(function(url) {
      console.log(url)
      return url
    }).catch(function(error) {
      return error
    });
  }
  getFiles (){
    var listRef = this.storageRef.child('image');
    listRef.listAll().then(function(res) {    
      console.log(res)

      res.items.forEach(function(itemRef) {
        itemRef.getDownloadURL().then(function(url) {
          // console.log(url)
        }).catch(function(error) {
          return error
        });
        // All the items under listRef.
      });

    }).catch(function(error) {
      console.log(error)
      // Uh-oh, an error occurred!
    });
  }  
  saveImageRef (imageURI):Promise <any>{      
     return this.uploadImage(imageURI).then((itemRef) => {            
        this.addImageRef(itemRef).then((added) => {
          console.log(added)
          return added
        }, err => {
          console.log(err)
          return err
        });  
    })
   
  }  
  removeImageRef (post:any){
    const {file_name} = post
    this.deleteImageRef(file_name)
    .then(()=>{
     return this.deleteImageStorage(file_name)
    })
    // .catch(err=>{ console.log(err) return err})
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
  joinUsers(post$: Observable<any>) {
    let post;
    const joinKeys = {};
  
    return post$.pipe(
      switchMap(c => {
        // Unique User IDs
        post = c;
        const uids = Array.from(new Set(c.map(v => v.uploaded_by)));
  
        // Firestore User Doc Reads
        const userDocs = uids.map(u =>         
          firebase.firestore().collection("guests").doc(`${u}`).get().then( userGuestProfile=>{
            return userGuestProfile.data()
          })
        );                       
        return userDocs.length ? combineLatest(userDocs) : of([]);
      }),
      map(arr => {        
        arr.forEach(v => (joinKeys[(<any>v).uid] = v));
        post = post.map(v => {          
          return { ...v, user: joinKeys[v.uploaded_by] };
        });
  
        return post;
      })
    );
  }
  makeid(length) {
    var result           = '';
    var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;
    for ( var i = 0; i < length; i++ ) {
       result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
  }
 
}
