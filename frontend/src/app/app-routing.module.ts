import { HomeComponent } from './views/home/home.component';
import { HeatmapViewComponent } from './views/heatmap-view/heatmap-view.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ChartComponent } from './views/chart/chart.component';
import { DictionaryComponent } from './views/dictionary/dictionary.component';

const routes: Routes = [{
  path: '',
  component: HomeComponent,
}, {
  path: 'heatmap',
  component: HeatmapViewComponent,
}, {
  path: 'chart',
  component: ChartComponent,
}, {
  path: 'dictionary',
  component: DictionaryComponent,
}];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
