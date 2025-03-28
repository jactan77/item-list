import {Injectable, inject, signal} from '@angular/core';
import {
  Auth,
  createUserWithEmailAndPassword,
  idToken,
  signInWithEmailAndPassword,
  signOut,
  updateProfile,
  user as firebaseUser,
  User as FirebaseUser
} from '@angular/fire/auth';
import {from, Observable, of, switchMap, tap} from 'rxjs';
import {User} from '../interfaces/User';
import {Item} from '../components/item/Item';
import {child, Database, get, getDatabase, ref, remove, set} from '@angular/fire/database';
import {RouterStateSnapshot} from '@angular/router';

@Injectable({
  providedIn:'root'
})
export class AuthService {
  firebaseAuth = inject(Auth);
  db:Database = getDatabase();
  user$ = firebaseUser(this.firebaseAuth);
  idToken$ = idToken(this.firebaseAuth);
  currentUserSig = signal<User | null | undefined>(undefined);

  constructor() {
    this.user$.pipe(
      tap(firebaseUser => {
        if (firebaseUser) {
          this.currentUserSig.set({
            username: firebaseUser.displayName,
            email:firebaseUser.email,
            id:firebaseUser.uid
          } as User);
        } else {
          this.currentUserSig.set(null);
        }
      })
    ).subscribe();
  }

  getIdToken(): Observable<string | null> {
    return this.user$.pipe(
      switchMap((user: FirebaseUser | null) => {
        if (!user) {
          return of(null);
        }
        return from(user.getIdToken());
      })
    );
  }

  async register(email: string, username: string, password: string): Promise<Observable<void>> {
    const promise = (async () => {
      const response = await createUserWithEmailAndPassword(
        this.firebaseAuth,
        email,
        password
      );

      await updateProfile(response.user, {displayName: username});

      await set(ref(this.db, `users/${response.user.uid}`), {
        username: username,
        email: email,
      });


    })();

    return from(promise);
  }


  login(email: string, password: string): Observable<void> {
    const promise = signInWithEmailAndPassword(
      this.firebaseAuth,
      email,
      password
    ).then(() => {});
    return from(promise);
  }

  logout(): Observable<void> {
    return from(signOut(this.firebaseAuth));
  }

}
