import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {HomePageComponent} from "./home-page/home-page.component";
import {SettingsPageComponent} from "./settings-page/settings-page.component";
import {GamePageComponent} from "./game-page/game-page.component";

const routes: Routes = [
  { path: 'game', component: GamePageComponent },
  { path: 'settings', component: SettingsPageComponent },
  { path: '**', component: HomePageComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
