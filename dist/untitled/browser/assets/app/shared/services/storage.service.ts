import {Item} from '../components/item/Item';
import {BehaviorSubject, from, Observable} from 'rxjs';
import {child, Database, getDatabase, onValue, ref, remove, set, update} from '@angular/fire/database';
import {Injectable} from '@angular/core';

interface ItemUpdate {
  type: 'added' | 'full';
  items: Record<string, any>;
}

@Injectable({
  providedIn: 'root',
})
export class StorageService{
  db:Database = getDatabase();
  items: BehaviorSubject<Object | null> = new BehaviorSubject<Object | null>(null);
  itemUpdates = new BehaviorSubject<ItemUpdate | null>(null);
  private previousItemKeys = new Set<string>();

  async addItem(userId: string | undefined,newItemId:string, newItem:Item):Promise<Observable<void>>{
    const {name, amount, minValue,midValue, id, color, img}= newItem;
    const promise = (async ()=>{
      await set(ref(this.db,`users/${userId}/items/${newItemId}`),{
        name:name,
        amount:amount,
        minValue:minValue,
        midValue:midValue,
        id:id,
        color:color,
        img:img
      });
    })();
    return from(promise);
  }

  setupItemsListener(userId: string | undefined): void {
    if (!userId) {
      this.items.next(null);
      this.itemUpdates.next(null);
      this.previousItemKeys.clear();
      return;
    }

    const itemRef = ref(this.db, `users/${userId}/items`);
    let isFirstLoad = true;

    onValue(itemRef, (snapshot) => {
      if (snapshot.exists()) {
        const currentData = snapshot.val();
        this.items.next(currentData);

        const currentKeys = new Set(Object.keys(currentData));

        if (isFirstLoad) {
          this.itemUpdates.next({
            type: 'full',
            items: currentData
          });
          isFirstLoad = false;
        } else {
          const newItemsObj: Record<string, any> = {};
          let hasNewItems = false;

          currentKeys.forEach(key => {
            if (!this.previousItemKeys.has(key)) {
              newItemsObj[key] = currentData[key];
              hasNewItems = true;
            }
          });

          if (hasNewItems) {
            this.itemUpdates.next({
              type: 'added',
              items: newItemsObj
            });
          }
        }

        this.previousItemKeys = currentKeys;
      } else {
        this.items.next(null);
        this.itemUpdates.next({
          type: 'full',
          items: {}
        });
        this.previousItemKeys.clear();
      }
    });
  }

  async changeAmount(userId:string | undefined, itemID: string,newAmount: number,bgColor:string):Promise<Observable<void>> {
    const updates: {[key:string]:any}={
      [`${itemID}/amount`]: newAmount,
      [`${itemID}/color`]: bgColor
    };
    const itemRef = ref(this.db,`users/${userId}/items`);

    const promise = (async ()=>{
      await update(itemRef,updates);
    })();
    return from(promise);
  }

  async changeMidMin(userId:string | undefined, itemID: string,newMin: number,newMid:number,bgColor:string):Promise<Observable<void>> {
    const updates: {[key:string]:any}={
      [`${itemID}/midValue`]: newMid,
      [`${itemID}/minValue`]: newMin,
      [`${itemID}/color`]: bgColor
    };
    const itemRef = ref(this.db,`users/${userId}/items`);

    const promise = (async ()=>{
      await update(itemRef,updates);
    })();
    return from(promise);
  }
  itemPropertyListener(
    userId: string | undefined,
    itemId: string,
    propertyName: string,
    callback: (data: any) => void): () => void {
    if (!userId || !itemId) {
      console.warn(`Invalid userId or itemId for ${propertyName} listener`);
      return () => {};
    }

    const propertyRef = ref(this.db, `users/${userId}/items/${itemId}/${propertyName}`);

    const unsubscribe = onValue(propertyRef, (snapshot) => {
      const data = snapshot.exists() ? snapshot.val() : undefined;
      callback(data);
    });

    return () => unsubscribe();
  }

  amountListener(userId: string | undefined, itemId: string, callback: (data: any) => void): () => void {
    return this.itemPropertyListener(userId, itemId, 'amount', callback);
  }

  midValueListener(userId: string | undefined, itemId: string, callback: (data: any) => void): () => void {
    return this.itemPropertyListener(userId, itemId, 'midValue', callback);
  }

  minValueListener(userId: string | undefined, itemId: string, callback: (data: any) => void): () => void {
    return this.itemPropertyListener(userId, itemId, 'minValue', callback);
  }

  async removeItem(userId:string | undefined, itemId: string):Promise<void>{
    const dbRef = ref(this.db);
    await remove(child(dbRef, `users/${userId}/items/${itemId}`));
  }
}
