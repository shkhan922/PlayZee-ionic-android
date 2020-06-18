import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';

@Injectable()
export class CheckUserProvider {

  constructor(private storage: Storage) {
    
  }

  set(id) {
    this.storage.set('user_id', id);
  }

  clear() {
    this.storage.set('user_id', 'null');
  }

  get() {
    return this.storage.get('user_id').then((val) => {
      if(val != 'null') {
          return val;  
      } else {
        return 'null';
      }
    });
  }

}
