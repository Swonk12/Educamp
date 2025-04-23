import { NgModule } from '@angular/core';
import { BrowserModule, provideClientHydration } from '@angular/platform-browser';
import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { HomeComponent } from './home/home.component';
import { CalendarComponent } from './calendar/calendar.component';
import { NavbarComponent } from './navbar/navbar.component';
import { ListuserComponent } from './listuser/listuser.component';
import { AppRoutingModule } from './app-routing.module';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { getAuth, provideAuth } from '@angular/fire/auth';
import { getFirestore, provideFirestore } from '@angular/fire/firestore';
import { getDatabase, provideDatabase } from '@angular/fire/database';
import { AngularFireModule } from '@angular/fire/compat';
import { AngularFireAuthModule } from '@angular/fire/compat/auth';
import { AngularFirestoreModule } from '@angular/fire/compat/firestore';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { FullCalendarModule } from '@fullcalendar/angular';
import { environment } from '../environments/environment';
import { TopicsComponent } from './topics/topics.component';
import { ChatComponent } from './chat/chat.component';
import { NewcicleComponent } from './newcicle/newcicle.component';
import { PopupComponent } from './popup/popup.component';
import { NewmoduleComponent } from './newmodule/newmodule.component';
import { DesinscribirseComponent } from './desinscribirse/desinscribirse.component';
import { GestionusuariosComponent } from './gestionusuarios/gestionusuarios.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    RegisterComponent,
    HomeComponent,
    CalendarComponent,
    NavbarComponent,
    ListuserComponent,
    TopicsComponent,
    ChatComponent,
    PopupComponent,
    NewcicleComponent,
    NewmoduleComponent,
    DesinscribirseComponent,
    GestionusuariosComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    AngularFireModule.initializeApp(environment.fireBaseConfig),
    AngularFireAuthModule,
    AngularFirestoreModule,
    FormsModule,
    FullCalendarModule,
    HttpClientModule
  ],
  providers: [
    provideClientHydration(),
    provideFirebaseApp(() => initializeApp(environment.fireBaseConfig)),
    provideAuth(() => getAuth()),
    provideFirestore(() => getFirestore()),
    provideDatabase(() => getDatabase())
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
