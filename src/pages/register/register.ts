import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController, AlertController } from 'ionic-angular';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/timeout';
import { LoginPage } from '../login/login';
import { HomePage } from '../home/home';
import { environment } from '../../environment';


@IonicPage()
@Component({
  selector: 'page-register',
  templateUrl: 'register.html',
})
export class RegisterPage {

  constructor(public navCtrl: NavController, public navParams: NavParams, public http: Http, private alertCtrl: AlertController, public toastCtrl: ToastController) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad RegisterPage');
  }

  register(username, email, password1, password2) {
    
    let path = environment.APIPath + 'rest-auth/register/';

    let encodedPath = encodeURI(path);
        let timeoutMS = 10000;

        this.http.post(encodedPath, {username: username,email: email, password1: password1, password2: password2})
            .timeout(timeoutMS)
            .map(res => res.json()).subscribe(data => {
                let responseData = data;
                console.log(responseData);
                this.presentToast('Glad to have you here, '+ username +'! You can login now using your credentials.');
                this.navCtrl.push(LoginPage);
            },
            err => {
                console.log('error', err);
                this.alert('You should fill in all the fields. <br><br> Password should have at least 8 characters and you have to use both numbers, characters and letters.'); 
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

  loginPage() {
    this.navCtrl.push(LoginPage);
  }

  homePage() {
    this.navCtrl.push(HomePage);
  }

  presentToast(message) {
    const toast = this.toastCtrl.create({
      message: message,
      duration: 5000
    });
    toast.present();
  }

  back() {
    this.navCtrl.pop();
  }

}
 