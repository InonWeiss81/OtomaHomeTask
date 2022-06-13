import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ConverterComponent } from './components/converter/converter.component';
import { HistoryComponent } from './components/history/history.component';

const routes: Routes = [
  { path: 'Converter', component: ConverterComponent },
  { path: 'History', component: HistoryComponent },
  { path: '', redirectTo: 'Converter', pathMatch: 'full' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
