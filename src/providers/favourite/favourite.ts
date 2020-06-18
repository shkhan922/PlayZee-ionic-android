import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';

@Injectable()
export class FavouriteProvider {

  user_favourites = <any>[];

  constructor(private storage: Storage) {
    console.log('Hello FavouriteProvider Provider');
  }

  set(id) {
    return this.get().then(data => {
      this.user_favourites = data;
      if(data) {
        if(this.user_favourites.indexOf(id) > -1) {
          return this.user_favourites.indexOf(id)
        } else {
          this.user_favourites.push(id);
          this.storage.set('user_favourites', this.user_favourites);
        }
      } else {
        this.user_favourites = [];
        if(this.user_favourites.indexOf(id) > -1) {
          return this.user_favourites.indexOf(id)
        } else {
          this.user_favourites.push(id);
          this.storage.set('user_favourites', this.user_favourites);
        }
      }
    })
  }

  get() {
    return this.storage.get('user_favourites').then(data => {
      return data;
    })
  }

  remove(id) {
    this.user_favourites.splice(this.user_favourites.indexOf(id), 1);
    return this.storage.set('user_favourites', this.user_favourites).then(data => {
      return true;
    });
  }

  check(id) {
    return this.get().then(data => {
      this.user_favourites = data;
      if(data) {
      if(this.user_favourites.indexOf(id) > -1) {
        return true;
      } else {
        return false;
      }
    }
    })
  }



} 
