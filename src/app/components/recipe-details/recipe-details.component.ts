import { Component, OnInit } from '@angular/core';
import { RecipeService } from 'src/app/services/recipe.service';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient,HttpClientModule } from '@angular/common/http';
import { CreateRecipeRequest } from 'src/app/interfaces/recipe';


@Component({
  selector: 'recipe-details',
  templateUrl: './recipe-details.component.html',
  styleUrls: ['./recipe-details.component.css']
})
export class RecipeDetailsComponent implements OnInit {

  constructor(private activatedRoute:ActivatedRoute,private recipeService:RecipeService, private http:HttpClient) { }
  // recipe?:CreateRecipeRequest;
  
  // singleRecipe?:CreateRecipeRequest;

  //mocking the recipeid which we will get when redirecting to this page
  recipeid : string ='iy5XX';
  recipeName: string = '';
  type: string = '';
  // // type: this.type,
  // procedure: string[] = ''
  // ingridients: string=''
  
     async ngOnInit(){
     let recipe:CreateRecipeRequest;
    
      //  recipe = await this.recipeService.getRecipe(this.recipeid);

      //  this.recipeName = recipe.recipeName;
      //  this.type = recipe.type;
      //  this.procedure = recipe.procedure;
      //  this.ingredients = recipe.ingredients;


      this.activatedRoute.paramMap.subscribe(async (params)=>{
        console.log(this.recipeid);
        debugger;
        var response =   await this.recipeService.getRecipe(this.recipeid);
          
        recipe = response.products;
        this.recipeName = recipe.recipeName;
        this.type = recipe.type;
        // this.procedure = recipe.procedure;
        // this.ingredients = recipe.ingredients;
 
      });  


  }

}