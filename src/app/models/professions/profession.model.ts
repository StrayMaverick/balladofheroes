import { Type } from "class-transformer";
import { EquipmentQualityEnum } from "../enums/equipment-quality-enum.model";
import { ProfessionEnum } from "../enums/professions-enum.model";
import { ProfessionUpgrades } from "./profession-upgrades.model";
import { Recipe } from "./recipe.model";

export class Profession {
    type: ProfessionEnum;
    level: number;
    maxLevel: number;
    exp: number;
    expToNextLevel: number;
    isUnlocked: boolean;
    @Type(() => ProfessionUpgrades)
    upgrades: ProfessionUpgrades[]; //each array item is for a different quality of recipe
    @Type(() => Recipe)
    availableRecipes: Recipe[];

    creatingRecipe: Recipe | undefined;
    creationTimer: number;
    creationTimerLength: number;
    creationStep: number;

    creationCurrentAmountCreated: number;
    creationCreateAmount: number;

    recipeBookQualityToggle: [EquipmentQualityEnum, boolean][];

    constructor() {
        this.type = ProfessionEnum.None;
        this.level = 0;
        this.maxLevel = 0;
        this.availableRecipes = [];
        this.upgrades = [];
        this.recipeBookQualityToggle = [];
        this.isUnlocked = false;
        this.creationTimer = 0;
        this.creationTimerLength = 0;
        this.creationStep = 0;
        this.exp = 0;
        this.expToNextLevel = 20;
        this.creationCurrentAmountCreated = 0;
        this.creationCreateAmount = 1;
    }
}
