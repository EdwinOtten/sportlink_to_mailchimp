import { BrowserModule } from '@angular/platform-browser'
import { NgModule } from '@angular/core'

import { MatCardModule } from '@angular/material/card'
import { DataConverterModule } from 'angular-data-converter-component'

import { AppComponent } from './app.component'

@NgModule({
  declarations: [
    AppComponent,
  ],
  imports: [
    BrowserModule,
    MatCardModule,
    DataConverterModule,
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule { }
