import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

// REST API
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

// Material Angular
import { MatToolbarModule, MatIconModule, MatSidenavModule, MatListModule, MatButtonModule } from  '@angular/material';

// My services
import { RequestService } from './services/request.service';
import { CircosComponent } from './components/circos/circos.component';
import { SnifferComponent } from './views/sniffer/sniffer.component';
import { ChartComponent } from './views/chart/chart.component';
import { DictionaryComponent } from './views/dictionary/dictionary.component';


@NgModule({
  declarations: [
    AppComponent,
    CircosComponent,
    SnifferComponent,
    ChartComponent,
    DictionaryComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    // REST AppRoutingModule
    FormsModule,
    HttpClientModule,
    // Material Angular
    MatToolbarModule,
    MatSidenavModule,
    MatListModule,
    MatButtonModule,
    MatIconModule,
  ],
  providers: [RequestService],
  bootstrap: [AppComponent]
})
export class AppModule { }
