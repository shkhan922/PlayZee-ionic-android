import { Component } from '@angular/core';
import { NavController, NavParams, ActionSheetController, AlertController } from 'ionic-angular';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/timeout';
import { CallNumber } from '@ionic-native/call-number';
import { SocialSharing } from '@ionic-native/social-sharing';
import { DomSanitizer, SafeResourceUrl, SafeUrl } from '@angular/platform-browser';
import {CheckUserProvider} from '../../providers/check-user/check-user';
import { TradeDetailsPage } from '../trade-details/trade-details';
import { LoginPage } from '../login/login';
import { MapPage } from '../map/map';
import { environment } from '../../environment';
import {ProfileProvider} from '../../providers/profile/profile';
import {FavouriteProvider} from '../../providers/favourite/favourite';


@Component({
  selector: 'page-single',
  templateUrl: 'single.html'
})
export class SinglePage {
  product = <any>[];
  category = <any>[];
  user_id; 
  product_id;
  comm;
  comments = <any>[];
  showDescription = false;
  user_base = <any>[];
  user_profile = <any>[];
  reply_id = 0;
  user_favourites = <any>[];
  isFav;
  product_user_profile = <any>[];
  comments_length;
  comments_start = 5;

  constructor(public navCtrl: NavController, public navParams: NavParams, public http: Http, private socialSharing: SocialSharing, private alertCtrl: AlertController, private callNumber: CallNumber, private profile: ProfileProvider, private favs: FavouriteProvider, private _sanitizer: DomSanitizer, private checkUser: CheckUserProvider, public actionSheetCtrl: ActionSheetController) {
    // If we navigated to this page, we will have an item available as a nav param
    this.product_id = navParams.get('product');
    console.log(this.category);
  }

  public sortByKey(array, key) {
    return array.sort(function (a, b) {
        var x = a[key]; var y = b[key];
        return ((x < y) ? -1 : ((x > y) ? 0 : 1));
    });
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad SinglePage');
    this.getProductDetails();
    this.checkUser.get().then((id) => {
      console.log(id);
      if(id != 'null') {
        this.user_id = id;
        this.getUserProfile();
      } else {
        console.log('hiding comments form cause no user');
      }
    })
  }

  getUserProfile() {
    this.profile.getUserBase().then(data => {
      console.log(data);
      this.user_base = data;
    })
    this.profile.getUserProfile().then(data => {
      console.log(data);
      this.user_profile = data;
    })
  }

  getProductUserProfile(id) {
    let path = environment.APIPath + 'users/profiles/' + id + '/'

    let encodedPath = encodeURI(path);
        let timeoutMS = 10000;

        this.http.get(encodedPath)
            .timeout(timeoutMS)
            .map(res => res.json()).subscribe(data => {
                let responseData = data;
                console.log(responseData);
                this.product_user_profile = responseData;
            },
            err => {
                console.log('error');
            });
  }

  getCategoryName(cat) {
    let cat_id = this.navParams.get('category');
    let path = environment.APIPath + 'categories/' + cat + '/'

    let encodedPath = encodeURI(path);
        let timeoutMS = 10000;

        this.http.get(encodedPath)
            .timeout(timeoutMS)
            .map(res => res.json()).subscribe(data => {
                let responseData = data;
                console.log(responseData);
                this.category = responseData;
            },
            err => {
                console.log('error');
            });
  }

  getProductDetails() {
    let path = environment.APIPath + 'products/' + this.product_id + '/';

    let encodedPath = encodeURI(path);
        let timeoutMS = 10000;

        this.http.get(encodedPath)
            .timeout(timeoutMS)
            .map(res => res.json()).subscribe(data => {
                let responseData = data;
                console.log(responseData);
                this.product = responseData;
                this.comments = this.sortByKey(responseData.comments, '-id');
                this.getCategoryName(responseData.category);
                this.checkFav(responseData.id);
                this.getProductUserProfile(responseData.author);
                this.comments_length = responseData.comments.length;
            },
            err => {
                console.log('error');
            });
  }

  loadMoreComments() {
    this.comments_start += 5; 
  }

  postComment(comm) {
    let path = environment.APIPath + 'comments/';

    let encodedPath = encodeURI(path);
        let timeoutMS = 10000;

        this.http.post(encodedPath, {text: comm, product_id: this.product.id, sender: this.user_id, sender_name: this.user_base.username, sender_image: this.user_profile.image})
            .timeout(timeoutMS)
            .map(res => res.json()).subscribe(data => {
                let responseData = data;
                console.log(responseData);
                this.getProductDetails();
                this.comm = '';
               if(this.reply_id != 0) { 
                  console.log('send notification to reply receiver ' + this.reply_id); 
                  this.reply_id = 0;
              } else {
                console.log('send notification to product author ' + this.product.author);
                this.reply_id = 0;
              }
            },
            err => {
                console.log('error', err);
            });
  }

  reply(name, id) {
    this.comm = name + ', ';
    document.getElementById("focusTo").focus();
    console.log(id);
    this.reply_id = id;
  }

  getBackground(image) {
    return this._sanitizer.bypassSecurityTrustStyle(`linear-gradient(rgba(0, 0, 0, 0) 0%, rgba(0, 0, 0, .1) 70%, rgba(0, 0, 0, .8) 100%), url(${image})`);
  }

  directTologin() {
    let alert = this.alertCtrl.create({
      title: 'You are not logged in',
      message: 'Would you like to access your account?',
      buttons: [
        {
          text: 'No, I\'m fine.',
          role: 'cancel',
          handler: () => {
            console.log('Cancel clicked');
          }
        },
        {
          text: 'Yes sure.',
          handler: () => {
            this.navCtrl.push(LoginPage, {product_id:this.product.id});
          }
        }
      ]
    });
    alert.present();
  }

  trade() {
    if(this.user_id) {
      let path = environment.APIPath + 'userproducts/' + this.user_id + '/';

    let encodedPath = encodeURI(path);
        let timeoutMS = 10000;

        this.http.get(encodedPath)
            .timeout(timeoutMS)
            .map(res => res.json()).subscribe(data => {
                let responseData = data;
                console.log(responseData);

                let buttons = [];
                  for (let btn of responseData) {
                    console.log(btn.title);
                    let button = {
                      text: btn.title,
                      handler: () => {
                        this.navCtrl.push(TradeDetailsPage, {offered_product: btn, desired_product: this.product});
                        return true;
                      }
                    }
                    buttons.push(button);
                  }
                  buttons.push({
                    text: 'Cancel',
                    role: 'destructive',
                    handler: () => {
                      console.log('Destructive clicked');
                    }
                  });
                  console.log(buttons);

                  let actionSheet = this.actionSheetCtrl.create({
                    title: 'Select one product to trade',
                    buttons: buttons,
                  });
                  actionSheet.present();

            },
            err => {
                console.log('error');
            });
    } else {
      this.directTologin();
    }
    
  }

  offer() {
    if(this.user_id) {
    let alert = this.alertCtrl.create({
      title: 'Make an offer for '+this.product.title + ' priced at $' +this.product.price,
      inputs: [
        {
          name: 'amount',
          placeholder: 'Amount (US $)'
        },
      ],
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          handler: data => {
            console.log('Cancel clicked');
          }
        },
        {
          text: 'Send',
          handler: data => {
            console.log(data.amount, this.product.id, this.product.author);
            // this.product.id this.product.author
            let path = environment.APIPath + 'offers/';

            let encodedPath = encodeURI(path);
                let timeoutMS = 10000;
        
                this.http.post(encodedPath, {product: this.product.id, amount: data.amount, product_user: this.product.author, sender: this.user_base.id, sender_name: this.user_base.username, product_title: this.product.title})
                    .timeout(timeoutMS)
                    .map(res => res.json()).subscribe(data => {
                        let responseData = data;
                        console.log(responseData);
                    },
                    err => {
                        console.log('error', err);
                    });
          }
        }
      ]
    });
    alert.present();
   } else {
    this.directTologin();
    }
  }

  favourite(id) {
    console.log('favourite', id); 
    this.favs.set(id).then(data => {
      console.log('datatatata', data);
      this.checkFav(id);
    })
    this.getFavs();
  }

  removeFavourite(id) {
    this.favs.remove(id).then(data => {
      this.checkFav(id);
    })
    this.getFavs();
  }

  getFavs() {
    this.favs.get().then(data => {
      console.log(data);
      this.user_favourites = data;
      console.log('uf: ', this.user_favourites);
    })
  }

  checkFav(id) {
    this.favs.check(id).then(resp => {
      console.log(resp);
      this.isFav = resp;
    })
  }
 
  map() {
    this.navCtrl.push(MapPage, {product: this.product})
  }

  description() {
    if(this.showDescription == false) {
      this.showDescription = true;
    } else {
      this.showDescription = false;
    }
  }

  phone(number) {
    console.log('phone: ', number);
    this.callNumber.callNumber(number, true)
  .then(res => console.log('Launched dialer!', res))
  .catch(err => console.log('Error launching dialer', err));
  }

  share() {
    // share(message, subject, file, url)
    this.socialSharing.share(this.product.body, 'Check this out: ' + this.product.title, this.product.image, null);
  }

  report() {
    let path = environment.APIPath + 'reported/';

    let encodedPath = encodeURI(path);
        let timeoutMS = 10000;

        this.http.post(encodedPath, {product: this.product.id,})
            .timeout(timeoutMS)
            .map(res => res.json()).subscribe(data => {
                let responseData = data;
                console.log(responseData);
                let alert = this.alertCtrl.create({
                  title: 'Report sent',
                  subTitle: 'We\'ve got your notification. Thank you!' ,
                  buttons: ['Dismiss']
                });
                alert.present();
            },
            err => {
                console.log('error', err);
            });
  }

  back() {
    this.navCtrl.pop();
  }
   
}
