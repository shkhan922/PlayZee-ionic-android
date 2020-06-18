import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController } from 'ionic-angular';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/timeout';
import { DomSanitizer, SafeResourceUrl, SafeUrl } from '@angular/platform-browser';
import { AlertController } from 'ionic-angular';
import {CheckUserProvider} from '../../providers/check-user/check-user';
import { ProfileProvider } from '../../providers/profile/profile';
import { Camera, CameraOptions } from '@ionic-native/camera';
import { HomePage } from '../home/home';
import { AddPage } from '../add/add';
import { MapPage } from '../map/map';
import { EditProductPage } from '../edit-product/edit-product';
import { environment } from '../../environment';
import { SinglePage } from '../single/single';
import {FavouriteProvider} from '../../providers/favourite/favourite';


@IonicPage()
@Component({
  selector: 'page-profile',
  templateUrl: 'profile.html',
})
export class ProfilePage {

  user_base =<any>[];
  user_profile =<any>[];
  image = null;
  user_id;
  tab = 'products';
  user_products =<any>[];
  user_trades =<any>[];
  user_favourite_products =<any>[];
  user_favourites =<any>[];
  user_offers =<any>[];
  offer_user =<any>[];

  constructor(public navCtrl: NavController, public navParams: NavParams, public http: Http, private camera: Camera, private favs: FavouriteProvider, public alertCtrl: AlertController, private _sanitizer: DomSanitizer, public toastCtrl: ToastController, private checkUser: CheckUserProvider, private profile: ProfileProvider) {

  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ProfilePage');
    this.checkUser.get().then((id) => {
      this.user_id = id;
        console.log(id);
        this.getUserProfile();
        this.getUserProducts(this.user_id);
    })
  }

  logout() {
    this.checkUser.clear();
    this.profile.clear();
    this.presentToast('See you soon!');
    this.navCtrl.push(HomePage);
  }

  presentToast(message) {
    const toast = this.toastCtrl.create({
      message: message,
      duration: 3000
    });
    toast.present();
  }

  getUserProfile() {
    this.profile.getUserBase().then(data => {
      console.log(data);
      this.user_base = data;
    })
    this.profile.getUserProfile().then(data => {
      console.log(data);
      this.user_profile = data;
      console.log(data);
    })
  }

  getBackground(image) {
    return this._sanitizer.bypassSecurityTrustStyle(`url(${image})`);
  }
  getBackgroundFaded(image) {
    return this._sanitizer.bypassSecurityTrustStyle(`linear-gradient(rgba(0, 0, 0, 0.8), rgba(0, 0, 0, 0.95)), url(${image})`);
  }

  showConfirm() {
    const confirm = this.alertCtrl.create({
      title: 'Change profile image',
      message: 'Choose either to take a new picture, or load one from your gallery.',
      buttons: [
        {
          text: 'Camera',
          handler: () => {
            this.getCamera();
          }
        },
        {
          text: 'Library',
          handler: () => {
            this.getLibrary();
          }
        }
      ]
    });
    confirm.present();
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
     this.updateImage(imageData);
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
     this.updateImage(imageData);
    }, (err) => {
     // Handle error
    });
  }

  updateImage(image) {
    let path = environment.APIPath + 'users/profiles/' + this.user_id + '/';

    let encodedPath = encodeURI(path);
        let timeoutMS = 10000;

        this.http.put(encodedPath, {image: image, user:this.user_id,location:this.user_profile.location})
            .timeout(timeoutMS)
            .map(res => res.json()).subscribe(data => {
                let responseData = data;
                console.log(responseData);
                this.presentToast('Your image was updated.');
            },
            err => {
                console.log('error', err);
            });
  }

  changeTab(tab) {
    this.tab = tab;
    if(tab == 'products') {
      this.getUserProducts(this.user_id);
    }
    if(tab == 'trades') {
      this.getUserTrades(this.user_id);
    }
    if(tab == 'favourites') {
      this.user_favourites = [];
      this.user_favourite_products = [];
      this.getFavs();
    }
    if(tab == 'offers') {
      this.getUserOffers(this.user_id);
    }
  }
  

  back() {
    this.navCtrl.pop();
  }

  getUserProducts(id) {
    console.log(id);
    let path = environment.APIPath + 'userproducts/' + id + '/';

    let encodedPath = encodeURI(path);
        let timeoutMS = 10000;

        this.http.get(path)
            .timeout(timeoutMS)
            .map(res => res.json()).subscribe(data => {
                let responseData = data;
                console.log(responseData);
                this.user_products = responseData;
            },
            err => {
                console.log('error', err);
            });
  }

  getUserOffers(id) {
    console.log(id);
    let path = environment.APIPath + 'useroffers/' + id + '/';

    let encodedPath = encodeURI(path);
        let timeoutMS = 10000;

        this.http.get(path)
            .timeout(timeoutMS)
            .map(res => res.json()).subscribe(data => {
                let responseData = data;
                console.log(responseData);
                this.user_offers = responseData;
            },
            err => {
                console.log('error', err);
            });
  }

  declineOffer(id) {
    let path = environment.APIPath + 'offers/' + id + '/';

    let encodedPath = encodeURI(path);
        let timeoutMS = 10000;

        this.http.delete(path)
            .timeout(timeoutMS)
            .map(res => res.json()).subscribe(data => {
                let responseData = data;
                console.log(responseData);
                this.getUserOffers(this.user_id);
            },
            err => {
                console.log('error', err);
            });
  }

  acceptOffer(id) {
    let path = environment.APIPath + 'users/profiles/' + id + '/';

    let encodedPath = encodeURI(path);
        let timeoutMS = 10000;

        this.http.get(path)
            .timeout(timeoutMS)
            .map(res => res.json()).subscribe(data => {
                let responseData = data;
                console.log(responseData);
                this.offer_user = responseData;

                let path = environment.APIPath + 'users/' + id + '';

    let encodedPath = encodeURI(path);
        let timeoutMS = 10000;

        this.http.get(path)
            .timeout(timeoutMS)
            .map(res => res.json()).subscribe(data => {
                let responseData = data;
                console.log(responseData);

                let alert = this.alertCtrl.create({
                  title: 'Hey, great news!',
                  message: 'Do you want to get in touch with ' + responseData.username + '?',
                  buttons: [
                    {
                      text: 'Not now',
                      role: 'cancel',
                      handler: () => {
                        console.log('Cancel clicked');
                      }
                    },
                    {
                      text: 'Call',
                      handler: () => {
                        console.log(this.offer_user.phone);
                      }
                    }
                  ]
                });
                alert.present();

            },
            err => {
              console.log('error', err);
          });

            })

                
            
  }

  getUserTrades(id) {
    let path = environment.APIPath + 'usertrades/' + id + '/';

    let encodedPath = encodeURI(path);
        let timeoutMS = 10000;

        this.http.get(path)
            .timeout(timeoutMS)
            .map(res => res.json()).subscribe(data => {
                let responseData = data;
                console.log(responseData);
                this.user_trades = responseData;
            },
            err => {
                console.log('error', err);
            });
  }

  editProductPage(id) {
    this.navCtrl.push(EditProductPage, {product: id});
  }

  singlePage(product){
    this.navCtrl.push(SinglePage, {product: product});
  }

  homePage(){
    this.navCtrl.push(HomePage);
  }

  addPage(){
    this.navCtrl.push(AddPage);
  }

  mapPage(){
    this.navCtrl.push(MapPage);
  }

  getFavs() {
    this.favs.get().then(data => {
      console.log(data);
      data.forEach(d => {
        console.log('here  ', d);

        let path = environment.APIPath + 'products/' + d + '/';

        let encodedPath = encodeURI(path);
        let timeoutMS = 10000;

        this.http.get(path)
            .timeout(timeoutMS)
            .map(res => res.json()).subscribe(data => {
                let responseData = data;
                console.log(responseData);
                this.user_favourites.push(responseData);
            },
            err => {
                console.log('error', err);
            });

      })
      this.user_favourite_products = data;
      console.log('uf: ', this.user_favourites);
    })
  }

}
