import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatTabsModule } from '@angular/material/tabs';
import { MatButtonModule } from '@angular/material/button';
import { MatTableModule } from '@angular/material/table';
import { MatDialogModule } from '@angular/material';
import { MatFormFieldModule } from '@angular/material';
import { MatInputModule } from '@angular/material';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatSelectModule } from '@angular/material/select';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatExpansionModule } from '@angular/material/expansion';


//Frameworks
import { NgSemanticModule } from 'ng-semantic';
import { AngularFireModule } from 'angularfire2';
import { firebaseConfig } from './../environments/firebase.config';
import { AngularFireDatabaseModule } from 'angularfire2/database';
import { AngularFireAuthModule } from 'angularfire2/auth';
import { SuiModule } from 'ng2-semantic-ui';


// Components
import { AddWikiComponent } from './add-wiki/add-wiki.component';
import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';
import { AddQuestionComponent } from './add-question/add-question.component';
import { LoginComponent } from './login/login.component';
import { HeaderComponent } from './header/header.component';
import { GameplayComponent } from './gameplay/gameplay.component';
import { RoomlistComponent } from './roomlist/roomlist.component';
import { PlayernameComponent } from './playername/playername.component';
import { UserListComponent } from './user-list/user-list.component';
import { SignupComponent } from './signup/signup.component';
import { FreeComponent } from './free/free.component';
import { DialogRoomAuthComponent } from './dialog-room-auth/dialog-room-auth.component';
import { DialogRoomCreateComponent } from './dialog-room-create/dialog-room-create.component';
import { DialogYnComponent } from './dialog-yn/dialog-yn.component';

// Services
import { FirebaseService } from './service/firebase-service.service';
import { AuthService } from './service/auth.service';
import { AuthGuardService } from './service/authguard.service';

const routes: Routes = [
  { path: 'addWiki', component: AddWikiComponent },
  { path: 'editWiki/:id', component: AddWikiComponent },
  { path: 'addQuestion', component: AddQuestionComponent },
  { path: 'signup', component: SignupComponent },
  { path: 'play/:roomid', component: GameplayComponent, canActivate: [AuthGuardService] },
  { path: 'login', component: LoginComponent },
  { path: 'name', component: PlayernameComponent },
  { path: 'roomlist', component: RoomlistComponent },
  { path: 'free', component: FreeComponent },
  { path: '', component: LoginComponent },
  { path: '**', redirectTo: '/', pathMatch: 'full' },


];

@NgModule({
  declarations: [
    AppComponent,
    AddWikiComponent,
    HomeComponent,
    AddQuestionComponent,
    LoginComponent,
    HeaderComponent,
    GameplayComponent,
    RoomlistComponent,
    UserListComponent,
    PlayernameComponent,
    SignupComponent,
    FreeComponent,
    DialogRoomAuthComponent,
    DialogRoomCreateComponent,
    DialogYnComponent

  ],
  imports: [
    BrowserModule,
    NgSemanticModule,
    FormsModule,
    AngularFireDatabaseModule,
    AngularFireModule.initializeApp(firebaseConfig),
    RouterModule.forRoot(routes),
    ReactiveFormsModule,
    AngularFireAuthModule,
    BrowserAnimationsModule,
    MatTabsModule,
    MatButtonModule,
    MatTableModule,
    MatDialogModule,
    SuiModule,
    MatFormFieldModule,
    MatInputModule,
    MatSnackBarModule,
    MatCheckboxModule,
    MatSelectModule,
    MatProgressBarModule,
    MatProgressSpinnerModule,
    MatExpansionModule


  ],
  providers: [FirebaseService,
    AuthService,
    AuthGuardService
  ],
  bootstrap: [AppComponent],
  entryComponents: [DialogRoomAuthComponent,
    DialogRoomCreateComponent,DialogYnComponent]
})
export class AppModule { }
