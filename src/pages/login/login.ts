import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController, AlertController } from 'ionic-angular';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/timeout';
import {CheckUserProvider} from '../../providers/check-user/check-user';
import { ProfileProvider } from '../../providers/profile/profile';
import { RegisterPage } from '../register/register';
import { HomePage } from '../home/home';
import { SinglePage } from '../single/single';
import { environment } from '../../environment';


@IonicPage()
@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})
export class LoginPage {

  user_id;

  constructor(public navCtrl: NavController, public navParams: NavParams, private alertCtrl: AlertController, public http: Http, public toastCtrl: ToastController, private checkUser: CheckUserProvider, private profile: ProfileProvider) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad LoginPage');
    this.checkUser.get().then((id) => {
        console.log(id);
        this.profile.getUserBase().then(user_base => {
          console.log('userbase: ', user_base);
        })
        this.profile.getUserProfile().then(user_profile => {
          console.log('userprofile: ', user_profile);
        })
    })
  }

  login(username, password) {
    
    let path = environment.APIPath + 'users/login/';

    let encodedPath = encodeURI(path);
        let timeoutMS = 10000;

        this.http.post(encodedPath, {username: username, password: password})
            .timeout(timeoutMS)
            .map(res => res.json()).subscribe(data => {
                let responseData = data;
                console.log(responseData);
                this.user_id = responseData.id;
                this.checkUser.set(responseData.id);
                this.profile.setUserBase(responseData.id);
                this.profile.setUserProfile(responseData.id);
                this.presentToast('Welcome '+ username +'!');
                console.log('produs id de pe login: ', this.navParams.get('product_id'));
                if(this.navParams.get('product_id')) {
                  this.navCtrl.push(SinglePage,{product:this.navParams.get('product_id')});
                } else {
                  this.navCtrl.push(HomePage);
                }
                
            },
            err => {
                console.log(err);
                this.alert('You should fill in both fields and use your credentials.');               
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

  registerPage() {
    this.navCtrl.push(RegisterPage);
  }

  homePage() {
    this.navCtrl.push(HomePage);
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
