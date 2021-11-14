import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
/* import AmplifyUIAngularModule  */
import { AmplifyUIAngularModule } from '@aws-amplify/ui-angular';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeComponent } from './components/home/home.component';
import { NavComponent } from './components/nav/nav.component';
import { BrowserAnimationsModule, NoopAnimationsModule } from '@angular/platform-browser/animations';
import { LayoutModule } from '@angular/cdk/layout';
import { MaterialModule } from './modules/material/material.module';
import { CreateMealPlanComponent } from './components/create-meal-plan/create-meal-plan.component';
import { MealPlanComponent } from './components/meal-plan/meal-plan.component';
import { CreateRecipeComponent } from './components/create-recipe/create-recipe.component';
import { RecipeComponent } from './components/recipe/recipe.component';
import { MyPlansComponent } from './components/my-plans/my-plans.component';
import { ProfileComponent } from './components/profile/profile.component';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    NavComponent,
    CreateMealPlanComponent,
    MealPlanComponent,
    CreateRecipeComponent,
    RecipeComponent,
    MyPlansComponent,
    ProfileComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    /* configure app with AmplifyUIAngularModule */
    AmplifyUIAngularModule,
    NoopAnimationsModule,
    BrowserAnimationsModule,
    LayoutModule,
    MaterialModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
