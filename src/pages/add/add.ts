import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController, AlertController } from 'ionic-angular';
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
  selector: 'page-add',
  templateUrl: 'add.html',
})
export class AddPage {

  user_id;
  categories = <any>[];
  image;
  location;
  showAutocomplete;
  category;
  dateNow: String = new Date().toISOString();
  type = 'sell';
  condition = 'new';
  warranty = 'false';
  shipping = 'false';

  constructor(public navCtrl: NavController, public navParams: NavParams, private _sanitizer: DomSanitizer, private alertCtrl: AlertController, public http: Http, public toastCtrl: ToastController, private checkUser: CheckUserProvider, private camera: Camera) {

  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad AddPage');
    this.getCategories();
    this.checkUser.get().then((id) => {
      console.log(id);
      if(id != 'null') {
        this.user_id = id;
      } else {
        console.log('redirect cause no user');
      }
    })
    if(this.navParams.get('category')) {
      this.category = this.navParams.get('category');
    }
  }

  getCategories() {
    let path = environment.APIPath;
        let encodedPath = encodeURI(path);
        let timeoutMS = 10000;

            this.http.get(encodedPath + 'categories/')
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

  add(title, price, body, category, location, condition, warranty, type) {

    if(type == 'giveaway') {
      price = 0;
    }
    
    let path = environment.APIPath;

    let encodedPath = encodeURI(path + 'products/');
        let timeoutMS = 10000;

        this.http.post(encodedPath, {title: title, price: price, body: body, category: category, author: this.user_id, date: this.dateNow, image: this.image, location: location, condition: condition, warranty: warranty, type: type}) 
            .timeout(timeoutMS)
            .map(res => res.json()).subscribe(data => {
                let responseData = data;
                console.log(responseData);
                this.presentToast('Your product was succesfully submitted.');
                this.navCtrl.push(HomePage);
            },
            err => {
                console.log('error', err);
                this.alert('You should fill in all the fields.');
            });
  }

  alert(subtitle) {
    let alert = this.alertCtrl.create({
      title: 'Something wrong!',
      subTitle: subtitle,
      buttons: ['Got it']
    });
    alert.present();
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
  this.location = e.description;
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
