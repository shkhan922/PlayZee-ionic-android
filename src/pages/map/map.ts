import { Component, ViewChild, ElementRef } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/timeout';
import { Geolocation } from '@ionic-native/geolocation';
import { environment } from '../../environment';
import { SinglePage } from '../single/single';

declare var google;

@IonicPage()
@Component({
  selector: 'page-map',
  templateUrl: 'map.html',
})
export class MapPage {

  @ViewChild('map') mapElement: ElementRef;
  map: any;
  geocoder: any;
  mapOptions = <any>[];
  product = <any>[];

  products = <any>[];

  constructor(public navCtrl: NavController, public navParams: NavParams, public http: Http, private geolocation: Geolocation) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad MapPage');
    if(this.navParams.get('product')) {
      this.product = this.navParams.get('product');
      this.loadMap({lat:0, lng:0});
      this.geocodeSingle(this.map, this.product, this.navCtrl);
    } else {
      this.locate();
    } 
  }

  locate() {
    this.geolocation.getCurrentPosition().then((resp) => {
      this.loadMap({lat:resp.coords.latitude, lng:resp.coords.longitude});
     }).catch((error) => {
       console.log('Error getting location', error);
       this.loadMap({lat:0, lng:0});
     });
  }

  getProducts() {
    let path = environment.APIPath + 'products/';
        let encodedPath = encodeURI(path);
        let timeoutMS = 10000;

        this.http.get(encodedPath)
            .timeout(timeoutMS)
            .map(res => res.json()).subscribe(data => {
                let responseData = data;
                console.log(responseData);
                this.products = responseData;
                responseData.forEach(prod => {
                  console.log('prodd: ', prod);
                  this.geocode(this.map, prod, this.navCtrl);
                })
            },
            err => {
                console.log('error');
            });
  }

  loadMap(coords){

          this.mapOptions = {
            center: coords,
            zoom: 12,
            mapTypeId: google.maps.MapTypeId.ROADMAP,
            // style https://snazzymaps.com
            styles: [{"featureType":"landscape.natural","elementType":"geometry.fill","stylers":[{"visibility":"on"},{"color":"#e0efef"}]},{"featureType":"poi","elementType":"geometry.fill","stylers":[{"visibility":"on"},{"hue":"#1900ff"},{"color":"#c0e8e8"}]},{"featureType":"road","elementType":"geometry","stylers":[{"lightness":100},{"visibility":"simplified"}]},{"featureType":"road","elementType":"labels","stylers":[{"visibility":"off"}]},{"featureType":"transit.line","elementType":"geometry","stylers":[{"visibility":"on"},{"lightness":700}]},{"featureType":"water","elementType":"all","stylers":[{"color":"#65a4d7"}]}]
          }
            this.map = new google.maps.Map(this.mapElement.nativeElement, this.mapOptions);         
            this.getProducts();
  }
 
  geocode(map, product, navCtrl) {
    this.geocoder = new google.maps.Geocoder();
  
    this.geocoder.geocode( { 'address': product.location }, function(results, status) {
      if (status == google.maps.GeocoderStatus.OK) {

          let icon = {
            url: product.image,
            origin: new google.maps.Point(0,0),
            anchor: new google.maps.Point(0, 0)
        };
          let marker = new google.maps.Marker({
            map: this.map,
            animation: google.maps.Animation.DROP,
            position: results[0].geometry.location,
            icon: icon,
            label: name,
            product: product.id
          });
          marker.setMap(map);
          marker.addListener('click', function(e) {
            console.log(marker);
            navCtrl.push(SinglePage, {product: marker.product});
          });

      } else {
          console.log("Unable to find address: " + status);
      }
      
      });
  }

  geocodeSingle(map, product, navCtrl) {
    this.geocoder = new google.maps.Geocoder();
  
    this.geocoder.geocode( { 'address': product.location }, function(results, status) {
      if (status == google.maps.GeocoderStatus.OK) {

          let icon = {
            url: product.image,
            origin: new google.maps.Point(0,0),
            anchor: new google.maps.Point(0, 0)
        };
          let marker = new google.maps.Marker({
            map: this.map,
            animation: google.maps.Animation.DROP,
            position: results[0].geometry.location,
            icon: icon,
            label: name,
            product: product.id
          });
          marker.setMap(map);
          marker.addListener('click', function(e) {
            console.log(marker);
            navCtrl.push(SinglePage, {product: marker.product});
          });

          map.panTo(results[0].geometry.location);

      } else {
          console.log("Unable to find address: " + status);
      }
      
      });
  }

  back() {
    this.navCtrl.pop();
  }

}

