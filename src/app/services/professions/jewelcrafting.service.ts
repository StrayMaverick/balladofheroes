import { Injectable } from '@angular/core';
import { EquipmentQualityEnum } from 'src/app/models/enums/equipment-quality-enum.model';
import { GameLogEntryEnum } from 'src/app/models/enums/game-log-entry-enum.model';
import { ItemsEnum } from 'src/app/models/enums/items-enum.model';
import { ProfessionActionsEnum } from 'src/app/models/enums/profession-actions-enum.model';
import { ProfessionEnum } from 'src/app/models/enums/professions-enum.model';
import { SubZoneEnum } from 'src/app/models/enums/sub-zone-enum.model';
import { ProfessionUpgrades } from 'src/app/models/professions/profession-upgrades.model';
import { Recipe } from 'src/app/models/professions/recipe.model';
import { ResourceValue } from 'src/app/models/resources/resource-value.model';
import { UtilityService } from '../utility/utility.service';
import { GlobalService } from '../global/global.service';
import { GameLogService } from '../battle/game-log.service';
import { LookupService } from '../lookup.service';

@Injectable({
  providedIn: 'root'
})
export class JewelcraftingService {

  constructor(private globalService: GlobalService, private utilityService: UtilityService, private gameLogService: GameLogService,
    private lookupService: LookupService) { }

  handleShopOpen(subzone: SubZoneEnum) {
    if (subzone === SubZoneEnum.AegeanSeaIolcus) {
      var jewelcrafting = this.globalService.globalVar.professions.find(item => item.type === ProfessionEnum.Jewelcrafting);      
      if (jewelcrafting !== undefined && !jewelcrafting.isUnlocked) {
        jewelcrafting.isUnlocked = true;
        jewelcrafting.level = 1;
        jewelcrafting.maxLevel += this.utilityService.firstJewelcraftingLevelCap;
      }
    }
  }

  getActionLength(action: ProfessionActionsEnum) {
    var duration = 0;

    if (action === ProfessionActionsEnum.CombiningGems)
      duration = 1 * 4;  //TODO: make 240
    if (action === ProfessionActionsEnum.Polish)
      duration = 1 * 4;  //TODO: make 60

    return duration;
  }  

  checkForNewRecipes() {
    var jewelcrafting = this.globalService.globalVar.professions.find(item => item.type === ProfessionEnum.Jewelcrafting);
    if (jewelcrafting === undefined)
      return;
    var newRecipeLearned = false;

    if (jewelcrafting.level >= 1) {
      if (!jewelcrafting.availableRecipes.some(item => item.createdItem === ItemsEnum.CrackedRuby)) {
        jewelcrafting.availableRecipes.push(this.getRecipe(ItemsEnum.CrackedRuby));
        newRecipeLearned = true;
        this.updateGameLogWithNewRecipe(ItemsEnum.CrackedRuby);
      }
    }
    if (jewelcrafting.level >= 2) {
      if (!jewelcrafting.availableRecipes.some(item => item.createdItem === ItemsEnum.CrackedAquamarine)) {
        jewelcrafting.availableRecipes.push(this.getRecipe(ItemsEnum.CrackedAquamarine));
        newRecipeLearned = true;
        this.updateGameLogWithNewRecipe(ItemsEnum.CrackedAquamarine);
      }
    }
    if (jewelcrafting.level >= 4) {
      if (!jewelcrafting.availableRecipes.some(item => item.createdItem === ItemsEnum.CrackedOpal)) {
        jewelcrafting.availableRecipes.push(this.getRecipe(ItemsEnum.CrackedOpal));
        newRecipeLearned = true;
        this.updateGameLogWithNewRecipe(ItemsEnum.CrackedOpal);
      }
    }
    if (jewelcrafting.level >= 7) {
      if (!jewelcrafting.availableRecipes.some(item => item.createdItem === ItemsEnum.MinorWeaponSlotAddition)) {
        jewelcrafting.availableRecipes.push(this.getRecipe(ItemsEnum.MinorWeaponSlotAddition));
        newRecipeLearned = true;
        this.updateGameLogWithNewRecipe(ItemsEnum.MinorWeaponSlotAddition);
      }
    }
    if (jewelcrafting.level >= 10) {
      if (!jewelcrafting.availableRecipes.some(item => item.createdItem === ItemsEnum.CrackedTopaz)) {
        jewelcrafting.availableRecipes.push(this.getRecipe(ItemsEnum.CrackedTopaz));
        newRecipeLearned = true;
        this.updateGameLogWithNewRecipe(ItemsEnum.CrackedTopaz);
      }
    }
    if (jewelcrafting.level >= 15) {
      if (!jewelcrafting.availableRecipes.some(item => item.createdItem === ItemsEnum.CrackedAmethyst)) {
        jewelcrafting.availableRecipes.push(this.getRecipe(ItemsEnum.CrackedAmethyst));
        newRecipeLearned = true;
        this.updateGameLogWithNewRecipe(ItemsEnum.CrackedAmethyst);
      }
    }
    if (jewelcrafting.level >= 20) {
      if (!jewelcrafting.availableRecipes.some(item => item.createdItem === ItemsEnum.CrackedEmerald)) {
        jewelcrafting.availableRecipes.push(this.getRecipe(ItemsEnum.CrackedEmerald));
        newRecipeLearned = true;
        this.updateGameLogWithNewRecipe(ItemsEnum.CrackedEmerald);
      }
    }    
    if (jewelcrafting.level >= 25) {
      if (!jewelcrafting.availableRecipes.some(item => item.createdItem === ItemsEnum.MinorRingSlotAddition)) {
        jewelcrafting.availableRecipes.push(this.getRecipe(ItemsEnum.MinorRingSlotAddition));
        newRecipeLearned = true;
        this.updateGameLogWithNewRecipe(ItemsEnum.MinorRingSlotAddition);
      }
    }    

    return newRecipeLearned;
  }

  getLevelUpReward() {
    var jewelcrafting = this.globalService.globalVar.professions.find(item => item.type === ProfessionEnum.Jewelcrafting);
    if (jewelcrafting === undefined)
      return;

    var upgrades: ProfessionUpgrades | undefined = undefined;
    var additionalChanceTo2x = .05;
    var additionalChanceTo5x = .025;
    var additionalChanceToRetainMaterials = .05;
    var additionalDurationReduction = .04;

    if (jewelcrafting.level <= 25)
      upgrades = jewelcrafting.upgrades.find(item => item.quality === EquipmentQualityEnum.Basic);
    else if (jewelcrafting.level <= 50)
      upgrades = jewelcrafting.upgrades.find(item => item.quality === EquipmentQualityEnum.Uncommon);


    if (upgrades === undefined)
      return;

    if (jewelcrafting.level % 25 === 3 || jewelcrafting.level % 25 === 6 ||
      jewelcrafting.level % 25 === 11 || jewelcrafting.level % 25 === 14 ||
      jewelcrafting.level % 25 === 16 || jewelcrafting.level % 25 === 23) {
      upgrades.chanceTo2xItem += additionalChanceTo2x;

      if (this.globalService.globalVar.gameLogSettings.get("jewelcraftingLevelUp")) {
        var gameLogEntry = "You gain an additional <strong>" + (additionalChanceTo2x * 100) + "%</strong> chance to make 2x as many items when making a Basic quality Jewelcrafting recipe.";
        this.gameLogService.updateGameLog(GameLogEntryEnum.Jewelcrafting, gameLogEntry);
      }
    }

    if (jewelcrafting.level % 25 === 5 || jewelcrafting.level % 25 === 8 ||
      jewelcrafting.level % 25 === 13 || jewelcrafting.level % 25 === 19 ||
      jewelcrafting.level % 25 === 21) {
      upgrades.durationReduction += additionalDurationReduction;

      if (this.globalService.globalVar.gameLogSettings.get("jewelcraftingLevelUp")) {
        var gameLogEntry = "The time it takes to create a Basic quality Jewelcrafting Recipe is reduced by <strong>" + (additionalDurationReduction * 100) + "%</strong>.";
        this.gameLogService.updateGameLog(GameLogEntryEnum.Jewelcrafting, gameLogEntry);
      }
    }

    if (jewelcrafting.level % 25 === 9 || jewelcrafting.level % 25 === 12 ||
      jewelcrafting.level % 25 === 17 || jewelcrafting.level % 25 === 22 ||
      jewelcrafting.level % 25 === 24) {
      upgrades.chanceToRetainMaterials += additionalChanceToRetainMaterials;

      if (this.globalService.globalVar.gameLogSettings.get("jewelcraftingLevelUp")) {
        var gameLogEntry = "You gain an additional <strong>" + (additionalChanceToRetainMaterials * 100) + "%</strong> chance to retain your ingredients when making a Basic quality Jewelcrafting recipe.";
        this.gameLogService.updateGameLog(GameLogEntryEnum.Jewelcrafting, gameLogEntry);
      }
    }

    if (jewelcrafting.level % 25 === 18 || jewelcrafting.level % 25 === 0) {
      upgrades.chanceTo5xItem += additionalChanceTo5x;

      if (this.globalService.globalVar.gameLogSettings.get("jewelcraftingLevelUp")) {
        var gameLogEntry = "You gain an additional <strong>" + (additionalChanceTo5x * 100) + "%</strong> chance to make 5x as many items when making a Basic quality Jewelcrafting recipe.";
        this.gameLogService.updateGameLog(GameLogEntryEnum.Jewelcrafting, gameLogEntry);
      }
    }

  }

  updateGameLogWithNewRecipe(type: ItemsEnum) {
    if (this.globalService.globalVar.gameLogSettings.get("jewelcraftingLevelUp")) {
      var gameLogEntry = "You learn how to make the Jewelcrafting recipe: <strong>" + this.lookupService.getItemName(type) + "</strong>.";
      this.gameLogService.updateGameLog(GameLogEntryEnum.Jewelcrafting, gameLogEntry);
    }
  }

  getRecipe(item: ItemsEnum) {
    var recipe = new Recipe();
    recipe.createdItem = item;
    recipe.createdItemType = this.lookupService.getItemTypeFromItemEnum(item);
    recipe.createdAmount = 1;

    if (item === ItemsEnum.CrackedRuby) {
      recipe.quality = EquipmentQualityEnum.Basic;
      recipe.ingredients.push(new ResourceValue(ItemsEnum.RoughRubyFragment, 5));
      recipe.ingredients.push(new ResourceValue(ItemsEnum.Coin, 200));

      //TODO: rework this
      recipe.numberOfSteps = 2;
      recipe.steps.push(ProfessionActionsEnum.CombiningGems);
      recipe.steps.push(ProfessionActionsEnum.Polish);

      recipe.expGain = 5;
    }

    return recipe;
  }   
}
