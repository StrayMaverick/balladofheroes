import { Injectable } from '@angular/core';
import { AlchemyActionsEnum } from 'src/app/models/enums/alchemy-actions-enum.model';
import { GameLogEntryEnum } from 'src/app/models/enums/game-log-entry-enum.model';
import { ItemTypeEnum } from 'src/app/models/enums/item-type-enum.model';
import { ItemsEnum } from 'src/app/models/enums/items-enum.model';
import { SubZoneEnum } from 'src/app/models/enums/sub-zone-enum.model';
import { Recipe } from 'src/app/models/professions/recipe.model';
import { ResourceValue } from 'src/app/models/resources/resource-value.model';
import { GameLogService } from '../battle/game-log.service';
import { GlobalService } from '../global/global.service';
import { LookupService } from '../lookup.service';
import { UtilityService } from '../utility/utility.service';

@Injectable({
  providedIn: 'root'
})
export class AlchemyService {

  constructor(private globalService: GlobalService, private lookupService: LookupService, private gameLogService: GameLogService,
    private utilityService: UtilityService) { }

  handleAlchemyTimer(deltaTime: number) {
    var alchemy = this.globalService.globalVar.alchemy;
    if (alchemy.creatingRecipe === undefined || alchemy.alchemyStep === 0)
      return;

    alchemy.alchemyTimer += deltaTime;

    if (alchemy.alchemyTimer >= alchemy.alchemyTimerLength) {
      alchemy.alchemyStep += 1;
      alchemy.alchemyTimer -= alchemy.alchemyTimerLength;

      if (alchemy.alchemyStep <= alchemy.creatingRecipe.numberOfSteps) {
        alchemy.alchemyTimerLength = this.getActionLength(alchemy.creatingRecipe.steps[alchemy.alchemyStep - 1]);
      }
      else {
        //create item
        this.createItem();
      }
    }
  }

  handleShopOpen(subzone: SubZoneEnum) {
    if (subzone === SubZoneEnum.AsphodelPalaceOfHades) {
      if (!this.globalService.globalVar.alchemy.isUnlocked) {
        this.globalService.globalVar.alchemy.isUnlocked = true;
        this.globalService.globalVar.alchemy.level = 1;
        this.globalService.globalVar.alchemy.maxLevel = this.utilityService.firstAlchemyLevelCap;
      }
    }
  }

  getActionLength(action: AlchemyActionsEnum) {
    var duration = 0;

    if (action === AlchemyActionsEnum.PrepareWaterSmallPot)
      duration = 1 * 2;
    if (action === AlchemyActionsEnum.CombineIngredientsPot)
      duration = 1 * 1;
    if (action === AlchemyActionsEnum.CombineIngredientsPotion)
      duration = 1 * 15;
    if (action === AlchemyActionsEnum.HeatMixture)
      duration = 1 * 3;
    if (action === AlchemyActionsEnum.CrushIngredients)
      duration = 1 * 3;
    if (action === AlchemyActionsEnum.CombineIngredients)
      duration = 1 * 15;
    if (action === AlchemyActionsEnum.MixOil)
      duration = 1 * 1;
    if (action === AlchemyActionsEnum.MeltWax)
      duration = 1 * 2;
    if (action === AlchemyActionsEnum.StrainMixture)
      duration = 1 * 1;

    return duration;
  }

  createItem() {
    var alchemy = this.globalService.globalVar.alchemy;
    if (alchemy.creatingRecipe === undefined)
      return;

    this.lookupService.gainResource(new ResourceValue(alchemy.creatingRecipe.createdItem, alchemy.creatingRecipe.createdItemType,
      alchemy.creatingRecipe.createdAmount));

    alchemy.alchemyStep = 0;

    if (alchemy.level < alchemy.maxLevel)
      alchemy.exp += alchemy.creatingRecipe.expGain;

    if (alchemy.exp >= alchemy.expToNextLevel) {
      alchemy.level += 1;
      alchemy.exp -= alchemy.expToNextLevel;

      if (alchemy.level === alchemy.maxLevel)
        alchemy.exp = 0;

      if (this.globalService.globalVar.gameLogSettings.get("alchemyLevelUp")) {
        var gameLogEntry = "Your <strong>Alchemy</strong> level increases to <strong>" + alchemy.level + "</strong>.";
        this.gameLogService.updateGameLog(GameLogEntryEnum.Alchemy, gameLogEntry);
      }

      this.checkForNewRecipes();
    }

    if (this.globalService.globalVar.gameLogSettings.get("alchemyCreation")) {
      var gameLogEntry = "You create <strong>" + this.lookupService.getItemName(alchemy.creatingRecipe.createdItem) + "</strong>.";
      this.gameLogService.updateGameLog(GameLogEntryEnum.Alchemy, gameLogEntry);
    }

    alchemy.alchemyCurrentAmountCreated += 1;

    if (alchemy.alchemyCurrentAmountCreated >= alchemy.alchemyCreateAmount) {
      alchemy.alchemyCurrentAmountCreated = 0;
      alchemy.creatingRecipe = undefined;
      alchemy.alchemyTimer = 0;
      alchemy.alchemyTimerLength = 0;
    }
    else {
      if (this.canCreateItem(alchemy.creatingRecipe)) {
        alchemy.alchemyStep = 1;
        alchemy.alchemyTimerLength = this.getActionLength(alchemy.creatingRecipe.steps[0]);
        this.spendResourcesOnRecipe(alchemy.creatingRecipe);
      }
      else {
        if (this.globalService.globalVar.gameLogSettings.get("alchemyCreation")) {
          var gameLogEntry = "You no longer have enough resources and stop creating <strong>" + this.lookupService.getItemName(alchemy.creatingRecipe.createdItem) + "</strong>.";
          this.gameLogService.updateGameLog(GameLogEntryEnum.Alchemy, gameLogEntry);

          alchemy.alchemyCurrentAmountCreated = 0;
          alchemy.creatingRecipe = undefined;
        }
      }
    }
  }

  initializeCreation(recipe: Recipe, createAmount: number) {
    var alchemy = this.globalService.globalVar.alchemy;
    alchemy.alchemyTimer = 0;
    alchemy.alchemyCurrentAmountCreated = 0;
    alchemy.alchemyStep = 1;
    alchemy.creatingRecipe = recipe;
    alchemy.alchemyCreateAmount = createAmount;
    if (recipe.steps.length > 0)
      alchemy.alchemyTimerLength = this.getActionLength(recipe.steps[0]);
  }

  learnRecipe(item: ItemsEnum) {
    if (!this.globalService.globalVar.alchemy.availableRecipes.some(recipe => recipe.createdItem === item)) {
      this.globalService.globalVar.alchemy.availableRecipes.push(this.getRecipe(item));
    }
  }

  checkForNewRecipes() {
    if (this.globalService.globalVar.alchemy.level >= 1) {
      if (!this.globalService.globalVar.alchemy.availableRecipes.some(item => item.createdItem === ItemsEnum.HealingPoultice)) {
        this.globalService.globalVar.alchemy.availableRecipes.push(this.getRecipe(ItemsEnum.HealingPoultice));
      }
    }
    if (this.globalService.globalVar.alchemy.level >= 2) {
      if (!this.globalService.globalVar.alchemy.availableRecipes.some(item => item.createdItem === ItemsEnum.ExplodingPotion)) {
        this.globalService.globalVar.alchemy.availableRecipes.push(this.getRecipe(ItemsEnum.ExplodingPotion));
      }
    }
    if (this.globalService.globalVar.alchemy.level >= 4) {
      if (!this.globalService.globalVar.alchemy.availableRecipes.some(item => item.createdItem === ItemsEnum.DebilitatingToxin)) {
        this.globalService.globalVar.alchemy.availableRecipes.push(this.getRecipe(ItemsEnum.DebilitatingToxin));
      }
    }
    if (this.globalService.globalVar.alchemy.level >= 7) {
      if (!this.globalService.globalVar.alchemy.availableRecipes.some(item => item.createdItem === ItemsEnum.HealingSalve)) {
        this.globalService.globalVar.alchemy.availableRecipes.push(this.getRecipe(ItemsEnum.HealingSalve));
      }
    }
    if (this.globalService.globalVar.alchemy.level >= 10) {
      if (!this.globalService.globalVar.alchemy.availableRecipes.some(item => item.createdItem === ItemsEnum.FirePotion)) {
        this.globalService.globalVar.alchemy.availableRecipes.push(this.getRecipe(ItemsEnum.FirePotion));
      }
    }
    if (this.globalService.globalVar.alchemy.level >= 15) {
      if (!this.globalService.globalVar.alchemy.availableRecipes.some(item => item.createdItem === ItemsEnum.PoisonousToxin)) {
        this.globalService.globalVar.alchemy.availableRecipes.push(this.getRecipe(ItemsEnum.PoisonousToxin));
      }
    }
    if (this.globalService.globalVar.alchemy.level >= 20) {
      if (!this.globalService.globalVar.alchemy.availableRecipes.some(item => item.createdItem === ItemsEnum.StranglingGasPotion)) {
        this.globalService.globalVar.alchemy.availableRecipes.push(this.getRecipe(ItemsEnum.StranglingGasPotion));
      }
    }
  }

  getRecipe(item: ItemsEnum) {
    var recipe = new Recipe();
    recipe.createdItem = item;
    recipe.createdItemType = this.lookupService.getItemTypeFromItemEnum(item);
    recipe.createdAmount = 1;

    if (item === ItemsEnum.HealingPoultice) {
      recipe.ingredients.push(new ResourceValue(ItemsEnum.Olive, ItemTypeEnum.CraftingMaterial, 1));
      recipe.ingredients.push(new ResourceValue(ItemsEnum.Fennel, ItemTypeEnum.CraftingMaterial, 1));

      recipe.numberOfSteps = 2;
      recipe.steps.push(AlchemyActionsEnum.PrepareWaterSmallPot);
      recipe.steps.push(AlchemyActionsEnum.CombineIngredientsPot);

      recipe.expGain = 5;
    }
    if (item === ItemsEnum.ExplodingPotion) {
      recipe.ingredients.push(new ResourceValue(ItemsEnum.VialOfTheLethe, ItemTypeEnum.CraftingMaterial, 1));
      recipe.ingredients.push(new ResourceValue(ItemsEnum.SoulSpark, ItemTypeEnum.CraftingMaterial, 2));

      recipe.numberOfSteps = 2;
      recipe.steps.push(AlchemyActionsEnum.CombineIngredientsPotion);
      recipe.steps.push(AlchemyActionsEnum.HeatMixture);

      recipe.expGain = 5;
    }

    if (item === ItemsEnum.DebilitatingToxin) {
      recipe.ingredients.push(new ResourceValue(ItemsEnum.Asphodelus, ItemTypeEnum.CraftingMaterial, 2));

      recipe.numberOfSteps = 1;
      recipe.steps.push(AlchemyActionsEnum.CrushIngredients);

      recipe.expGain = 8;
    }

    if (item === ItemsEnum.HealingSalve) {
      recipe.ingredients.push(new ResourceValue(ItemsEnum.Olive, ItemTypeEnum.CraftingMaterial, 2));
      recipe.ingredients.push(new ResourceValue(ItemsEnum.HealingHerb, ItemTypeEnum.HealingItem, 1));
      recipe.ingredients.push(new ResourceValue(ItemsEnum.Wax, ItemTypeEnum.CraftingMaterial, 2));

      recipe.numberOfSteps = 4;
      recipe.steps.push(AlchemyActionsEnum.MixOil);
      recipe.steps.push(AlchemyActionsEnum.StrainMixture);
      recipe.steps.push(AlchemyActionsEnum.MeltWax);
      recipe.steps.push(AlchemyActionsEnum.CombineIngredientsPot);

      recipe.expGain = 12;
    }

    if (item === ItemsEnum.FirePotion) {
      recipe.ingredients.push(new ResourceValue(ItemsEnum.VialOfTheLethe, ItemTypeEnum.CraftingMaterial, 2));
      recipe.ingredients.push(new ResourceValue(ItemsEnum.SoulSpark, ItemTypeEnum.CraftingMaterial, 1));
      recipe.ingredients.push(new ResourceValue(ItemsEnum.EssenceOfFire, ItemTypeEnum.CraftingMaterial, 2));

      recipe.numberOfSteps = 2;
      recipe.steps.push(AlchemyActionsEnum.CombineIngredientsPotion);
      recipe.steps.push(AlchemyActionsEnum.HeatMixture);

      recipe.expGain = 10;
    }
    if (item === ItemsEnum.PoisonousToxin) {
      //TODO: FILL IN CORRECTLY
      recipe.ingredients.push(new ResourceValue(ItemsEnum.Asphodelus, ItemTypeEnum.CraftingMaterial, 2));

      recipe.numberOfSteps = 1;
      recipe.steps.push(AlchemyActionsEnum.CrushIngredients);

      recipe.expGain = 8;
    }
    if (item === ItemsEnum.StranglingGasPotion) {
      //TODO: FILL IN CORRECTLY
      recipe.ingredients.push(new ResourceValue(ItemsEnum.VialOfTheLethe, ItemTypeEnum.CraftingMaterial, 1));
      recipe.ingredients.push(new ResourceValue(ItemsEnum.SoulSpark, ItemTypeEnum.CraftingMaterial, 2));

      recipe.numberOfSteps = 2;
      recipe.steps.push(AlchemyActionsEnum.CombineIngredientsPotion);
      recipe.steps.push(AlchemyActionsEnum.HeatMixture);

      recipe.expGain = 5;
    }
    if (item === ItemsEnum.PoisonExtractPotion) {
      //TODO: FILL IN CORRECTLY
      recipe.ingredients.push(new ResourceValue(ItemsEnum.VialOfTheLethe, ItemTypeEnum.CraftingMaterial, 1));
      recipe.ingredients.push(new ResourceValue(ItemsEnum.SoulSpark, ItemTypeEnum.CraftingMaterial, 2));

      recipe.numberOfSteps = 2;
      recipe.steps.push(AlchemyActionsEnum.CombineIngredientsPotion);
      recipe.steps.push(AlchemyActionsEnum.HeatMixture);

      recipe.expGain = 5;
    }
    if (item === ItemsEnum.HeroicElixir) {
      //TODO: FILL IN CORRECTLY
      recipe.ingredients.push(new ResourceValue(ItemsEnum.VialOfTheLethe, ItemTypeEnum.CraftingMaterial, 1));
      recipe.ingredients.push(new ResourceValue(ItemsEnum.SoulSpark, ItemTypeEnum.CraftingMaterial, 2));

      recipe.numberOfSteps = 2;
      recipe.steps.push(AlchemyActionsEnum.CombineIngredientsPotion);
      recipe.steps.push(AlchemyActionsEnum.HeatMixture);

      recipe.expGain = 5;
    }

    return recipe;
  }

  canCreateItem(recipe: Recipe) {
    var canBuy = true;

    recipe.ingredients.forEach(resource => {
      var userResourceAmount = this.lookupService.getResourceAmount(resource.item);      
      if (userResourceAmount < resource.amount)
        canBuy = false;
    });

    return canBuy;
  }

  spendResourcesOnRecipe(recipe: Recipe) {
    recipe.ingredients.forEach(resource => {
      this.lookupService.useResource(resource.item, resource.amount);
    });
  }
}