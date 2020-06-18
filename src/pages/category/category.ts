import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/timeout';
import { DomSanitizer, SafeResourceUrl, SafeUrl } from '@angular/platform-browser';
import { SinglePage } from '../single/single';
import { AddPage } from '../add/add';
import { environment } from '../../environment';


@IonicPage()
@Component({
  selector: 'page-category',
  templateUrl: 'category.html',
})
export class CategoryPage {

  products = <any>[];
  category = <any>[];

  constructor(public navCtrl: NavController, public navParams: NavParams, public http: Http, private _sanitizer: DomSanitizer) {
    let category = navParams.get('category');
    console.log(category);

    let path = environment.APIPath + 'categories/'+category + '/';

    let encodedPath = encodeURI(path);
        let timeoutMS = 10000;

        this.http.get(encodedPath)
            .timeout(timeoutMS)
            .map(res => res.json()).subscribe(data => {
                let responseData = data;
                console.log(responseData);
                this.category = responseData;
                this.products = responseData.products;
            },
            err => {
                console.log('error');
            });

  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad CategoryPage');
  }

  getBackgroundFaded(image) {
    return this._sanitizer.bypassSecurityTrustStyle(`linear-gradient(rgba(29, 29, 29, 0), rgba(16, 16, 23, 0.5)), url(${image})`);
  } 

  singlePage(product){
    this.navCtrl.push(SinglePage, {product: product});
  }

  addPage(product){
    this.navCtrl.push(AddPage, {category: this.category.id});
  }

  back() {
    this.navCtrl.pop();
  }

}
