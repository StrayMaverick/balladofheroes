import { Injectable } from '@angular/core';
import { Ability } from 'src/app/models/character/ability.model';
import { CharacterStats } from 'src/app/models/character/character-stats.model';
import { Character } from 'src/app/models/character/character.model';
import { Enemy } from 'src/app/models/character/enemy.model';
import { BestiaryEnum } from 'src/app/models/enums/bestiary-enum.model';
import { CharacterEnum } from 'src/app/models/enums/character-enum.model';
import { dotTypeEnum } from 'src/app/models/enums/damage-over-time-type-enum.model';
import { ElementalTypeEnum } from 'src/app/models/enums/elemental-type-enum.model';
import { ItemTypeEnum } from 'src/app/models/enums/item-type-enum.model';
import { ItemsEnum } from 'src/app/models/enums/items-enum.model';
import { StatusEffectEnum } from 'src/app/models/enums/status-effects-enum.model';
import { SubZoneEnum } from 'src/app/models/enums/sub-zone-enum.model';
import { TargetEnum } from 'src/app/models/enums/target-enum.model';
import { LootItem } from 'src/app/models/resources/loot-item.model';
import { DeploymentService } from '../deployment/deployment.service';
import { GlobalService } from '../global/global.service';
import { LookupService } from '../lookup.service';
import { UtilityService } from '../utility/utility.service';

@Injectable({
  providedIn: 'root'
})
export class EnemyGeneratorService {

  constructor(private globalService: GlobalService, private utilityService: UtilityService, private deploymentService: DeploymentService) { }

  generateEnemy(type: BestiaryEnum)
  {
    var enemy = new Enemy();
    enemy.type = CharacterEnum.Enemy;
    enemy.bestiaryType = type;

    if (type === BestiaryEnum.WaterSerpent)
    {
      enemy.name = "Water Serpent";
      enemy.battleStats = new CharacterStats(10, 12, 2, 5, 1, 5); 
      enemy.battleInfo.timeToAutoAttack = this.utilityService.enemyAverageAutoAttackSpeed;
      enemy.xpGainFromDefeat = 22;//this.deploymentService.devModeActive ? 22000 : 22;
      enemy.coinGainFromDefeat = 0;
    }
    if (type === BestiaryEnum.Crustacean)
    {
      enemy.name = "Crustacean";
      enemy.battleStats = new CharacterStats(14, 10, 7, 3, 1, 5); 
      enemy.battleInfo.timeToAutoAttack = this.utilityService.enemyAverageAutoAttackSpeed;
      enemy.xpGainFromDefeat = 31;
      enemy.coinGainFromDefeat = 0;
      enemy.loot.push(new LootItem(ItemsEnum.ThrowingStone, ItemTypeEnum.BattleItem, 1, .15));
    }
    if (type === BestiaryEnum.FrenziedGull)
    {
      enemy.name = "Frenzied Gull";
      enemy.battleStats = new CharacterStats(18, 14, 5, 6, 5, 5); 
      enemy.battleInfo.timeToAutoAttack = this.utilityService.enemyLongAutoAttackSpeed;
      enemy.coinGainFromDefeat = 1;
      enemy.xpGainFromDefeat = 33; 

      var peck = new Ability();
      peck.name = "Peck";
      peck.isAvailable = true;
      peck.effectiveness = .5;
      peck.dealsDirectDamage = true;
      peck.cooldown = peck.currentCooldown = 5;
      enemy.abilityList.push(peck);
    }
    if (type === BestiaryEnum.StarvingMongrel)
    {
      enemy.name = "Starving Mongrel";
      enemy.battleStats = new CharacterStats(17, 12, 9, 10, 5, 5); 
      enemy.battleInfo.timeToAutoAttack = this.utilityService.enemyAverageAutoAttackSpeed;
      enemy.coinGainFromDefeat = 1;
      enemy.xpGainFromDefeat = 35; 
      enemy.loot.push(new LootItem(ItemsEnum.LightLeather, ItemTypeEnum.CraftingMaterial, 1, .15));
    }
    if (type === BestiaryEnum.WildBoar)
    {
      enemy.name = "Wild Boar";
      enemy.battleStats = new CharacterStats(25, 11, 12, 5, 5, 5); 
      enemy.battleInfo.timeToAutoAttack = this.utilityService.enemyAverageAutoAttackSpeed;
      enemy.xpGainFromDefeat = 45; 
      enemy.coinGainFromDefeat = 2;      
      enemy.loot.push(new LootItem(ItemsEnum.LightLeather, ItemTypeEnum.CraftingMaterial, 1, .1));
    }
    if (type === BestiaryEnum.KillerBees)
    {
      enemy.name = "Killer Bees";
      enemy.battleStats = new CharacterStats(12, 9, 7, 10, 15, 10); 
      enemy.battleInfo.timeToAutoAttack = this.utilityService.enemyQuickAutoAttackSpeed;
      enemy.xpGainFromDefeat = 20; 
      enemy.coinGainFromDefeat = 1;
      enemy.loot.push(new LootItem(ItemsEnum.Wax, ItemTypeEnum.CraftingMaterial, 1, .03));
      enemy.loot.push(new LootItem(ItemsEnum.Wax, ItemTypeEnum.CraftingMaterial, 2, .01));
    }
    if (type === BestiaryEnum.Patriarch)
    {
      enemy.name = "Patriarch";
      enemy.battleStats = new CharacterStats(125, 18, 15, 5, 5, 40); 
      enemy.battleInfo.timeToAutoAttack = this.utilityService.enemyAverageAutoAttackSpeed;
      enemy.coinGainFromDefeat = 3;
      enemy.xpGainFromDefeat = 100; 

      var slash = new Ability();
      slash.name = "Slash";
      slash.isAvailable = true;
      slash.effectiveness = 1;
      slash.dealsDirectDamage = true;
      slash.cooldown = slash.currentCooldown = 23;
      slash = this.randomizeCooldown(slash);
      slash.targetEffect.push(this.globalService.createStatusEffect(StatusEffectEnum.DefenseDown, 10, .9, false, false));
      enemy.abilityList.push(slash);

      enemy.loot.push(new LootItem(ItemsEnum.EagleFeather, ItemTypeEnum.CraftingMaterial, 1, .2));
      enemy.loot.push(new LootItem(ItemsEnum.LightLeather, ItemTypeEnum.CraftingMaterial, 1, .04));
    }
    if (type === BestiaryEnum.Bandit)
    {
      enemy.name = "Bandit";
      enemy.battleStats = new CharacterStats(35, 16, 12, 7, 10, 10); 
      enemy.battleInfo.timeToAutoAttack = this.utilityService.enemyAverageAutoAttackSpeed;
      enemy.xpGainFromDefeat = 40; 
      enemy.coinGainFromDefeat = 1;
      enemy.loot.push(new LootItem(ItemsEnum.ThrowingStone, ItemTypeEnum.BattleItem, 1, .1));
    }
    if (type === BestiaryEnum.Thief)
    {
      enemy.name = "Thief";
      enemy.battleStats = new CharacterStats(26, 13, 8, 10, 5, 5); 
      enemy.battleInfo.timeToAutoAttack = this.utilityService.enemyQuickAutoAttackSpeed;
      enemy.xpGainFromDefeat = 40; 
      enemy.coinGainFromDefeat = 3;      
      enemy.loot.push(new LootItem(ItemsEnum.Olive, ItemTypeEnum.CraftingMaterial, 1, .02));
    }
    if (type === BestiaryEnum.Highwayman)
    {
      enemy.name = "Highwayman";
      enemy.battleStats = new CharacterStats(60, 14, 17, 10, 10, 20); 
      enemy.battleInfo.timeToAutoAttack = this.utilityService.enemyAverageAutoAttackSpeed;
      enemy.xpGainFromDefeat = 45; 
      enemy.coinGainFromDefeat = 2;
      enemy.loot.push(new LootItem(ItemsEnum.Olive, ItemTypeEnum.CraftingMaterial, 1, .08));
      enemy.loot.push(new LootItem(ItemsEnum.BronzeShield, ItemTypeEnum.Equipment, 1, .01));
    }
    if (type === BestiaryEnum.Coyote)
    {
      enemy.name = "Coyote";
      enemy.battleStats = new CharacterStats(27, 19, 15, 25, 25, 5); 
      enemy.battleInfo.timeToAutoAttack = this.utilityService.enemyQuickAutoAttackSpeed;
      enemy.xpGainFromDefeat = 42; 
      enemy.coinGainFromDefeat = 0;
      enemy.loot.push(new LootItem(ItemsEnum.LightLeather, ItemTypeEnum.CraftingMaterial, 1, .2));
      //chance to drop light leather
    }
    if (type === BestiaryEnum.Archer)
    {
      enemy.name = "Archer";
      enemy.battleStats = new CharacterStats(200, 25, 16, 10, 12, 60); 
      enemy.battleInfo.timeToAutoAttack = this.utilityService.enemyAverageAutoAttackSpeed;
      enemy.xpGainFromDefeat = 120; 
      enemy.coinGainFromDefeat = 3;
      enemy.loot.push(new LootItem(ItemsEnum.Olive, ItemTypeEnum.CraftingMaterial, 2, .05));
      enemy.loot.push(new LootItem(ItemsEnum.HealingHerb, ItemTypeEnum.HealingItem, 2, .125));

      var sureShot = new Ability();
      sureShot.name = "Sure Shot";
      sureShot.isAvailable = true;
      sureShot.effectiveness = 1.3;
      sureShot.cooldown = sureShot.currentCooldown = 25;
      sureShot = this.randomizeCooldown(sureShot);
      sureShot.dealsDirectDamage = true;
      sureShot.targetEffect.push(this.globalService.createDamageOverTimeEffect(12, 3, .2, sureShot.name));
      enemy.abilityList.push(sureShot);
    }
    if (type === BestiaryEnum.RedHarpy)
    {
      enemy.name = "Red-Feathered Harpy";
      enemy.battleStats = new CharacterStats(76, 25, 21, 25, 10, 10); 
      enemy.battleInfo.timeToAutoAttack = this.utilityService.enemyAverageAutoAttackSpeed;
      enemy.xpGainFromDefeat = 55; 
      enemy.coinGainFromDefeat = 2;
      enemy.loot.push(new LootItem(ItemsEnum.Leather, ItemTypeEnum.CraftingMaterial, 1, .1));
      //chance to drop leather

      var claw = new Ability();
      claw.name = "Claw";
      claw.isAvailable = true;
      claw.effectiveness = 1.5;
      claw.cooldown = claw.currentCooldown = 18;
      claw = this.randomizeCooldown(claw);
      claw.dealsDirectDamage = true;
      claw.elementalType = ElementalTypeEnum.Air;
      claw.targetEffect.push(this.globalService.createDamageOverTimeEffect(12, 3, .2, claw.name));
      enemy.abilityList.push(claw);

    }
    if (type === BestiaryEnum.BlueHarpy)
    {
      enemy.name = "Blue-Feathered Harpy";
      enemy.battleStats = new CharacterStats(85, 29, 23, 20, 10, 10); 
      enemy.battleInfo.timeToAutoAttack = this.utilityService.enemyLongAutoAttackSpeed;
      enemy.xpGainFromDefeat = 58; 
      enemy.coinGainFromDefeat = 2;
      enemy.loot.push(new LootItem(ItemsEnum.Leather, ItemTypeEnum.CraftingMaterial, 1, .1));
      //chance to drop leather

      var enrage = new Ability();
      enrage.name = "Enrage";
      enrage.isAvailable = true;
      enrage.cooldown = enrage.currentCooldown = (this.utilityService.enemyLongAutoAttackSpeed - 1);
      enrage.dealsDirectDamage = false;
      enrage.userEffect.push(this.globalService.createStatusEffect(StatusEffectEnum.AttackUp, 5, 1.25, false, true));
      enemy.abilityList.push(enrage);
    }
    if (type === BestiaryEnum.GreenHarpy)
    {
      enemy.name = "Green-Feathered Harpy";
      enemy.battleStats = new CharacterStats(64, 24, 18, 20, 20, 10); 
      enemy.battleInfo.timeToAutoAttack = this.utilityService.enemyQuickAutoAttackSpeed;
      enemy.xpGainFromDefeat = 55; 
      enemy.coinGainFromDefeat = 2;
      enemy.loot.push(new LootItem(ItemsEnum.Leather, ItemTypeEnum.CraftingMaterial, 1, .1));
      //chance to drop leather
      
      var ravage = new Ability();
      ravage.name = "Ravage";
      ravage.isAvailable = true;
      ravage.effectiveness = 1.7;
      ravage.cooldown = ravage.currentCooldown = 12;
      ravage = this.randomizeCooldown(ravage);
      ravage.dealsDirectDamage = true;
      ravage.elementalType = ElementalTypeEnum.Air;
      enemy.abilityList.push(ravage);
    }
    if (type === BestiaryEnum.FledglingLamia)
    {
      enemy.name = "Fledgling Lamia";
      enemy.battleStats = new CharacterStats(48, 19, 14, 45, 18, 7); 
      enemy.battleInfo.timeToAutoAttack = this.utilityService.enemyQuickAutoAttackSpeed;
      enemy.xpGainFromDefeat = 50; 
      enemy.coinGainFromDefeat = 1;
      enemy.loot.push(new LootItem(ItemsEnum.LamiaHeart, ItemTypeEnum.CraftingMaterial, 1, .05));      
    }
    if (type === BestiaryEnum.Lamia)
    {
      enemy.name = "Lamia";
      enemy.battleStats = new CharacterStats(88, 30, 30, 20, 25, 30); 
      enemy.battleInfo.timeToAutoAttack = this.utilityService.enemyQuickAutoAttackSpeed;
      enemy.xpGainFromDefeat = 60; 
      enemy.coinGainFromDefeat = 2;
      enemy.loot.push(new LootItem(ItemsEnum.LamiaHeart, ItemTypeEnum.CraftingMaterial, 1, .12));      

      var empower = new Ability();
      empower.name = "Empower";
      empower.isAvailable = true;
      empower.cooldown = empower.currentCooldown = 12;
      empower = this.randomizeCooldown(empower);
      empower.dealsDirectDamage = false;
      empower.userEffect.push(this.globalService.createStatusEffect(StatusEffectEnum.AttackUp, 10, 1.1, false, true, true));
      empower.userEffect.push(this.globalService.createStatusEffect(StatusEffectEnum.LuckUp, 10, 1.1, false, true, true));
      enemy.abilityList.push(empower);
    }
    if (type === BestiaryEnum.Sybaris)
    {
      enemy.name = "Sybaris";
      enemy.battleStats = new CharacterStats(600, 36, 40, 15, 13, 75); 
      enemy.battleInfo.timeToAutoAttack = this.utilityService.enemyLongAutoAttackSpeed;
      enemy.coinGainFromDefeat = 3;
      enemy.xpGainFromDefeat = 150; 

      var bite = new Ability();
      bite.name = "Bite";
      bite.isAvailable = true;
      bite.effectiveness = 1.5;
      bite.dealsDirectDamage = true;
      bite.cooldown = bite.currentCooldown = 22;
      bite = this.randomizeCooldown(bite);
      bite.targetEffect.push(this.globalService.createDamageOverTimeEffect(20, 4, .1, bite.name));
      enemy.abilityList.push(bite);

      var empower = new Ability();
      empower.name = "Empower";
      empower.isAvailable = true;
      empower.cooldown = empower.currentCooldown = 14;
      empower.dealsDirectDamage = false;
      empower = this.randomizeCooldown(empower);
      empower.userEffect.push(this.globalService.createStatusEffect(StatusEffectEnum.AttackUp, 10, 1.15, false, true, true));
      empower.userEffect.push(this.globalService.createStatusEffect(StatusEffectEnum.LuckUp, 10, 1.15, false, true, true));
      enemy.abilityList.push(empower);

      enemy.loot.push(new LootItem(ItemsEnum.LamiaHeart, ItemTypeEnum.CraftingMaterial, 3, .09));
      enemy.loot.push(new LootItem(ItemsEnum.PoisonFang, ItemTypeEnum.BattleItem, 1, .33));
      enemy.loot.push(new LootItem(ItemsEnum.PoisonFang, ItemTypeEnum.BattleItem, 2, .05));
      //chance to drop Poison Fang (battle item)
    }
    if (type === BestiaryEnum.LargeOctopus)
    {
      enemy.name = "Large Octopus";
      enemy.battleStats = new CharacterStats(108, 28, 28, 28, 28, 28); 
      enemy.battleInfo.timeToAutoAttack = this.utilityService.enemyAverageAutoAttackSpeed;
      enemy.xpGainFromDefeat = 55; 
      enemy.coinGainFromDefeat = 2;
      //chance to drop Lamia Scales

      var constrict = new Ability();
      constrict.name = "Constrict";
      constrict.isAvailable = true;
      constrict.cooldown = constrict.currentCooldown = 16;
      constrict = this.randomizeCooldown(constrict);
      constrict.dealsDirectDamage = false;
      constrict.targetEffect.push(this.globalService.createStatusEffect(StatusEffectEnum.AgilityDown, 8, .75, false, false));      
      enemy.abilityList.push(constrict);
    }
    if (type === BestiaryEnum.UnsettlingShade)
    {
      enemy.name = "Unsettling Shade";
      enemy.battleStats = new CharacterStats(140, 61, 48, 60, 60, 25); 
      enemy.battleInfo.timeToAutoAttack = this.utilityService.enemyLongAutoAttackSpeed;
      enemy.xpGainFromDefeat = 70; 
      enemy.coinGainFromDefeat = 0;
      enemy.loot.push(new LootItem(ItemsEnum.ForgottenLocket, ItemTypeEnum.Equipment, 1, .0075));

      var ethereal = new Ability();
      ethereal.name = "Ethereal";
      ethereal.isAvailable = true;
      ethereal.cooldown = ethereal.currentCooldown = 30;
      ethereal = this.randomizeCooldown(ethereal);
      ethereal.dealsDirectDamage = false;
      ethereal.userEffect.push(this.globalService.createStatusEffect(StatusEffectEnum.Dodge, 4, 0, false, true));      
      enemy.abilityList.push(ethereal);
    }
    if (type === BestiaryEnum.Gorgon)
    {
      enemy.name = "Gorgon";
      enemy.battleStats = new CharacterStats(120, 44, 52, 50, 35, 35); 
      enemy.battleInfo.timeToAutoAttack = this.utilityService.enemyAverageAutoAttackSpeed;
      enemy.xpGainFromDefeat = 72; 
      enemy.coinGainFromDefeat = 2;      
      enemy.loot.push(new LootItem(ItemsEnum.PetrifiedBark, ItemTypeEnum.CraftingMaterial, 1, .01));

      var gaze = new Ability();
      gaze.name = "Gaze";
      gaze.isAvailable = true;
      gaze.cooldown = gaze.currentCooldown = 24;
      gaze = this.randomizeCooldown(gaze);
      gaze.dealsDirectDamage = false;
      gaze.targetEffect.push(this.globalService.createStatusEffect(StatusEffectEnum.Stun, 4, 0, false, false));      
      enemy.abilityList.push(gaze);
    }
    if (type === BestiaryEnum.Stheno)
    {
      enemy.name = "Stheno";
      enemy.battleStats = new CharacterStats(700, 76, 75, 35, 20, 100); 
      enemy.battleInfo.timeToAutoAttack = this.utilityService.enemyLongAutoAttackSpeed;
      enemy.coinGainFromDefeat = 3;
      enemy.xpGainFromDefeat = 125; 
      enemy.loot.push(new LootItem(ItemsEnum.PetrifiedBark, ItemTypeEnum.CraftingMaterial, 2, .08));

      var gaze = new Ability();
      gaze.name = "Gaze";
      gaze.isAvailable = true;
      gaze.cooldown = gaze.currentCooldown = 25;
      gaze = this.randomizeCooldown(gaze);
      gaze.dealsDirectDamage = false;
      gaze.targetEffect.push(this.globalService.createStatusEffect(StatusEffectEnum.Stun, 6, 0, false, false));      
      enemy.abilityList.push(gaze);

      var bite = new Ability();
      bite.name = "Snake Bite";
      bite.isAvailable = true;
      bite.effectiveness = 1.25;
      bite.dealsDirectDamage = true;
      bite.cooldown = bite.currentCooldown = 13;
      bite = this.randomizeCooldown(bite);
      bite.targetEffect.push(this.globalService.createDamageOverTimeEffect(6, 2, .2, bite.name));
      enemy.abilityList.push(bite);
    }
    if (type === BestiaryEnum.Euryale)
    {
      enemy.name = "Euryale";
      enemy.battleStats = new CharacterStats(550, 65, 80, 40, 40, 110); 
      enemy.battleInfo.timeToAutoAttack = this.utilityService.enemyLongAutoAttackSpeed;
      enemy.coinGainFromDefeat = 3;
      enemy.xpGainFromDefeat = 125; 
      enemy.loot.push(new LootItem(ItemsEnum.PetrifiedBark, ItemTypeEnum.CraftingMaterial, 1, .2));

      var gaze = new Ability();
      gaze.name = "Gaze";
      gaze.isAvailable = true;
      gaze.cooldown = gaze.currentCooldown = 20;
      gaze = this.randomizeCooldown(gaze);
      gaze.dealsDirectDamage = false;
      gaze.targetEffect.push(this.globalService.createStatusEffect(StatusEffectEnum.Stun, 6, 0, false, false));      
      enemy.abilityList.push(gaze);

      var feint = new Ability();
      feint.name = "Feint";
      feint.isAvailable = true;
      feint.dealsDirectDamage = false;
      feint.cooldown = feint.currentCooldown = 15;
      feint = this.randomizeCooldown(feint);
      feint.targetEffect.push(this.globalService.createStatusEffect(StatusEffectEnum.AgilityDown, 7, .75, false, false)); 
      enemy.abilityList.push(feint);
    }
    if (type === BestiaryEnum.Medusa)
    {
      enemy.name = "Medusa";
      enemy.battleStats = new CharacterStats(1800, 103, 116, 82, 40, 175); 
      enemy.battleInfo.timeToAutoAttack = this.utilityService.enemyAverageAutoAttackSpeed;
      enemy.coinGainFromDefeat = 3;
      enemy.xpGainFromDefeat = 175; 
      enemy.loot.push(new LootItem(ItemsEnum.PetrifiedBark, ItemTypeEnum.CraftingMaterial, 5, .05));

      var gaze = new Ability();
      gaze.name = "Gaze";
      gaze.isAvailable = true;
      gaze.cooldown = gaze.currentCooldown = 25;
      gaze = this.randomizeCooldown(gaze);
      gaze.dealsDirectDamage = false;
      gaze.targetEffect.push(this.globalService.createStatusEffect(StatusEffectEnum.Stun, 5, 0, false, false));      
      enemy.abilityList.push(gaze);
    }
    if (type === BestiaryEnum.Lion)
    {      
      enemy.name = "Lion";
      enemy.battleStats = new CharacterStats(1000, 190, 150, 300, 300, 280); 
      enemy.battleInfo.timeToAutoAttack = this.utilityService.enemyQuickAutoAttackSpeed;
      enemy.coinGainFromDefeat = 2;
      enemy.xpGainFromDefeat = 250; 

      var swipe = new Ability();
      swipe.name = "Swipe";
      swipe.isAvailable = true;
      swipe.cooldown = swipe.currentCooldown = 13;
      swipe = this.randomizeCooldown(swipe);
      swipe.dealsDirectDamage = true;
      swipe.effectiveness = 1.4;    
      enemy.abilityList.push(swipe);
    }
    if (type === BestiaryEnum.EnceladusOne)
    {      
      enemy.name = "Enceladus";
      enemy.battleStats = new CharacterStats(250000, 415, 683, 60, 600, 1000); 
      enemy.battleInfo.timeToAutoAttack = this.utilityService.enemyAverageAutoAttackSpeed;
      enemy.coinGainFromDefeat = 10;
      enemy.xpGainFromDefeat = 1000;       

      var smash = new Ability();
      smash.name = "Smash";
      smash.isAvailable = true;
      smash.cooldown = smash.currentCooldown = 15;
      smash = this.randomizeCooldown(smash);
      smash.dealsDirectDamage = true;
      smash.effectiveness = 2.3;    
      smash.targetEffect.push(this.globalService.createDamageOverTimeEffect(15, 5, .8, smash.name));
      enemy.abilityList.push(smash);

      var wallop = new Ability();
      wallop.name = "Wallop";
      wallop.isAvailable = true;
      wallop.cooldown = wallop.currentCooldown = 15;
      wallop = this.randomizeCooldown(wallop);
      wallop.dealsDirectDamage = true;
      wallop.effectiveness = 1.5;
      wallop.targetEffect.push(this.globalService.createStatusEffect(StatusEffectEnum.DefenseDown, 10, .4, false, false));      
      enemy.abilityList.push(wallop);
    }
    if (type === BestiaryEnum.LostSoul)
    {
      //somewhat easy to rebound from resetting gods
      enemy.name = "Lost Soul";
      enemy.battleStats = new CharacterStats(363, 43, 64, 37, 30, 85);      
      enemy.battleInfo.timeToAutoAttack = this.utilityService.enemyAverageAutoAttackSpeed;
      enemy.coinGainFromDefeat = 2;
      enemy.xpGainFromDefeat = 92; 
      enemy.loot.push(new LootItem(ItemsEnum.SoulSpark, ItemTypeEnum.CraftingMaterial, 1, .05));
    }
    if (type === BestiaryEnum.Wretched)
    {
      enemy.name = "Wretched";
      enemy.battleStats = new CharacterStats(278, 52, 82, 53, 40, 85); 
      enemy.battleStats.elementalDamageResistance.holy = this.utilityService.enemyMinorElementalWeakness;
      enemy.battleInfo.timeToAutoAttack = this.utilityService.enemyLongAutoAttackSpeed;
      enemy.coinGainFromDefeat = 2;
      enemy.xpGainFromDefeat = 93; 
      enemy.loot.push(new LootItem(ItemsEnum.MoltenShield, ItemTypeEnum.Equipment, 1, .01));

      var deathsTouch = new Ability();
      deathsTouch.name = "Death's Touch";
      deathsTouch.isAvailable = true;
      deathsTouch.cooldown = deathsTouch.currentCooldown = 18;
      deathsTouch = this.randomizeCooldown(deathsTouch);
      deathsTouch.dealsDirectDamage = false;
      deathsTouch.targetEffect.push(this.globalService.createStatusEffect(StatusEffectEnum.AttackDown, 7, .9, false, false));
      deathsTouch.targetEffect.push(this.globalService.createStatusEffect(StatusEffectEnum.DefenseDown, 7, .9, false, false));
      enemy.abilityList.push(deathsTouch);
    }
    if (type === BestiaryEnum.Revenant)
    {
      enemy.name = "Revenant";
      enemy.battleStats = new CharacterStats(450, 77, 112, 75, 40, 85); 
      enemy.battleStats.elementalDamageResistance.holy = this.utilityService.enemyMinorElementalWeakness;
      enemy.battleInfo.timeToAutoAttack = this.utilityService.enemyLongAutoAttackSpeed;
      enemy.coinGainFromDefeat = 2;
      enemy.xpGainFromDefeat = 97; 
      enemy.loot.push(new LootItem(ItemsEnum.MoltenShield, ItemTypeEnum.Equipment, 1, .02));
      enemy.loot.push(new LootItem(ItemsEnum.VialOfTheLethe, ItemTypeEnum.CraftingMaterial, 1, .075));

      var soulRip = new Ability();
      soulRip.name = "Soul Rip";
      soulRip.isAvailable = true;
      soulRip.cooldown = soulRip.currentCooldown = 13;
      soulRip = this.randomizeCooldown(soulRip);
      soulRip.dealsDirectDamage = true;
      soulRip.effectiveness = 1;
      soulRip.userEffect.push(this.globalService.createStatusEffect(StatusEffectEnum.InstantHeal, 0, .25, true, true));      
      enemy.abilityList.push(soulRip);
    }
    if (type === BestiaryEnum.IncoherentBanshee)
    {
      enemy.name = "Incoherent Banshee";
      enemy.battleStats = new CharacterStats(537, 89, 100, 50, 50, 75); 
      enemy.battleInfo.timeToAutoAttack = this.utilityService.enemyAverageAutoAttackSpeed;
      enemy.coinGainFromDefeat = 2;
      enemy.xpGainFromDefeat = 108; 
      enemy.loot.push(new LootItem(ItemsEnum.Asphodelus, ItemTypeEnum.CraftingMaterial, 1, .05));

      var rambling = new Ability();
      rambling.name = "Rambling";
      rambling.isAvailable = true;
      rambling.cooldown = rambling.currentCooldown = 16;
      rambling = this.randomizeCooldown(rambling);
      rambling.dealsDirectDamage = false;
      rambling.targetEffect.push(this.globalService.createStatusEffect(StatusEffectEnum.AgilityDown, 9, .7, false, false, true));
      enemy.abilityList.push(rambling);
    }
    if (type === BestiaryEnum.EngorgedShade)
    {
      enemy.name = "Engorged Shade";
      enemy.battleStats = new CharacterStats(594, 92, 130, 80, 50, 75); 
      enemy.battleInfo.timeToAutoAttack = this.utilityService.enemyLongAutoAttackSpeed;
      enemy.coinGainFromDefeat = 2;
      enemy.xpGainFromDefeat = 105; 
      enemy.loot.push(new LootItem(ItemsEnum.SoulSpark, ItemTypeEnum.CraftingMaterial, 3, .1));
      enemy.loot.push(new LootItem(ItemsEnum.SmallEmerald, ItemTypeEnum.CraftingMaterial, 1, .01));
    }
    if (type === BestiaryEnum.CacklingSpectre)
    {
      enemy.name = "Cackling Spectre";
      enemy.battleStats = new CharacterStats(663, 57, 89, 70, 55, 75); 
      enemy.battleInfo.timeToAutoAttack = this.utilityService.enemyQuickAutoAttackSpeed;
      enemy.coinGainFromDefeat = 2;
      enemy.xpGainFromDefeat = 108; 
      enemy.loot.push(new LootItem(ItemsEnum.VialOfTheLethe, ItemTypeEnum.CraftingMaterial, 2, .15));
    }
    if (type === BestiaryEnum.FloatingFlame)
    {
      enemy.name = "Floating Flame";
      enemy.battleStats = new CharacterStats(494, 90, 90, 60, 50, 150); 
      enemy.battleStats.elementalDamageResistance.water = this.utilityService.enemyMediumElementalWeakness;
      enemy.battleInfo.timeToAutoAttack = this.utilityService.enemyLongAutoAttackSpeed;
      enemy.battleInfo.elementalType = ElementalTypeEnum.Fire;
      enemy.coinGainFromDefeat = 2;
      enemy.xpGainFromDefeat = 105;       
      enemy.loot.push(new LootItem(ItemsEnum.SoulSpark, ItemTypeEnum.CraftingMaterial, 1, .033));
      enemy.loot.push(new LootItem(ItemsEnum.EssenceOfFire, ItemTypeEnum.CraftingMaterial, 1, .15));

      var burn = new Ability();
      burn.name = "Burn";
      burn.isAvailable = true;
      burn.cooldown = burn.currentCooldown = 10;
      burn = this.randomizeCooldown(burn);
      burn.dealsDirectDamage = false;      
      burn.targetEffect.push(this.globalService.createDamageOverTimeEffect(10, 5, .5, burn.name, dotTypeEnum.BasedOnAttack, ElementalTypeEnum.Fire));
      enemy.abilityList.push(burn);
    }
    if (type === BestiaryEnum.Butcher)
    {
      enemy.name = "Butcher";
      enemy.battleStats = new CharacterStats(718, 98, 119, 80, 40, 140); 
      enemy.battleStats.elementalDamageResistance.holy = this.utilityService.enemyMinorElementalWeakness;
      enemy.battleInfo.timeToAutoAttack = this.utilityService.enemyAverageAutoAttackSpeed;
      enemy.coinGainFromDefeat = 2;
      enemy.xpGainFromDefeat = 116; 
      enemy.loot.push(new LootItem(ItemsEnum.MoltenArmor, ItemTypeEnum.Equipment, 1, .005));
      enemy.loot.push(new LootItem(ItemsEnum.SwordOfFlames, ItemTypeEnum.Equipment, 1, .005));

      var slice = new Ability();
      slice.name = "Slice";
      slice.isAvailable = true;
      slice.cooldown = slice.currentCooldown = 13;
      slice = this.randomizeCooldown(slice);
      slice.dealsDirectDamage = true;
      slice.effectiveness = 2;     
      slice.elementalType = ElementalTypeEnum.Fire; 
      slice.userEffect.push(this.globalService.createStatusEffect(StatusEffectEnum.AgilityUp, 6, 1.1, false, true));
      enemy.abilityList.push(slice);
    }
    if (type === BestiaryEnum.WheelOfFire)
    {
      enemy.name = "Wheel of Fire";
      enemy.battleStats = new CharacterStats(565, 83, 118, 85, 80, 150); 
      enemy.battleStats.elementalDamageResistance.water = this.utilityService.enemyMediumElementalWeakness;
      enemy.battleInfo.timeToAutoAttack = this.utilityService.enemyAverageAutoAttackSpeed;
      enemy.battleInfo.elementalType = ElementalTypeEnum.Fire;
      enemy.coinGainFromDefeat = 2;
      enemy.xpGainFromDefeat = 114; 
      enemy.loot.push(new LootItem(ItemsEnum.EssenceOfFire, ItemTypeEnum.CraftingMaterial, 2, .075));
      enemy.loot.push(new LootItem(ItemsEnum.SmallRuby, ItemTypeEnum.CraftingMaterial, 1, .01));

      var rollThrough = new Ability();
      rollThrough.name = "Roll";
      rollThrough.isAvailable = true;
      rollThrough.cooldown = rollThrough.currentCooldown = 16;
      rollThrough = this.randomizeCooldown(rollThrough);
      rollThrough.dealsDirectDamage = true;
      rollThrough.isAoe = true;
      rollThrough.effectiveness = 1.4;     
      rollThrough.elementalType = ElementalTypeEnum.Fire; 
      enemy.abilityList.push(rollThrough);
    }
    if (type === BestiaryEnum.Empusa)
    {
      enemy.name = "Empusa";
      enemy.battleStats = new CharacterStats(800, 104, 95, 80, 45, 75); 
      enemy.battleInfo.timeToAutoAttack = this.utilityService.enemyAverageAutoAttackSpeed;
      enemy.coinGainFromDefeat = 2;
      enemy.xpGainFromDefeat = 118; 
      enemy.loot.push(new LootItem(ItemsEnum.MoltenRing, ItemTypeEnum.Equipment, 1, .03));      
      enemy.battleStats.elementalDamageIncrease.fire = .25;
            
      var enfire = new Ability();
      enfire.name = "Enfire";
      enfire.isAvailable = true;
      enfire.cooldown = enfire.currentCooldown = 25;
      enfire = this.randomizeCooldown(enfire);
      enfire.dealsDirectDamage = false;      
      enfire.userEffect.push(this.globalService.createStatusEffect(StatusEffectEnum.Enfire, 20, 1, false, true));            
      enemy.abilityList.push(enfire);
    }
    if (type === BestiaryEnum.InsaneSoul)
    {
      enemy.name = "Insane Soul";
      enemy.battleStats = new CharacterStats(732, 94, 119, 104, 50, 150); 
      enemy.battleInfo.timeToAutoAttack = this.utilityService.enemyAverageAutoAttackSpeed;
      enemy.coinGainFromDefeat = 2;
      enemy.xpGainFromDefeat = 113; 
      enemy.loot.push(new LootItem(ItemsEnum.SoulSpark, ItemTypeEnum.CraftingMaterial, 2, .04));
      enemy.loot.push(new LootItem(ItemsEnum.SoulSpark, ItemTypeEnum.CraftingMaterial, 1, .08));
      enemy.loot.push(new LootItem(ItemsEnum.SmallTopaz, ItemTypeEnum.CraftingMaterial, 1, .01));

      var slam = new Ability();
      slam.name = "Slam";
      slam.isAvailable = true;
      slam.cooldown = slam.currentCooldown = 16;
      slam = this.randomizeCooldown(slam);
      slam.dealsDirectDamage = true;
      slam.effectiveness = 1;           
      enemy.abilityList.push(slam);
    }
    if (type === BestiaryEnum.DualWieldingButcher)
    {
      enemy.name = "Dual-Wielding Butcher";
      enemy.battleStats = new CharacterStats(953, 78, 125, 130, 55, 125); 
      enemy.battleStats.elementalDamageResistance.holy = this.utilityService.enemyMinorElementalWeakness;
      enemy.battleInfo.timeToAutoAttack = this.utilityService.enemyQuickAutoAttackSpeed;
      enemy.coinGainFromDefeat = 3;
      enemy.xpGainFromDefeat = 124; 
      enemy.loot.push(new LootItem(ItemsEnum.SwordOfFlames, ItemTypeEnum.Equipment, 1, .0075));
      enemy.loot.push(new LootItem(ItemsEnum.SmallRuby, ItemTypeEnum.CraftingMaterial, 1, .01));
      enemy.battleStats.elementalDamageIncrease.fire = .1;
      
      var dualSlice = new Ability();
      dualSlice.name = "Dual Slice";
      dualSlice.isAvailable = true;
      dualSlice.cooldown = dualSlice.currentCooldown = 24;
      dualSlice = this.randomizeCooldown(dualSlice);
      dualSlice.dealsDirectDamage = true;
      dualSlice.effectiveness = 1.8;     
      dualSlice.elementalType = ElementalTypeEnum.Fire; 
      dualSlice.userEffect.push(this.globalService.createStatusEffect(StatusEffectEnum.AgilityUp, 10, 1.5, false, true));
      enemy.abilityList.push(dualSlice);
    }    
    if (type === BestiaryEnum.HellRider)
    {
      enemy.name = "Hell Rider";
      enemy.battleStats = new CharacterStats(1265, 105, 152, 40, 50, 120); 
      enemy.battleStats.elementalDamageResistance.water = this.utilityService.enemyMinorElementalWeakness;
      enemy.battleInfo.timeToAutoAttack = this.utilityService.enemyQuickAutoAttackSpeed;
      enemy.coinGainFromDefeat = 4;
      enemy.xpGainFromDefeat = 130; 
      enemy.loot.push(new LootItem(ItemsEnum.MoltenArmor, ItemTypeEnum.Equipment, 1, .05));
      enemy.loot.push(new LootItem(ItemsEnum.SmallRuby, ItemTypeEnum.CraftingMaterial, 1, .02));
      
      var trample = new Ability();
      trample.name = "Trample";
      trample.isAvailable = true;
      trample.effectiveness = 1.45;
      trample.cooldown = trample.currentCooldown = 22;
      trample = this.randomizeCooldown(trample);
      trample.dealsDirectDamage = true;
      trample.targetEffect.push(this.globalService.createDamageOverTimeEffect(8, 2, .25, trample.name));
      enemy.abilityList.push(trample);
      
      var stagger = new Ability();
      stagger.name = "Stagger";
      stagger.isAvailable = true;
      stagger.effectiveness = 1.75;
      stagger.cooldown = stagger.currentCooldown = 15;
      stagger = this.randomizeCooldown(stagger);
      stagger.dealsDirectDamage = true;
      stagger.targetEffect.push(this.globalService.createStatusEffect(StatusEffectEnum.Stagger, 8, .5, false, true));
      enemy.abilityList.push(stagger);
    }
    if (type === BestiaryEnum.FieryNewt)
    {
      enemy.name = "Fiery Newt";
      enemy.battleStats = new CharacterStats(717, 63, 98, 85, 60, 100); 
      enemy.battleStats.elementalDamageResistance.water = this.utilityService.enemyMinorElementalWeakness;
      enemy.battleInfo.timeToAutoAttack = this.utilityService.enemyQuickAutoAttackSpeed;
      enemy.coinGainFromDefeat = 2;
      enemy.xpGainFromDefeat = 110; 
      enemy.loot.push(new LootItem(ItemsEnum.Asphodelus, ItemTypeEnum.CraftingMaterial, 2, .05));

      var fireBreath = new Ability();
      fireBreath.name = "Fire Breath";
      fireBreath.isAvailable = true;
      fireBreath.cooldown = fireBreath.currentCooldown = 22;
      fireBreath = this.randomizeCooldown(fireBreath);
      fireBreath.dealsDirectDamage = true;
      fireBreath.effectiveness = 1.2;     
      fireBreath.elementalType = ElementalTypeEnum.Fire; 
      fireBreath.targetEffect.push(this.globalService.createStatusEffect(StatusEffectEnum.DefenseDown, 10, .8, false, false));
      enemy.abilityList.push(fireBreath);
    }
    if (type === BestiaryEnum.EnflamedSalamander)
    {
      enemy.name = "Enflamed Salamander";
      enemy.battleStats = new CharacterStats(2350, 175, 200, 95, 80, 180); 
      enemy.battleStats.elementalDamageResistance.water = this.utilityService.enemyMinorElementalWeakness;
      enemy.battleInfo.timeToAutoAttack = this.utilityService.enemyAverageAutoAttackSpeed;
      enemy.battleStats.elementalDamageIncrease.fire += .1;
      enemy.coinGainFromDefeat = 5;
      enemy.xpGainFromDefeat = 325; 
      enemy.loot.push(new LootItem(ItemsEnum.Asphodelus, ItemTypeEnum.CraftingMaterial, 2, .1));
      enemy.loot.push(new LootItem(ItemsEnum.EssenceOfFire, ItemTypeEnum.CraftingMaterial, 3, .033));
      enemy.loot.push(new LootItem(ItemsEnum.VialOfTheLethe, ItemTypeEnum.CraftingMaterial, 2, .2));

      var tailSwing = new Ability();
      tailSwing.name = "Tail Swipe";
      tailSwing.isAvailable = true;
      tailSwing.cooldown = tailSwing.currentCooldown = 16;
      tailSwing = this.randomizeCooldown(tailSwing);
      tailSwing.dealsDirectDamage = true;
      tailSwing.effectiveness = 1.2;     
      tailSwing.elementalType = ElementalTypeEnum.Fire;       
      enemy.abilityList.push(tailSwing);

      var regeneration = new Ability();
      regeneration.name = "Regeneration";
      regeneration.isAvailable = true;
      regeneration.cooldown = regeneration.currentCooldown = 35;
      regeneration = this.randomizeCooldown(regeneration);
      regeneration.dealsDirectDamage = false;
      regeneration.heals = true;
      regeneration.effectiveness = .6;     
      regeneration.targetsAllies = true;
      enemy.abilityList.push(regeneration);
    }
    if (type === BestiaryEnum.FallenHero)
    {
      enemy.name = "Fallen Hero";
      enemy.battleStats = new CharacterStats(1054, 123, 164, 70, 60, 150); 
      enemy.battleInfo.timeToAutoAttack = this.utilityService.enemyAverageAutoAttackSpeed;
      enemy.coinGainFromDefeat = 3;
      enemy.xpGainFromDefeat = 124; 
      enemy.loot.push(new LootItem(ItemsEnum.Narcissus, ItemTypeEnum.CraftingMaterial, 1, .15));

      var shieldUp = new Ability();
      shieldUp.name = "Shields Up";
      shieldUp.isAvailable = true;
      shieldUp.cooldown = shieldUp.currentCooldown = 20;
      shieldUp = this.randomizeCooldown(shieldUp);
      shieldUp.dealsDirectDamage = false;    
      shieldUp.userEffect.push(this.globalService.createStatusEffect(StatusEffectEnum.DefenseUp, 10, 1.3, false, true, true));
      enemy.abilityList.push(shieldUp);

      var bash = new Ability();
      bash.name = "Bash";
      bash.isAvailable = true;
      bash.cooldown = bash.currentCooldown = 19;
      bash = this.randomizeCooldown(bash);
      bash.dealsDirectDamage = true;
      bash.effectiveness = 1.15;         
      enemy.abilityList.push(bash);
    }
    if (type === BestiaryEnum.TwistedSoul)
    {
      enemy.name = "Twisted Soul";
      enemy.battleStats = new CharacterStats(989, 114, 159, 121, 60, 150); 
      enemy.battleInfo.timeToAutoAttack = this.utilityService.enemyAverageAutoAttackSpeed;
      enemy.coinGainFromDefeat = 2;
      enemy.xpGainFromDefeat = 126; 
      enemy.loot.push(new LootItem(ItemsEnum.SoulSpark, ItemTypeEnum.CraftingMaterial, 3, .1));
      enemy.loot.push(new LootItem(ItemsEnum.SmallTopaz, ItemTypeEnum.CraftingMaterial, 1, .02));

      var sap = new Ability();
      sap.name = "Sap";
      sap.isAvailable = true;
      sap.cooldown = sap.currentCooldown = 8;
      sap = this.randomizeCooldown(sap);
      sap.dealsDirectDamage = false;      
      sap.userEffect.push(this.globalService.createStatusEffect(StatusEffectEnum.Sap, -1, .2, true, false));
      enemy.abilityList.push(sap);
    }
    if (type === BestiaryEnum.BlessedShade)
    {
      enemy.name = "Blessed Shade";
      enemy.battleStats = new CharacterStats(1324, 162, 188, 90, 75, 150);
      enemy.battleInfo.timeToAutoAttack = this.utilityService.enemyLongAutoAttackSpeed;
      enemy.coinGainFromDefeat = 2;
      enemy.xpGainFromDefeat = 125; 
      enemy.loot.push(new LootItem(ItemsEnum.VialOfTheLethe, ItemTypeEnum.CraftingMaterial, 1, .33));
      enemy.loot.push(new LootItem(ItemsEnum.SmallEmerald, ItemTypeEnum.CraftingMaterial, 1, .02));
    }
    if (type === BestiaryEnum.ExiledHoplite)
    {
      enemy.name = "Exiled Hoplite";
      enemy.battleStats = new CharacterStats(1405, 178, 192, 84, 75, 200); 
      enemy.battleInfo.timeToAutoAttack = this.utilityService.enemyLongAutoAttackSpeed;
      enemy.coinGainFromDefeat = 4;
      enemy.xpGainFromDefeat = 130; 
      enemy.battleInfo.barrierValue = enemy.battleStats.maxHp * .1;
      enemy.loot.push(new LootItem(ItemsEnum.Narcissus, ItemTypeEnum.CraftingMaterial, 2, .05));
      enemy.loot.push(new LootItem(ItemsEnum.BrokenNecklace, ItemTypeEnum.CraftingMaterial, 1, .15));
      
      var focus = new Ability();
      focus.name = "Focus";
      focus.isAvailable = true;
      focus.cooldown = focus.currentCooldown = 20;
      focus = this.randomizeCooldown(focus);
      focus.dealsDirectDamage = false;      
      focus.targetEffect.push(this.globalService.createStatusEffect(StatusEffectEnum.Taunt, 12, 1, false, false));
      enemy.abilityList.push(focus);

      var bash = new Ability();
      bash.name = "Bash";
      bash.isAvailable = true;
      bash.cooldown = bash.currentCooldown = 18;
      bash = this.randomizeCooldown(bash);
      bash.dealsDirectDamage = true;
      bash.effectiveness = 1.6;         
      enemy.abilityList.push(bash);
    }
    if (type === BestiaryEnum.Sisyphus)
    {
      enemy.name = "Sisyphus";
      enemy.battleStats = new CharacterStats(4400, 200, 373, 40, 50, 450); 
      enemy.battleInfo.timeToAutoAttack = this.utilityService.enemyLongAutoAttackSpeed;      
      enemy.coinGainFromDefeat = 2;
      enemy.xpGainFromDefeat = 250; 

      var rockslide = new Ability();
      rockslide.name = "Rockslide";
      rockslide.isAvailable = true;
      rockslide.effectiveness = 1.7;
      rockslide.cooldown = rockslide.currentCooldown = 16;
      rockslide = this.randomizeCooldown(rockslide);
      rockslide.dealsDirectDamage = true;
      rockslide.elementalType = ElementalTypeEnum.Earth;
      rockslide.targetEffect.push(this.globalService.createStatusEffect(StatusEffectEnum.Stagger, 8, .5, false, true));
      enemy.abilityList.push(rockslide);

      //todo: Ability that reduces damage taken until hit by an auto attack maybe?

      var fistsOfFury = new Ability();
      fistsOfFury.name = "Enfire";
      fistsOfFury.isAvailable = true;
      fistsOfFury.cooldown = fistsOfFury.currentCooldown = 14;
      fistsOfFury = this.randomizeCooldown(fistsOfFury);
      fistsOfFury.dealsDirectDamage = false;      
      fistsOfFury.userEffect.push(this.globalService.createStatusEffect(StatusEffectEnum.Enfire, 10, 1, false, true));            
      enemy.abilityList.push(fistsOfFury);
    }
    if (type === BestiaryEnum.Ixion)
    {
      enemy.name = "Ixion";
      enemy.battleStats = new CharacterStats(3830, 156, 293, 140, 95, 450); 
      enemy.battleInfo.timeToAutoAttack = this.utilityService.enemyQuickAutoAttackSpeed;
      enemy.battleInfo.barrierValue = enemy.battleStats.maxHp * .2;
      enemy.coinGainFromDefeat = 2;
      enemy.xpGainFromDefeat = 250; 

      var pathOfFlames = new Ability();
      pathOfFlames.name = "Path of Flames";
      pathOfFlames.isAvailable = true;
      pathOfFlames.effectiveness = 1.5;
      pathOfFlames.isAoe = true;
      pathOfFlames.cooldown = pathOfFlames.currentCooldown = 18;
      pathOfFlames = this.randomizeCooldown(pathOfFlames);
      pathOfFlames.dealsDirectDamage = true;
      pathOfFlames.elementalType = ElementalTypeEnum.Fire;
      pathOfFlames.targetEffect.push(this.globalService.createDamageOverTimeEffect(6, 2, .25, pathOfFlames.name, dotTypeEnum.BasedOnDamage, ElementalTypeEnum.Fire));
      enemy.abilityList.push(pathOfFlames);

      var speedUp = new Ability();
      speedUp.name = "Speed Up";
      speedUp.isAvailable = true;
      speedUp.cooldown = speedUp.currentCooldown = 8;
      speedUp = this.randomizeCooldown(speedUp);
      speedUp.dealsDirectDamage = false;
      speedUp.userEffect.push(this.globalService.createStatusEffect(StatusEffectEnum.AgilityUp, -1, 1.1, false, true, false, undefined, undefined, true));
      speedUp.userEffect.push(this.globalService.createStatusEffect(StatusEffectEnum.AttackUp, -1, 1.1, false, true, false, undefined, undefined, true));
      enemy.abilityList.push(speedUp);
      
      var flamesOfTartarus = new Ability();
      flamesOfTartarus.name = "Flames of Tartarus";
      flamesOfTartarus.isAvailable = true;
      flamesOfTartarus.effectiveness = 3.8;
      flamesOfTartarus.cooldown = flamesOfTartarus.currentCooldown = 1000;
      flamesOfTartarus.dealsDirectDamage = true;
      flamesOfTartarus.elementalType = ElementalTypeEnum.Fire;      
      enemy.abilityList.push(flamesOfTartarus);
    }
    if (type === BestiaryEnum.Tantalus)
    {
      enemy.name = "Tantalus";
      enemy.battleStats = new CharacterStats(3140, 198, 338, 76, 120, 450); 
      enemy.battleInfo.timeToAutoAttack = this.utilityService.enemyAverageAutoAttackSpeed;      
      enemy.coinGainFromDefeat = 2;
      enemy.xpGainFromDefeat = 250; 
      
      var torment = new Ability();
      torment.name = "Torment";
      torment.isAvailable = true;
      torment.cooldown = torment.currentCooldown = 17;
      torment = this.randomizeCooldown(torment);
      torment.dealsDirectDamage = true;
      torment.isAoe = true;
      torment.effectiveness = 2.1;     
      torment.elementalType = ElementalTypeEnum.Fire; 
      enemy.abilityList.push(torment);

      var twistedSacrifice = new Ability();
      twistedSacrifice.name = "Twisted Sacrifice";
      twistedSacrifice.isAvailable = true;
      twistedSacrifice.cooldown = twistedSacrifice.currentCooldown = 10;
      twistedSacrifice = this.randomizeCooldown(twistedSacrifice);
      twistedSacrifice.dealsDirectDamage = false;
      twistedSacrifice.userEffect.push(this.globalService.createStatusEffect(StatusEffectEnum.AttackUp, -1, 1.2, false, true, false, undefined, undefined, true));
      twistedSacrifice.userEffect.push(this.globalService.createStatusEffect(StatusEffectEnum.DefenseDown, -1, .8, false, true, false, undefined, undefined, true));
      enemy.abilityList.push(twistedSacrifice);            
    }
    //these two are barrier based, can continously create barriers
    if (type === BestiaryEnum.Castor)
    {
      enemy.name = "Castor";
      enemy.battleStats = new CharacterStats(1650, 202, 175, 112, 85, 200); 
      enemy.battleInfo.timeToAutoAttack = this.utilityService.enemyAverageAutoAttackSpeed;
      enemy.coinGainFromDefeat = 2;
      enemy.xpGainFromDefeat = 250; 

      var geminiStrike = new Ability();
      geminiStrike.name = "Gemini Strike";
      geminiStrike.isAvailable = true;
      geminiStrike.cooldown = geminiStrike.currentCooldown = 22;
      geminiStrike = this.randomizeCooldown(geminiStrike);
      geminiStrike.dealsDirectDamage = true;
      geminiStrike.effectiveness = 1.3;         
      enemy.abilityList.push(geminiStrike);
            
      var ride = new Ability();
      ride.name = "Ride Down";
      ride.isAvailable = true;
      ride.cooldown = ride.currentCooldown = 11;
      ride = this.randomizeCooldown(ride);
      ride.dealsDirectDamage = false;
      ride.userEffect.push(this.globalService.createStatusEffect(StatusEffectEnum.AgilityUp, 6, 1.35, false, true, true));
      enemy.abilityList.push(ride);
    }
    if (type === BestiaryEnum.Pollux)
    {
      enemy.name = "Pollux";
      enemy.battleStats = new CharacterStats(1567, 173, 188, 78, 124, 200); 
      enemy.battleInfo.timeToAutoAttack = this.utilityService.enemyLongAutoAttackSpeed;
      enemy.coinGainFromDefeat = 2;
      enemy.xpGainFromDefeat = 250; 

      var divinity = new Ability();
      divinity.name = "Divinity";
      divinity.isAvailable = true;
      divinity.cooldown = divinity.currentCooldown = 10;
      divinity = this.randomizeCooldown(divinity);
      divinity.dealsDirectDamage = false;      
      divinity.userEffect.push(this.globalService.createStatusEffect(StatusEffectEnum.Barrier, -1, .7, true, true, true, enemy.name, .5));
      enemy.abilityList.push(divinity);
      
      var firePower = new Ability();
      firePower.name = "Fire Power";
      firePower.isAvailable = true;
      firePower.cooldown = firePower.currentCooldown = 14;
      firePower = this.randomizeCooldown(firePower);
      firePower.dealsDirectDamage = false;
      firePower.userEffect.push(this.globalService.createStatusEffect(StatusEffectEnum.AttackUp, 6, 1.15, false, true, true));
      enemy.abilityList.push(firePower);
    }
    if (type === BestiaryEnum.ExplodingSoul)
    {
      enemy.name = "Exploding Soul";
      enemy.battleStats = new CharacterStats(1731, 182, 243, 140, 110, 180); 
      enemy.battleInfo.timeToAutoAttack = this.utilityService.enemyAverageAutoAttackSpeed;
      enemy.coinGainFromDefeat = 3;
      enemy.xpGainFromDefeat = 145; 
      enemy.loot.push(new LootItem(ItemsEnum.SoulSpark, ItemTypeEnum.CraftingMaterial, 3, .1));
      enemy.loot.push(new LootItem(ItemsEnum.SmallTopaz, ItemTypeEnum.CraftingMaterial, 1, .02));

      var sap = new Ability();
      sap.name = "Sap";
      sap.isAvailable = true;
      sap.cooldown = sap.currentCooldown = 8;
      sap = this.randomizeCooldown(sap);
      sap.dealsDirectDamage = false;      
      sap.userEffect.push(this.globalService.createStatusEffect(StatusEffectEnum.Sap, -1, .2, true, false));
      enemy.abilityList.push(sap);

      var explode = new Ability();
      explode.name = "Explode";
      explode.isAvailable = true;
      explode.cooldown = explode.currentCooldown = 30;      
      explode.dealsDirectDamage = true;
      explode.effectiveness = 3.5;      
      explode.userEffect.push(this.globalService.createStatusEffect(StatusEffectEnum.SelfKO, 0, 1, true, false));
      enemy.abilityList.push(explode);
    }
    if (type === BestiaryEnum.Lycaon)
    {
      enemy.name = "Lycaon";
      enemy.battleStats = new CharacterStats(8200, 330, 600, 240, 200, 600); 
      enemy.battleInfo.timeToAutoAttack = this.utilityService.enemyQuickAutoAttackSpeed;      
      enemy.coinGainFromDefeat = 2;
      enemy.xpGainFromDefeat = 250; 

      var claw = new Ability();
      claw.name = "Savage Claw";
      claw.isAvailable = true;
      claw.effectiveness = 2.3;
      claw.cooldown = claw.currentCooldown = 13;
      claw = this.randomizeCooldown(claw);
      claw.dealsDirectDamage = true;
      claw.targetEffect.push(this.globalService.createDamageOverTimeEffect(12, 4, .33, claw.name));
      enemy.abilityList.push(claw);

      var lacerate = new Ability();
      lacerate.name = "Lacerate";
      lacerate.isAvailable = true;
      lacerate.effectiveness = 1.4;
      lacerate.cooldown = lacerate.currentCooldown = 20;
      lacerate = this.randomizeCooldown(lacerate);
      lacerate.dealsDirectDamage = true;
      lacerate.targetEffect.push(this.globalService.createDamageOverTimeEffect(16, 2, .1, lacerate.name));
      enemy.abilityList.push(lacerate);

      var howl = new Ability();
      howl.name = "Howl";
      howl.isAvailable = true;
      howl.cooldown = howl.currentCooldown = 18;
      howl = this.randomizeCooldown(howl);
      howl.dealsDirectDamage = false;
      howl.userEffect.push(this.globalService.createStatusEffect(StatusEffectEnum.AttackUp, 12, 1.25, false, true, true));
      enemy.abilityList.push(howl);
    }
    if (type === BestiaryEnum.Melampus)
    {
      enemy.name = "Melampus";
      enemy.battleStats = new CharacterStats(7320, 330, 600, 240, 200, 600); 
      enemy.battleInfo.timeToAutoAttack = this.utilityService.enemyAverageAutoAttackSpeed;      
      enemy.coinGainFromDefeat = 2;
      enemy.xpGainFromDefeat = 250; 
      enemy.battleInfo.statusEffects.push(this.globalService.createStatusEffect(StatusEffectEnum.BlessingOfDionysus, -1, 1.25, false, true, true));

      var drink = new Ability();
      drink.name = "Drink";
      drink.isAvailable = true;
      drink.cooldown = drink.currentCooldown = 10;
      drink = this.randomizeCooldown(drink);
      drink.dealsDirectDamage = false;      
      drink.userEffect.push(this.globalService.createStatusEffect(StatusEffectEnum.Barrier, -1, .7, true, true, false, enemy.name, 1));
      enemy.abilityList.push(drink);             
    }
    if (type === BestiaryEnum.Atreus)
    {
      enemy.name = "Atreus";
      enemy.battleStats = new CharacterStats(8200, 330, 600, 240, 200, 600); 
      enemy.battleInfo.timeToAutoAttack = this.utilityService.enemyQuickAutoAttackSpeed;      
      enemy.coinGainFromDefeat = 2;
      enemy.battleStats.elementalDamageIncrease.lightning = .25;
      enemy.xpGainFromDefeat = 250; 

      var bronti = new Ability();
      bronti.name = "Bronti";
      bronti.isAvailable = true;
      bronti.effectiveness = 2.2;
      bronti.cooldown = bronti.currentCooldown = 18;
      bronti.targetEffect.push(this.globalService.createStatusEffect(StatusEffectEnum.Stun, 4, 0, false, false)); 
      bronti = this.randomizeCooldown(bronti);
      bronti.dealsDirectDamage = true;      
      bronti.elementalType = ElementalTypeEnum.Lightning;
      enemy.abilityList.push(bronti);

      var risingSun = new Ability();
      risingSun.name = "Rising Sun";
      risingSun.isAvailable = true;
      risingSun.effectiveness = 2.2;
      risingSun.cooldown = risingSun.currentCooldown = 14;
      risingSun = this.randomizeCooldown(risingSun);
      risingSun.dealsDirectDamage = true;      
      risingSun.elementalType = ElementalTypeEnum.Fire;
      enemy.abilityList.push(risingSun);
    }
    if (type === BestiaryEnum.Cassandra)
    {
      enemy.name = "Cassandra";
      enemy.battleStats = new CharacterStats(8200, 330, 600, 240, 200, 600); 
      enemy.battleInfo.timeToAutoAttack = this.utilityService.enemyQuickAutoAttackSpeed;      
      enemy.coinGainFromDefeat = 2;
      enemy.xpGainFromDefeat = 250; 

      var foresight = new Ability();
      foresight.name = "Foresight";
      foresight.isAvailable = true;            
      foresight.dealsDirectDamage = false;      
      foresight.userEffect.push(this.globalService.createStatusEffect(StatusEffectEnum.Barrier, -1, .25, true, true, false, enemy.name, 1));
      enemy.abilityList.push(foresight);    
    }
    if (type === BestiaryEnum.Helenus)
    {
      enemy.name = "Helenus";
      enemy.battleStats = new CharacterStats(8200, 330, 600, 240, 200, 600); 
      enemy.battleInfo.timeToAutoAttack = this.utilityService.enemyQuickAutoAttackSpeed;      
      enemy.coinGainFromDefeat = 2;
      enemy.xpGainFromDefeat = 250; 
      
      var oneStepAhead = new Ability();
      oneStepAhead.name = "One Step Ahead";
      oneStepAhead.isAvailable = true;
      oneStepAhead.effectiveness = 1;
      oneStepAhead.dealsDirectDamage = true;
      oneStepAhead.cooldown = oneStepAhead.currentCooldown = 19;
      oneStepAhead = this.randomizeCooldown(oneStepAhead);
      oneStepAhead.targetEffect.push(this.globalService.createStatusEffect(StatusEffectEnum.DefenseDown, 10, .9, false, false));
      enemy.abilityList.push(oneStepAhead);
    }
    if (type === BestiaryEnum.Rhadamanthus)
    {
      enemy.name = "Rhadamanthus";
      enemy.battleStats = new CharacterStats(8200, 330, 600, 240, 200, 600); 
      enemy.battleInfo.timeToAutoAttack = this.utilityService.enemyQuickAutoAttackSpeed;      
      enemy.coinGainFromDefeat = 2;
      enemy.xpGainFromDefeat = 250; 
    }
    if (type === BestiaryEnum.Aeacus)
    {
      enemy.name = "Aeacus";
      enemy.battleStats = new CharacterStats(8200, 330, 600, 240, 200, 600); 
      enemy.battleInfo.timeToAutoAttack = this.utilityService.enemyQuickAutoAttackSpeed;      
      enemy.coinGainFromDefeat = 2;
      enemy.xpGainFromDefeat = 250; 
    }
    if (type === BestiaryEnum.Minos)
    {
      enemy.name = "Minos";
      enemy.battleStats = new CharacterStats(8200, 330, 600, 240, 200, 600); 
      enemy.battleInfo.timeToAutoAttack = this.utilityService.enemyQuickAutoAttackSpeed;      
      enemy.coinGainFromDefeat = 2;
      enemy.xpGainFromDefeat = 250; 
    }
    if (type === BestiaryEnum.UnrulyHound)
    {
      enemy.name = "Unruly Hound";
      enemy.battleStats = new CharacterStats(2130, 148, 298, 100, 120, 250);
      enemy.battleInfo.timeToAutoAttack = this.utilityService.enemyQuickAutoAttackSpeed;      
      enemy.coinGainFromDefeat = 2;
      enemy.xpGainFromDefeat = 250;
      enemy.loot.push(new LootItem(ItemsEnum.Leather, ItemTypeEnum.CraftingMaterial, 2, .075));       
      
      var bark = new Ability();
      bark.name = "Bark";
      bark.isAvailable = true;
      bark.dealsDirectDamage = false;
      bark.cooldown = bark.currentCooldown = 15;
      bark = this.randomizeCooldown(bark);
      bark.targetEffect.push(this.globalService.createStatusEffect(StatusEffectEnum.DefenseDown, 10, .85, false, false, true));
      enemy.abilityList.push(bark);
      
      var bite = new Ability();
      bite.name = "Bite";
      bite.isAvailable = true;
      bite.effectiveness = 1.4;
      bite.cooldown = bite.currentCooldown = 13;
      bite = this.randomizeCooldown(bite);
      bite.dealsDirectDamage = true;      
      enemy.abilityList.push(bite);
    }
    if (type === BestiaryEnum.FirebreathingSerpent)
    {
      enemy.name = "Fire-Breathing Serpent";
      enemy.battleStats = new CharacterStats(1960, 186, 282, 120, 120, 250);
      enemy.battleInfo.timeToAutoAttack = this.utilityService.enemyAverageAutoAttackSpeed;      
      enemy.coinGainFromDefeat = 2;
      enemy.xpGainFromDefeat = 250; 
      enemy.loot.push(new LootItem(ItemsEnum.EssenceOfFire, ItemTypeEnum.CraftingMaterial, 1, .03)); 
      enemy.loot.push(new LootItem(ItemsEnum.VialOfLakeLerna, ItemTypeEnum.CraftingMaterial, 2, .05)); 

      var spittingFlames = new Ability();
      spittingFlames.name = "Fire Breath";
      spittingFlames.isAvailable = true;
      spittingFlames.cooldown = spittingFlames.currentCooldown = 17;
      spittingFlames = this.randomizeCooldown(spittingFlames);
      spittingFlames.dealsDirectDamage = true;
      spittingFlames.effectiveness = 1.2;     
      spittingFlames.elementalType = ElementalTypeEnum.Fire; 
      spittingFlames.targetEffect.push(this.globalService.createDamageOverTimeEffect(12, 3, .2, spittingFlames.name, dotTypeEnum.BasedOnDamage, ElementalTypeEnum.Fire));
      enemy.abilityList.push(spittingFlames);
    }
    if (type === BestiaryEnum.RogueNymph)
    {
      enemy.name = "Rogue Nymph";
      enemy.battleStats = new CharacterStats(8200, 330, 600, 240, 200, 600); 
      enemy.battleInfo.timeToAutoAttack = this.utilityService.enemyQuickAutoAttackSpeed;      
      enemy.coinGainFromDefeat = 2;
      enemy.xpGainFromDefeat = 250; 
      enemy.loot.push(new LootItem(ItemsEnum.VialOfLakeLerna, ItemTypeEnum.CraftingMaterial, 1, .025));

      var spiritOfTheForest = new Ability();
      spiritOfTheForest.name = "Spirit of the Forest";
      spiritOfTheForest.isAvailable = true;
      spiritOfTheForest.cooldown = spiritOfTheForest.currentCooldown = 28;
      spiritOfTheForest = this.randomizeCooldown(spiritOfTheForest);
      spiritOfTheForest.dealsDirectDamage = false;
      spiritOfTheForest.heals = true;
      spiritOfTheForest.effectiveness = .8;     
      spiritOfTheForest.targetsAllies = false;
      spiritOfTheForest.userEffect.push(this.globalService.createStatusEffect(StatusEffectEnum.LuckUp, 10, 1.25, false, true, false));
      spiritOfTheForest.userEffect.push(this.globalService.createStatusEffect(StatusEffectEnum.AgilityUp, 10, 1.25, false, true, false));
      enemy.abilityList.push(spiritOfTheForest);
    }
    if (type === BestiaryEnum.StymphalianVulture)
    {
      enemy.name = "Stymphalian Vulture";
      enemy.battleStats = new CharacterStats(8200, 330, 600, 240, 200, 600); 
      enemy.battleInfo.timeToAutoAttack = this.utilityService.enemyQuickAutoAttackSpeed;      
      enemy.coinGainFromDefeat = 2;
      enemy.xpGainFromDefeat = 250; 
      enemy.loot.push(new LootItem(ItemsEnum.Leather, ItemTypeEnum.CraftingMaterial, 1, .125));  

      var peck = new Ability();
      peck.name = "Peck";
      peck.isAvailable = true;
      peck.effectiveness = 1.75;
      peck.cooldown = peck.currentCooldown = 19;
      peck = this.randomizeCooldown(peck);
      peck.dealsDirectDamage = true;      
      enemy.abilityList.push(peck);
    }
    if (type === BestiaryEnum.ForestWisp)
    {
      enemy.name = "Forest Wisp";
      enemy.battleStats = new CharacterStats(8200, 330, 600, 240, 200, 600); 
      enemy.battleInfo.timeToAutoAttack = this.utilityService.enemyQuickAutoAttackSpeed;      
      enemy.coinGainFromDefeat = 2;
      enemy.xpGainFromDefeat = 250; 
      
      var phase = new Ability();
      phase.name = "Ethereal";
      phase.isAvailable = true;
      phase.cooldown = phase.currentCooldown = 30;
      phase = this.randomizeCooldown(phase);
      phase.dealsDirectDamage = false;
      phase.userEffect.push(this.globalService.createStatusEffect(StatusEffectEnum.Dodge, 6, 0, false, true));      
      enemy.abilityList.push(phase);
    }
    if (type === BestiaryEnum.BrownBear)
    {
      enemy.name = "Brown Bear";
      enemy.battleStats = new CharacterStats(8200, 330, 600, 240, 200, 600); 
      enemy.battleInfo.timeToAutoAttack = this.utilityService.enemyQuickAutoAttackSpeed;      
      enemy.coinGainFromDefeat = 2;
      enemy.xpGainFromDefeat = 250; 
      enemy.loot.push(new LootItem(ItemsEnum.ThickLeather, ItemTypeEnum.CraftingMaterial, 1, .025));       
      
      var claw = new Ability();
      claw.name = "Claw";
      claw.isAvailable = true;
      claw.effectiveness = 1.5;
      claw.cooldown = claw.currentCooldown = 22;
      claw = this.randomizeCooldown(claw);
      claw.dealsDirectDamage = true;
      claw.targetEffect.push(this.globalService.createDamageOverTimeEffect(12, 3, .2, claw.name));
      enemy.abilityList.push(claw);
    }
    if (type === BestiaryEnum.CentaurScout)
    {
      enemy.name = "Centaur Scout";
      enemy.battleStats = new CharacterStats(8200, 330, 600, 240, 200, 600); 
      enemy.battleInfo.timeToAutoAttack = this.utilityService.enemyQuickAutoAttackSpeed;      
      enemy.coinGainFromDefeat = 2;
      enemy.xpGainFromDefeat = 250; 
      enemy.loot.push(new LootItem(ItemsEnum.SmallAquamarine, ItemTypeEnum.CraftingMaterial, 1, .01));

      var soundTheAlarm = new Ability();
      soundTheAlarm.name = "Sound the Alarm";
      soundTheAlarm.isAvailable = true;
      soundTheAlarm.cooldown = soundTheAlarm.currentCooldown = 16;
      soundTheAlarm = this.randomizeCooldown(soundTheAlarm);
      soundTheAlarm.dealsDirectDamage = false;      
      soundTheAlarm.userEffect.push(this.globalService.createStatusEffect(StatusEffectEnum.DefenseUp, 10, 1.25, false, true, true));
      soundTheAlarm.userEffect.push(this.globalService.createStatusEffect(StatusEffectEnum.AgilityUp, 10, 1.25, false, true, true));
      enemy.abilityList.push(soundTheAlarm);
      
      var lance = new Ability();
      lance.name = "Lance";
      lance.isAvailable = true;
      lance.effectiveness = 1.5;
      lance.cooldown = lance.currentCooldown = 14;
      lance = this.randomizeCooldown(lance);
      lance.dealsDirectDamage = true; 
      lance.elementalType = ElementalTypeEnum.Earth;     
      enemy.abilityList.push(lance);
    }
    if (type === BestiaryEnum.CentaurArcher)
    {
      enemy.name = "Centaur Archer";
      enemy.battleStats = new CharacterStats(8200, 330, 600, 240, 200, 600); 
      enemy.battleInfo.timeToAutoAttack = this.utilityService.enemyQuickAutoAttackSpeed;      
      enemy.coinGainFromDefeat = 2;
      enemy.xpGainFromDefeat = 250; 
      //TODO: New Bow drop

      var poisonTippedArrows = new Ability();
      poisonTippedArrows.name = "Poison Tipped Arrows";
      poisonTippedArrows.isAvailable = true;
      poisonTippedArrows.effectiveness = 1.2;
      poisonTippedArrows.cooldown = poisonTippedArrows.currentCooldown = 24;
      poisonTippedArrows = this.randomizeCooldown(poisonTippedArrows);
      poisonTippedArrows.dealsDirectDamage = true;
      poisonTippedArrows.targetEffect.push(this.globalService.createDamageOverTimeEffect(16, 4, 20, poisonTippedArrows.name, dotTypeEnum.TrueDamage));
      enemy.abilityList.push(poisonTippedArrows);
    }
    if (type === BestiaryEnum.CentaurWarrior)
    {
      enemy.name = "Centaur Warrior";
      enemy.battleStats = new CharacterStats(8200, 330, 600, 240, 200, 600); 
      enemy.battleInfo.timeToAutoAttack = this.utilityService.enemyQuickAutoAttackSpeed;      
      enemy.coinGainFromDefeat = 2;
      enemy.xpGainFromDefeat = 250;
      //TODO: New Hammer drop 

      var fend = new Ability();
      fend.name = "Fend";
      fend.isAvailable = true;
      fend.effectiveness = 2.5;
      fend.cooldown = fend.currentCooldown = 23;
      fend = this.randomizeCooldown(fend);
      fend.dealsDirectDamage = true; 
      fend.elementalType = ElementalTypeEnum.Earth;     
      enemy.abilityList.push(fend);

      var expose = new Ability();
      expose.name = "Expose";
      expose.isAvailable = true;
      expose.effectiveness = 1.6;
      expose.dealsDirectDamage = true;
      expose.cooldown = expose.currentCooldown = 18;
      expose = this.randomizeCooldown(expose);
      expose.elementalType = ElementalTypeEnum.Earth;
      expose.targetEffect.push(this.globalService.createStatusEffect(StatusEffectEnum.DefenseDown, 10, .8, false, false));
      enemy.abilityList.push(expose);
    }
    if (type === BestiaryEnum.CentaurMystic)
    {
      enemy.name = "Centaur Mystic";
      enemy.battleStats = new CharacterStats(8200, 330, 600, 240, 200, 600); 
      enemy.battleInfo.timeToAutoAttack = this.utilityService.enemyQuickAutoAttackSpeed;      
      enemy.coinGainFromDefeat = 2;
      enemy.xpGainFromDefeat = 250;
      enemy.loot.push(new LootItem(ItemsEnum.Goldroot, ItemTypeEnum.CraftingMaterial, 1, .05));  
      //TODO: New Necklace drop

      var communeWithTheSpirits = new Ability();
      communeWithTheSpirits.name = "Commune with the Spirits";
      communeWithTheSpirits.isAvailable = true;
      communeWithTheSpirits.cooldown = communeWithTheSpirits.currentCooldown = 32;
      communeWithTheSpirits = this.randomizeCooldown(communeWithTheSpirits);
      communeWithTheSpirits.dealsDirectDamage = false;      
      communeWithTheSpirits.userEffect.push(this.globalService.createStatusEffect(StatusEffectEnum.EarthDamageUp, 15, 1.5, false, true, true));      
      enemy.abilityList.push(communeWithTheSpirits);
      
      var stoneBlast = new Ability();
      stoneBlast.name = "Stone Blast";
      stoneBlast.isAvailable = true;
      stoneBlast.effectiveness = 1.9;
      stoneBlast.cooldown = stoneBlast.currentCooldown = 22;
      stoneBlast = this.randomizeCooldown(stoneBlast);
      stoneBlast.dealsDirectDamage = true; 
      stoneBlast.elementalType = ElementalTypeEnum.Earth;   
      stoneBlast.targetEffect.push(this.globalService.createStatusEffect(StatusEffectEnum.AgilityDown, 10, .85, false, false));  
      enemy.abilityList.push(stoneBlast);
    }
    if (type === BestiaryEnum.StoneElemental)
    {
      enemy.name = "Stone Elemental";
      enemy.battleStats = new CharacterStats(8200, 330, 600, 240, 200, 600); 
      enemy.battleInfo.timeToAutoAttack = this.utilityService.enemyQuickAutoAttackSpeed;      
      enemy.coinGainFromDefeat = 2;
      enemy.xpGainFromDefeat = 250; 
      enemy.loot.push(new LootItem(ItemsEnum.SmallOpal, ItemTypeEnum.CraftingMaterial, 1, .025)); 
      enemy.loot.push(new LootItem(ItemsEnum.SmallAmethyst, ItemTypeEnum.CraftingMaterial, 1, .025)); 
      
      var shatter = new Ability();
      shatter.name = "Roll";
      shatter.isAvailable = true;
      shatter.cooldown = shatter.currentCooldown = 28;
      shatter = this.randomizeCooldown(shatter);
      shatter.dealsDirectDamage = true;
      shatter.isAoe = true;
      shatter.effectiveness = 2;     
      shatter.elementalType = ElementalTypeEnum.Fire; 
      enemy.abilityList.push(shatter);
    }
    if (type === BestiaryEnum.ShadyTraveler)
    {
      enemy.name = "Shady Traveler";
      enemy.battleStats = new CharacterStats(8200, 330, 600, 240, 200, 600); 
      enemy.battleInfo.timeToAutoAttack = this.utilityService.enemyQuickAutoAttackSpeed;      
      enemy.coinGainFromDefeat = 2;
      enemy.xpGainFromDefeat = 250; 
      enemy.loot.push(new LootItem(ItemsEnum.VialOfLakeLerna, ItemTypeEnum.CraftingMaterial, 1, .075)); 

      var sneak = new Ability();
      sneak.name = "Sneak";
      sneak.isAvailable = true;
      sneak.cooldown = sneak.currentCooldown = 18;
      sneak = this.randomizeCooldown(sneak);
      sneak.dealsDirectDamage = false;      
      sneak.userEffect.push(this.globalService.createStatusEffect(StatusEffectEnum.AgilityUp, 6, 1.5, false, true, true));            
      enemy.abilityList.push(sneak);

      var stab = new Ability();
      stab.name = "Stab";
      stab.isAvailable = true;
      stab.effectiveness = 1.9;
      stab.cooldown = stab.currentCooldown = 14;
      stab = this.randomizeCooldown(stab);
      stab.dealsDirectDamage = true; 
      enemy.abilityList.push(stab);
    }
    if (type === BestiaryEnum.PushyMerchant)
    {
      enemy.name = "Pushy Merchant";
      enemy.battleStats = new CharacterStats(8200, 330, 600, 240, 200, 600); 
      enemy.battleInfo.timeToAutoAttack = this.utilityService.enemyQuickAutoAttackSpeed;      
      enemy.coinGainFromDefeat = 2;
      enemy.xpGainFromDefeat = 250; 
      enemy.loot.push(new LootItem(ItemsEnum.SmallTopaz, ItemTypeEnum.CraftingMaterial, 1, .08)); 

      var hardBargain = new Ability();
      hardBargain.name = "Hard Bargain";
      hardBargain.isAvailable = true;
      hardBargain.cooldown = hardBargain.currentCooldown = 15;
      hardBargain = this.randomizeCooldown(hardBargain);
      hardBargain.dealsDirectDamage = false;      
      hardBargain.userEffect.push(this.globalService.createStatusEffect(StatusEffectEnum.RandomPrimaryStatUp, 15, 1.25, false, true, true));      
      hardBargain.targetEffect.push(this.globalService.createStatusEffect(StatusEffectEnum.RandomPrimaryStatDown, 15, 1.25, false, true, true));      
      enemy.abilityList.push(hardBargain);
    }
    if (type === BestiaryEnum.FeistyBadger)
    {
      enemy.name = "Feisty Badger";
      enemy.battleStats = new CharacterStats(8200, 330, 600, 240, 200, 600); 
      enemy.battleInfo.timeToAutoAttack = this.utilityService.enemyQuickAutoAttackSpeed;      
      enemy.coinGainFromDefeat = 2;
      enemy.xpGainFromDefeat = 250; 
      enemy.loot.push(new LootItem(ItemsEnum.ThickLeather, ItemTypeEnum.CraftingMaterial, 1, .0333));

      var bite = new Ability();
      bite.name = "Bite";
      bite.isAvailable = true;
      bite.effectiveness = 1.75;
      bite.cooldown = bite.currentCooldown = 19;
      bite = this.randomizeCooldown(bite);
      bite.dealsDirectDamage = true;      
      enemy.abilityList.push(bite);
    }
    if (type === BestiaryEnum.GoldenJackal)
    {
      enemy.name = "Golden Jackal";
      enemy.battleStats = new CharacterStats(8200, 330, 600, 240, 200, 600); 
      enemy.battleInfo.timeToAutoAttack = this.utilityService.enemyQuickAutoAttackSpeed;      
      enemy.coinGainFromDefeat = 2;
      enemy.xpGainFromDefeat = 250;       
      enemy.loot.push(new LootItem(ItemsEnum.ThickLeather, ItemTypeEnum.CraftingMaterial, 2, .05));

      var claw = new Ability();
      claw.name = "Claw";
      claw.isAvailable = true;
      claw.effectiveness = 1.5;
      claw.cooldown = claw.currentCooldown = 22;
      claw = this.randomizeCooldown(claw);
      claw.dealsDirectDamage = true;
      claw.targetEffect.push(this.globalService.createDamageOverTimeEffect(12, 3, .2, claw.name, dotTypeEnum.BasedOnDamage));
      enemy.abilityList.push(claw);
    }
    if (type === BestiaryEnum.FrenziedWisp)
    {
      enemy.name = "Frenzied Wisp";
      enemy.battleStats = new CharacterStats(8200, 330, 600, 240, 200, 600); 
      enemy.battleInfo.timeToAutoAttack = this.utilityService.enemyQuickAutoAttackSpeed;      
      enemy.coinGainFromDefeat = 2;
      enemy.xpGainFromDefeat = 250; 
           
      var phase = new Ability();
      phase.name = "Ethereal";
      phase.isAvailable = true;
      phase.cooldown = phase.currentCooldown = 30;
      phase = this.randomizeCooldown(phase);
      phase.dealsDirectDamage = false;
      phase.userEffect.push(this.globalService.createStatusEffect(StatusEffectEnum.Dodge, 6, 0, false, true));      
      enemy.abilityList.push(phase);
    }
    if (type === BestiaryEnum.PatrinosBandit)
    {
      enemy.name = "Patrinos Bandit";
      enemy.battleStats = new CharacterStats(8200, 330, 600, 240, 200, 600); 
      enemy.battleInfo.timeToAutoAttack = this.utilityService.enemyQuickAutoAttackSpeed;      
      enemy.coinGainFromDefeat = 2;
      enemy.xpGainFromDefeat = 250; 
      enemy.loot.push(new LootItem(ItemsEnum.HealingHerb, ItemTypeEnum.HealingItem, 2, .1));

      var healingHerb = new Ability();
      healingHerb.name = "Healing Herb";
      healingHerb.targetType = TargetEnum.LowestHpPercent;
      healingHerb.isAvailable = false;
      healingHerb.effectiveness = .5;
      healingHerb.heals = true;
      healingHerb.targetsAllies = true;
      healingHerb.dealsDirectDamage = false;
      healingHerb.cooldown = healingHerb.currentCooldown = 13;
      healingHerb = this.randomizeCooldown(healingHerb);
      enemy.abilityList.push(healingHerb);
    }
    if (type === BestiaryEnum.PatrinosRogue)
    {
      enemy.name = "Patrinos Rogue";
      enemy.battleStats = new CharacterStats(8200, 330, 600, 240, 200, 600); 
      enemy.battleInfo.timeToAutoAttack = this.utilityService.enemyQuickAutoAttackSpeed;      
      enemy.coinGainFromDefeat = 2;
      enemy.xpGainFromDefeat = 250;       
      enemy.loot.push(new LootItem(ItemsEnum.SmallRuby, ItemTypeEnum.CraftingMaterial, 1, .025)); 

      var throwSand = new Ability();
      throwSand.name = "Throw Sand";
      throwSand.isAvailable = true;
      throwSand.effectiveness = 1.6;
      throwSand.cooldown = throwSand.currentCooldown = 24;
      throwSand = this.randomizeCooldown(throwSand);
      throwSand.dealsDirectDamage = true;
      throwSand.targetEffect.push(this.globalService.createStatusEffect(StatusEffectEnum.Blind, 3, 1.25, false, false, true));
      enemy.abilityList.push(throwSand);
    }
    if (type === BestiaryEnum.PatrinosRuffian)
    {
      enemy.name = "Patrinos Ruffian";
      enemy.battleStats = new CharacterStats(8200, 330, 600, 240, 200, 600); 
      enemy.battleInfo.timeToAutoAttack = this.utilityService.enemyQuickAutoAttackSpeed;      
      enemy.coinGainFromDefeat = 2;
      enemy.xpGainFromDefeat = 250; 
      enemy.loot.push(new LootItem(ItemsEnum.HeftyStone, ItemTypeEnum.BattleItem, 1, .05));

      var stoneToss = new Ability();
      stoneToss.name = "Stone Toss";
      stoneToss.isAvailable = true;      
      stoneToss.cooldown = stoneToss.currentCooldown = 9;
      stoneToss = this.randomizeCooldown(stoneToss);
      stoneToss.dealsDirectDamage = false;
      stoneToss.targetEffect.push(this.globalService.createStatusEffect(StatusEffectEnum.InstantTrueDamage, 0, 25, true, false, false));      
      enemy.abilityList.push(stoneToss);
    }
    if (type === BestiaryEnum.PatrinosGangLeader)
    {
      enemy.name = "Patrinos Gang Leader";
      enemy.battleStats = new CharacterStats(8200, 330, 600, 240, 200, 600); 
      enemy.battleInfo.timeToAutoAttack = this.utilityService.enemyQuickAutoAttackSpeed;      
      enemy.coinGainFromDefeat = 2;
      enemy.xpGainFromDefeat = 250; 
      enemy.loot.push(new LootItem(ItemsEnum.SmallEmerald, ItemTypeEnum.CraftingMaterial, 1, .05)); 

      var dustUp = new Ability();
      dustUp.name = "Dust Up";
      dustUp.isAvailable = true;
      dustUp.effectiveness = 1.6;
      dustUp.cooldown = dustUp.currentCooldown = 21;
      dustUp = this.randomizeCooldown(dustUp);
      dustUp.dealsDirectDamage = true;
      dustUp.targetEffect.push(this.globalService.createStatusEffect(StatusEffectEnum.Stagger, 12, .75, false, true));
      enemy.abilityList.push(dustUp);
      
      var encourage = new Ability();
      encourage.name = "Encourage";
      encourage.isAvailable = true;
      encourage.cooldown = encourage.currentCooldown = 18;
      encourage = this.randomizeCooldown(encourage);
      encourage.dealsDirectDamage = false;
      encourage.userEffect.push(this.globalService.createStatusEffect(StatusEffectEnum.AttackUp, 10, 1.3, false, true, true));
      encourage.userEffect.push(this.globalService.createStatusEffect(StatusEffectEnum.LuckUp, 10, 1.3, false, true, true));
      enemy.abilityList.push(encourage);
    }
    
    if (type === BestiaryEnum.WoodlandNymph)
    {
      enemy.name = "Woodland Nymph";
      enemy.battleStats = new CharacterStats(8200, 330, 600, 240, 200, 600); 
      enemy.battleInfo.timeToAutoAttack = this.utilityService.enemyQuickAutoAttackSpeed;      
      enemy.coinGainFromDefeat = 2;
      enemy.xpGainFromDefeat = 250; 
    }    
    if (type === BestiaryEnum.HornedViper)
    {
      enemy.name = "Centaur Mystic";
      enemy.battleStats = new CharacterStats(8200, 330, 600, 240, 200, 600); 
      enemy.battleInfo.timeToAutoAttack = this.utilityService.enemyQuickAutoAttackSpeed;      
      enemy.coinGainFromDefeat = 2;
      enemy.xpGainFromDefeat = 250; 
    }   
    if (type === BestiaryEnum.PoisonSpewingFungi)
    {
      enemy.name = "Poison Spewing Fungi";
      enemy.battleStats = new CharacterStats(8200, 330, 600, 240, 200, 600); 
      enemy.battleInfo.timeToAutoAttack = this.utilityService.enemyQuickAutoAttackSpeed;      
      enemy.coinGainFromDefeat = 2;
      enemy.xpGainFromDefeat = 250; 
    }       
    if (type === BestiaryEnum.ForestDryad)
    {
      enemy.name = "Forest Dryad";
      enemy.battleStats = new CharacterStats(8200, 330, 600, 240, 200, 600); 
      enemy.battleInfo.timeToAutoAttack = this.utilityService.enemyQuickAutoAttackSpeed;      
      enemy.coinGainFromDefeat = 2;
      enemy.xpGainFromDefeat = 250; 
    }   
    if (type === BestiaryEnum.GreyWolf)
    {
      enemy.name = "Grey Wolf";
      enemy.battleStats = new CharacterStats(8200, 330, 600, 240, 200, 600); 
      enemy.battleInfo.timeToAutoAttack = this.utilityService.enemyQuickAutoAttackSpeed;      
      enemy.coinGainFromDefeat = 2;
      enemy.xpGainFromDefeat = 250; 
    }       
    if (type === BestiaryEnum.AggravatedHunter)
    {
      enemy.name = "Aggravated Hunter";
      enemy.battleStats = new CharacterStats(8200, 330, 600, 240, 200, 600); 
      enemy.battleInfo.timeToAutoAttack = this.utilityService.enemyQuickAutoAttackSpeed;      
      enemy.coinGainFromDefeat = 2;
      enemy.xpGainFromDefeat = 250; 
    }      
    if (type === BestiaryEnum.Trapper)
    {
      enemy.name = "Trapper";
      enemy.battleStats = new CharacterStats(8200, 330, 600, 240, 200, 600); 
      enemy.battleInfo.timeToAutoAttack = this.utilityService.enemyQuickAutoAttackSpeed;      
      enemy.coinGainFromDefeat = 2;
      enemy.xpGainFromDefeat = 250; 
    }   
    if (type === BestiaryEnum.FeralBoar)
    {
      enemy.name = "Feral Boar";
      enemy.battleStats = new CharacterStats(8200, 330, 600, 240, 200, 600); 
      enemy.battleInfo.timeToAutoAttack = this.utilityService.enemyQuickAutoAttackSpeed;      
      enemy.coinGainFromDefeat = 2;
      enemy.xpGainFromDefeat = 250; 
    }   
    if (type === BestiaryEnum.CarnivorousFlora)
    {
      enemy.name = "Carnivorous Flora";
      enemy.battleStats = new CharacterStats(8200, 330, 600, 240, 200, 600); 
      enemy.battleInfo.timeToAutoAttack = this.utilityService.enemyQuickAutoAttackSpeed;      
      enemy.coinGainFromDefeat = 2;
      enemy.xpGainFromDefeat = 250; 
    }   
    if (type === BestiaryEnum.RedSpeckledToad)
    {
      enemy.name = "Red-Speckled Toad";
      enemy.battleStats = new CharacterStats(8200, 330, 600, 240, 200, 600); 
      enemy.battleInfo.timeToAutoAttack = this.utilityService.enemyQuickAutoAttackSpeed;      
      enemy.coinGainFromDefeat = 2;
      enemy.xpGainFromDefeat = 250; 
    }   
    if (type === BestiaryEnum.YellowSpeckledToad)
    {
      enemy.name = "Yellow-Speckled Toad";
      enemy.battleStats = new CharacterStats(8200, 330, 600, 240, 200, 600); 
      enemy.battleInfo.timeToAutoAttack = this.utilityService.enemyQuickAutoAttackSpeed;      
      enemy.coinGainFromDefeat = 2;
      enemy.xpGainFromDefeat = 250; 
    }       
    if (type === BestiaryEnum.WanderingIbex)
    {
      enemy.name = "Wandering Ibex";
      enemy.battleStats = new CharacterStats(8200, 330, 600, 240, 200, 600); 
      enemy.battleInfo.timeToAutoAttack = this.utilityService.enemyQuickAutoAttackSpeed;      
      enemy.coinGainFromDefeat = 2;
      enemy.xpGainFromDefeat = 250; 
    }  
    if (type === BestiaryEnum.SavageBear)
    {
      enemy.name = "Savage Bear";
      enemy.battleStats = new CharacterStats(8200, 330, 600, 240, 200, 600); 
      enemy.battleInfo.timeToAutoAttack = this.utilityService.enemyQuickAutoAttackSpeed;      
      enemy.coinGainFromDefeat = 2;
      enemy.xpGainFromDefeat = 250; 
    }   
    if (type === BestiaryEnum.GriffonVulture)
    {
      enemy.name = "Griffon Vulture";
      enemy.battleStats = new CharacterStats(8200, 330, 600, 240, 200, 600); 
      enemy.battleInfo.timeToAutoAttack = this.utilityService.enemyQuickAutoAttackSpeed;      
      enemy.coinGainFromDefeat = 2;
      enemy.xpGainFromDefeat = 250; 
    }   
    if (type === BestiaryEnum.Leopard)
    {
      enemy.name = "Leopard";
      enemy.battleStats = new CharacterStats(8200, 330, 600, 240, 200, 600); 
      enemy.battleInfo.timeToAutoAttack = this.utilityService.enemyQuickAutoAttackSpeed;      
      enemy.coinGainFromDefeat = 2;
      enemy.xpGainFromDefeat = 250; 
    }   
    if (type === BestiaryEnum.Bobcat)
    {
      enemy.name = "Bobcat";
      enemy.battleStats = new CharacterStats(8200, 330, 600, 240, 200, 600); 
      enemy.battleInfo.timeToAutoAttack = this.utilityService.enemyQuickAutoAttackSpeed;      
      enemy.coinGainFromDefeat = 2;
      enemy.xpGainFromDefeat = 250; 
    }   
    if (type === BestiaryEnum.PitViper)
    {
      enemy.name = "Pit Viper";
      enemy.battleStats = new CharacterStats(8200, 330, 600, 240, 200, 600); 
      enemy.battleInfo.timeToAutoAttack = this.utilityService.enemyQuickAutoAttackSpeed;      
      enemy.coinGainFromDefeat = 2;
      enemy.xpGainFromDefeat = 250; 
    } 
    if (type === BestiaryEnum.AlphaGreyWolf)
    {
      enemy.name = "Alpha Grey Wolf";
      enemy.battleStats = new CharacterStats(8200, 330, 600, 240, 200, 600); 
      enemy.battleInfo.timeToAutoAttack = this.utilityService.enemyQuickAutoAttackSpeed;      
      enemy.coinGainFromDefeat = 2;
      enemy.xpGainFromDefeat = 250; 
    }   
    if (type === BestiaryEnum.DenMother)
    {
      enemy.name = "Den Mother";
      enemy.battleStats = new CharacterStats(8200, 330, 600, 240, 200, 600); 
      enemy.battleInfo.timeToAutoAttack = this.utilityService.enemyQuickAutoAttackSpeed;      
      enemy.coinGainFromDefeat = 2;
      enemy.xpGainFromDefeat = 250; 
    }   
    if (type === BestiaryEnum.CalydonianBoar)
    {
      enemy.name = "Calydonian Boar";
      enemy.battleStats = new CharacterStats(8200, 330, 600, 240, 200, 600); 
      enemy.battleInfo.timeToAutoAttack = this.utilityService.enemyQuickAutoAttackSpeed;      
      enemy.coinGainFromDefeat = 2;
      enemy.xpGainFromDefeat = 250; 
    }
    

    //probably a better way to do this... these reductions are multiplicative but enemies don't get stats calc'd so otherwise
    //it gets multiplied by 0
    enemy.battleStats.abilityCooldownReduction = 1;
    enemy.battleStats.autoAttackCooldownReduction = 1;
    enemy.battleInfo.autoAttackTimer = this.utilityService.getRandomInteger(0, enemy.battleInfo.timeToAutoAttack / 2);     
    return enemy;
  }

  randomizeCooldown(ability: Ability) {
    ability.currentCooldown = this.utilityService.getRandomInteger(Math.round(ability.cooldown / 2), ability.cooldown);    
    return ability;
  }
}
