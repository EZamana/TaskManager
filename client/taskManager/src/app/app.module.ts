import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import {HTTP_INTERCEPTORS} from "@angular/common/http";
import {TokenInterceptor} from "./interceptors/token.interceptor";
import {ErrorInterceptor} from "./interceptors/error.interceptor";

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatInputModule } from '@angular/material/input';
import {MatButtonModule} from '@angular/material/button';
import { TestComponent } from './components/test/test.component';
import { ReactiveFormsModule } from '@angular/forms';
import { LoginComponent } from './components/login/login.component';
import { ButtonComponent } from './components/button/button.component';
import { HeaderComponent } from './components/header/header.component';
import { FooterComponent } from './components/footer/footer.component';
import { MessageAlertComponent } from './components/message-alert/message-alert.component';
import { RegisterComponent } from './components/register/register.component';
import { UserIconComponent } from './components/user-icon/user-icon.component';
import { GetCapitalFirstLetterPipe } from './pipes/get-capital-first-letter.pipe';
import { BoardComponent } from './components/board/board.component';
import {DragDropModule} from '@angular/cdk/drag-drop';
import { BoardColumnComponent } from './components/board-column/board-column.component';
import { BoardTaskComponent } from './components/board-task/board-task.component';
import { TruncatePipe } from './pipes/truncate.pipe';
import { CreateTaskModalComponent } from './components/create-task-modal/create-task-modal.component';
import {MatDialogModule} from '@angular/material/dialog';
import {MatSelectModule} from '@angular/material/select';
import { EditTaskModalComponent } from './components/edit-task-modal/edit-task-modal.component';



@NgModule({
  declarations: [
    AppComponent,
    TestComponent,
    LoginComponent,
    ButtonComponent,
    HeaderComponent,
    FooterComponent,
    MessageAlertComponent,
    RegisterComponent,
    UserIconComponent,
    GetCapitalFirstLetterPipe,
    BoardComponent,
    BoardColumnComponent,
    BoardTaskComponent,
    TruncatePipe,
    CreateTaskModalComponent,
    EditTaskModalComponent
  ],
  imports: [
    HttpClientModule,
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MatInputModule,
    MatButtonModule,
    ReactiveFormsModule,
    DragDropModule,
    MatDialogModule,
    MatSelectModule
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: TokenInterceptor,
      multi: true
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: ErrorInterceptor,
      multi: true
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
