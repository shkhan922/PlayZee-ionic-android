import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/timeout';
import { Storage } from '@ionic/storage';
import { environment } from '../../environment';

@Injectable()
export class ProfileProvider {

  user_base = <any>[];
  user_profile = <any>[];
  toReturn = <any>[];

  constructor(public http: Http, private storage: Storage) {
    
  }

  setUserBase(id) {
    let path = environment.APIPath + 'users/' + id + '';

    let encodedPath = encodeURI(path);
        let timeoutMS = 10000;

    return this.http.get(encodedPath)
            .timeout(timeoutMS)
            .map(res => res.json()).subscribe(data => {
                let responseData = data;
                this.storage.set('user_base', responseData);
            },
            err => {
                return err;
            });
  }

  setUserProfile(id) {
    let path = environment.APIPath + 'users/profiles/' + id + '/';

    let encodedPath = encodeURI(path);
        let timeoutMS = 10000;

    return this.http.get(encodedPath)
            .timeout(timeoutMS)
            .map(res => res.json()).subscribe(data => {
              console.log(data);
                let responseData = data;
                console.log(data);
                this.storage.set('user_profile', responseData);
            },
            err => {
              console.log('error', err);

              let path = environment.APIPath + 'users/profiles/';

              let encodedPath = encodeURI(path);
                  let timeoutMS = 10000;

                  return this.http.post(encodedPath, {image: 'data:image/gif;base64,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', user:id, location:''})
                      .timeout(timeoutMS)
                      .map(res => res.json()).subscribe(data => {
                          let responseData = data;
                          console.log(responseData);
                      },
                      err => {
                        console.log('error', err);
                      });


            });
  }

 

  clear() {
    this.storage.set('user_base', null);
    this.storage.set('user_profile', null);
  }

  getUserBase() {
    return this.storage.get('user_base').then((val) => {
      if(val != 'null') {
          return val;  
      } else {
        return 'null';
      }
    });
  }

  getUserProfile() {
    return this.storage.get('user_profile').then((val) => {
      if(val != 'null') {
          return val;  
      } else {
        return 'null';
      }
    });
  }

}
