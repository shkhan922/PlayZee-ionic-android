import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/timeout';
import { SinglePage } from '../single/single';
import { DomSanitizer, SafeResourceUrl, SafeUrl } from '@angular/platform-browser';
import { environment } from '../../environment';

@IonicPage()
@Component({
  selector: 'page-search',
  templateUrl: 'search.html',
})
export class SearchPage {

  categories = <any>[];
  searchResults = <any>[];
  query = '';
  location = '';
  category = 0;
  fresh_products = <any>[];
  featured_products = <any>[];

  constructor(public navCtrl: NavController, public navParams: NavParams, private _sanitizer: DomSanitizer, public http: Http) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad SearchPage');
    this.getCategories();
    if(this.navParams.get('query') != undefined) {
      this.query = this.navParams.get('query');
      this.getSearchResults();
      this.getFreshProducts();
      this.getFeaturedProducts();
    }
  }

  back() {
    this.navCtrl.pop();
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

  getSearchResults() {
    let path = environment.APIPath + 'search/?query=' + this.query + '&location=' + this.location + '&category=' + this.category;
    console.log(path);
        let encodedPath = encodeURI(path);
        let timeoutMS = 10000;
            this.http.get(encodedPath)
            .timeout(timeoutMS)
            .map(res => res.json()).subscribe(data => {
                let responseData = data;
                console.log(responseData);
                this.searchResults = responseData;
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

  getFreshProducts() {
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
          }

  getFeaturedProducts() {
    let path = environment.APIPath;
        let encodedPath = encodeURI(path);
        let timeoutMS = 10000;

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

  getBackgroundFaded(image) {
    return this._sanitizer.bypassSecurityTrustStyle(`linear-gradient(rgba(29, 29, 29, 0), rgba(16, 16, 23, 0.5)), url(${image})`);
  } 

  singlePage(product){
    this.navCtrl.push(SinglePage, {product: product});
  }

}
