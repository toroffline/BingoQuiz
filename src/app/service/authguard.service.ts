import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot,} from '@angular/router';
import { AngularFireAuth } from 'angularfire2/auth';
import { AngularFireDatabase } from 'angularfire2/database';
import { AuthService } from './auth.service';
import * as firebase from 'firebase/app';
import { Observable } from 'rxjs/Observable';
import { User } from '../model/user.model';
import { error } from 'selenium-webdriver';
import { FirebaseService } from './firebase-service.service';
import 'rxjs/add/operator/take';
import 'rxjs/add/operator/map'

@Injectable()
export class AuthGuardService implements CanActivate {

  constructor(private afAuth: AngularFireAuth,
              private db: AngularFireDatabase,
              private router: Router,
              private firebaseService: FirebaseService,
              private authService: AuthService,
            ) {
      
      
    }
    canActivate(
        next: ActivatedRouteSnapshot,
        state: RouterStateSnapshot): Observable<boolean> | boolean {
          if (this.authService.authenticated) { return true; }
          else {
            console.log('access denied!')
          this.router.navigate(['/login']);
          }
          return false
      }
  
    
}