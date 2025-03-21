import {Item} from '../components/item/Item';
import {from, Observable} from 'rxjs';
import {child, Database, get, getDatabase, ref, remove, set} from '@angular/fire/database';
import {Injectable} from '@angular/core';
@Injectable({
  providedIn: 'root',
})
export class StorageService{
  db:Database = getDatabase();
  async addItem(userId: string | undefined,newItemId:string, newItem:Item):Promise<Observable<void>>{
    const promise = (async ()=>{
      await set(ref(this.db,`users/${userId}/items/${newItemId}`),{
        item:JSON.stringify(newItem)
      });
    })();
    return from(promise);
  }
  async loadItems(userId: string | undefined) : Promise<Object|null> {
    const dbRef = ref(this.db);
    try{
      const snapshot = await get(child(dbRef, `users/${userId}/items`));
      if(snapshot.exists()){
        console.log(snapshot.toJSON());
        return snapshot.toJSON();
      } else{
        return null;
      }
    }
    catch (e) {
      console.error(e);
      return null;
    }


  }
  async removeItem(userId:string | undefined, itemId: string):Promise<void>{
    const dbRef = ref(this.db);
    await remove(child(dbRef, `users/${userId}/items/${itemId}`));

  }
}
