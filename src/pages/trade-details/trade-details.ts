import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController } from 'ionic-angular';
import {CheckUserProvider} from '../../providers/check-user/check-user';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/timeout';
import { environment } from '../../environment';


@IonicPage()
@Component({
  selector: 'page-trade-details',
  templateUrl: 'trade-details.html',
})
export class TradeDetailsPage {

  offered_product; 
  desired_product;
  user_id;
  amount;
  difference = 'plus';

  constructor(public navCtrl: NavController, public navParams: NavParams, public http: Http, public toastCtrl: ToastController, private checkUser: CheckUserProvider) {
    this.offered_product = this.navParams.get('offered_product');
    this.desired_product = this.navParams.get('desired_product');
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad TradeDetailsPage');

    this.checkUser.get().then((id) => {
      console.log(id);
      if(id != 'null') {
        this.user_id = id;
        console.log(this.offered_product, this.desired_product, this.user_id);
      } else {

      }
    })
  }

  send() {
    let path = environment.APIPath + 'trades/';

    let encodedPath = encodeURI(path);
        let timeoutMS = 10000;

        if(this.difference == 'minus') {
          this.amount = 0 - this.amount;
        } else {

        }

        this.http.post(encodedPath, {desired_product: this.desired_product.id, offered_product: this.offered_product.id, offered_amount: this.amount, receiving_user: this.desired_product.author, offered_product_title: this.offered_product.title, desired_product_title: this.desired_product.title})
            .timeout(timeoutMS)
            .map(res => res.json()).subscribe(data => {
                let responseData = data;
                console.log(responseData);
                this.presentToast('We just sent your offer. Good luck!');
                this.navCtrl.pop();
            },
            err => {
                console.log('error', err);
            });
  }

  presentToast(message) {
    const toast = this.toastCtrl.create({
      message: message,
      duration: 3000
    });
    toast.present();
  }
  
  back() {
    this.navCtrl.pop();
  }

}
