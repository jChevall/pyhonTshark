import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

// REST API
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

// Material Angular
import {
  MatToolbarModule,
   MatIconModule,
   MatSidenavModule,
   MatListModule,
   MatButtonModule,
   MatCardModule,
   MatTableModule,
   MatFormFieldModule,
   MatInputModule,
   MatDatepickerModule,
   MatNativeDateModule,
   MatOptionModule,
   MatSelectModule,
   MatDialogModule,
   } from '@angular/material';

// My services
import { RequestService } from './services/request.service';
import { CircosComponent } from './components/circos/circos.component';
import { ChartComponent } from './views/chart/chart.component';
import { DictionaryComponent } from './views/dictionary/dictionary.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { DatePickerComponent } from './components/date-picker/date-picker.component';
import { CreateDictionayEntityComponent } from './components/create-dictionay-entity/create-dictionay-entity.component';
import { CdkTableModule } from '@angular/cdk/table';
import { UpdateDictionayEntityComponent } from './components/update-dictionay-entity/update-dictionay-entity.component';
import { DeleteDictionayEntityComponent } from './components/delete-dictionay-entity/delete-dictionay-entity.component';
import { HeatmapComponent } from './components/heatmap/heatmap.component';
import { HeatmapViewComponent } from './views/heatmap-view/heatmap-view.component';
import { HomeComponent } from './views/home/home.component';

@NgModule({
  declarations: [
    AppComponent,
    CircosComponent,
    ChartComponent,
    DictionaryComponent,
    DashboardComponent,
    DatePickerComponent,
    CreateDictionayEntityComponent,
    UpdateDictionayEntityComponent,
    DeleteDictionayEntityComponent,
    HeatmapComponent,
    HeatmapViewComponent,
    HomeComponent,
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
    MatCardModule,
    MatButtonModule,
    MatTableModule,
    MatFormFieldModule,
    MatInputModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatOptionModule,
    MatSelectModule,
    MatDialogModule,
    // CKT Import
    CdkTableModule,
  ],
  entryComponents: [CreateDictionayEntityComponent, UpdateDictionayEntityComponent, DeleteDictionayEntityComponent],
  providers: [RequestService],
  bootstrap: [AppComponent]
})
export class AppModule { }
