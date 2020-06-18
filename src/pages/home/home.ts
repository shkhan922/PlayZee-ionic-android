import { Component } from '@angular/core';
import { NavController, AlertController } from 'ionic-angular';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/timeout';
import { DomSanitizer, SafeResourceUrl, SafeUrl } from '@angular/platform-browser';
import { CategoryPage } from '../category/category';
import { SinglePage } from '../single/single';
import { LoginPage } from '../login/login';
import { ProfilePage } from '../profile/profile';
import {CheckUserProvider} from '../../providers/check-user/check-user';
import { environment } from '../../environment';
import { AddPage } from '../add/add';
import { MapPage } from '../map/map';
import { SearchPage } from '../search/search';


@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  fresh_products = <any>[];
  categories = <any>[];
  featured_products = <any>[];
  user_id;

  constructor(public navCtrl: NavController, public http: Http, private checkUser: CheckUserProvider, private _sanitizer: DomSanitizer, private alertCtrl: AlertController) {
    let path = environment.APIPath;
        let encodedPath = encodeURI(path);
        let timeoutMS = 10000;
 
        this.http.get(encodedPath + 'products/')
            .timeout(timeoutMS)
            .map(res => res.json()).subscribe(data => {
                let responseData = data;
                console.log(responseData);
                this.fresh_products = this.sortByKey(responseData, '-id');
            },
            err => {
                console.log('error');
            });

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

            this.http.get(encodedPath + 'featured/')
            .timeout(timeoutMS)
            .map(res => res.json()).subscribe(data => {
                let responseData = data;
                console.log(responseData);
                this.featured_products = responseData;
            },
            err => {
                console.log('error');
            });


  }

  public sortByKey(array, key) {
    return array.sort(function (a, b) {
        var x = a[key]; var y = b[key];
        return ((x < y) ? -1 : ((x > y) ? 0 : 1));
    });
  }

  getBackground(image) {
    return this._sanitizer.bypassSecurityTrustStyle(`linear-gradient(rgba(29, 29, 29, 0), rgba(16, 16, 23, 0)), url(${image})`);
  }

  getBackgroundFaded(image) {
    return this._sanitizer.bypassSecurityTrustStyle(`linear-gradient(rgba(29, 29, 29, 0), rgba(16, 16, 23, 0)), url(${image})`);
  } 

  categoryPage(cat){ 
    this.navCtrl.push(CategoryPage, {category: cat});
  }

  singlePage(product){
    this.navCtrl.push(SinglePage, {product: product});
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad LoginPage');
    this.checkUser.get().then((id) => {
        console.log(id);
        this.user_id = id;
    })
  }

  accountPage(){
    if(this.user_id != 'null') {
      this.navCtrl.push(ProfilePage);
    } else {
      this.navCtrl.push(LoginPage);
    }
  }

  addPage(){
    this.navCtrl.push(AddPage);
  }

  mapPage(){
    this.navCtrl.push(MapPage);
  }

  searchPage(){
    //this.navCtrl.push(SearchPage);
    this.searchBox();
  }

  searchBox() {
    let alert = this.alertCtrl.create({
      title: 'Enter searching terms...',
      inputs: [
        {
          name: 'query',
          placeholder: 'Enter your search query...'
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
          text: 'Search',
          handler: data => {
            console.log(data.query);
            this.navCtrl.push(SearchPage, {query: data.query});
          }
        }
      ]
    });
    alert.present();
  }


}