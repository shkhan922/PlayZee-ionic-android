import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController } from 'ionic-angular';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/timeout';
import { DomSanitizer, SafeResourceUrl, SafeUrl } from '@angular/platform-browser';
import {CheckUserProvider} from '../../providers/check-user/check-user';
import { Camera, CameraOptions } from '@ionic-native/camera';
import { HomePage } from '../home/home';
import { environment } from '../../environment';


@IonicPage()
@Component({
  selector: 'page-edit-product',
  templateUrl: 'edit-product.html',
})
export class EditProductPage {

  product_id;
  product = <any>[];
  user_id;
  categories = <any>[];
  image;
  location;
  showAutocomplete;
  dateNow: String = new Date().toISOString();

  constructor(public navCtrl: NavController, public navParams: NavParams, private _sanitizer: DomSanitizer, public http: Http, public toastCtrl: ToastController, private checkUser: CheckUserProvider, private camera: Camera) {
    this.product_id = navParams.get('product');
    console.log(this.product_id);
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad EditProductPage');
    this.getUserProduct(this.product_id);
    this.getCategories();
    this.checkUser.get().then((id) => {
      console.log(id);
      if(id != 'null') {
        this.user_id = id;
      } else {
        console.log('redirect cause no user');
      }
    })
  }

  getUserProduct(id) {
    let path = environment.APIPath + 'products/'+ id + '/';

    let encodedPath = encodeURI(path);
        let timeoutMS = 10000;

        this.http.get(path)
            .timeout(timeoutMS)
            .map(res => res.json()).subscribe(data => {
                let responseData = data;
                console.log(responseData);
                this.product = responseData;
            },
            err => {
                console.log('error', err);
            });
  }

  getCategories() {
    let path = environment.APIPath + 'categories/';
        let encodedPath = encodeURI(path);
        let timeoutMS = 10000;

            this.http.get(encodedPath)
            .timeout(timeoutMS)
            .map(res => res.json()).subscribe(data => {
                let responseData = data;
                console.log(responseData);
                this.categories = responseData;
            },
            err => {
                console.log('error');
            });
  }

  update(product) {
    
    let path = environment.APIPath + 'products/' + this.product_id + '/';

    console.log(path);

    let encodedPath = encodeURI(path);
        let timeoutMS = 10000;

        this.http.patch(encodedPath, {title: product.title, price: product.price, body: product.body, category: product.category, author: this.user_id, date: this.dateNow, image: this.image, location: product.location, condition: product.condition, warranty: product.warranty, type: product.type}) 
            .timeout(timeoutMS)
            .map(res => res.json()).subscribe(data => {
                let responseData = data;
                console.log(responseData);
                this.presentToast('Your product was succesfully updated.');
                this.navCtrl.pop();
            },
            err => {
                console.log('error', err);
            });
  }

  getCamera() {
    const options: CameraOptions = {
      quality: 100,
      destinationType: this.camera.DestinationType.FILE_URI,
      encodingType: this.camera.EncodingType.JPEG,
      mediaType: this.camera.MediaType.PICTURE
    }
    
    this.camera.getPicture(options).then((imageData) => {
     // imageData is either a base64 encoded string or a file URI
     // If it's base64 (DATA_URL):
     console.log(imageData);
     this.image = imageData;
    }, (err) => {
     // Handle error
    });
  }

  getLibrary() {
    const options: CameraOptions = {
      quality: 100,
      destinationType: this.camera.DestinationType.FILE_URI,
      encodingType: this.camera.EncodingType.JPEG,
      mediaType: this.camera.MediaType.PICTURE,
      sourceType: this.camera.PictureSourceType.PHOTOLIBRARY
    }
    
    this.camera.getPicture(options).then((imageData) => {
     // imageData is either a base64 encoded string or a file URI
     // If it's base64 (DATA_URL):
     console.log(imageData);
     this.image = imageData;
    }, (err) => {
     // Handle error
    });
  }

  presentToast(message) {
    const toast = this.toastCtrl.create({
      message: message,
      duration: 3000
    });
    toast.present();
  }

  homePage() {
    this.navCtrl.push(HomePage);
  }  

getLocation(e) {
  console.log(e.description);
  this.product.location = e.description;
  this.showAutocomplete = false;
}

autocomplete() {
  this.showAutocomplete = true;
}

getBackground(image) {
  return this._sanitizer.bypassSecurityTrustStyle(`linear-gradient(rgba(245, 245, 245, 0), rgba(245, 245, 245, 0)), url(${image})`);
}

back() {
  this.navCtrl.pop();
}

}
