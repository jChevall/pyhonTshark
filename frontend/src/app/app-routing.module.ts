import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SnifferComponent } from './views/sniffer/sniffer.component';
import { ChartComponent } from './views/chart/chart.component';
import { DictionaryComponent } from './views/dictionary/dictionary.component';


const routes: Routes = [{
  path: 'sniffer',
  component: SnifferComponent,
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
