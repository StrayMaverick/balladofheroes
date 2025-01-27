import { Injectable } from '@angular/core';
import { AltarEffect } from '../models/altar/altar-effect.model';
import { StatusEffect } from '../models/battle/status-effect.model';
import { Ability } from '../models/character/ability.model';
import { CharacterStats } from '../models/character/character-stats.model';
import { Character } from '../models/character/character.model';
import { Enemy } from '../models/character/enemy.model';
import { God } from '../models/character/god.model';
import { OverdriveInfo } from '../models/character/overdrive-info.model';
import { AchievementTypeEnum } from '../models/enums/achievement-type-enum.copy';
import { AffinityLevelRewardEnum } from '../models/enums/affinity-level-reward-enum.model';
import { ProfessionActionsEnum } from '../models/enums/profession-actions-enum.model';
import { AltarEffectsEnum } from '../models/enums/altar-effects-enum.model';
import { BestiaryEnum } from '../models/enums/bestiary-enum.model';
import { CharacterEnum } from '../models/enums/character-enum.model';
import { dotTypeEnum } from '../models/enums/damage-over-time-type-enum.model';
import { EffectTriggerEnum } from '../models/enums/effect-trigger-enum.model';
import { ElementalTypeEnum } from '../models/enums/elemental-type-enum.model';
import { EquipmentQualityEnum } from '../models/enums/equipment-quality-enum.model';
import { EquipmentTypeEnum } from '../models/enums/equipment-type-enum.model';
import { GodEnum } from '../models/enums/god-enum.model';
import { ItemTypeEnum } from '../models/enums/item-type-enum.model';
import { ItemsEnum } from '../models/enums/items-enum.model';
import { LogViewEnum } from '../models/enums/log-view-enum.model';
import { OverdriveNameEnum } from '../models/enums/overdrive-name-enum.model';
import { ProfessionEnum } from '../models/enums/professions-enum.model';
import { StatusEffectEnum } from '../models/enums/status-effects-enum.model';
import { SubZoneEnum } from '../models/enums/sub-zone-enum.model';
import { TutorialTypeEnum } from '../models/enums/tutorial-type-enum.model';
import { WeaponTypeEnum } from '../models/enums/weapon-type-enum.model';
import { ZoneEnum } from '../models/enums/zone-enum.model';
import { Achievement } from '../models/global/achievement.model';
import { Equipment } from '../models/resources/equipment.model';
import { ResourceValue } from '../models/resources/resource-value.model';
import { UsableItemEffect } from '../models/resources/usable-item-effect.model';
import { LogData } from '../models/utility/log-data.model';
import { Ballad } from '../models/zone/ballad.model';
import { SubZone } from '../models/zone/sub-zone.model';
import { BalladService } from './ballad/ballad.service';
import { EnemyGeneratorService } from './enemy-generator/enemy-generator.service';
import { GlobalService } from './global/global.service';
import { CharmService } from './resources/charm.service';
import { ShopItemGeneratorService } from './shop/shop-item-generator.service';
import { SubZoneGeneratorService } from './sub-zone-generator/sub-zone-generator.service';
import { UtilityService } from './utility/utility.service';
import { NotificationTypeEnum } from "../models/enums/notification-type-enum.model";
import { ResourceGeneratorService } from './resources/resource-generator.service';
import { EquipmentService } from './resources/equipment.service';
import { DictionaryService } from './utility/dictionary.service';
import { ShopTypeEnum } from '../models/enums/shop-type-enum.model';
import { BalladEnum } from '../models/enums/ballad-enum.model';

@Injectable({
  providedIn: 'root'
})
export class LookupService {

  isUIHidden = false;

  constructor(private globalService: GlobalService, private utilityService: UtilityService, private subzoneGeneratorService: SubZoneGeneratorService,
    private charmService: CharmService, private enemyGeneratorService: EnemyGeneratorService, private balladService: BalladService,
    private shopItemGeneratorService: ShopItemGeneratorService, private resourceGeneratorService: ResourceGeneratorService,
    private equipmentService: EquipmentService, private dictionaryService: DictionaryService) { }

  getSubZoneCompletionByType(type: SubZoneEnum) {
    var chosenSubzone = new SubZone();

    this.globalService.globalVar.ballads.forEach(ballad => {
      ballad.zones.forEach(zone => {
        zone.subzones.forEach(subzone => {
          if (subzone.type === type)
            chosenSubzone = subzone;
        });
      });
    });

    return chosenSubzone.victoryCount >= this.balladService.getVictoriesNeededToProceed(chosenSubzone.type);
  }

  getSubZoneByType(type: SubZoneEnum) {
    var chosenSubzone = new SubZone();

    this.globalService.globalVar.ballads.forEach(ballad => {
      ballad.zones.forEach(zone => {
        zone.subzones.forEach(subzone => {
          if (subzone.type === type)
            chosenSubzone = subzone;
        });
      });
    });

    return chosenSubzone;
  }

  getAchievementName(achievement: Achievement) {
    var name = "";

    name += "'" + this.balladService.getSubZoneName(achievement.subzone) + " - " + this.getAchievementDescription(achievement.type) + "'";

    return name;
  }

  getTotalXpGainFromEnemyTeam(enemyTeam: Enemy[]) {
    var totalXp = 0;

    enemyTeam.forEach(enemy => {
      totalXp += enemy.xpGainFromDefeat;
    });

    return totalXp;
  }

  getCharacterDescription(type: CharacterEnum) {
    var description = "";

    if (type === CharacterEnum.Adventurer)
      description = "The Adventurer class focuses on speed with access to agility buffs and increased damage based on how many actions you perform in quick succession.";
    if (type === CharacterEnum.Archer)
      description = "The Archer class focuses on debilitating enemies with access to damage over time and stunning effects.";
    if (type === CharacterEnum.Warrior)
      description = "The Warrior class focuses on taking damage as much as dealing damage with the ability to force enemies' attention and increase defense when HP is low.";
    if (type === CharacterEnum.Priest)
      description = "The Priest class focuses on keeping the party healthy with healing and barrier effects.";


    return description;
  }

  getGodDescription(type: GodEnum) {
    var description = "";

    if (type === GodEnum.Athena)
      description = "Athena, Goddess of Wisdom and Warfare, focuses on combat and self-reliance. Her abilities and upgrades allow the user to heal themselves based on damage dealt and reduce incoming damage to themselves.";
    if (type === GodEnum.Artemis)
      description = "Artemis, Goddess of the Hunt, focuses on critical hits and debilitating enemies. Her abilities and upgrades can weaken enemies through status effects and increase damage dealt from critical attacks.";
    if (type === GodEnum.Hermes)
      description = "Hermes, Messenger of the Gods, focuses on agility and quick attacks. His abilities and upgrades can increase agility and reduce auto attack and ability cooldowns.";
    if (type === GodEnum.Apollo)
      description = "Apollo, God of Archery and Music, focuses on strengthening and healing allies. His abilities and upgrades allow the user to heal over time and provide a variety of buffs to the party.";
    if (type === GodEnum.Zeus)
      description = "";
    if (type === GodEnum.Ares)
      description = "Ares, God of War, focuses on creating as many damage over time effects as possible. His abilities and upgrades revolve around creating and improving the damage of damage over time effects.";
    if (type === GodEnum.Poseidon)
      description = "";
    if (type === GodEnum.Hades)
      description = "Hades, God of the Underworld, focuses on dealing damage to all enemies. All of his abilities attack the entire enemy party and he has access to Fire and Earth elemental damage.";
    if (type === GodEnum.Nemesis)
      description = "Nemesis, Goddess of Divine Retribution, focuses on taking damage and countering enemies. Her abilities allow her to deal increased damage after being attacked and attack enemies multiple times.";
    if (type === GodEnum.Dionysus)
      description = "Dionysus, God of Wine and Revelry, focuses on protecting party members and weakening enemies. His abilities allow him to give barriers to allies and put numerous debuffs on enemies.";

    return description;
  }

  getAlchemyActionName(action: ProfessionActionsEnum) {
    var name = "";

    if (action === ProfessionActionsEnum.PrepareWaterSmallPot)
      name = "Boiling water in a small pot";
    if (action === ProfessionActionsEnum.StrainMixture)
      name = "Straining mixture";
    if (action === ProfessionActionsEnum.CombineIngredientsPot)
      name = "Combining ingredients in pot";
    if (action === ProfessionActionsEnum.MeltWax)
      name = "Melting wax";
    if (action === ProfessionActionsEnum.MixOil)
      name = "Mixing oil";
    if (action === ProfessionActionsEnum.CombineIngredientsPotion)
      name = "Combining ingredients in vial and stoppering";
    if (action === ProfessionActionsEnum.HeatMixture)
      name = "Heating mixture";
    if (action === ProfessionActionsEnum.CombineIngredients)
      name = "Combining ingredients together";
    if (action === ProfessionActionsEnum.CrushIngredients)
      name = "Crushing ingredients into a powder";
    if (action === ProfessionActionsEnum.ExtractEssence)
      name = "Extract essence from ingredients";
    if (action === ProfessionActionsEnum.Infuse)
      name = "Steep ingredients in liquid and infuse";
    if (action === ProfessionActionsEnum.StoreIngredients)
      name = "Store ingredients for future use";

    if (action === ProfessionActionsEnum.CombiningGems)
      name = "Combining gemstone fragments";
    if (action === ProfessionActionsEnum.Polish)
      name = "Polishing stone";
    if (action === ProfessionActionsEnum.HeatingMetal)
      name = "Heating metal to expand"
    if (action === ProfessionActionsEnum.ShapingMetal)
      name = "Shaping metal"
    if (action === ProfessionActionsEnum.CoolingMetal)
      name = "Cooling metal for use"

    return name;
  }

  isItemACharm(type: ItemsEnum) {
    var isACharm = false;

    if (type === ItemsEnum.LargeCharmOfDetermination || type === ItemsEnum.LargeCharmOfRejuvenation || type === ItemsEnum.LargeCharmOfVulnerability ||
      type === ItemsEnum.SmallCharmOfDetermination || type === ItemsEnum.SmallCharmOfRejuvenation || type === ItemsEnum.SmallCharmOfVulnerability ||
      type === ItemsEnum.SmallCharmOfHaste || type === ItemsEnum.LargeCharmOfHaste ||
      type === ItemsEnum.SmallCharmOfPreparation || type === ItemsEnum.LargeCharmOfPreparation ||
      type === ItemsEnum.SmallCharmOfIngenuity || type === ItemsEnum.LargeCharmOfIngenuity ||
      type === ItemsEnum.SmallCharmOfHolyDestruction || type === ItemsEnum.LargeCharmOfHolyDestruction ||
      type === ItemsEnum.SmallCharmOfFireDestruction || type === ItemsEnum.LargeCharmOfFireDestruction ||
      type === ItemsEnum.SmallCharmOfLightningDestruction || type === ItemsEnum.LargeCharmOfLightningDestruction ||
      type === ItemsEnum.SmallCharmOfAirDestruction || type === ItemsEnum.LargeCharmOfAirDestruction ||
      type === ItemsEnum.SmallCharmOfWaterDestruction || type === ItemsEnum.LargeCharmOfWaterDestruction ||
      type === ItemsEnum.SmallCharmOfEarthDestruction || type === ItemsEnum.LargeCharmOfEarthDestruction ||
      type === ItemsEnum.SmallCharmOfHolyProtection || type === ItemsEnum.LargeCharmOfHolyProtection ||
      type === ItemsEnum.SmallCharmOfFireProtection || type === ItemsEnum.LargeCharmOfFireProtection ||
      type === ItemsEnum.SmallCharmOfAirProtection || type === ItemsEnum.LargeCharmOfAirProtection ||
      type === ItemsEnum.SmallCharmOfLightningProtection || type === ItemsEnum.LargeCharmOfLightningProtection ||
      type === ItemsEnum.SmallCharmOfWaterProtection || type === ItemsEnum.LargeCharmOfWaterProtection ||
      type === ItemsEnum.SmallCharmOfEarthProtection || type === ItemsEnum.LargeCharmOfEarthProtection ||
      type === ItemsEnum.SmallCharmOfAthena || type === ItemsEnum.LargeCharmOfAthena ||
      type === ItemsEnum.SmallCharmOfArtemis || type === ItemsEnum.LargeCharmOfArtemis ||
      type === ItemsEnum.SmallCharmOfHermes || type === ItemsEnum.LargeCharmOfHermes ||
      type === ItemsEnum.SmallCharmOfApollo || type === ItemsEnum.LargeCharmOfApollo ||
      type === ItemsEnum.SmallCharmOfHades || type === ItemsEnum.LargeCharmOfHades ||
      type === ItemsEnum.SmallCharmOfAres || type === ItemsEnum.LargeCharmOfAres ||
      type === ItemsEnum.SmallCharmOfNemesis || type === ItemsEnum.LargeCharmOfNemesis ||
      type === ItemsEnum.SmallCharmOfDionysus || type === ItemsEnum.LargeCharmOfDionysus)
      isACharm = true;

    return isACharm;
  }

  getSlotItemQuality(type: ItemsEnum) {
    if (type === ItemsEnum.CrackedRuby || type === ItemsEnum.CrackedTopaz || type === ItemsEnum.CrackedOpal ||
      type === ItemsEnum.CrackedAmethyst || type === ItemsEnum.CrackedEmerald || type === ItemsEnum.CrackedAquamarine ||
      type === ItemsEnum.LesserCrackedRuby || type === ItemsEnum.LesserCrackedTopaz || type === ItemsEnum.LesserCrackedOpal ||
      type === ItemsEnum.LesserCrackedAmethyst || type === ItemsEnum.LesserCrackedEmerald || type === ItemsEnum.LesserCrackedAquamarine)
      return EquipmentQualityEnum.Basic;

    if (type === ItemsEnum.DullRuby || type === ItemsEnum.DullTopaz || type === ItemsEnum.DullOpal || type === ItemsEnum.DullAmethyst ||
      type === ItemsEnum.DullEmerald || type === ItemsEnum.DullAquamarine || type === ItemsEnum.MinorWeaponSlotAddition ||
      type === ItemsEnum.MinorRingSlotAddition || type === ItemsEnum.MinorShieldSlotAddition || type === ItemsEnum.MinorArmorSlotAddition ||
      type === ItemsEnum.MinorNecklaceSlotAddition)
      return EquipmentQualityEnum.Uncommon;

    return EquipmentQualityEnum.Basic;
  }

  getItemTypeFromItemEnum(type: ItemsEnum) {
    if (type === ItemsEnum.HealingHerb || type === ItemsEnum.HealingPoultice || type === ItemsEnum.HealingSalve ||
      type === ItemsEnum.RestorativeHerb || type === ItemsEnum.FocusPotion || type === ItemsEnum.RestorativePoultice ||
      type === ItemsEnum.RestorativeSalve) {
      return ItemTypeEnum.HealingItem;
    }

    if (type === ItemsEnum.ThrowingStone || type === ItemsEnum.PoisonFang || type === ItemsEnum.ExplodingPotion
      || type === ItemsEnum.FirePotion || type === ItemsEnum.StranglingGasPotion || type === ItemsEnum.PoisonExtractPotion ||
      type === ItemsEnum.HeftyStone || type === ItemsEnum.UnstablePotion || type === ItemsEnum.BoomingPotion) {
      return ItemTypeEnum.BattleItem;
    }

    if (type === ItemsEnum.PoisonousToxin || type === ItemsEnum.DebilitatingToxin || type === ItemsEnum.WitheringToxin ||
      type === ItemsEnum.VenomousToxin) {
      return ItemTypeEnum.Toxin;
    }

    if (type === ItemsEnum.HeroicElixir || type === ItemsEnum.RejuvenatingElixir || type === ItemsEnum.ElixirOfFortitude) {
      return ItemTypeEnum.Elixir;
    }

    if (type === ItemsEnum.EagleFeather || type === ItemsEnum.LamiaHeart || type === ItemsEnum.Leather || type === ItemsEnum.LightLeather ||
      type === ItemsEnum.PetrifiedBark || type === ItemsEnum.SmallFeather || type === ItemsEnum.Asphodelus || type === ItemsEnum.Fennel ||
      type === ItemsEnum.Olive || type === ItemsEnum.SoulSpark || type === ItemsEnum.VialOfTheLethe || type === ItemsEnum.EssenceOfFire ||
      type === ItemsEnum.Narcissus || type === ItemsEnum.ThickLeather || type === ItemsEnum.RoughRubyFragment || type === ItemsEnum.RoughEmeraldFragment || type === ItemsEnum.RoughTopazFragment ||
      type === ItemsEnum.RoughOpalFragment || type === ItemsEnum.RoughAmethystFragment || type === ItemsEnum.RoughAquamarineFragment || type === ItemsEnum.Goldroot || type === ItemsEnum.Lousewort ||
      type === ItemsEnum.Violet || type === ItemsEnum.VialOfTheBlackSea || type === ItemsEnum.Sorrel || type === ItemsEnum.SpiritEssence || type === ItemsEnum.VialOfLakeLerna ||
      type === ItemsEnum.SatchelOfHerbs || type === ItemsEnum.BushelOfHerbs || type === ItemsEnum.SoulEssence || type === ItemsEnum.FishScales ||
      type === ItemsEnum.MetalScraps || type === ItemsEnum.SharkTeeth || type === ItemsEnum.Seashell || type === ItemsEnum.Wax || type === ItemsEnum.BoarHide ||
      type === ItemsEnum.BearHide) {
      return ItemTypeEnum.CraftingMaterial;
    }

    if (this.isItemACharm(type))
      return ItemTypeEnum.Charm;

    if (type === ItemsEnum.Coin || type === ItemsEnum.EternalMeleeTicket)
      return ItemTypeEnum.Resource;


    if (type === ItemsEnum.CrackedRuby || type === ItemsEnum.CrackedTopaz || type === ItemsEnum.CrackedOpal ||
      type === ItemsEnum.CrackedAmethyst || type === ItemsEnum.CrackedEmerald || type === ItemsEnum.CrackedAquamarine ||
      type === ItemsEnum.LesserCrackedRuby || type === ItemsEnum.LesserCrackedTopaz || type === ItemsEnum.LesserCrackedOpal ||
      type === ItemsEnum.LesserCrackedAmethyst || type === ItemsEnum.LesserCrackedEmerald || type === ItemsEnum.LesserCrackedAquamarine ||
      type === ItemsEnum.DullRuby || type === ItemsEnum.DullTopaz || type === ItemsEnum.DullOpal || type === ItemsEnum.DullAmethyst ||
      type === ItemsEnum.DullEmerald || type === ItemsEnum.DullAquamarine || type === ItemsEnum.MinorWeaponSlotAddition ||
      type === ItemsEnum.MinorRingSlotAddition || type === ItemsEnum.MinorShieldSlotAddition || type === ItemsEnum.MinorArmorSlotAddition ||
      type === ItemsEnum.MinorNecklaceSlotAddition)
      return ItemTypeEnum.SlotItem;

    if (this.getEquipmentPieceByItemType(type) !== undefined) {
      return ItemTypeEnum.Equipment;
    }

    if (type === ItemsEnum.BoonOfOlympus || type === ItemsEnum.ChthonicFavor || type === ItemsEnum.ChthonicPower || type === ItemsEnum.UnderworldAccess ||
      type === ItemsEnum.ChthonicFavorUpgrade1 || type === ItemsEnum.ChthonicFavorUpgrade2)
      return ItemTypeEnum.Progression;

    return ItemTypeEnum.None;
  }


  enableChthonicFavoredGod() {
    this.globalService.globalVar.chthonicPowers.preferredGod = this.getPreferredGod();
  }


  enableChthonicFavor() {
    this.globalService.globalVar.chthonicPowers.isChthonicFavorUnlocked = true;
  }

  giveCharactersBonusExp(amount: number) {
    this.globalService.giveCharactersBonusExp(this.globalService.getActivePartyCharacters(true), amount);
  }

  getItemDescription(type: ItemsEnum, associatedResource?: ResourceValue, canRemoveExtra: boolean = false): string {
    var name = "";
    var effect = this.getBattleItemEffect(type);

    var relatedUserGainStatusEffectDuration = 0;
    var durationInMinutes = 0;
    var relatedUserGainStatusEffectEffectiveness = 0;
    var relatedUserGainStatusEffectEffectivenessPercent = 0;
    var relatedTargetGainStatusEffectDuration = 0;
    var relatedTargetGainStatusEffectEffectiveness = 0;
    var relatedTargetGainStatusEffectEffectivenessPercent = 0;
    var relatedTargetGainStatusEffectTickFrequency = 0;
    var secondaryRelatedTargetGainStatusEffectDuration = 0;
    var secondaryRelatedTargetGainStatusEffectEffectiveness = 0;
    var secondaryRelatedTargetGainStatusEffectEffectivenessPercent = 0;
    var secondaryRelatedTargetGainStatusEffectTickFrequency = 0;


    if (effect !== undefined) {

      var relatedUserGainStatusEffect = effect?.userEffect[0];

      if (relatedUserGainStatusEffect !== undefined) {
        relatedUserGainStatusEffectDuration = Math.round(relatedUserGainStatusEffect.duration);
        durationInMinutes = Math.ceil(relatedUserGainStatusEffectDuration / 60);
        relatedUserGainStatusEffectEffectiveness = relatedUserGainStatusEffect.effectiveness;
        if (relatedUserGainStatusEffectEffectiveness < 1)
          relatedUserGainStatusEffectEffectivenessPercent = Math.round((relatedUserGainStatusEffectEffectiveness) * 100);
        else
          relatedUserGainStatusEffectEffectivenessPercent = Math.round((relatedUserGainStatusEffectEffectiveness - 1) * 100);
      }

      var relatedTargetGainStatusEffect = effect?.targetEffect[0];

      if (relatedTargetGainStatusEffect !== undefined) {
        relatedTargetGainStatusEffectDuration = Math.round(relatedTargetGainStatusEffect.duration);
        relatedTargetGainStatusEffectEffectiveness = relatedTargetGainStatusEffect.effectiveness;
        if (relatedTargetGainStatusEffectEffectiveness < 1)
          relatedTargetGainStatusEffectEffectivenessPercent = Math.round((relatedTargetGainStatusEffectEffectiveness) * 100);
        else
          relatedTargetGainStatusEffectEffectivenessPercent = Math.round((relatedTargetGainStatusEffectEffectiveness - 1) * 100);
        relatedTargetGainStatusEffectTickFrequency = relatedTargetGainStatusEffect.tickFrequency;
      }
    }

    if (type === ItemsEnum.HealingHerb || type === ItemsEnum.HealingPoultice || type === ItemsEnum.RestorativeHerb ||
      type === ItemsEnum.RestorativePoultice)
      name = "Heal a party member for " + effect.healAmount + " HP.";

    else if (type === ItemsEnum.HealingSalve || type === ItemsEnum.RestorativeSalve)
      name = "Heal both party members for " + effect.healAmount + " HP.";

    else if (type === ItemsEnum.FocusPotion)
      name = "Fill " + relatedUserGainStatusEffectEffectivenessPercent + "% of a party member's Overdrive gauge. " + effect.cooldown + " second cooldown.";

    //battle items
    else if (type === ItemsEnum.ThrowingStone || type === ItemsEnum.ExplodingPotion || type === ItemsEnum.HeftyStone)
      name = "Deal " + effect.trueDamageAmount + " damage to a target.";
    else if (type === ItemsEnum.UnstablePotion)
      name = "Deal " + effect.trueDamageAmount + " damage to all targets.";
    else if (type === ItemsEnum.FirePotion)
      name = "Deal " + effect.trueDamageAmount + " Fire damage to a target.";
    else if (type === ItemsEnum.PoisonFang || type === ItemsEnum.StranglingGasPotion)
      name = "Poison an enemy, dealing " + relatedTargetGainStatusEffectEffectiveness + " damage every " + relatedTargetGainStatusEffectTickFrequency + " seconds for " + relatedTargetGainStatusEffectDuration + " seconds.";
    else if (type === ItemsEnum.PoisonExtractPotion)
      name = "Poison all enemies, dealing " + relatedTargetGainStatusEffectEffectiveness + " damage every " + relatedTargetGainStatusEffectTickFrequency + " seconds for " + relatedTargetGainStatusEffectDuration + " seconds.";
    else if (type === ItemsEnum.BoomingPotion)
      name = "Reduce target's Resistance by " + (100 - relatedTargetGainStatusEffectEffectivenessPercent) + "% for " + relatedTargetGainStatusEffectDuration + " seconds.";
    else if (type === ItemsEnum.DebilitatingToxin)
      name = "Apply a toxin to a party member's weapon, giving their auto attacks a 10% chance to reduce a target's Agility by 20% for 14 seconds. Lasts for 30 minutes. Only one toxin can be applied per party member at a time.";
    else if (type === ItemsEnum.PoisonousToxin)
      name = "Apply a toxin to a party member's weapon, giving their auto attacks a 10% chance to deal an additional 65 damage. Lasts for 30 minutes. Only one toxin can be applied per party member at a time.";
    else if (type === ItemsEnum.WitheringToxin)
      name = "Apply a toxin to a party member's weapon, giving their auto attacks a 10% chance to reduce a target's Attack by 20% for 16 seconds. Lasts for 30 minutes. Only one toxin can be applied per party member at a time.";
    else if (type === ItemsEnum.VenomousToxin)
      name = "Apply a toxin to a party member's weapon, giving their auto attacks a 10% chance to deal an additional 432 damage. Lasts for 30 minutes. Only one toxin can be applied per party member at a time.";
    else if (type === ItemsEnum.HeroicElixir)
      name = "Increase user's max HP by " + relatedUserGainStatusEffectEffectivenessPercent + "% for " + durationInMinutes + " minutes. Only one elixir can be active per party member at a time.";
    else if (type === ItemsEnum.RejuvenatingElixir)
      name = "Increase user's HP Regen by " + relatedUserGainStatusEffectEffectiveness + " HP per 5 seconds for " + durationInMinutes + " minutes. Only one elixir can be active per party member at a time.";
    else if (type === ItemsEnum.ElixirOfFortitude)
      name = "Increase user's Defense by " + relatedUserGainStatusEffectEffectivenessPercent + "% for " + durationInMinutes + " minutes. Only one elixir can be active per party member at a time.";

    //resources    
    else if (this.getItemTypeFromItemEnum(type) === ItemTypeEnum.Resource || this.getItemTypeFromItemEnum(type) === ItemTypeEnum.CraftingMaterial)
      name = this.getResourceDescription(type);

    //progression
    else if (type === ItemsEnum.BoonOfOlympus)
      name = "Increase experience gained by all gods.";
    else if (type === ItemsEnum.ChthonicFavor)
      name = "Increase Chthonic Power gain by " + (this.getChthonicFavorMultiplier(true)).toFixed(0) + "%.";
    else if (type === ItemsEnum.ChthonicPower)
      name = "Spend on permanent stat boosts.";
    else if (type === ItemsEnum.PoisonExtractPotionRecipe)
      name = "Recipe for Alchemy item <b>Poison Extract Potion</b>.";
      else if (type === ItemsEnum.FocusPotionRecipe)
        name = "Recipe for Alchemy item <b>Focus Potion</b>.";

    //equipment
    else if (this.getEquipmentPieceByItemType(type) !== undefined) {
      name = this.getEquipmentStats(this.getEquipmentPieceByItemType(type), associatedResource, canRemoveExtra) + "<br/><br/>" + this.getEquipmentEffects(this.getEquipmentPieceByItemType(type));
    }

    //charm
    else if (this.getItemTypeFromItemEnum(type) === ItemTypeEnum.Charm) {
      name = this.getCharmDescription(type);
    }

    //slot item
    else if (this.getItemTypeFromItemEnum(type) === ItemTypeEnum.SlotItem) {
      name = this.getSlotItemDescription(type);
    }

    else if (type === ItemsEnum.SparringMatch) {
      var xpAmount = 5000;
      name = "Instantly receive " + xpAmount.toLocaleString() + " Bonus XP";
    }
    else if (type === ItemsEnum.WarriorClass)
      name = "New Class: Warrior<br/><br/>" + this.getCharacterDescription(CharacterEnum.Warrior);
    else if (type === ItemsEnum.PriestClass)
      name = "New Class: Priest<br/><br/>" + this.getCharacterDescription(CharacterEnum.Priest);
    else if (type === ItemsEnum.BonusXp)
      name = "Give bonus XP to all characters and gods.";
    else if (type == ItemsEnum.ItemBeltUp)
      name = "Gain an extra item belt slot.";
    else if (type === ItemsEnum.ChthonicFavorUpgrade1)
      name = "At different intervals, random gods will give 25% more <strong>Chthonic Power</strong>";
    else if (type === ItemsEnum.ChthonicFavorUpgrade2)
      name = "Gain access to <strong>Chthonic Favor</strong>, a new resource that increases the amount of Chthonic Power you gain";
    else if (type === ItemsEnum.Hades)
      name = "Gain <span class='hadesColor smallCaps'>Hades</span> as an equippable god";
    else if (type === ItemsEnum.Ares)
      name = "Gain <span class='aresColor smallCaps'>Ares</span> as an equippable god";

    return name;
  }

  getCharmDescription(type: ItemsEnum) {
    var description = "";

    if (type === ItemsEnum.SmallCharmOfRejuvenation)
      description = "Increase all characters' HP Regen by <span class='charmDescriptor'>" + this.charmService.getSmallCharmOfRejuvenationValue() + " HP / 5 seconds</span>.";
    if (type === ItemsEnum.LargeCharmOfRejuvenation)
      description = "Increase all characters' HP Regen by <span class='charmDescriptor'>" + this.charmService.getLargeCharmOfRejuvenationValue() + " HP / 5 seconds</span>.";

    if (type === ItemsEnum.SmallCharmOfDetermination)
      description = "Increase Overdrive gauge gain from all sources by <span class='charmDescriptor'>" + (this.charmService.getSmallCharmOfDeterminationValue() * 100) + "%</span>.";
    if (type === ItemsEnum.LargeCharmOfDetermination)
      description = "Increase Overdrive gauge gain from all sources by <span class='charmDescriptor'>" + (this.charmService.getLargeCharmOfDeterminationValue() * 100) + "%</span>.";

    if (type === ItemsEnum.SmallCharmOfVulnerability)
      description = "Increase all characters' Critical Damage Multiplier by <span class='charmDescriptor'>" + (this.charmService.getSmallCharmOfVulnerabilityValue() * 100) + "%</span>.";
    if (type === ItemsEnum.LargeCharmOfVulnerability)
      description = "Increase all characters' Critical Damage Multiplier by <span class='charmDescriptor'>" + (this.charmService.getLargeCharmOfVulnerabilityValue() * 100) + "%</span>.";

    if (type === ItemsEnum.SmallCharmOfPreparation)
      description = "Reduce all characters' Ability Cooldowns by <span class='charmDescriptor'>" + (this.charmService.getSmallCharmOfPreparationValue() * 100) + "%</span>.";
    if (type === ItemsEnum.LargeCharmOfPreparation)
      description = "Reduce all characters' Ability Cooldowns by <span class='charmDescriptor'>" + (this.charmService.getLargeCharmOfPreparationValue() * 100) + "%</span>.";

    if (type === ItemsEnum.SmallCharmOfHaste)
      description = "Reduce all characters' Auto Attack Cooldowns by <span class='charmDescriptor'>" + (this.charmService.getSmallCharmOfPreparationValue() * 100) + "%</span>.";
    if (type === ItemsEnum.LargeCharmOfHaste)
      description = "Reduce all characters' Auto Attack Cooldowns by <span class='charmDescriptor'>" + (this.charmService.getLargeCharmOfPreparationValue() * 100) + "%</span>.";

    if (type === ItemsEnum.SmallCharmOfIngenuity)
      description = "Increase all characters' Armor Penetration by <span class='charmDescriptor'>" + (this.charmService.getSmallCharmOfIngenuityValue() * 100) + "%</span>.";
    if (type === ItemsEnum.LargeCharmOfIngenuity)
      description = "Increase all characters' Armor Penetration by <span class='charmDescriptor'>" + (this.charmService.getLargeCharmOfIngenuityValue() * 100) + "%</span>.";

    if (type === ItemsEnum.SmallCharmOfHolyDestruction)
      description = "Increase all characters' Holy damage by <span class='charmDescriptor'>" + (this.charmService.getSmallCharmOfElementalDestructionValue() * 100) + "%</span>.";
    if (type === ItemsEnum.LargeCharmOfHolyDestruction)
      description = "Increase all characters' Holy damage by <span class='charmDescriptor'>" + (this.charmService.getLargeCharmOfElementalDestructionValue() * 100) + "%</span>.";

    if (type === ItemsEnum.SmallCharmOfFireDestruction)
      description = "Increase all characters' Fire damage by <span class='charmDescriptor'>" + (this.charmService.getSmallCharmOfElementalDestructionValue() * 100) + "%</span>.";
    if (type === ItemsEnum.LargeCharmOfFireDestruction)
      description = "Increase all characters' Fire damage by <span class='charmDescriptor'>" + (this.charmService.getLargeCharmOfElementalDestructionValue() * 100) + "%</span>.";

    if (type === ItemsEnum.SmallCharmOfWaterDestruction)
      description = "Increase all characters' Water damage by <span class='charmDescriptor'>" + (this.charmService.getSmallCharmOfElementalDestructionValue() * 100) + "%</span>.";
    if (type === ItemsEnum.LargeCharmOfWaterDestruction)
      description = "Increase all characters' Water damage by <span class='charmDescriptor'>" + (this.charmService.getLargeCharmOfElementalDestructionValue() * 100) + "%</span>.";

    if (type === ItemsEnum.SmallCharmOfLightningDestruction)
      description = "Increase all characters' Lightning damage by <span class='charmDescriptor'>" + (this.charmService.getSmallCharmOfElementalDestructionValue() * 100) + "%</span>.";
    if (type === ItemsEnum.LargeCharmOfLightningDestruction)
      description = "Increase all characters' Lightning damage by <span class='charmDescriptor'>" + (this.charmService.getLargeCharmOfElementalDestructionValue() * 100) + "%</span>.";

    if (type === ItemsEnum.SmallCharmOfAirDestruction)
      description = "Increase all characters' Air damage by <span class='charmDescriptor'>" + (this.charmService.getSmallCharmOfElementalDestructionValue() * 100) + "%</span>.";
    if (type === ItemsEnum.LargeCharmOfAirDestruction)
      description = "Increase all characters' Air damage by <span class='charmDescriptor'>" + (this.charmService.getLargeCharmOfElementalDestructionValue() * 100) + "%</span>.";

    if (type === ItemsEnum.SmallCharmOfEarthDestruction)
      description = "Increase all characters' Earth damage by <span class='charmDescriptor'>" + (this.charmService.getSmallCharmOfElementalDestructionValue() * 100) + "%</span>.";
    if (type === ItemsEnum.LargeCharmOfEarthDestruction)
      description = "Increase all characters' Earth damage by <span class='charmDescriptor'>" + (this.charmService.getLargeCharmOfElementalDestructionValue() * 100) + "%</span>.";

    if (type === ItemsEnum.SmallCharmOfHolyProtection)
      description = "Reduce all characters' Holy damage taken by <span class='charmDescriptor'>" + (this.charmService.getSmallCharmOfElementalResistanceValue() * 100) + "%</span>.";
    if (type === ItemsEnum.LargeCharmOfHolyProtection)
      description = "Reduce all characters' Holy damage taken by <span class='charmDescriptor'>" + (this.charmService.getLargeCharmOfElementalResistanceValue() * 100) + "%</span>.";

    if (type === ItemsEnum.SmallCharmOfFireProtection)
      description = "Reduce all characters' Fire damage taken by <span class='charmDescriptor'>" + (this.charmService.getSmallCharmOfElementalResistanceValue() * 100) + "%</span>.";
    if (type === ItemsEnum.LargeCharmOfFireProtection)
      description = "Reduce all characters' Fire damage taken by <span class='charmDescriptor'>" + (this.charmService.getLargeCharmOfElementalResistanceValue() * 100) + "%</span>.";

    if (type === ItemsEnum.SmallCharmOfLightningProtection)
      description = "Reduce all characters' Lightning damage taken by <span class='charmDescriptor'>" + (this.charmService.getSmallCharmOfElementalResistanceValue() * 100) + "%</span>.";
    if (type === ItemsEnum.LargeCharmOfLightningProtection)
      description = "Reduce all characters' Lightning damage taken by <span class='charmDescriptor'>" + (this.charmService.getLargeCharmOfElementalResistanceValue() * 100) + "%</span>.";

    if (type === ItemsEnum.SmallCharmOfWaterProtection)
      description = "Reduce all characters' Water damage taken by <span class='charmDescriptor'>" + (this.charmService.getSmallCharmOfElementalResistanceValue() * 100) + "%</span>.";
    if (type === ItemsEnum.LargeCharmOfWaterProtection)
      description = "Reduce all characters' Water damage taken by <span class='charmDescriptor'>" + (this.charmService.getLargeCharmOfElementalResistanceValue() * 100) + "%</span>.";

    if (type === ItemsEnum.SmallCharmOfAirProtection)
      description = "Reduce all characters' Air damage taken by <span class='charmDescriptor'>" + (this.charmService.getSmallCharmOfElementalResistanceValue() * 100) + "%</span>.";
    if (type === ItemsEnum.LargeCharmOfAirProtection)
      description = "Reduce all characters' Air damage taken by <span class='charmDescriptor'>" + (this.charmService.getLargeCharmOfElementalResistanceValue() * 100) + "%</span>.";

    if (type === ItemsEnum.SmallCharmOfEarthProtection)
      description = "Reduce all characters' Earth damage taken by <span class='charmDescriptor'>" + (this.charmService.getSmallCharmOfElementalResistanceValue() * 100) + "%</span>.";
    if (type === ItemsEnum.LargeCharmOfEarthProtection)
      description = "Reduce all characters' Earth damage taken by <span class='charmDescriptor'>" + (this.charmService.getLargeCharmOfElementalResistanceValue() * 100) + "%</span>.";

    if (type === ItemsEnum.SmallCharmOfAthena)
      description = "Increase Healing Received from all sources by <span class='charmDescriptor'>" + (this.charmService.getSmallCharmOfAthenaValue() * 100) + "%</span> for the character equipped with Athena.";
    if (type === ItemsEnum.LargeCharmOfAthena)
      description = "Increase Healing Received from all sources by <span class='charmDescriptor'>" + (this.charmService.getLargeCharmOfAthenaValue() * 100) + "%</span> for the character equipped with Athena.";

    if (type === ItemsEnum.SmallCharmOfArtemis)
      description = "Increase Debuff Duration by <span class='charmDescriptor'>" + (this.charmService.getSmallCharmOfArtemisValue() * 100) + "%</span> for all debuffs created by the character equipped with Artemis.";
    if (type === ItemsEnum.LargeCharmOfArtemis)
      description = "Increase Debuff Duration by <span class='charmDescriptor'>" + (this.charmService.getLargeCharmOfArtemisValue() * 100) + "%</span> for all debuffs created by the character equipped with Artemis.";

    if (type === ItemsEnum.SmallCharmOfHermes)
      description = "Increase Overdrive gauge gain from auto attacks by <span class='charmDescriptor'>" + (this.charmService.getSmallCharmOfHermesValue() * 100) + "%</span> for the character equipped with Hermes.";
    if (type === ItemsEnum.LargeCharmOfHermes)
      description = "Increase Overdrive gauge gain from auto attacks by <span class='charmDescriptor'>" + (this.charmService.getLargeCharmOfHermesValue() * 100) + "%</span> for the character equipped with Hermes.";

    if (type === ItemsEnum.SmallCharmOfApollo)
      description = "Increase Healing Done by <span class='charmDescriptor'>" + (this.charmService.getSmallCharmOfApolloValue() * 100) + "%</span> for the character equipped with Apollo.";
    if (type === ItemsEnum.LargeCharmOfApollo)
      description = "Increase Healing Done by <span class='charmDescriptor'>" + (this.charmService.getLargeCharmOfApolloValue() * 100) + "%</span> for the character equipped with Apollo.";

      if (type === ItemsEnum.SmallCharmOfHades)
      description = "Increase Multiple Target Damage by <span class='charmDescriptor'>" + (this.charmService.getSmallCharmOfHadesValue() * 100) + "%</span> for the character equipped with Hades.";
    if (type === ItemsEnum.LargeCharmOfHades)
      description = "Increase Multiple Target Damage by <span class='charmDescriptor'>" + (this.charmService.getLargeCharmOfHadesValue() * 100) + "%</span> for the character equipped with Hades.";

      if (type === ItemsEnum.SmallCharmOfAres)
      description = "Reduce Damage over Time Tick Frequency by <span class='charmDescriptor'>" + (this.charmService.getSmallCharmOfAresValue() * 100) + "%</span> for the character equipped with Ares.";
    if (type === ItemsEnum.LargeCharmOfAres)
      description = "Reduce Damage over Time Tick Frequency by <span class='charmDescriptor'>" + (this.charmService.getLargeCharmOfAresValue() * 100) + "%</span> for the character equipped with Ares.";

      if (type === ItemsEnum.SmallCharmOfDionysus)
      description = "Reduce Ability Cooldown while buffs are active by <span class='charmDescriptor'>" + (this.charmService.getSmallCharmOfDionysusValue() * 100) + "%</span> for the character equipped with Dionysus.";
    if (type === ItemsEnum.LargeCharmOfDionysus)
      description = "Reduce Ability Cooldown while buffs are active by <span class='charmDescriptor'>" + (this.charmService.getLargeCharmOfDionysusValue() * 100) + "%</span> for the character equipped with Dionysus.";

      if (type === ItemsEnum.SmallCharmOfNemesis)
      description = "Reflect <span class='charmDescriptor'>" + (this.charmService.getSmallCharmOfNemesisValue() * 100) + "%</span> of damage taken back to the attacker for the character equipped with Nemesis.";
    if (type === ItemsEnum.LargeCharmOfNemesis)
      description = "Reflect <span class='charmDescriptor'>" + (this.charmService.getLargeCharmOfNemesisValue() * 100) + "%</span> of damage taken back to the attacker for the character equipped with Nemesis.";

    return description;
  }

  getSlotItemDescription(item: ItemsEnum) {
    var description = "";

    var slotItemValues = this.resourceGeneratorService.getSlotItemValues(item);

    if (slotItemValues.maxHp > 0)
      description = "+<b>" + slotItemValues.maxHp + " Max HP</b>";
    if (slotItemValues.attack > 0)
      description = "+<b>" + slotItemValues.attack + " Attack</b>";
    if (slotItemValues.defense > 0)
      description = "+<b>" + slotItemValues.defense + " Defense</b>";
    if (slotItemValues.agility > 0)
      description = "+<b>" + slotItemValues.agility + " Agility</b>";
    if (slotItemValues.luck > 0)
      description = "+<b>" + slotItemValues.luck + " Luck</b>";
    if (slotItemValues.resistance > 0)
      description = "+<b>" + slotItemValues.resistance + " Resistance</b>";

    var slotStarDisclaimer = "An item can only have as many slots total as it has stars.";
    if (item === ItemsEnum.MinorWeaponSlotAddition)
      description = "Add a slot to a Weapon, up to 3 slots total. " + slotStarDisclaimer;
    if (item === ItemsEnum.MinorRingSlotAddition)
      description = "Add a slot to a Ring, up to 3 slots total. " + slotStarDisclaimer;
    if (item === ItemsEnum.MinorArmorSlotAddition)
      description = "Add a slot to an Armor, up to 3 slots total. " + slotStarDisclaimer;
    if (item === ItemsEnum.MinorShieldSlotAddition)
      description = "Add a slot to a Shield, up to 3 slots total. " + slotStarDisclaimer;
    if (item === ItemsEnum.MinorNecklaceSlotAddition)
      description = "Add a slot to a Necklace, up to 3 slots total. " + slotStarDisclaimer;

    if (item === ItemsEnum.WeaponSlotAddition)
      description = "Add a slot to a Weapon, up to 5 slots total. " + slotStarDisclaimer;
    if (item === ItemsEnum.RingSlotAddition)
      description = "Add a slot to a Ring, up to 5 slots total. " + slotStarDisclaimer;
    if (item === ItemsEnum.ArmorSlotAddition)
      description = "Add a slot to an Armor, up to 5 slots total. " + slotStarDisclaimer;
    if (item === ItemsEnum.ShieldSlotAddition)
      description = "Add a slot to a Shield, up to 5 slots total. " + slotStarDisclaimer;
    if (item === ItemsEnum.NecklaceSlotAddition)
      description = "Add a slot to a Necklace, up to 5 slots total. " + slotStarDisclaimer;


    return description;
  }

  getResourceDescription(item: ItemsEnum) {
    var itemNotYetImplementedText = "You are sure there is a purpose for this, but you are not quite sure yet what that is.<br/> It will likely make more sense in the future. (Not implemented yet)";

    var description = "";
    if (item === ItemsEnum.Coin)
      description = "Use to trade with merchants.";
    else if (item === ItemsEnum.EternalMeleeTicket)
      description = "One extra entry to the <strong>Eternal Melee</strong> coliseum battle.";
    else {
      description = "Used for crafting.";
      if (item === ItemsEnum.SoulEssence || item === ItemsEnum.SatchelOfHerbs || item === ItemsEnum.BushelOfHerbs)
        return description;

      /*if (item === ItemsEnum.CrackedRuby || item === ItemsEnum.CrackedEmerald || item === ItemsEnum.CrackedAquamarine ||
        item === ItemsEnum.CrackedOpal || item === ItemsEnum.CrackedTopaz || item === ItemsEnum.CrackedAmethyst ||
        item === ItemsEnum.LesserCrackedRuby || item === ItemsEnum.LesserCrackedEmerald || item === ItemsEnum.LesserCrackedAquamarine ||
        item === ItemsEnum.LesserCrackedOpal || item === ItemsEnum.LesserCrackedTopaz || item === ItemsEnum.LesserCrackedAmethyst ||
        item === ItemsEnum.DullRuby || item === ItemsEnum.DullEmerald || item === ItemsEnum.DullAquamarine ||
        item === ItemsEnum.DullOpal || item === ItemsEnum.DullTopaz || item === ItemsEnum.DullAmethyst)
        return itemNotYetImplementedText;*/

      var locations = this.getResourceItemLocations(item);
      description += "<hr/>Can be found at:<br/>" + locations;
    }
    return description;
  }

  getResourceItemLocations(item: ItemsEnum) {
    var locations = "<div>???</div>";
    var matchingEnemies: Enemy[] = [];
    var matchingSubzones: SubZoneEnum[] = [];

    //get enemies who have item
    //find what subzones they exist in, remove those that aren't unlocked
    //list highest % chance of top 3-5 or so

    for (const [propertyKey, propertyValue] of Object.entries(BestiaryEnum)) {
      if (!Number.isNaN(Number(propertyKey))) {
        continue;
      }

      var enumValue = propertyValue as BestiaryEnum;
      //todo: one option for optimization is abstract out loot from enemy generation and call that both in generateEnemy and here
      var enemy = this.enemyGeneratorService.generateEnemy(enumValue);
      if (enemy.loot.some(loot => loot.item === item)) {
        //todo: should I hide it like below or not?
        //var defeatCount = this.globalService.globalVar.enemyDefeatCount.find(item => item.bestiaryEnum === enemy.bestiaryType);
        //if (defeatCount !== undefined && defeatCount.defeatCount >= this.utilityService.killCountDisplayBasicEnemyLoot)
        matchingEnemies.push(enemy);
      }
    }

    if (matchingEnemies.length > 0) {
      matchingEnemies.forEach(enemy => {
        for (const [propertyKey, propertyValue] of Object.entries(SubZoneEnum)) {
          if (!Number.isNaN(Number(propertyKey))) {
            continue;
          }

          var enumValue = propertyValue as SubZoneEnum;

          var options = this.subzoneGeneratorService.generateBattleOptions(enumValue, false);
          if (options.some(option => option.enemyList.some(list => list.name === enemy.name))) {
            matchingSubzones.push(enumValue);
          }
        }
      });
    }

    for (const [propertyKey, propertyValue] of Object.entries(SubZoneEnum)) {
      if (!Number.isNaN(Number(propertyKey))) {
        continue;
      }

      var subzoneValue = propertyValue as SubZoneEnum;

      var rewards = this.subzoneGeneratorService.getTreasureChestRewards(subzoneValue);

      if (rewards.some(loot => loot.item === item)) {
        matchingSubzones.push(subzoneValue);
      }
    }

    if (matchingSubzones.length === 0)
      return locations;

    locations = "";
    matchingSubzones = matchingSubzones.filter((el, i, a) => i === a.indexOf(el));
    /*var availableSubzones: SubZoneEnum[] = [];
    */

    matchingSubzones.sort((a,b) => {
      var aSubzone = this.balladService.findSubzone(a);
      var bSubzone = this.balladService.findSubzone(b);

      if (aSubzone === undefined || bSubzone === undefined)
        return 0;

      if (aSubzone.isAvailable && !bSubzone.isAvailable)
        return -1;
        if (!aSubzone.isAvailable && bSubzone.isAvailable)
        return 1;
        else
        return 0;
    })

    //matchingSubzones.forEach(subzone => {
      var locationTotal = 4;
      for (var i = 0; i < locationTotal; i++) {
        var subzone = matchingSubzones[i];
      var matchedSubzone = this.balladService.findSubzone(subzone);
      var name = this.balladService.getSubZoneName(subzone);

      if (matchedSubzone !== undefined) {
        var matchedBallad = this.balladService.findBalladOfSubzone(matchedSubzone?.type);
        if (matchedBallad !== undefined && !matchedBallad.isAvailable && matchedSubzone.isAvailable) {
          name = "<span class='subzoneUnavailable'>" + name + " (Unavailable)</span>";
          locations += "<div class='" + subzone.toString() + "'>" + name + "</div>";
        }
        else if (matchedSubzone.isAvailable) {
          //TODO: clear count should be relevant here, <100 clears = ???, >100 clears gives info maybe
          locations += "<div class='subzoneClickableItem " + subzone.toString() + "'>" + name + "</div>";
        }
      }
    }

    var matchingSubzoneAvailableTotal = 0;

    matchingSubzones.forEach(subzone => {
      var matchedSubzone = this.balladService.findSubzone(subzone);
      if (matchedSubzone !== undefined) {
      var matchedBallad = this.balladService.findBalladOfSubzone(matchedSubzone.type);
      if (matchedSubzone !== undefined && matchedSubzone.isAvailable && matchedBallad?.isAvailable) {
        matchingSubzoneAvailableTotal += 1;
      }
      }
    });

    if (matchingSubzoneAvailableTotal > locationTotal)
      locations += "and " + (matchingSubzoneAvailableTotal - locationTotal) + " other locations.";
    return this.utilityService.getSanitizedHtml(locations);
    //<div>???</div><div>???</div>";
  }

  getItemTypeName(item: ItemsEnum) {
    var itemTypeName = "";

    var equipment = this.getEquipmentPieceByItemType(item);

    if (equipment !== undefined)
      itemTypeName = this.getEquipmentTypeName(equipment);
    else {
      var itemType = this.getItemTypeFromItemEnum(item);

      if (itemType === ItemTypeEnum.BattleItem)
        itemTypeName = "Equippable Damaging Item";
      else if (itemType === ItemTypeEnum.HealingItem)
        itemTypeName = "Equippable Healing Item";
      else if (itemType === ItemTypeEnum.CraftingMaterial)
        itemTypeName = "Material";
      else if (itemType === ItemTypeEnum.Resource)
        itemTypeName = "Resource";
    }

    return itemTypeName;
  }

  getEquipmentTypeName(equipment: Equipment) {
    var name = "";

    if (equipment.equipmentType === EquipmentTypeEnum.Weapon) {
      if (equipment.weaponType === WeaponTypeEnum.Sword)
        name = "Weapon - Sword";
      if (equipment.weaponType === WeaponTypeEnum.Hammer)
        name = "Weapon - Hammer";
      if (equipment.weaponType === WeaponTypeEnum.Bow)
        name = "Weapon - Bow";
      if (equipment.weaponType === WeaponTypeEnum.Spear)
        name = "Weapon - Spear";
    }
    else if (equipment.equipmentType === EquipmentTypeEnum.Shield) {
      name = "Shield";
    }
    else if (equipment.equipmentType === EquipmentTypeEnum.Armor) {
      name = "Armor";
    }
    else if (equipment.equipmentType === EquipmentTypeEnum.Ring) {
      name = "Ring";
    }
    else if (equipment.equipmentType === EquipmentTypeEnum.Necklace) {
      name = "Necklace";
    }

    return name;
  }

  getEquipmentPieceByItemType(type: ItemsEnum) {
    var equipmentPiece: Equipment | undefined = undefined;

    //swords
    if (type === ItemsEnum.IronSword) {
      equipmentPiece = new Equipment(type, EquipmentTypeEnum.Weapon, EquipmentQualityEnum.Basic, WeaponTypeEnum.Sword);
      equipmentPiece.stats = new CharacterStats(0, 4, 0, 5, 0, 0);
    }
    if (type === ItemsEnum.BronzeSword) {
      equipmentPiece = new Equipment(type, EquipmentTypeEnum.Weapon, EquipmentQualityEnum.Uncommon, WeaponTypeEnum.Sword);
      equipmentPiece.stats = new CharacterStats(0, 8, 0, 10, 0, 0);
    }
    if (type === ItemsEnum.FortifiedBronzeSword) {
      equipmentPiece = new Equipment(type, EquipmentTypeEnum.Weapon, EquipmentQualityEnum.Uncommon, WeaponTypeEnum.Sword);
      equipmentPiece.stats = new CharacterStats(0, 12, 0, 15, 0, 0);
    }
    if (type === ItemsEnum.SteelSword) {
      equipmentPiece = new Equipment(type, EquipmentTypeEnum.Weapon, EquipmentQualityEnum.Rare, WeaponTypeEnum.Sword);
      equipmentPiece.stats = new CharacterStats(0, 18, 0, 20, 0, 0);
      equipmentPiece.stats.overdriveGain = .05;
    }
    if (type === ItemsEnum.SwordOfFlames) {
      equipmentPiece = new Equipment(type, EquipmentTypeEnum.Weapon, EquipmentQualityEnum.Rare, WeaponTypeEnum.Sword);
      equipmentPiece.stats = new CharacterStats(0, 24, 0, 25, 0, 0);
      equipmentPiece.equipmentEffect.trigger = EffectTriggerEnum.OnAbilityUse;
      equipmentPiece.equipmentEffect.targetEffect.push(this.globalService.createStatusEffect(StatusEffectEnum.InstantTrueDamage, 0, 30, true, false, false, "Sword of Flames", undefined, undefined, ElementalTypeEnum.Fire, undefined, false));
    }
    if (type === ItemsEnum.GoldenSword) {
      equipmentPiece = new Equipment(type, EquipmentTypeEnum.Weapon, EquipmentQualityEnum.Epic, WeaponTypeEnum.Sword);
      equipmentPiece.stats = new CharacterStats(0, 80, 0, 85, 0, 0);
      equipmentPiece.stats.overdriveGain = .1;
      equipmentPiece.slotCount = 1;
    }
    if (type === ItemsEnum.BlackLance) {
      equipmentPiece = new Equipment(type, EquipmentTypeEnum.Weapon, EquipmentQualityEnum.Epic, WeaponTypeEnum.Spear);
      equipmentPiece.stats = new CharacterStats(0, 125, 0, 0, 145, 40);
      equipmentPiece.stats.criticalMultiplier = .15;
      equipmentPiece.stats.aoeDamage = .1;
      equipmentPiece.slotCount = 2;
    }
    if (type === ItemsEnum.LiquidSaber) {
      equipmentPiece = new Equipment(type, EquipmentTypeEnum.Weapon, EquipmentQualityEnum.Epic, WeaponTypeEnum.Sword);
      equipmentPiece.stats = new CharacterStats(650, 125, 40, 0, 0, 0);
      equipmentPiece.stats.elementIncrease.water = .2;
      equipmentPiece.equipmentEffect.trigger = EffectTriggerEnum.AlwaysActive;
      equipmentPiece.equipmentEffect.userEffect.push(this.globalService.createStatusEffect(StatusEffectEnum.Enwater, -1, 1, false, true, false, type.toString()));
      equipmentPiece.slotCount = 2;
    }

    //hammers
    if (type === ItemsEnum.IronHammer) {
      equipmentPiece = new Equipment(type, EquipmentTypeEnum.Weapon, EquipmentQualityEnum.Basic, WeaponTypeEnum.Hammer);
      equipmentPiece.stats = new CharacterStats(0, 7, 0, 0, 0, 0);
    }
    if (type === ItemsEnum.BronzeHammer) {
      equipmentPiece = new Equipment(type, EquipmentTypeEnum.Weapon, EquipmentQualityEnum.Uncommon, WeaponTypeEnum.Hammer);
      equipmentPiece.stats = new CharacterStats(0, 14, 0, 0, 0, 0);
    }
    if (type === ItemsEnum.FortifiedBronzeHammer) {
      equipmentPiece = new Equipment(type, EquipmentTypeEnum.Weapon, EquipmentQualityEnum.Uncommon, WeaponTypeEnum.Hammer);
      equipmentPiece.stats = new CharacterStats(0, 21, 0, 0, 0, 0);
    }
    if (type === ItemsEnum.SteelHammer) {
      equipmentPiece = new Equipment(type, EquipmentTypeEnum.Weapon, EquipmentQualityEnum.Rare, WeaponTypeEnum.Hammer);
      equipmentPiece.stats = new CharacterStats(0, 32, 0, 0, 0, 0);
      equipmentPiece.stats.armorPenetration = .025;
    }
    if (type === ItemsEnum.FendingMace) {
      equipmentPiece = new Equipment(type, EquipmentTypeEnum.Weapon, EquipmentQualityEnum.Rare, WeaponTypeEnum.Hammer);
      equipmentPiece.stats = new CharacterStats(80, 48, 0, 0, 0, 0);
      equipmentPiece.equipmentEffect.trigger = EffectTriggerEnum.OnAutoAttack;
      equipmentPiece.equipmentEffect.targetEffect.push(this.globalService.createStatusEffect(StatusEffectEnum.InstantTrueDamage, 0, 28, true, false, false, "Fending Mace", undefined, undefined, undefined, undefined, false));
    }
    if (type === ItemsEnum.DiamondHammer) {
      equipmentPiece = new Equipment(type, EquipmentTypeEnum.Weapon, EquipmentQualityEnum.Epic, WeaponTypeEnum.Hammer);
      equipmentPiece.stats = new CharacterStats(0, 135, 0, 0, 0, 0);
      equipmentPiece.stats.armorPenetration = .05;
      equipmentPiece.slotCount = 1;
    }

    //bows
    if (type === ItemsEnum.ShortBow) {
      equipmentPiece = new Equipment(type, EquipmentTypeEnum.Weapon, EquipmentQualityEnum.Basic, WeaponTypeEnum.Bow);
      equipmentPiece.stats = new CharacterStats(0, 5, 0, 0, 4, 0);
    }
    if (type === ItemsEnum.LongBow) {
      equipmentPiece = new Equipment(type, EquipmentTypeEnum.Weapon, EquipmentQualityEnum.Uncommon, WeaponTypeEnum.Bow);
      equipmentPiece.stats = new CharacterStats(0, 10, 0, 0, 8, 0);
    }
    if (type === ItemsEnum.Venomstrike) {
      equipmentPiece = new Equipment(type, EquipmentTypeEnum.Weapon, EquipmentQualityEnum.Uncommon, WeaponTypeEnum.Bow);
      equipmentPiece.stats = new CharacterStats(0, 15, 0, 0, 12, 0);
      equipmentPiece.equipmentEffect.trigger = EffectTriggerEnum.ChanceOnAutoAttack;
      equipmentPiece.equipmentEffect.chance = .2;
      equipmentPiece.equipmentEffect.targetEffect.push(this.globalService.createDamageOverTimeEffect(6, 3, 13, "Venomstrike", dotTypeEnum.TrueDamage));
    }
    if (type === ItemsEnum.ElysianOakBow) {
      equipmentPiece = new Equipment(type, EquipmentTypeEnum.Weapon, EquipmentQualityEnum.Rare, WeaponTypeEnum.Bow);
      equipmentPiece.stats = new CharacterStats(0, 20, 0, 0, 16, 0);
      equipmentPiece.stats.criticalMultiplier = .05;
    }
    if (type === ItemsEnum.SpiritBow) {
      equipmentPiece = new Equipment(type, EquipmentTypeEnum.Weapon, EquipmentQualityEnum.Rare, WeaponTypeEnum.Bow);
      equipmentPiece.stats = new CharacterStats(0, 30, 0, 0, 22, 0);
      equipmentPiece.equipmentEffect.trigger = EffectTriggerEnum.AlwaysActive;
      equipmentPiece.equipmentEffect.userEffect.push(this.globalService.createStatusEffect(StatusEffectEnum.Enearth, -1, 1, false, true, false, type.toString()));
    }
    if (type === ItemsEnum.EagleEye) {
      equipmentPiece = new Equipment(type, EquipmentTypeEnum.Weapon, EquipmentQualityEnum.Epic, WeaponTypeEnum.Bow);
      equipmentPiece.stats = new CharacterStats(0, 80, 0, 0, 85, 0);
      equipmentPiece.stats.criticalMultiplier = .15;
      equipmentPiece.slotCount = 1;
    }

    //shields
    if (type === ItemsEnum.IronShield) {
      equipmentPiece = new Equipment(type, EquipmentTypeEnum.Shield, EquipmentQualityEnum.Basic);
      equipmentPiece.stats = new CharacterStats(0, 0, 7, 0, 0, 0);
    }
    if (type === ItemsEnum.BronzeShield) {
      equipmentPiece = new Equipment(type, EquipmentTypeEnum.Shield, EquipmentQualityEnum.Uncommon);
      equipmentPiece.stats = new CharacterStats(0, 0, 14, 0, 0, 0);
    }
    if (type === ItemsEnum.Aegis) {
      equipmentPiece = new Equipment(type, EquipmentTypeEnum.Shield, EquipmentQualityEnum.Rare);
      equipmentPiece.stats = new CharacterStats(0, 0, 15, 0, 0, 0);
      equipmentPiece.equipmentEffect.trigger = EffectTriggerEnum.AlwaysActive;
      equipmentPiece.equipmentEffect.userEffect.push(this.globalService.createStatusEffect(StatusEffectEnum.Thorns, -1, 5, false, true, false, type.toString()));
    }
    if (type === ItemsEnum.MoltenShield) {
      equipmentPiece = new Equipment(type, EquipmentTypeEnum.Shield, EquipmentQualityEnum.Rare);
      equipmentPiece.stats = new CharacterStats(0, 0, 28, 0, 0, 0);
      equipmentPiece.stats.hpRegen += 3;
      equipmentPiece.stats.elementResistance.fire += .05;
    }
    if (type === ItemsEnum.ShieldOfTheHealer) {
      equipmentPiece = new Equipment(type, EquipmentTypeEnum.Shield, EquipmentQualityEnum.Rare);
      equipmentPiece.stats = new CharacterStats(0, 0, 60, 0, 0, 0);
      equipmentPiece.stats.hpRegen += 5;
      equipmentPiece.stats.healingDone += .05;
    }
    if (type === ItemsEnum.ShieldOfTheSea) {
      equipmentPiece = new Equipment(type, EquipmentTypeEnum.Shield, EquipmentQualityEnum.Epic);
      equipmentPiece.stats = new CharacterStats(450, 0, 145, 0, 0, 0);
      equipmentPiece.stats.hpRegen += 10;
      equipmentPiece.equipmentEffect.trigger = EffectTriggerEnum.TriggersEvery;
      equipmentPiece.equipmentEffect.targetEffect.push(this.globalService.createStatusEffect(StatusEffectEnum.InstantTrueDamage, -1, .25, true, false, true, this.dictionaryService.getItemName(type).toString(), 0, false, ElementalTypeEnum.Water, 40));
      equipmentPiece.equipmentEffect.targetEffect[0].dotType = dotTypeEnum.BasedOnAttack;
    }
    if (type === ItemsEnum.SpikedShield) {
      equipmentPiece = new Equipment(type, EquipmentTypeEnum.Shield, EquipmentQualityEnum.Epic);
      equipmentPiece.stats = new CharacterStats(0, 0, 180, 0, 0, 130);
      equipmentPiece.stats.hpRegen += 12;
      equipmentPiece.equipmentEffect.trigger = EffectTriggerEnum.AlwaysActive;
      equipmentPiece.equipmentEffect.userEffect.push(this.globalService.createStatusEffect(StatusEffectEnum.Thorns, -1, 400, false, true, false, type.toString()));
    }

    //armor
    if (type === ItemsEnum.LinenArmor) {
      equipmentPiece = new Equipment(type, EquipmentTypeEnum.Armor, EquipmentQualityEnum.Basic);
      equipmentPiece.stats = new CharacterStats(20, 0, 2, 0, 0, 0);
    }
    if (type === ItemsEnum.IronArmor) {
      equipmentPiece = new Equipment(type, EquipmentTypeEnum.Armor, EquipmentQualityEnum.Basic);
      equipmentPiece.stats = new CharacterStats(40, 0, 3, 0, 0, 0);
    }
    if (type === ItemsEnum.BronzeArmor) {
      equipmentPiece = new Equipment(type, EquipmentTypeEnum.Armor, EquipmentQualityEnum.Uncommon);
      equipmentPiece.stats = new CharacterStats(80, 0, 5, 0, 0, 0);
    }
    if (type === ItemsEnum.FortifiedBronzeArmor) {
      equipmentPiece = new Equipment(type, EquipmentTypeEnum.Armor, EquipmentQualityEnum.Uncommon);
      equipmentPiece.stats = new CharacterStats(120, 0, 10, 0, 0, 0);
    }
    if (type === ItemsEnum.SteelArmor) {
      equipmentPiece = new Equipment(type, EquipmentTypeEnum.Armor, EquipmentQualityEnum.Rare);
      equipmentPiece.stats = new CharacterStats(240, 0, 25, 0, 0, 10);
    }
    if (type === ItemsEnum.MoltenArmor) {
      equipmentPiece = new Equipment(type, EquipmentTypeEnum.Armor, EquipmentQualityEnum.Rare);
      equipmentPiece.stats = new CharacterStats(300, 0, 20, 10, 0, 0);
      equipmentPiece.stats.elementResistance.fire += .05;
    }
    if (type === ItemsEnum.HardenedLeatherArmor) {
      equipmentPiece = new Equipment(type, EquipmentTypeEnum.Armor, EquipmentQualityEnum.Rare);
      equipmentPiece.stats = new CharacterStats(450, 0, 100, 25, 0, 0);
    }
    if (type === ItemsEnum.BearskinArmor) {
      equipmentPiece = new Equipment(type, EquipmentTypeEnum.Armor, EquipmentQualityEnum.Rare);
      equipmentPiece.stats = new CharacterStats(600, 0, 75, 65, 0, 0);
      equipmentPiece.equipmentEffect.trigger = EffectTriggerEnum.ChanceOnAutoAttack;
      equipmentPiece.equipmentEffect.chance = .25;
      equipmentPiece.equipmentEffect.userEffect.push(this.globalService.createStatusEffect(StatusEffectEnum.AgilityUp, 10, 1.25, false, true, false));
    }
    if (type === ItemsEnum.BoarskinArmor) {
      equipmentPiece = new Equipment(type, EquipmentTypeEnum.Armor, EquipmentQualityEnum.Rare);
      equipmentPiece.stats = new CharacterStats(600, 0, 135, 0, 0, 0);
      equipmentPiece.equipmentEffect.trigger = EffectTriggerEnum.AlwaysActive;
      equipmentPiece.equipmentEffect.userEffect.push(this.globalService.createStatusEffect(StatusEffectEnum.ReduceDirectDamage, -1, 20, false, true, false));
    }
    if (type === ItemsEnum.FeatheredTunic) {
      equipmentPiece = new Equipment(type, EquipmentTypeEnum.Armor, EquipmentQualityEnum.Epic);
      equipmentPiece.stats = new CharacterStats(950, 0, 100, 60, 0, 75);
      equipmentPiece.stats.elementResistance.air = .1;
      equipmentPiece.slotCount = 2;
    }

    //necklace
    if (type === ItemsEnum.ForgottenLocket) {
      equipmentPiece = new Equipment(type, EquipmentTypeEnum.Necklace, EquipmentQualityEnum.Rare);
      equipmentPiece.stats = new CharacterStats(0, 4, 4, 4, 4, 4);
    }
    if (type === ItemsEnum.PendantOfFortune) {
      equipmentPiece = new Equipment(type, EquipmentTypeEnum.Necklace, EquipmentQualityEnum.Rare);
      equipmentPiece.stats = new CharacterStats(0, 0, 0, 0, 25, 0);
      equipmentPiece.stats.criticalMultiplier = .1;
    }
    if (type === ItemsEnum.PendantOfPower) {
      equipmentPiece = new Equipment(type, EquipmentTypeEnum.Necklace, EquipmentQualityEnum.Rare);
      equipmentPiece.stats = new CharacterStats(0, 25, 0, 0, 0, 0);
      equipmentPiece.stats.armorPenetration = .05;
    }
    if (type === ItemsEnum.PendantOfSpeed) {
      equipmentPiece = new Equipment(type, EquipmentTypeEnum.Necklace, EquipmentQualityEnum.Rare);
      equipmentPiece.stats = new CharacterStats(0, 0, 0, 25, 0, 0);
      equipmentPiece.stats.overdriveGain = .1;
    }
    if (type === ItemsEnum.GemmedNecklace) {
      equipmentPiece = new Equipment(type, EquipmentTypeEnum.Necklace, EquipmentQualityEnum.Rare);
      equipmentPiece.stats = new CharacterStats(0, 0, 0, 0, 0, 25);
      equipmentPiece.stats.elementResistance.earth += .1;
    }
    if (type === ItemsEnum.SharkstoothNecklace) {
      equipmentPiece = new Equipment(type, EquipmentTypeEnum.Necklace, EquipmentQualityEnum.Epic);
      equipmentPiece.stats = new CharacterStats(0, 70, 0, 80, 0, 0);
      equipmentPiece.stats.autoAttackCooldownReduction = .05;
      equipmentPiece.stats.overdriveGain = .1;
    }
    if (type === ItemsEnum.SharkstoothPendant) {
      equipmentPiece = new Equipment(type, EquipmentTypeEnum.Necklace, EquipmentQualityEnum.Epic);
      equipmentPiece.stats = new CharacterStats(0, 70, 0, 0, 80, 0);
      equipmentPiece.stats.abilityCooldownReduction = .05;
      equipmentPiece.stats.armorPenetration = .05;
    }
    if (type === ItemsEnum.BlazingSunPendant) {
      equipmentPiece = new Equipment(type, EquipmentTypeEnum.Necklace, EquipmentQualityEnum.Special);
      equipmentPiece.stats = new CharacterStats(0, 0, 0, 0, 0, 0);
      equipmentPiece.stats.autoAttackCooldownReduction += .1;
      equipmentPiece.stats.abilityCooldownReduction += .1;
      equipmentPiece.stats.overdriveGain += .2;
      equipmentPiece.stats.criticalMultiplier += .25;
      equipmentPiece.stats.tickFrequency += .05;
    }
    if (type === ItemsEnum.DarkMoonPendant) {
      equipmentPiece = new Equipment(type, EquipmentTypeEnum.Necklace, EquipmentQualityEnum.Special);
      equipmentPiece.stats = new CharacterStats(0, 0, 0, 0, 0, 0);
      equipmentPiece.stats.hpRegen += 30;
      equipmentPiece.stats.healingDone += .15;
      equipmentPiece.stats.healingReceived += .15;
      equipmentPiece.stats.abilityCooldownReduction += .1;
      equipmentPiece.stats.thorns += .15;
    }

    //ring
    if (type === ItemsEnum.MoltenRing) {
      equipmentPiece = new Equipment(type, EquipmentTypeEnum.Ring, EquipmentQualityEnum.Rare);
      equipmentPiece.stats = new CharacterStats(0, 0, 0, 0, 0, 20);
      equipmentPiece.stats.elementResistance.fire += .10;
    }
    //+% to elemental damage, absorb certain amount of elemental damage
    if (type === ItemsEnum.FracturedRubyRing) {
      equipmentPiece = new Equipment(type, EquipmentTypeEnum.Ring, EquipmentQualityEnum.Rare);
      equipmentPiece.stats = new CharacterStats(0, 0, 0, 0, 20, 0);
      equipmentPiece.stats.elementIncrease.fire += .25;
      equipmentPiece.equipmentEffect.trigger = EffectTriggerEnum.TriggersEvery;
      equipmentPiece.equipmentEffect.userEffect.push(this.globalService.createStatusEffect(StatusEffectEnum.AbsorbElementalDamage, 75, 1000, false, true, false, type.toString(), 0, false, ElementalTypeEnum.Fire, 75));
    }
    if (type === ItemsEnum.FracturedAmethystRing) {
      equipmentPiece = new Equipment(type, EquipmentTypeEnum.Ring, EquipmentQualityEnum.Rare);
      equipmentPiece.stats = new CharacterStats(0, 0, 0, 0, 0, 20);
      equipmentPiece.stats.elementIncrease.air += .25;
      equipmentPiece.equipmentEffect.trigger = EffectTriggerEnum.TriggersEvery;
      equipmentPiece.equipmentEffect.userEffect.push(this.globalService.createStatusEffect(StatusEffectEnum.AbsorbElementalDamage, 75, 1000, false, true, false, type.toString(), 0, false, ElementalTypeEnum.Air, 75));
    }
    if (type === ItemsEnum.FracturedAquamarineRing) {
      equipmentPiece = new Equipment(type, EquipmentTypeEnum.Ring, EquipmentQualityEnum.Rare);
      equipmentPiece.stats = new CharacterStats(0, 0, 0, 20, 0, 0);
      equipmentPiece.stats.elementIncrease.water += .25;
      equipmentPiece.equipmentEffect.trigger = EffectTriggerEnum.TriggersEvery;
      equipmentPiece.equipmentEffect.userEffect.push(this.globalService.createStatusEffect(StatusEffectEnum.AbsorbElementalDamage, 75, 1000, false, true, false, type.toString(), 0, false, ElementalTypeEnum.Water, 75));
    }
    if (type === ItemsEnum.FracturedEmeraldRing) {
      equipmentPiece = new Equipment(type, EquipmentTypeEnum.Ring, EquipmentQualityEnum.Rare);
      equipmentPiece.stats = new CharacterStats(0, 0, 20, 0, 0, 0);
      equipmentPiece.stats.elementIncrease.earth += .25;
      equipmentPiece.equipmentEffect.trigger = EffectTriggerEnum.TriggersEvery;
      equipmentPiece.equipmentEffect.userEffect.push(this.globalService.createStatusEffect(StatusEffectEnum.AbsorbElementalDamage, 75, 1000, false, true, false, type.toString(), 0, false, ElementalTypeEnum.Earth, 75));
    }
    if (type === ItemsEnum.FracturedOpalRing) {
      equipmentPiece = new Equipment(type, EquipmentTypeEnum.Ring, EquipmentQualityEnum.Rare);
      equipmentPiece.stats = new CharacterStats(0, 20, 0, 0, 0, 0);
      equipmentPiece.stats.elementIncrease.lightning += .25;
      equipmentPiece.equipmentEffect.trigger = EffectTriggerEnum.TriggersEvery;
      equipmentPiece.equipmentEffect.userEffect.push(this.globalService.createStatusEffect(StatusEffectEnum.AbsorbElementalDamage, 75, 1000, false, true, false, type.toString(), 0, false, ElementalTypeEnum.Lightning, 75));
    }
    if (type === ItemsEnum.FracturedTopazRing) {
      equipmentPiece = new Equipment(type, EquipmentTypeEnum.Ring, EquipmentQualityEnum.Rare);
      equipmentPiece.stats = new CharacterStats(100, 0, 0, 0, 0, 0);
      equipmentPiece.stats.elementIncrease.holy += .25;
      equipmentPiece.equipmentEffect.trigger = EffectTriggerEnum.TriggersEvery;
      equipmentPiece.equipmentEffect.userEffect.push(this.globalService.createStatusEffect(StatusEffectEnum.AbsorbElementalDamage, 75, 1000, false, true, false, type.toString(), 0, false, ElementalTypeEnum.Holy, 75));
    }
    if (type === ItemsEnum.BedazzledRing) {
      equipmentPiece = new Equipment(type, EquipmentTypeEnum.Ring, EquipmentQualityEnum.Rare);
      equipmentPiece.stats = new CharacterStats(150, 0, 0, 0, 25, 0);
      equipmentPiece.equipmentEffect.trigger = EffectTriggerEnum.AlwaysActive;
      equipmentPiece.equipmentEffect.userEffect.push(this.globalService.createStatusEffect(StatusEffectEnum.BattleItemEffectUp, -1, 1.5, false, true, false, type.toString()));
    }
    if (type === ItemsEnum.RingOfNightmares) {
      equipmentPiece = new Equipment(type, EquipmentTypeEnum.Ring, EquipmentQualityEnum.Epic);
      equipmentPiece.stats = new CharacterStats(0, 35, 0, 0, 0, 70);
      equipmentPiece.equipmentEffect.trigger = EffectTriggerEnum.ChanceOnAutoAttack;
      equipmentPiece.equipmentEffect.chance = .15;
      equipmentPiece.equipmentEffect.targetEffect.push(this.globalService.createStatusEffect(StatusEffectEnum.RandomPrimaryStatDownExcludeHp, 20, .8, true, false, false));
      equipmentPiece.slotCount = 2;
    }
    if (type === ItemsEnum.ScalyRing) {
      equipmentPiece = new Equipment(type, EquipmentTypeEnum.Ring, EquipmentQualityEnum.Epic);
      equipmentPiece.stats = new CharacterStats(0, 0, 75, 0, 0, 85);
      equipmentPiece.equipmentEffect.trigger = EffectTriggerEnum.AlwaysActive;
      equipmentPiece.equipmentEffect.userEffect.push(this.globalService.createStatusEffect(StatusEffectEnum.Thorns, -1, 300, false, true, false, type.toString()));
    }
    if (type === ItemsEnum.QuadRing) {
      equipmentPiece = new Equipment(type, EquipmentTypeEnum.Ring, EquipmentQualityEnum.Epic);
      equipmentPiece.stats = new CharacterStats(444, 44, 44, 44, 44, 44);
      equipmentPiece.slotCount = 4;
    }

    return equipmentPiece;
  }

  getEquipmentQualityClass(quality?: EquipmentQualityEnum) {
    var classText = "";
    if (quality === undefined)
      return classText;

    if (quality === EquipmentQualityEnum.Basic)
      classText = "basicEquipment";
    if (quality === EquipmentQualityEnum.Uncommon)
      classText = "uncommonEquipment";
    if (quality === EquipmentQualityEnum.Rare)
      classText = "rareEquipment";
    if (quality === EquipmentQualityEnum.Epic)
      classText = "epicEquipment";
    if (quality === EquipmentQualityEnum.Special)
      classText = "specialEquipment";
    if (quality === EquipmentQualityEnum.Extraordinary)
      classText = "extraordinaryEquipment";
    if (quality === EquipmentQualityEnum.Unique)
      classText = "uniqueEquipment";

    return classText;
  }

  getItemTextClass(item: ResourceValue) {
    if (this.getItemTypeFromItemEnum(item.item) === ItemTypeEnum.Equipment)
      return this.getEquipmentQualityClass(this.getEquipmentPieceByItemType(item.item)?.quality);
    else
      return "";
  }

  getItemSellPrice(item: ItemsEnum) {
    var sellPrice = 1;
    var originalPrice = this.shopItemGeneratorService.generateShopItem(item, SubZoneEnum.None);

    var coinCost = originalPrice.purchasePrice.find(item => item.item === ItemsEnum.Coin);

    if (coinCost !== undefined)
      sellPrice = coinCost.amount / 4;

    return sellPrice;
  }

  getAutoAttackDescription(character: Character) {
    var description = "";
    var secondsPerAutoAttack = this.utilityService.roundTo(this.globalService.getAutoAttackTime(character), 3);//.replace(/[.,]00$/, "");    
    var totalAutoAttackCount = this.getTotalAutoAttackCount(character);

    description = "Deal <strong>" + (character.battleInfo.autoAttackModifier * 100) + "% of Attack</strong> damage to a single target " + totalAutoAttackCount.toFixed(3) + (totalAutoAttackCount === 1 ? " time" : " times") + " every <strong>" + secondsPerAutoAttack + "</strong> seconds.";

    return description;
  }

  isOverdriveDiscovered(type: OverdriveNameEnum, character?: Character) {
    if (character !== undefined && character.unlockedOverdrives.some(item => item === type)) {
      return true;
    }

    return false;
  }


  getOverdriveName(type: OverdriveNameEnum, character?: Character) {
    var name = "";

    if (character !== undefined && !character.unlockedOverdrives.some(item => item === type)) {
      return "???";
    }

    if (type === OverdriveNameEnum.Fervor)
      name = "Fervor";
    if (type === OverdriveNameEnum.Smash)
      name = "Smash";
    if (type === OverdriveNameEnum.Protection)
      name = "Protection";
    if (type === OverdriveNameEnum.Nature)
      name = "Nature";


    return name;
  }

  getOverdriveDescription(type: OverdriveNameEnum) {
    var description = "";

    if (type === OverdriveNameEnum.Fervor) {
      description = "For 20 seconds, your auto attack cooldown is reduced by 33%.";
    }
    if (type === OverdriveNameEnum.Smash) {
      description = "For 20 seconds, your auto attacks deal 25% increased damage.";
    }
    if (type === OverdriveNameEnum.Protection) {
      description = "After 20 seconds, you recover 50% of the damage you took while this effect was active.";
    }
    if (type === OverdriveNameEnum.Nature) {
      description = "For 20 seconds, all non elemental attacks take on the element of the last elemental attack you used while this effect is active.";
    }

    return description;
  }

  getOverdriveUnlockCondition(type: OverdriveNameEnum, character: Character) {
    var description = "???";

    if (type === OverdriveNameEnum.Fervor) {
      description = "Reach character level 20. <i>(" + character.level + ")</i>";
    }
    if (type === OverdriveNameEnum.Protection) {
      description = "Take " + this.utilityService.overdriveDamageNeededToUnlockProtection.toLocaleString() + " damage. <i>(" + character.trackedStats.damageTaken.toLocaleString() + ")</i>";
    }
    if (type === OverdriveNameEnum.Nature) {
      description = "Deal " + this.utilityService.overdriveAttacksNeededToUnlockNature.toLocaleString() + " elemental damage. <i>(" + character.trackedStats.elementalDamageDealt.toLocaleString() + ")</i>";
    }

    return description;
  }

  setOverdrive(character: Character, type: OverdriveNameEnum) {
    character.overdriveInfo = this.getOverdriveInfo(type);
  }

  getOverdriveInfo(type: OverdriveNameEnum) {
    var overdriveInfo = new OverdriveInfo();

    overdriveInfo.selectedOverdrive = type;

    if (type === OverdriveNameEnum.Fervor) {
      overdriveInfo.gaugeTotal = 120;
      overdriveInfo.activeLength = 20;
    }
    if (type === OverdriveNameEnum.Smash) {
      overdriveInfo.gaugeTotal = 80;
      overdriveInfo.activeLength = 20;
    }
    if (type === OverdriveNameEnum.Nature) {
      overdriveInfo.gaugeTotal = 150;
      overdriveInfo.activeLength = 20;
    }
    if (type === OverdriveNameEnum.Protection) {
      overdriveInfo.gaugeTotal = 150;
      overdriveInfo.activeLength = 20;
    }

    return overdriveInfo;
  }

  getOverdriveMultiplier(character: Character) {
    return 3;
  }

  getAbilityEffectiveAmount(character: Character, ability: Ability) {
    return ability.effectiveness * this.getAdjustedAttack(character);
  }

  getCharacterAbilityDescription(abilityName: string, character: Character, ability?: Ability) {
    var abilityDescription = "";
    var effectivenessPercent = 0;
    var effectiveAmount = 0;
    var effectiveAmountPercent = 0; //for nondamage
    var abilityCount = 0;
    var secondaryEffectivenessPercent = 0;
    var thresholdAmountPercent = 0;
    var relatedUserGainStatusEffectDuration = 0;
    var relatedUserGainStatusEffectEffectiveness = 0;
    var relatedUserGainStatusEffectEffectivenessPercent = 0;
    var relatedTargetGainStatusEffectDuration = 0;
    var relatedTargetGainStatusEffectEffectiveness = 0;
    var relatedTargetGainStatusEffectEffectivenessPercent = 0;
    var relatedTargetGainStatusEffectTickFrequency = 0;
    var cooldown = 0;

    if (ability !== undefined) {
      effectivenessPercent = this.utilityService.roundTo(ability.effectiveness * 100, 2);
      secondaryEffectivenessPercent = ability.secondaryEffectiveness * 100;
      effectiveAmount = Math.round(this.getAbilityEffectiveAmount(character, ability));
      effectiveAmountPercent = this.utilityService.roundTo((ability.effectiveness - 1) * 100, 2);
      thresholdAmountPercent = Math.round((ability.threshold) * 100);
      abilityCount = ability.maxCount;
      cooldown = this.utilityService.roundTo(ability.cooldown * character.battleStats.abilityCooldownReduction, 3);

      var relatedUserGainStatusEffect = ability?.userEffect[0];

      if (relatedUserGainStatusEffect !== undefined) {
        relatedUserGainStatusEffectDuration = Math.round(relatedUserGainStatusEffect.duration);
        relatedUserGainStatusEffectEffectiveness = relatedUserGainStatusEffect.effectiveness;
        if (relatedUserGainStatusEffectEffectiveness < 1)
          relatedUserGainStatusEffectEffectivenessPercent = this.utilityService.roundTo((relatedUserGainStatusEffectEffectiveness) * 100, 2);
        else
          relatedUserGainStatusEffectEffectivenessPercent = this.utilityService.roundTo((relatedUserGainStatusEffectEffectiveness - 1) * 100, 2);
      }

      var relatedTargetGainStatusEffect = ability?.targetEffect[0];

      if (relatedTargetGainStatusEffect !== undefined) {
        relatedTargetGainStatusEffectDuration = Math.round(relatedTargetGainStatusEffect.duration);
        relatedTargetGainStatusEffectEffectiveness = relatedTargetGainStatusEffect.effectiveness;
        if (relatedTargetGainStatusEffectEffectiveness < 1)
          relatedTargetGainStatusEffectEffectivenessPercent = this.utilityService.roundTo((relatedTargetGainStatusEffectEffectiveness) * 100, 2);
        else
          relatedTargetGainStatusEffectEffectivenessPercent = this.utilityService.roundTo((relatedTargetGainStatusEffectEffectiveness - 1) * 100, 2);
        relatedTargetGainStatusEffectTickFrequency = relatedTargetGainStatusEffect.tickFrequency;
      }
    }

    //Adventurer
    if (abilityName === "Quick Hit")
      abilityDescription = "Deal <strong>" + (effectivenessPercent) + "% of Attack</strong> damage and increase Agility by <strong>" + relatedUserGainStatusEffectEffectivenessPercent + "%</strong> for <strong>" + relatedUserGainStatusEffectDuration + "</strong> seconds. " + cooldown + " second cooldown.";
    if (abilityName === "Barrage")
      abilityDescription = "Every <strong>" + this.utilityService.ordinalSuffixOf(abilityCount) + "</strong> auto attack hits all additional enemies for <strong>" + effectivenessPercent + "%</strong> of the damage dealt. Passive.";
    if (abilityName === "Thousand Cuts")
      abilityDescription = "For <strong>" + relatedUserGainStatusEffectDuration + "</strong> seconds, deal an additional <strong>" + relatedUserGainStatusEffectEffectivenessPercent + "%</strong> damage after each auto attack or ability. " + cooldown + " second cooldown.";

    //Archer
    if (abilityName === "Sure Shot")
      abilityDescription = "Deal <strong>" + (effectivenessPercent) + "% of Attack</strong> damage. Apply a damage over time effect that deals an additional <strong>" + relatedTargetGainStatusEffectEffectivenessPercent + "%</strong> of the damage dealt every " + relatedTargetGainStatusEffectTickFrequency + " seconds for <strong>" + relatedTargetGainStatusEffectDuration + "</strong> seconds. " + cooldown + " second cooldown.";
    if (abilityName === "Mark")
      abilityDescription = "When an enemy has a status effect that you have applied, they also have Mark. Mark increases damage taken by <strong>" + relatedTargetGainStatusEffectEffectivenessPercent + "%</strong>. Passive.";
    if (abilityName === "Pinning Shot")
      abilityDescription = "Deal <strong>" + (effectivenessPercent) + "% of Attack</strong> damage. Stun the target for <strong>" + relatedTargetGainStatusEffectDuration + "</strong> seconds. " + cooldown + " second cooldown.";

    //Warrior
    if (abilityName === "Battle Cry")
      abilityDescription = "Draw a target's focus for the next <strong>" + relatedTargetGainStatusEffectDuration + "</strong> seconds, forcing all attacks to target you. " + cooldown + " second cooldown.";
    if (abilityName === "Last Stand")
      abilityDescription = "When HP drops below <strong>" + thresholdAmountPercent + "%</strong>, increase Defense by <strong>" + effectiveAmountPercent + "%</strong>. Passive.";
    if (abilityName === "Shield Slam")
      abilityDescription = "Increase Attack by <strong>" + (secondaryEffectivenessPercent) + "% of Defense</strong> then deal <strong>" + (effectivenessPercent) + "% of Attack</strong> damage. " + cooldown + " second cooldown.";

    //Priest
    if (abilityName === "Heal")
      abilityDescription = "Heal a party member for <strong>" + (effectivenessPercent) + "% of Attack</strong> HP. Targets the party member with the lowest HP %. " + cooldown + " second cooldown.";
    if (abilityName === "Faith")
      abilityDescription = "Altar effectiveness is increased by <strong>" + effectiveAmountPercent + "%</strong>. Passive.";
    //abilityDescription = "God abilities for all characters are more effective by <strong>" + effectiveAmountPercent + "%</strong>. Passive.";
    if (abilityName === "Pray")
      abilityDescription = "Grant all characters a <strong>" + (effectivenessPercent) + "% of Attack</strong> HP Shield, up to <strong>" + thresholdAmountPercent + "%</strong> of their total health. " + cooldown + " second cooldown.";

    return this.utilityService.getSanitizedHtml(abilityDescription);
  }

  getGodAbilityDescription(abilityName: string, character: Character, ability?: Ability) {
    var abilityDescription = "";
    var effectivenessPercent = 0;
    var effectiveAmount = 0;
    var effectiveAmountPercent = 0; //for nondamage
    var secondaryEffectiveAmount = 0;
    var secondaryEffectiveAmountPercent = 0; //for nondamage
    var abilityCount = 0;
    var thresholdAmountPercent = 0;
    var relatedUserGainStatusEffectDuration = 0;
    var relatedUserGainStatusEffectEffectiveness = 0;
    var relatedUserGainStatusEffectEffectivenessPercent = 0;
    var relatedUserGainStatusEffectTickFrequency = 0;
    var relatedUserGainStatusEffectThreshold = 0;
    var relatedTargetGainStatusEffectDuration = 0;
    var relatedTargetGainStatusEffectEffectiveness = 0;
    var relatedTargetGainStatusEffectEffectivenessPercent = 0;
    var relatedTargetGainStatusEffectTickFrequency = 0;
    var cooldown = 0;
    var maxCountTimesEffectivenessPercent = 0;

    if (ability !== undefined) {
      effectivenessPercent = this.utilityService.genericRound(ability.effectiveness * 100);
      effectiveAmount = this.utilityService.genericRound(this.getAbilityEffectiveAmount(character, ability));
      effectiveAmountPercent = this.utilityService.genericRound((ability.effectiveness - 1) * 100);
      secondaryEffectiveAmount = ability.secondaryEffectiveness;
      secondaryEffectiveAmountPercent = this.utilityService.genericRound((secondaryEffectiveAmount - 1) * 100);
      thresholdAmountPercent = this.utilityService.genericRound((ability.threshold) * 100);
      abilityCount = ability.maxCount;
      cooldown = this.utilityService.roundTo(this.globalService.getAbilityCooldown(ability, character), 2);
      maxCountTimesEffectivenessPercent = ability.maxCount * effectivenessPercent;

      var relatedUserGainStatusEffect = ability?.userEffect[0];

      if (relatedUserGainStatusEffect !== undefined) {
        relatedUserGainStatusEffectDuration = this.utilityService.genericRound(relatedUserGainStatusEffect.duration);
        relatedUserGainStatusEffectThreshold = relatedUserGainStatusEffect.threshold;
        relatedUserGainStatusEffectEffectiveness = relatedUserGainStatusEffect.effectiveness;
        if (relatedUserGainStatusEffectEffectiveness < 1)
          relatedUserGainStatusEffectEffectivenessPercent = this.utilityService.roundTo((relatedUserGainStatusEffectEffectiveness) * 100, 2);
        else
          relatedUserGainStatusEffectEffectivenessPercent = this.utilityService.roundTo((relatedUserGainStatusEffectEffectiveness - 1) * 100, 2);
        relatedUserGainStatusEffectTickFrequency = relatedUserGainStatusEffect.tickFrequency;
      }

      var relatedTargetGainStatusEffect = ability?.targetEffect[0];

      if (relatedTargetGainStatusEffect !== undefined) {
        relatedTargetGainStatusEffectDuration = this.utilityService.genericRound(relatedTargetGainStatusEffect.duration);
        relatedTargetGainStatusEffectEffectiveness = relatedTargetGainStatusEffect.effectiveness;
        if (relatedTargetGainStatusEffectEffectiveness < 1)
          relatedTargetGainStatusEffectEffectivenessPercent = this.utilityService.genericRound((relatedTargetGainStatusEffectEffectiveness) * 100);
        else
          relatedTargetGainStatusEffectEffectivenessPercent = this.utilityService.roundTo((relatedTargetGainStatusEffectEffectiveness - 1) * 100, this.utilityService.genericRoundTo);
        relatedTargetGainStatusEffectTickFrequency = relatedTargetGainStatusEffect.tickFrequency;
      }
    }

    //Athena
    if (abilityName === "Second Wind")
      abilityDescription = "After using an ability, your next auto attack heals for <strong>" + relatedUserGainStatusEffectEffectiveness + "</strong> HP. Passive.";
    if (abilityName === "Divine Strike")
      abilityDescription = "Deal <strong>" + (effectivenessPercent) + "% of Attack</strong> <span class='bold'>Holy</span> damage. Heal for <strong>" + relatedUserGainStatusEffectEffectivenessPercent + "%</strong> of the damage dealt. " + cooldown + " second cooldown.";
    if (abilityName === "Heavenly Shield")
      abilityDescription = "Reduce damage taken by <strong>" + (100 - relatedUserGainStatusEffectEffectivenessPercent) + "%</strong> for <strong>" + relatedUserGainStatusEffectDuration + "</strong> seconds. " + cooldown + " second cooldown.";
    if (abilityName === "Blinding Light")
      abilityDescription = "Deal <strong>" + (effectivenessPercent) + "% of Attack</strong> <span class='bold'>Holy</span> damage to all targets and apply a <strong>" + relatedTargetGainStatusEffectEffectivenessPercent + "%</strong> Blind for <strong>" + relatedTargetGainStatusEffectDuration + "</strong> seconds. " + cooldown + " second cooldown.";

    //Artemis
    if (abilityName === "True Shot")
      abilityDescription = "If your target has a negative status effect, increase critical strike chance by <strong>" + effectiveAmountPercent + "%</strong> when attacking. Passive.";
    if (abilityName === "Wounding Arrow")
      abilityDescription = "Deal <strong>" + (effectivenessPercent) + "% of Attack</strong> damage to a target and reduce their attack by <strong>" + (100 - relatedTargetGainStatusEffectEffectivenessPercent) + "%</strong> for <strong>" + relatedTargetGainStatusEffectDuration + "</strong> seconds. " + cooldown + " second cooldown.";
    if (abilityName === "Paralyzing Volley")
      abilityDescription = "Deal <strong>" + (effectivenessPercent) + "% of Attack</strong> damage to all targets and paralyze them for <strong>" + relatedTargetGainStatusEffectDuration + "</strong> seconds. " + cooldown + " second cooldown.";
    if (abilityName === "Expose Weakness")
      abilityDescription = "Deal <strong>" + (effectivenessPercent) + "% of Attack</strong> damage. Any negative status effects on the target have their duration increased by <strong>" + relatedTargetGainStatusEffectEffectivenessPercent + "%</strong> of the original duration. " + cooldown + " second cooldown.";

    //Apollo
    if (abilityName === "Staccato")
      abilityDescription = "Increase the party's agility by <strong>" + relatedUserGainStatusEffectEffectivenessPercent + "%</strong> for <strong>" + relatedUserGainStatusEffectDuration + "</strong> seconds. If Ostinato triggers while Staccato is active, each party member performs a free auto attack. " + cooldown + " second cooldown.";
    if (abilityName === "Fortissimo")
      abilityDescription = "Increase the party's attack by <strong>" + relatedUserGainStatusEffectEffectivenessPercent + "%</strong> for <strong>" + relatedUserGainStatusEffectDuration + "</strong> seconds. If Ostinato triggers while Fortissimo is active, reduce your other cooldowns by <strong>" + secondaryEffectiveAmountPercent + "%</strong>. " + cooldown + " second cooldown.";
    if (abilityName === "Coda")
      abilityDescription = "Increase the party's luck by <strong>" + relatedUserGainStatusEffectEffectivenessPercent + "%</strong> for <strong>" + relatedUserGainStatusEffectDuration + "</strong> seconds. If Ostinato triggers while Coda is active, cleanse a random debuff from a party member. " + cooldown + " second cooldown.";
    if (abilityName === "Ostinato")
      abilityDescription = "Every " + cooldown + " seconds, heal a party member for <strong>" + (effectivenessPercent) + "% of Attack</strong> HP. Targets the party member with the lowest HP %.";

    //Hermes
    if (abilityName === "Nimble Strike")
      abilityDescription = "Deal <strong>" + (effectivenessPercent) + "% of Attack</strong> damage. " + cooldown + " second cooldown.";
    if (abilityName === "Take Flight")
      abilityDescription = "Increase your Attack and Agility by <strong>" + relatedUserGainStatusEffectEffectivenessPercent + "%</strong> for <strong>" + relatedUserGainStatusEffectDuration + "</strong> seconds. " + cooldown + " second cooldown.";
    if (abilityName === "Special Delivery")
      abilityDescription = "Immediately perform <strong>" + ability?.userEffect.length + "</strong> auto attacks. Their damage is increased by <strong>" + relatedUserGainStatusEffectEffectivenessPercent + "%</strong>. " + cooldown + " second cooldown.";
    if (abilityName === "Quicken")
      abilityDescription = "Every auto attack reduces your cooldowns by <strong>" + ability?.effectiveness.toFixed(3) + "</strong> seconds. Passive.";

    //Zeus
    if (abilityName === "Overload")
      abilityDescription = "Surge effect increases damage dealt by next ability by " + effectiveAmount + "%. Passive";
    if (abilityName === "Lightning Bolt")
      abilityDescription = "Deal <strong>" + (effectivenessPercent) + "% of Attack</strong> <span class='bold'>Lightning</span> damage. Grants user Surge. " + cooldown + " second cooldown.";
    if (abilityName === "Chain Lightning")
      abilityDescription = "Deal <strong>" + (effectivenessPercent) + "% of Attack</strong> <span class='bold'>Lightning</span> damage. Deal 25% less damage to another random target. Repeat until all targets have been hit. " + cooldown + " second cooldown.";
    if (abilityName === "Judgment")
      abilityDescription = "Deal <strong>" + (effectivenessPercent) + "% of Attack</strong> <span class='bold'>Lightning</span> damage. " + cooldown + " second cooldown.";

    //Hades
    if (abilityName === "Hellfire")
      abilityDescription = "Deal <strong>" + (effectivenessPercent) + "% of Attack</strong> Fire damage to all targets. " + cooldown + " second cooldown.";
    if (abilityName === "Earthquake")
      abilityDescription = "Deal <strong>" + (effectivenessPercent) + "% of Attack</strong> Earth damage to all targets. " + cooldown + " second cooldown.";
    if (abilityName === "Natural Disaster")
      abilityDescription = "Deal <strong>" + (effectivenessPercent) + "% of Attack</strong> damage to all targets. Repeat this for every element you attacked with since the last time it was used. " + cooldown + " second cooldown.";
    if (abilityName === "Lord of the Underworld")
      abilityDescription = "Give the user Lord of the Underworld, increasing Luck and Attack by <strong>" + relatedUserGainStatusEffectEffectivenessPercent + "%</strong> for <strong>" + relatedUserGainStatusEffectDuration + "</strong> seconds when dealing the killing blow on an enemy. This effect stacks up to " + abilityCount + " times.";

    //Ares
    if (abilityName === "Rupture")
      abilityDescription = "Apply a damage over time effect to a target that deals <strong>" + this.utilityService.genericRound((relatedTargetGainStatusEffectEffectiveness) * 100) + "% of Attack</strong> damage every " + relatedTargetGainStatusEffectTickFrequency + " seconds for <strong>" + relatedTargetGainStatusEffectDuration + "</strong> seconds. " + cooldown + " second cooldown.";
    if (abilityName === "Onslaught")
      abilityDescription = "After your next ability, apply a damage over time effect to the targets that deals an additional <strong>" + this.utilityService.genericRound((relatedTargetGainStatusEffectEffectiveness) * 100) + "%</strong> of the damage dealt every " + relatedTargetGainStatusEffectTickFrequency + " seconds for <strong>" + relatedTargetGainStatusEffectDuration + "</strong> seconds. " + cooldown + " second cooldown.";
    if (abilityName === "Revel in Blood")
      abilityDescription = "Reduce your own current HP by 10%. Apply a damage over time effect to all targets that deals <strong>" + (relatedTargetGainStatusEffectEffectivenessPercent) + "% of HP Loss</strong> damage every " + relatedTargetGainStatusEffectTickFrequency + " seconds for <strong>" + relatedTargetGainStatusEffectDuration + "</strong> seconds. " + cooldown + " second cooldown.";
    if (abilityName === "Bloodlust")
      abilityDescription = "Increase all damage over time effectiveness by <strong>" + effectivenessPercent + "%</strong> per active damage over time effect amongst all enemies, up to <strong>" + ability?.maxCount + "</strong> effects for a total of <strong>" + (maxCountTimesEffectivenessPercent) + "%</strong> increase.";

    //Dionysus
    if (abilityName === "Revelry")
      abilityDescription = "Grant a random party member a <strong>" + (this.utilityService.genericRound(relatedUserGainStatusEffectEffectiveness * 100)) + "% of Attack</strong> HP Shield, up to <strong>" + Math.round(relatedUserGainStatusEffectThreshold * 100) + "%</strong> of their total health. Increase the effectiveness of the shield by <strong>" + secondaryEffectiveAmountPercent + "%</strong> per active buff you have. " + cooldown + " second cooldown.";
    if (abilityName === "Thyrsus")
      abilityDescription = "Deal <strong>" + (effectivenessPercent) + "% of Attack</strong> damage to a target and increase the damage they take by <strong>" + (relatedTargetGainStatusEffectEffectivenessPercent) + "%</strong> for <strong>" + relatedTargetGainStatusEffectDuration + "</strong> seconds. Increase the the effectiveness of the debuff by <strong>" + secondaryEffectiveAmountPercent + "%</strong> per active debuff the target has. " + cooldown + " second cooldown.";
    if (abilityName === "Insanity")
      abilityDescription = "Randomly distribute <strong>" + ability?.targetEffect.length + "</strong> random stat decreasing debuffs amongst enemies. Each effect reduces the stat by <strong>" + (100 - relatedTargetGainStatusEffectEffectivenessPercent) + "%</strong> for <strong>" + relatedTargetGainStatusEffectDuration + "</strong> seconds. If the target already has a debuff of that type, increase its duration by <strong>" + relatedTargetGainStatusEffectDuration + "</strong> seconds. " + cooldown + " second cooldown.";
    if (abilityName === "Have a Drink")
      abilityDescription = "Every " + cooldown + " seconds, give yourself " + (ability?.userEffect.length === 1 ? "a" : ability?.userEffect.length) + " random <strong>" + relatedUserGainStatusEffectEffectivenessPercent + "%</strong> stat increasing buff" + (ability?.userEffect.length === 1 ? "" : "s") + " for <strong>" + relatedUserGainStatusEffectDuration + "</strong> seconds.";

    //Nemesis
    if (abilityName === "Retribution")
      abilityDescription = "The next <strong>" + (abilityCount === 1 ? " time " : abilityCount + " times ") + "</strong> you are attacked, reduce the damage taken by <strong>" + (100 - relatedUserGainStatusEffectEffectivenessPercent) + "%</strong> and deal <strong>" + (effectivenessPercent) + "% of Attack</strong> damage back to the target. " + cooldown + " second cooldown.";
    if (abilityName === "Chains of Fate")
      abilityDescription = "Create a link between you and one target forcing you both to only target each other. Attacks against you from this target increase <strong>Dues</strong> gain by an additional <strong>" + (effectivenessPercent - 100) + "%</strong>. Lasts " + relatedTargetGainStatusEffectDuration + " seconds. " + cooldown + " second cooldown.";
    if (abilityName === "No Escape")
      abilityDescription = "Deal <strong>" + (effectivenessPercent) + "% of Attack</strong> damage to a target " + (ability === undefined ? "2" : (ability.userEffect.filter(item => item.type === StatusEffectEnum.RepeatAbility).length + 1)) + " times. Your <strong>Dues</strong> total does not reset. " + cooldown + " second cooldown.";
    if (abilityName === "Dispenser of Dues")
      abilityDescription = "You always have <strong>Dues</strong>. When you take damage, increase <strong>Dues</strong> by " + (effectivenessPercent) + "% of the damage taken. Increase your next ability's damage by the amount of <strong>Dues</strong> and reset it back to 0.";


    return abilityDescription;
  }

  getRandomElement() {
    var elements: ElementalTypeEnum[] = [];
    for (const [propertyKey, propertyValue] of Object.entries(ElementalTypeEnum)) {
      if (!Number.isNaN(Number(propertyKey))) {
        continue;
      }

      var enumValue = propertyValue as ElementalTypeEnum;
      if (enumValue !== ElementalTypeEnum.None)
        elements.push(enumValue);
    }

    var rng = this.utilityService.getRandomInteger(0, elements.length - 1);

    return elements[rng];
  }

  getEnemyAbilityDescription(character: Enemy, ability: Ability) {
    var abilityDescription = "";
    var effectivenessPercent = 0;
    var effectiveAmount = 0;
    var effectiveAmountPercent = 0; //for nondamage
    var secondaryEffectiveAmount = 0;
    var secondaryEffectiveAmountPercent = 0; //for nondamage
    var abilityCount = 0;
    var thresholdAmountPercent = 0;
    var damageModifierRange = 0;
    var relatedUserGainStatusEffectDuration = 0;
    var relatedUserGainStatusEffectEffectiveness = 0;
    var relatedUserGainStatusEffectEffectivenessPercent = 0;
    var relatedTargetGainStatusEffectDuration = 0;
    var relatedTargetGainStatusEffectEffectiveness = 0;
    var relatedTargetGainStatusEffectEffectivenessPercent = 0;
    var relatedTargetGainStatusEffectTickFrequency = 0;
    var secondaryRelatedUserGainStatusEffectDuration = 0;
    var secondaryRelatedUserGainStatusEffectEffectiveness = 0;
    var secondaryRelatedUserGainStatusEffectEffectivenessPercent = 0;
    var secondaryRelatedUserGainStatusEffectTickFrequency = 0;
    var secondaryRelatedTargetGainStatusEffectDuration = 0;
    var secondaryRelatedTargetGainStatusEffectEffectiveness = 0;
    var secondaryRelatedTargetGainStatusEffectEffectivenessPercent = 0;
    var secondaryRelatedTargetGainStatusEffectTickFrequency = 0;
    var cooldown = 0;

    if (ability !== undefined) {
      effectivenessPercent = Math.round(ability.effectiveness * 100);
      effectiveAmount = Math.round(this.getAbilityEffectiveAmount(character, ability));
      effectiveAmountPercent = Math.round((ability.effectiveness - 1) * 100);
      secondaryEffectiveAmount = ability.secondaryEffectiveness;
      secondaryEffectiveAmountPercent = Math.round((secondaryEffectiveAmount - 1) * 100);
      thresholdAmountPercent = Math.round((ability.threshold) * 100);
      abilityCount = ability.maxCount;
      cooldown = this.utilityService.roundTo(ability.cooldown, 2);
      damageModifierRange = ability.damageModifierRange;

      var relatedUserGainStatusEffect = ability?.userEffect[0];

      if (relatedUserGainStatusEffect !== undefined) {
        relatedUserGainStatusEffectDuration = Math.round(relatedUserGainStatusEffect.duration);
        relatedUserGainStatusEffectEffectiveness = relatedUserGainStatusEffect.effectiveness;
        if (relatedUserGainStatusEffectEffectiveness < 1)
          relatedUserGainStatusEffectEffectivenessPercent = Math.round((relatedUserGainStatusEffectEffectiveness) * 100);
        else
          relatedUserGainStatusEffectEffectivenessPercent = Math.round((relatedUserGainStatusEffectEffectiveness - 1) * 100);
      }

      var secondaryRelatedUserGainStatusEffect = ability?.userEffect[1];

      if (secondaryRelatedUserGainStatusEffect !== undefined) {
        secondaryRelatedUserGainStatusEffectDuration = Math.round(secondaryRelatedUserGainStatusEffect.duration);
        secondaryRelatedUserGainStatusEffectEffectiveness = secondaryRelatedUserGainStatusEffect.effectiveness;
        if (secondaryRelatedUserGainStatusEffectEffectiveness < 1)
          secondaryRelatedUserGainStatusEffectEffectivenessPercent = Math.round((secondaryRelatedUserGainStatusEffectEffectiveness) * 100);
        else
          secondaryRelatedUserGainStatusEffectEffectivenessPercent = Math.round((secondaryRelatedUserGainStatusEffectEffectiveness - 1) * 100);
      }

      var relatedTargetGainStatusEffect = ability?.targetEffect[0];

      if (relatedTargetGainStatusEffect !== undefined) {
        relatedTargetGainStatusEffectDuration = Math.round(relatedTargetGainStatusEffect.duration);
        relatedTargetGainStatusEffectEffectiveness = relatedTargetGainStatusEffect.effectiveness;
        if (relatedTargetGainStatusEffectEffectiveness < 1)
          relatedTargetGainStatusEffectEffectivenessPercent = Math.round((relatedTargetGainStatusEffectEffectiveness) * 100);
        else
          relatedTargetGainStatusEffectEffectivenessPercent = Math.round((relatedTargetGainStatusEffectEffectiveness - 1) * 100);
        relatedTargetGainStatusEffectTickFrequency = relatedTargetGainStatusEffect.tickFrequency;
      }

      var secondaryRelatedTargetGainStatusEffect = ability?.targetEffect[1];

      if (secondaryRelatedTargetGainStatusEffect !== undefined) {
        secondaryRelatedTargetGainStatusEffectDuration = Math.round(secondaryRelatedTargetGainStatusEffect.duration);
        secondaryRelatedTargetGainStatusEffectEffectiveness = secondaryRelatedTargetGainStatusEffect.effectiveness;
        if (secondaryRelatedTargetGainStatusEffectEffectiveness < 1)
          secondaryRelatedTargetGainStatusEffectEffectivenessPercent = Math.round((secondaryRelatedTargetGainStatusEffectEffectiveness) * 100);
        else
          secondaryRelatedTargetGainStatusEffectEffectivenessPercent = Math.round((secondaryRelatedTargetGainStatusEffectEffectiveness - 1) * 100);
        secondaryRelatedTargetGainStatusEffectTickFrequency = secondaryRelatedTargetGainStatusEffect.tickFrequency;
      }
    }

    if (ability.name === "Slash") {
      abilityDescription = "Deal <strong>" + (effectivenessPercent) + "% of Attack</strong> damage to a target and reduce their defense by <strong>" + (100 - relatedTargetGainStatusEffectEffectivenessPercent) + "%</strong> for <strong>" + relatedTargetGainStatusEffectDuration + "</strong> seconds. " + cooldown + " second cooldown.";
    }
    if (ability.name === "Sure Shot") {
      abilityDescription = "Deal <strong>" + (effectivenessPercent) + "% of Attack</strong> damage to a target. Apply a damage over time effect that deals an additional <strong>" + relatedTargetGainStatusEffectEffectivenessPercent + "%</strong> of the damage dealt every " + relatedTargetGainStatusEffectTickFrequency + " seconds for <strong>" + relatedTargetGainStatusEffectDuration + "</strong> seconds. " + cooldown + " second cooldown.";
    }
    if (ability.name === "Claw") {
      abilityDescription = "Deal <strong>" + (effectivenessPercent) + "% of Attack</strong> damage to a target. Apply a damage over time effect that deals an additional <strong>" + relatedTargetGainStatusEffectEffectivenessPercent + "%</strong> of the damage dealt every " + relatedTargetGainStatusEffectTickFrequency + " seconds for <strong>" + relatedTargetGainStatusEffectDuration + "</strong> seconds. " + cooldown + " second cooldown.";
    }
    if (ability.name === "Enrage") {
      abilityDescription = "Increase the user's Attack by <strong>" + relatedUserGainStatusEffectEffectivenessPercent + "%</strong> for <strong>" + relatedUserGainStatusEffectDuration + "</strong> seconds.";
    }
    if (ability.name === "Ravage") {
      abilityDescription = "Deal <strong>" + (effectivenessPercent) + "% of Attack</strong> damage to a target.";
    }
    if (ability.name === "Empower") {
      abilityDescription = "Increase the party's Attack and Luck by <strong>" + relatedUserGainStatusEffectEffectivenessPercent + "%</strong> for <strong>" + relatedUserGainStatusEffectDuration + "</strong> seconds.";
    }
    if (ability.name === "Bite") {
      abilityDescription = "Deal <strong>" + (effectivenessPercent) + "% of Attack</strong> damage. Apply a damage over time effect that deals an additional <strong>" + relatedTargetGainStatusEffectEffectivenessPercent + "%</strong> of the damage dealt every " + relatedTargetGainStatusEffectTickFrequency + " seconds for <strong>" + relatedTargetGainStatusEffectDuration + "</strong> seconds. " + cooldown + " second cooldown.";
    }
    if (ability.name === "Constrict") {
      abilityDescription = "Reduce target's Agility by <strong>" + (100 - relatedTargetGainStatusEffectEffectivenessPercent) + "%</strong> for <strong>" + relatedTargetGainStatusEffectDuration + "</strong> seconds. " + cooldown + " second cooldown.";
    }
    if (ability.name === "Ethereal") {
      abilityDescription = "Avoid all auto attacks for <strong>" + relatedUserGainStatusEffectDuration + "</strong> seconds.";
    }
    if (ability.name === "Gaze") {
      abilityDescription = "Stun target for <strong>" + relatedTargetGainStatusEffectDuration + "</strong> seconds. " + cooldown + " second cooldown.";
    }
    if (ability.name === "Snake Bite") {
      abilityDescription = "Deal <strong>" + (effectivenessPercent) + "% of Attack</strong> damage. Apply a damage over time effect that deals an additional <strong>" + relatedTargetGainStatusEffectEffectivenessPercent + "%</strong> of the damage dealt every " + relatedTargetGainStatusEffectTickFrequency + " seconds for <strong>" + relatedTargetGainStatusEffectDuration + "</strong> seconds. " + cooldown + " second cooldown.";
    }
    if (ability.name === "Feint") {
      abilityDescription = "Reduce target's Agility by <strong>" + (100 - relatedTargetGainStatusEffectEffectivenessPercent) + "%</strong> for <strong>" + relatedTargetGainStatusEffectDuration + "</strong> seconds. " + cooldown + " second cooldown.";
    }
    if (ability.name === "Swipe") {
      abilityDescription = "Deal <strong>" + (effectivenessPercent) + "% of Attack</strong> damage to a target.";
    }
    if (ability.name === "Smash") {
      abilityDescription = "Deal <strong>" + (effectivenessPercent) + "% of Attack</strong> damage to a target. Apply a damage over time effect that deals an additional <strong>" + relatedTargetGainStatusEffectEffectivenessPercent + "%</strong> of the damage dealt every " + relatedTargetGainStatusEffectTickFrequency + " seconds for <strong>" + relatedTargetGainStatusEffectDuration + "</strong> seconds. " + cooldown + " second cooldown.";
    }
    if (ability.name === "Wallop") {
      abilityDescription = "Deal <strong>" + (effectivenessPercent) + "% of Attack</strong> damage to a target and reduce their defense by <strong>" + (100 - relatedTargetGainStatusEffectEffectivenessPercent) + "%</strong> for <strong>" + relatedTargetGainStatusEffectDuration + "</strong> seconds. " + cooldown + " second cooldown.";
    }
    if (ability.name === "Death's Touch") {
      abilityDescription = "Reduce target's Attack and Defense by <strong>" + (100 - relatedTargetGainStatusEffectEffectivenessPercent) + "%</strong> for <strong>" + relatedTargetGainStatusEffectDuration + "</strong> seconds. " + cooldown + " second cooldown.";
    }
    if (ability.name === "Soul Rip") {
      abilityDescription = "Deal <strong>" + (effectivenessPercent) + "% of Attack</strong> damage. Heal for <strong>" + relatedUserGainStatusEffectEffectivenessPercent + "%</strong> of the damage dealt. " + cooldown + " second cooldown.";
    }
    if (ability.name === "Rambling") {
      abilityDescription = "Reduce all enemies' Agility by <strong>" + (100 - relatedTargetGainStatusEffectEffectivenessPercent) + "%</strong> for <strong>" + relatedTargetGainStatusEffectDuration + "</strong> seconds. " + cooldown + " second cooldown.";
    }
    if (ability.name === "Burn") {
      abilityDescription = "Apply a damage over time effect that deals <strong>" + relatedTargetGainStatusEffectEffectivenessPercent + "% of Attack</strong> Fire damage every " + relatedTargetGainStatusEffectTickFrequency + " seconds for <strong>" + relatedTargetGainStatusEffectDuration + "</strong> seconds. " + cooldown + " second cooldown.";
    }
    if (ability.name === "Slice" || ability.name === "Dual Slice") {
      abilityDescription = "Deal <strong>" + (effectivenessPercent) + "% of Attack</strong> Fire damage to a target and increase Agility by <strong>" + relatedUserGainStatusEffectEffectivenessPercent + "%</strong> for <strong>" + relatedUserGainStatusEffectDuration + "</strong> seconds. " + cooldown + " second cooldown.";
    }
    if (ability.name === "Roll") {
      abilityDescription = "Deal <strong>" + (effectivenessPercent) + "% of Attack</strong> Fire damage to all targets. " + cooldown + " second cooldown.";
    }
    if (ability.name === "Enfire") {
      abilityDescription = "All attacks are now Fire elemental for <strong>" + relatedUserGainStatusEffectDuration + "</strong> seconds." + cooldown + " second cooldown.";
    }
    if (ability.name === "Slam") {
      abilityDescription = "Deal <strong>" + (effectivenessPercent) + "% of Attack</strong> damage to a target." + cooldown + " second cooldown.";
    }
    if (ability.name === "Trample") {
      abilityDescription = "Deal <strong>" + (effectivenessPercent) + "% of Attack</strong> damage to a target. Apply a damage over time effect that deals an additional <strong>" + relatedTargetGainStatusEffectEffectivenessPercent + "%</strong> of the damage dealt every " + relatedTargetGainStatusEffectTickFrequency + " seconds for <strong>" + relatedTargetGainStatusEffectDuration + "</strong> seconds. " + cooldown + " second cooldown.";
    }
    if (ability.name === "Stagger") {
      abilityDescription = "Deal <strong>" + (effectivenessPercent) + "% of Attack</strong> damage to a target. Reduce target's auto attack cooldown rate by <strong>" + (100 - relatedTargetGainStatusEffectEffectivenessPercent) + "%</strong> for <strong>" + relatedTargetGainStatusEffectDuration + "</strong> seconds. " + cooldown + " second cooldown.";
    }
    if (ability.name === "Fire Breath") {
      abilityDescription = "Deal <strong>" + (effectivenessPercent) + "% of Attack</strong> damage to a target and reduce their defense by <strong>" + (100 - relatedTargetGainStatusEffectEffectivenessPercent) + "%</strong> for <strong>" + relatedTargetGainStatusEffectDuration + "</strong> seconds. " + cooldown + " second cooldown.";
    }
    if (ability.name === "Tail Swipe") {
      abilityDescription = "Deal <strong>" + (effectivenessPercent) + "% of Attack</strong> Fire damage to a target. " + cooldown + " second cooldown.";
    }
    if (ability.name === "Regeneration") {
      abilityDescription = "Heal self for <strong>" + (effectivenessPercent) + "% of Attack</strong> HP. " + cooldown + " second cooldown.";
    }
    if (ability.name === "Shields Up") {
      abilityDescription = "Increase the party's Defense by <strong>" + relatedUserGainStatusEffectEffectivenessPercent + "%</strong> for <strong>" + relatedUserGainStatusEffectDuration + "</strong> seconds." + cooldown + " second cooldown.";
    }
    if (ability.name === "Focus") {
      abilityDescription = "Cast taunt onto a target, forcing that character to direct all attacks onto you for <strong>" + relatedTargetGainStatusEffectDuration + "</strong> seconds. " + cooldown + " second cooldown.";
    }
    if (ability.name === "Bash") {
      abilityDescription = "Deal <strong>" + (effectivenessPercent) + "% of Attack</strong> damage to a target. " + cooldown + " second cooldown.";
    }
    if (ability.name === "Sap") {
      abilityDescription = "Deal <strong>" + (effectivenessPercent) + "% of Attack</strong> true damage to a target and heal back the amount of damage dealt.";
    }
    if (ability.name === "Path of Flames") {
      abilityDescription = "Deal <strong>" + (effectivenessPercent) + "% of Attack</strong> Fire damage to all targets. Apply a damage over time effect that deals an additional <strong>" + relatedTargetGainStatusEffectEffectivenessPercent + "%</strong> of the damage dealt every " + relatedTargetGainStatusEffectTickFrequency + " seconds for <strong>" + relatedTargetGainStatusEffectDuration + "</strong> seconds. " + cooldown + " second cooldown.";
    }
    if (ability.name === "Speed Up") {
      abilityDescription = "Increase the user's Attack and Agility by <strong>" + relatedUserGainStatusEffectEffectivenessPercent + "%</strong>. Stacks up to three times.";
    }
    if (ability.name === "Flames of Tartarus") {
      abilityDescription = "Used when user attempts to Speed Up for the fourth time. Deal <strong>" + (effectivenessPercent) + "% of Attack</strong> Fire damage to a target. Resets Speed Up stacks back to 0.";
    }
    if (ability.name === "Ride Down") {
      abilityDescription = "Increase the party's Agility by <strong>" + relatedUserGainStatusEffectEffectivenessPercent + "%</strong> for <strong>" + relatedUserGainStatusEffectDuration + "</strong> seconds. " + cooldown + " second cooldown.";
    }
    if (ability.name === "Fire Power") {
      abilityDescription = "Increase the party's Attack by <strong>" + relatedUserGainStatusEffectEffectivenessPercent + "%</strong> for <strong>" + relatedUserGainStatusEffectDuration + "</strong> seconds. " + cooldown + " second cooldown.";
    }
    if (ability.name === "Divinity") {
      abilityDescription = "Give each party member a Barrier of <strong>" + relatedUserGainStatusEffectEffectivenessPercent + "% of Attack</strong> HP. " + cooldown + " second cooldown.";
    }
    if (ability.name === "Gemini Strike") {
      abilityDescription = "Deal <strong>" + (effectivenessPercent) + "% of Attack</strong> damage to a target. Increase Attack based on how much Barrier you have. " + cooldown + " second cooldown.";
    }
    if (ability.name === "Explode") {
      abilityDescription = "Deal <strong>" + (effectivenessPercent) + "% of Attack</strong> damage to a target. Instantly die. " + cooldown + " second cooldown.";
    }
    if (ability.name === "Savage Claw") {
      abilityDescription = "Deal <strong>" + (effectivenessPercent) + "% of Attack</strong> damage to a target. Apply a damage over time effect that deals an additional <strong>" + relatedTargetGainStatusEffectEffectivenessPercent + "%</strong> of the damage dealt every " + relatedTargetGainStatusEffectTickFrequency + " seconds for <strong>" + relatedTargetGainStatusEffectDuration + "</strong> seconds. " + cooldown + " second cooldown.";
    }
    if (ability.name === "Lacerate") {
      abilityDescription = "Deal <strong>" + (effectivenessPercent) + "% of Attack</strong> damage to a target. Apply a damage over time effect that deals an additional <strong>" + relatedTargetGainStatusEffectEffectivenessPercent + "%</strong> of the damage dealt every " + relatedTargetGainStatusEffectTickFrequency + " seconds for <strong>" + relatedTargetGainStatusEffectDuration + "</strong> seconds. " + cooldown + " second cooldown.";
    }
    if (ability.name === "Howl") {
      abilityDescription = "Increase the user's Attack by <strong>" + relatedUserGainStatusEffectEffectivenessPercent + "%</strong> for <strong>" + relatedUserGainStatusEffectDuration + "</strong> seconds. " + cooldown + " second cooldown.";
    }
    if (ability.name === "Spray") {
      abilityDescription = "Deal <strong>" + (effectivenessPercent) + "% of Attack</strong> Water damage to all targets. Apply Unsteady debuff to targets, reducing ability cooldown speed by " + relatedTargetGainStatusEffectEffectivenessPercent + "% for " + relatedTargetGainStatusEffectDuration + " seconds. " + cooldown + " second cooldown.";
    }
    if (ability.name === "Defend" || ability.name === "Oath: Defend") {
      abilityDescription = "Reduce the user's Damage Taken by <strong>" + (100 - relatedUserGainStatusEffectEffectivenessPercent) + "%</strong> for <strong>" + relatedUserGainStatusEffectDuration + "</strong> seconds.";
    }
    if (ability.name === "Bark") {
      abilityDescription = "Reduce target's Defense by <strong>" + (100 - relatedTargetGainStatusEffectEffectivenessPercent) + "%</strong> for <strong>" + relatedTargetGainStatusEffectDuration + "</strong> seconds. " + cooldown + " second cooldown.";
    }
    if (ability.name === "Bite" && (character.bestiaryType === BestiaryEnum.FeistyBadger || character.bestiaryType === BestiaryEnum.UnrulyHound)) {
      abilityDescription = "Deal <strong>" + (effectivenessPercent) + "% of Attack</strong> damage to a target. " + cooldown + " second cooldown.";
    }
    if (ability.name === "Fire Breath") {
      abilityDescription = "Deal <strong>" + (effectivenessPercent) + "% of Attack</strong> Fire damage to a target. Apply a damage over time effect that deals an additional <strong>" + relatedTargetGainStatusEffectEffectivenessPercent + "%</strong> of the damage dealt every " + relatedTargetGainStatusEffectTickFrequency + " seconds for <strong>" + relatedTargetGainStatusEffectDuration + "</strong> seconds. " + cooldown + " second cooldown.";
    }
    if (ability.name === "Peck") {
      abilityDescription = "Deal <strong>" + (effectivenessPercent) + "% of Attack</strong> damage to a target. " + cooldown + " second cooldown.";
    }
    if (ability.name === "Spirit of the Forest") {
      abilityDescription = "Heal self for <strong>" + (effectivenessPercent) + "% of Attack</strong> HP and increase the user's Attack and Luck by <strong>" + relatedUserGainStatusEffectEffectivenessPercent + "%</strong> for <strong>" + relatedUserGainStatusEffectDuration + "</strong> seconds. " + cooldown + " second cooldown.";
    }
    if (ability.name === "Sound the Alarm") {
      abilityDescription = "Increase the party's Defense and Agility by <strong>" + relatedUserGainStatusEffectEffectivenessPercent + "%</strong> for <strong>" + relatedUserGainStatusEffectDuration + "</strong> seconds. " + cooldown + " second cooldown.";
    }
    if (ability.name === "Lance") {
      abilityDescription = "Deal <strong>" + (effectivenessPercent) + "% of Attack</strong> Earth damage to a target. " + cooldown + " second cooldown.";
    }
    if (ability.name === "Poison Tipped Arrows") {
      abilityDescription = "Deal <strong>" + (effectivenessPercent) + "% of Attack</strong> damage to a target. Apply a damage over time effect that deals an additional <strong>" + relatedTargetGainStatusEffectEffectiveness + "</strong> damage every " + relatedTargetGainStatusEffectTickFrequency + " seconds for <strong>" + relatedTargetGainStatusEffectDuration + "</strong> seconds. " + cooldown + " second cooldown.";
    }
    if (ability.name === "Fend") {
      abilityDescription = "Deal <strong>" + (effectivenessPercent) + "% of Attack</strong> Earth damage to a target. " + cooldown + " second cooldown.";
    }
    if (ability.name === "Expose") {
      abilityDescription = "Deal <strong>" + (effectivenessPercent) + "% of Attack</strong> Earth damage to a target and reduce their Defense by <strong>" + (100 - relatedTargetGainStatusEffectEffectivenessPercent) + "%</strong> for <strong>" + relatedTargetGainStatusEffectDuration + "</strong> seconds. " + cooldown + " second cooldown.";
    }
    if (ability.name === "Commune with the Spirits") {
      abilityDescription = "Increase the party's Earth Damage Dealt by <strong>" + relatedUserGainStatusEffectEffectivenessPercent + "%</strong> for <strong>" + relatedUserGainStatusEffectDuration + "</strong> seconds. " + cooldown + " second cooldown.";
    }
    if (ability.name === "Stone Blast") {
      abilityDescription = "Deal <strong>" + (effectivenessPercent) + "% of Attack</strong> Earth damage to a target and reduce their Agility by <strong>" + (100 - relatedTargetGainStatusEffectEffectivenessPercent) + "%</strong> for <strong>" + relatedTargetGainStatusEffectDuration + "</strong> seconds. " + cooldown + " second cooldown.";
    }
    if (ability.name === "Shatter") {
      abilityDescription = "Deal <strong>" + (effectivenessPercent) + "% of Attack</strong> Earth damage to all targets. " + cooldown + " second cooldown.";
    }
    if (ability.name === "Sneak") {
      abilityDescription = "Increase the user's Agility by <strong>" + relatedUserGainStatusEffectEffectivenessPercent + "%</strong> for <strong>" + relatedUserGainStatusEffectDuration + "</strong> seconds. " + cooldown + " second cooldown.";
    }
    if (ability.name === "Stab") {
      abilityDescription = "Deal <strong>" + (effectivenessPercent) + "% of Attack</strong> damage to a target. " + cooldown + " second cooldown.";
    }
    if (ability.name === "Hard Bargain") {
      abilityDescription = "Give party members a random positive stat boost and all targets a random negative stat reduction of <strong>" + relatedUserGainStatusEffectEffectivenessPercent + "%</strong> for <strong>" + relatedUserGainStatusEffectDuration + "</strong> seconds. " + cooldown + " second cooldown.";
    }
    if (ability.name === "Healing Herb") {
      abilityDescription = "Heal the lowest HP % party member for <strong>" + (effectivenessPercent) + "% of Attack</strong> HP." + cooldown + " second cooldown.";
    }
    if (ability.name === "Throw Sand") {
      abilityDescription = "Deal <strong>" + (effectivenessPercent) + "% of Attack</strong> damage to all targets and apply a <strong>" + (relatedTargetGainStatusEffectEffectivenessPercent) + "%</strong> Blind for <strong>" + relatedTargetGainStatusEffectDuration + "</strong> seconds. " + cooldown + " second cooldown.";
    }
    if (ability.name === "Stone Toss") {
      abilityDescription = "Deal <strong>" + (effectiveAmount) + "</strong> damage to a target. " + cooldown + " second cooldown.";
    }
    if (ability.name === "Dust Up") {
      abilityDescription = "Apply a <strong>" + (100 - relatedTargetGainStatusEffectEffectivenessPercent) + "%</strong> Stagger for <strong>" + relatedTargetGainStatusEffectDuration + "</strong> seconds to all targets. " + cooldown + " second cooldown.";
    }
    if (ability.name === "Encourage") {
      abilityDescription = "Increase the party's Attack and Luck by <strong>" + relatedUserGainStatusEffectEffectivenessPercent + "%</strong> for <strong>" + relatedUserGainStatusEffectDuration + "</strong> seconds. " + cooldown + " second cooldown.";
    }
    if (ability.name === "Entangle") {
      abilityDescription = "Deal <strong>" + (effectivenessPercent) + "% of Attack</strong> damage to a target. Apply a damage over time effect that deals an additional <strong>" + secondaryRelatedTargetGainStatusEffectEffectivenessPercent + "%</strong> of the damage dealt every " + secondaryRelatedTargetGainStatusEffectTickFrequency + " seconds for <strong>" + secondaryRelatedTargetGainStatusEffectDuration + "</strong> seconds and reduce their Agility by <strong>" + (100 - relatedTargetGainStatusEffectEffectivenessPercent) + "%</strong> for <strong>" + relatedTargetGainStatusEffectDuration + "</strong> seconds. " + cooldown + " second cooldown.";
    }
    if (ability.name === "Venomous Bite") {
      abilityDescription = "Deal <strong>" + (effectivenessPercent) + "% of Attack</strong> damage to a target. Apply a damage over time effect that deals an additional <strong>" + relatedTargetGainStatusEffectEffectiveness + "</strong> damage every " + relatedTargetGainStatusEffectTickFrequency + " seconds for <strong>" + relatedTargetGainStatusEffectDuration + "</strong> seconds. " + cooldown + " second cooldown.";
    }
    if (ability.name === "Coil") {
      abilityDescription = "Heal self for <strong>" + (effectivenessPercent) + "% of Attack</strong> HP and increase the user's Defense by <strong>" + relatedUserGainStatusEffectEffectivenessPercent + "%</strong> for <strong>" + relatedUserGainStatusEffectDuration + "</strong> seconds. " + cooldown + " second cooldown.";
    }
    if (ability.name === "Emit Toxin") {
      abilityDescription = "Apply a damage over time effect to all targets that deals an additional <strong>" + relatedTargetGainStatusEffectEffectiveness + "</strong> damage every " + relatedTargetGainStatusEffectTickFrequency + " seconds for <strong>" + relatedTargetGainStatusEffectDuration + "</strong> seconds. " + cooldown + " second cooldown.";
    }
    if (ability.name === "Emit Spores") {
      abilityDescription = "Reduce all targets' Attack, Defense, and Resistance by <strong>" + (100 - relatedTargetGainStatusEffectEffectivenessPercent) + "%</strong> for <strong>" + relatedTargetGainStatusEffectDuration + "</strong> seconds. " + cooldown + " second cooldown.";
    }
    if (ability.name === "Spines") {
      abilityDescription = "Deal <strong>" + (effectivenessPercent) + "% of Attack</strong> Earth damage to a target. " + cooldown + " second cooldown.";
    }
    if (ability.name === "Heart of Oak") {
      abilityDescription = "Increase the user's Earth Damage Dealt by <strong>" + relatedUserGainStatusEffectEffectivenessPercent + "%</strong> for <strong>" + relatedUserGainStatusEffectDuration + "</strong> seconds. " + cooldown + " second cooldown.";
    }
    if (ability.name === "Crunch") {
      abilityDescription = "Deal <strong>" + (effectivenessPercent) + "% of Attack</strong> damage to a target and reduce their Defense by <strong>" + (100 - relatedTargetGainStatusEffectEffectivenessPercent) + "%</strong> for <strong>" + relatedTargetGainStatusEffectDuration + "</strong> seconds. " + cooldown + " second cooldown.";
    }
    if (ability.name === "Howl") {
      abilityDescription = "Increase the user's Attack and Agility by <strong>" + relatedUserGainStatusEffectEffectivenessPercent + "%</strong> for <strong>" + relatedUserGainStatusEffectDuration + "</strong> seconds. " + cooldown + " second cooldown.";
    }
    if (ability.name === "Sloppy Shot") {
      abilityDescription = "Deal <strong>" + (effectivenessPercent) + "% of Attack</strong> damage to a target. Damage is randomly modified by " + (damageModifierRange * 100) + "% to " + ((damageModifierRange + 1) * 100) + "%. " + cooldown + " second cooldown.";
    }
    if (ability.name === "Full Burst") {
      abilityDescription = "Deal <strong>" + (effectivenessPercent) + "% of Attack</strong> damage to all targets. Damage is randomly modified by " + (damageModifierRange * 100) + "% to " + ((damageModifierRange + 1) * 100) + "%. " + cooldown + " second cooldown.";
    }
    if (ability.name === "Immobilize") {
      abilityDescription = "Deal <strong>" + (effectivenessPercent) + "% of Attack</strong> damage to a target and apply a Stun for <strong>" + relatedTargetGainStatusEffectDuration + "</strong> seconds. " + cooldown + " second cooldown.";
    }
    if (ability.name === "Gore") {
      abilityDescription = "Deal <strong>" + (effectivenessPercent) + "% of Attack</strong> damage to a target. Apply a damage over time effect that deals an additional <strong>" + relatedTargetGainStatusEffectEffectiveness + "</strong> damage every " + relatedTargetGainStatusEffectTickFrequency + " seconds for <strong>" + relatedTargetGainStatusEffectDuration + "</strong> seconds. " + cooldown + " second cooldown.";
    }
    if (ability.name === "Devour") {
      abilityDescription = "Deal <strong>" + (effectivenessPercent) + "% of Attack</strong> damage to a target. " + cooldown + " second cooldown.";
    }
    if (ability.name === "Emit Spores") {
      abilityDescription = "Reduce all targets' Agility and Resistance by <strong>" + (100 - relatedTargetGainStatusEffectEffectivenessPercent) + "%</strong> for <strong>" + relatedTargetGainStatusEffectDuration + "</strong> seconds. " + cooldown + " second cooldown.";
    }
    if (ability.name === "Red Poison") {
      abilityDescription = "Apply a damage over time effect to all targets that deals <strong>" + effectiveAmount + "</strong> damage every " + relatedTargetGainStatusEffectTickFrequency + " seconds for <strong>" + relatedTargetGainStatusEffectDuration + "</strong> seconds. " + cooldown + " second cooldown.";
    }
    if (ability.name === "Yellow Poison") {
      abilityDescription = "Apply a damage over time effect to all targets that deals <strong>" + effectiveAmount + "</strong> damage every " + relatedTargetGainStatusEffectTickFrequency + " seconds for <strong>" + relatedTargetGainStatusEffectDuration + "</strong> seconds. " + cooldown + " second cooldown.";
    }
    if (ability.name === "Trample") {
      abilityDescription = "Deal <strong>" + (effectivenessPercent) + "% of Attack</strong> damage to all targets. " + cooldown + " second cooldown.";
    }
    if (ability.name === "Sprint") {
      abilityDescription = "Increase the user's Agility by <strong>" + relatedUserGainStatusEffectEffectivenessPercent + "%</strong> for <strong>" + relatedUserGainStatusEffectDuration + "</strong> seconds. " + cooldown + " second cooldown.";
    }
    if (ability.name === "Savagery") {
      abilityDescription = "Increase the user's Agility and Luck by <strong>" + relatedUserGainStatusEffectEffectivenessPercent + "%</strong>. This effect is permanent and stacks. " + cooldown + " second cooldown.";
    }
    if (ability.name === "Scavenge") {
      abilityDescription = "Heal self for <strong>" + (effectivenessPercent) + "% of Attack</strong> HP and increase the user's Attack by <strong>" + relatedUserGainStatusEffectEffectivenessPercent + "%</strong> for <strong>" + relatedUserGainStatusEffectDuration + "</strong> seconds. " + cooldown + " second cooldown.";
    }
    if (ability.name === "Scramble") {
      abilityDescription = "Avoid all auto attacks for <strong>" + relatedUserGainStatusEffectDuration + "</strong> seconds.";
    }
    if (ability.name === "Scratch") {
      abilityDescription = "Deal <strong>" + (effectivenessPercent) + "% of Attack</strong> damage to a target. " + cooldown + " second cooldown.";
    }
    if (ability.name === "Hamstring") {
      abilityDescription = "Deal <strong>" + (effectivenessPercent) + "% of Attack</strong> damage to a target and reduce their Agility by <strong>" + (100 - relatedTargetGainStatusEffectEffectivenessPercent) + "%</strong> for <strong>" + relatedTargetGainStatusEffectDuration + "</strong> seconds. " + cooldown + " second cooldown.";
    }
    if (ability.name === "Savage Swipe") {
      abilityDescription = "Deal <strong>" + (effectivenessPercent) + "% of Attack</strong> damage to all targets and reduce their Healing Received by <strong>" + (100 - relatedTargetGainStatusEffectEffectivenessPercent) + "%</strong> for <strong>" + relatedTargetGainStatusEffectDuration + "</strong> seconds. " + cooldown + " second cooldown.";
    }
    if (ability.name === "Body Slam") {
      abilityDescription = "Deal <strong>" + (effectivenessPercent) + "% of Attack</strong> damage to a target. " + cooldown + " second cooldown.";
    }
    if (ability.name === "Thick Skin") {
      abilityDescription = "Increase the user's Defense and Resistance by <strong>" + relatedUserGainStatusEffectEffectivenessPercent + "%</strong> for <strong>" + relatedUserGainStatusEffectDuration + "</strong> seconds. " + cooldown + " second cooldown.";
    }
    if (ability.name === "Prod") {
      abilityDescription = "Deal <strong>" + (effectivenessPercent) + "% of Attack</strong> damage to a target. " + cooldown + " second cooldown.";
    }
    if (ability.name === "Drink") {
      abilityDescription = "Give yourself a Barrier of <strong>" + relatedUserGainStatusEffectEffectivenessPercent + "% of Attack</strong> HP. " + cooldown + " second cooldown.";
    }
    if (ability.name === "Bronti") {
      abilityDescription = "Deal <strong>" + (effectivenessPercent) + "% of Attack</strong> Lightning damage to a target and apply a Stun for <strong>" + relatedTargetGainStatusEffectDuration + "</strong> seconds. " + cooldown + " second cooldown.";
    }
    if (ability.name === "Rising Sun") {
      abilityDescription = "Deal <strong>" + (effectivenessPercent) + "% of Attack</strong> Fire damage to a target. " + cooldown + " second cooldown.";
    }
    if (ability.name === "Foresight") {
      abilityDescription = "Just before being attacked, give yourself a Barrier of <strong>" + relatedUserGainStatusEffectEffectivenessPercent + "% of Attack</strong> HP. " + cooldown + " second cooldown.";
    }
    if (ability.name === "Straight Arrow") {
      abilityDescription = "Deal <strong>" + (effectivenessPercent) + "% of Attack</strong> damage to a target. Apply a damage over time effect that deals <strong>" + relatedTargetGainStatusEffectEffectivenessPercent + "% of Attack</strong> every " + relatedTargetGainStatusEffectTickFrequency + " seconds for <strong>" + relatedTargetGainStatusEffectDuration + "</strong> seconds. " + cooldown + " second cooldown.";
    }
    if (ability.name === "Last Breath") {
      abilityDescription = "If Cassandra is defeated before Helenus, restore 50% of Helenus's HP.";
    }
    if (ability.name === "Dying Wish") {
      abilityDescription = "If Helenus is defeated before Cassandra, permanently increase Cassandra's Attack by 50%.";
    }
    if (ability.name === "Slice") {
      abilityDescription = "Deal <strong>" + (effectivenessPercent) + "% of Attack</strong> damage to a target. " + cooldown + " second cooldown.";
    }
    if (ability.name === "One Step Ahead") {
      abilityDescription = "Deal <strong>" + (effectivenessPercent) + "% of Attack</strong> damage to a target and reduce their Defense by <strong>" + (100 - relatedTargetGainStatusEffectEffectivenessPercent) + "%</strong> for <strong>" + relatedTargetGainStatusEffectDuration + "</strong> seconds. " + cooldown + " second cooldown.";
    }
    if (ability.name === "Lightning Strike") {
      abilityDescription = "Deal <strong>" + (effectivenessPercent) + "% of Attack</strong> Lightning damage to a target and increase the user's Attack by <strong>" + relatedUserGainStatusEffectEffectivenessPercent + "%</strong> permanently. This effect can stack. " + cooldown + " second cooldown.";
    }
    if (ability.name === "Favored Son") {
      abilityDescription = "Increase the user's Agility and Luck by <strong>" + relatedUserGainStatusEffectEffectivenessPercent + "%</strong> for <strong>" + relatedUserGainStatusEffectDuration + "</strong> seconds. " + cooldown + " second cooldown.";
    }
    if (ability.name === "Divine Protection") {
      abilityDescription = "Deal <strong>" + (effectivenessPercent) + "% of Attack</strong> Holy damage to a target and increase the user's Defense by <strong>" + relatedUserGainStatusEffectEffectivenessPercent + "%</strong> permanently. This effect can stack. " + cooldown + " second cooldown.";
    }
    if (ability.name === "Inflexibility") {
      abilityDescription = "Increase the user's Resistance by <strong>" + relatedUserGainStatusEffectEffectivenessPercent + "%</strong> for <strong>" + relatedUserGainStatusEffectDuration + "</strong> seconds. " + cooldown + " second cooldown.";
    }
    if (ability.name === "Last Hearing") {
      abilityDescription = "Increase the user's Agility, Luck, and Resistance by <strong>" + relatedUserGainStatusEffectEffectivenessPercent + "%</strong> for <strong>" + relatedUserGainStatusEffectDuration + "</strong> seconds. " + cooldown + " second cooldown.";
    }
    if (ability.name === "Slam of the Gavel") {
      abilityDescription = "Deal <strong>" + (effectivenessPercent) + "% of Attack</strong> damage to a target. " + cooldown + " second cooldown.";
    }
    if (ability.name === "Final Judgment") {
      abilityDescription = "Deal <strong>" + (effectivenessPercent) + "% of Attack</strong> damage to a target. Damage is multiplied by the number of allies still remaining. " + cooldown + " second cooldown.";
    }
    if (ability.name === "Tail Swing") {
      abilityDescription = "Deal <strong>" + (effectivenessPercent) + "% of Attack</strong> damage to a target. " + cooldown + " second cooldown.";
    }
    if (ability.name === "Impenetrable Armor") {
      abilityDescription = "Increase the user's Defense and Resistance by <strong>" + relatedUserGainStatusEffectEffectivenessPercent + "%</strong> for <strong>" + relatedUserGainStatusEffectDuration + "</strong> seconds. " + cooldown + " second cooldown.";
    }
    if (ability.name === "Hook") {
      abilityDescription = "Deal <strong>" + (effectivenessPercent) + "% of Attack</strong> Water damage to a target and taunt them, forcing that character to direct all attacks onto you for <strong>" + relatedTargetGainStatusEffectDuration + "</strong> seconds. " + cooldown + " second cooldown.";
    }
    if (ability.name === "Splash") {
      abilityDescription = "Reduce a target's Agility and Resistance by <strong>" + (100 - relatedTargetGainStatusEffectEffectivenessPercent) + "%</strong> for <strong>" + relatedTargetGainStatusEffectDuration + "</strong> seconds. " + cooldown + " second cooldown.";
    }
    if (ability.name === "Tough Scales") {
      abilityDescription = "Give the user Thorns, dealing <strong>" + relatedUserGainStatusEffectEffectiveness + "</strong> damage back to attackers for <strong>" + relatedUserGainStatusEffectDuration + "</strong> seconds. " + cooldown + " second cooldown.";
    }
    if (ability.name === "Soulflame") {
      abilityDescription = "Apply a damage over time effect that deals <strong>" + relatedTargetGainStatusEffectEffectivenessPercent + "% of Attack</strong> damage every " + relatedTargetGainStatusEffectTickFrequency + " seconds for <strong>" + relatedTargetGainStatusEffectDuration + "</strong> seconds. " + cooldown + " second cooldown.";
    }
    if (ability.name === "Shadow Blast") {
      abilityDescription = "Deal <strong>" + (effectivenessPercent) + "% of Attack</strong> damage to a target. " + cooldown + " second cooldown.";
    }
    if (ability.name === "Nightmare") {
      abilityDescription = "Give a target a random negative stat reduction of <strong>" + (100 - relatedTargetGainStatusEffectEffectivenessPercent) + "%</strong> for <strong>" + relatedTargetGainStatusEffectDuration + "</strong> seconds. " + cooldown + " second cooldown.";
    }
    if (ability.name === "Shadow Snare") {
      abilityDescription = "Apply a <strong>" + (relatedTargetGainStatusEffectEffectivenessPercent) + "%</strong> Blind for <strong>" + relatedTargetGainStatusEffectDuration + "</strong> seconds and a damage over time effect that deals <strong>" + secondaryRelatedTargetGainStatusEffectEffectivenessPercent + "% of Attack</strong> damage every " + secondaryRelatedTargetGainStatusEffectTickFrequency + " seconds for <strong>" + secondaryRelatedTargetGainStatusEffectDuration + "</strong> seconds to all targets. " + cooldown + " second cooldown.";
    }
    if (ability.name === "Dreameater") {
      abilityDescription = "Deal <strong>" + (effectivenessPercent) + "% of Attack</strong> damage to all targets. Damage is increased by 20% per negative status effect on the target. " + cooldown + " second cooldown.";
    }
    if (ability.name === "Rush") {
      abilityDescription = "Deal <strong>" + (effectivenessPercent) + "% of Attack</strong> Water damage to a target. " + cooldown + " second cooldown.";
    }
    if (ability.name === "Acheron Flow") {
      abilityDescription = "Increase the user's Attack by <strong>" + relatedUserGainStatusEffectEffectivenessPercent + "%</strong> indefinitely. " + cooldown + " second cooldown.";
    }
    if (ability.name === "Cocytus Flow") {
      abilityDescription = "Increase the user's Attack and Luck by <strong>" + relatedUserGainStatusEffectEffectivenessPercent + "%</strong> indefinitely. " + cooldown + " second cooldown.";
    }
    if (ability.name === "Lethe Flow") {
      abilityDescription = "Increase the user's Attack, Luck, and Resistance by <strong>" + relatedUserGainStatusEffectEffectivenessPercent + "%</strong> indefinitely. " + cooldown + " second cooldown.";
    }
    if (ability.name === "Phlegethon Flow") {
      abilityDescription = "Increase the user's Attack, Luck, Resistance, and Defense by <strong>" + relatedUserGainStatusEffectEffectivenessPercent + "%</strong> indefinitely. " + cooldown + " second cooldown.";
    }
    if (ability.name === "Styx Flow") {
      abilityDescription = "Increase the user's Attack, Luck, Resistance, Defense, and Agility by <strong>" + relatedUserGainStatusEffectEffectivenessPercent + "%</strong> indefinitely. " + cooldown + " second cooldown.";
    }
    if (ability.name === "Weave" || ability.name === "Oath: Weave") {
      abilityDescription = "Deal <strong>" + (effectivenessPercent) + "% of Attack</strong> Water damage to a target and apply Unsteady debuff, reducing ability cooldown speed by " + relatedTargetGainStatusEffectEffectivenessPercent + "% for " + relatedTargetGainStatusEffectDuration + " seconds. " + cooldown + " second cooldown.";
    }
    if (ability.name === "Wail") {
      abilityDescription = "Reduce a target's Attack and Luck by <strong>" + (100 - relatedTargetGainStatusEffectEffectivenessPercent) + "%</strong> for <strong>" + relatedTargetGainStatusEffectDuration + "</strong> seconds. " + cooldown + " second cooldown.";
    }
    if (ability.name === "Rest") {
      abilityDescription = "Heal self for <strong>" + (effectivenessPercent) + "% of Attack</strong> HP. " + cooldown + " second cooldown.";
    }
    if (ability.name === "Oblivion" || ability.name === "Oath: Oblivion") {
      abilityDescription = "Deal <strong>" + (effectivenessPercent) + "% of Attack</strong> damage to all targets. " + cooldown + " second cooldown.";
    }
    if (ability.name === "Stream of Fire" || ability.name === "Oath: Stream of Fire") {
      abilityDescription = "Deal <strong>" + (effectivenessPercent) + "% of Attack</strong> Fire damage to a target and apply a damage over time effect that deals <strong>" + relatedTargetGainStatusEffectEffectivenessPercent + "% of Attack</strong> Fire damage every " + relatedTargetGainStatusEffectTickFrequency + " seconds for <strong>" + relatedTargetGainStatusEffectDuration + "</strong> seconds. " + cooldown + " second cooldown.";
    }
    if (ability.name === "Charred Skin") {
      abilityDescription = "Give the user Thorns, dealing <strong>" + relatedUserGainStatusEffectEffectiveness + "</strong> damage back to attackers for <strong>" + relatedUserGainStatusEffectDuration + "</strong> seconds. " + cooldown + " second cooldown.";
    }
    if (ability.name === "Oar Thump") {
      abilityDescription = "Deal <strong>" + (effectivenessPercent) + "% of Attack</strong> damage to a target. " + cooldown + " second cooldown.";
    }
    if (ability.name === "Clubbing Blows") {
      abilityDescription = "Deal <strong>" + (effectivenessPercent) + "% of Attack</strong> damage to all targets and apply a Stun for <strong>" + relatedTargetGainStatusEffectDuration + "</strong> seconds. " + cooldown + " second cooldown.";
    }
    if (ability.name === "Loyal Ferryman") {
      abilityDescription = "Reduce all targets' Resistance by <strong>" + (100 - relatedTargetGainStatusEffectEffectivenessPercent) + "%</strong> for <strong>" + relatedTargetGainStatusEffectDuration + "</strong> seconds. " + cooldown + " second cooldown.";
    }
    if (ability.name === "Whip Smack") {
      abilityDescription = "Deal <strong>" + (effectivenessPercent) + "% of Attack</strong> damage to a target. Apply a damage over time effect that deals an additional <strong>" + relatedTargetGainStatusEffectEffectivenessPercent + "%</strong> of the damage dealt every " + relatedTargetGainStatusEffectTickFrequency + " seconds for <strong>" + relatedTargetGainStatusEffectDuration + "</strong> seconds. " + cooldown + " second cooldown.";
    }
    if (ability.name === "Fate Foretold") {
      abilityDescription = "Give the user Thorns, dealing <strong>" + relatedUserGainStatusEffectEffectiveness + "</strong> damage back to attackers for <strong>" + relatedUserGainStatusEffectDuration + "</strong> seconds. Also increase the user's Defense and Resistance by <strong>" + secondaryRelatedUserGainStatusEffectEffectivenessPercent + "%</strong> for <strong>" + secondaryRelatedUserGainStatusEffectDuration + "</strong> seconds. " + cooldown + " second cooldown.";
    }
    if (ability.name === "Loyal Arbiter") {
      abilityDescription = "Reduce all targets' Agility for <strong>" + (relatedTargetGainStatusEffectDuration) + "</strong> seconds. Agility is reduced by 15% if one enemy remains, 30% if two remain, and 45% if all three remain. " + cooldown + " second cooldown.";
    }
    if (ability.name === "Arc") {
      abilityDescription = "Deal <strong>" + (effectivenessPercent) + "% of Attack</strong> Lightning damage to all targets and apply Paralyze for <strong>" + relatedTargetGainStatusEffectDuration + "</strong> seconds on all targets. " + cooldown + " second cooldown.";
    }
    if (ability.name === "Hard Blade") {
      abilityDescription = "Deal <strong>" + (effectivenessPercent) + "% of Attack</strong> damage to a target. " + cooldown + " second cooldown.";
    }
    if (ability.name === "More Punishment") {
      abilityDescription = "Deal <strong>" + (effectivenessPercent) + "% of Attack</strong> damage to all targets. " + cooldown + " second cooldown.";
    }
    if (ability.name === "Reaper's Mark") {
      abilityDescription = "Apply a Focus effect and reduce a target's Max HP and Attack by <strong>" + (100 - relatedTargetGainStatusEffectEffectivenessPercent) + "%</strong> for <strong>" + relatedTargetGainStatusEffectDuration + "</strong> seconds. " + cooldown + " second cooldown.";
    }
    if (ability.name === "Loyal Servant") {
      abilityDescription = "Reduce all targets' Elemental Resistances by <strong>" + Math.abs(relatedTargetGainStatusEffectEffectivenessPercent) + "%</strong> for <strong>" + relatedTargetGainStatusEffectDuration + "</strong> seconds. " + cooldown + " second cooldown.";
    }
    if (ability.name === "Scythe Combo") {
      abilityDescription = "Deal <strong>" + (effectivenessPercent) + "% of Attack</strong> damage to a target two times. " + cooldown + " second cooldown.";
    }
    if (ability.name === "Death Waits For No One") {
      abilityDescription = "Increase the user's Attack and Luck by <strong>" + relatedUserGainStatusEffectEffectivenessPercent + "%</strong> for <strong>" + relatedUserGainStatusEffectDuration + "</strong> seconds. " + cooldown + " second cooldown.";
    }
    if (ability.name === "Tri-Bite") {
      abilityDescription = "Deal <strong>" + (effectivenessPercent) + "% of Attack</strong> Fire damage to a target three times. " + cooldown + " second cooldown.";
    }
    if (ability.name === "Tri-Roar") {
      abilityDescription = "Apply a Stun for <strong>" + relatedTargetGainStatusEffectDuration + "</strong> seconds and <strong>" + (secondaryRelatedTargetGainStatusEffectEffectivenessPercent) + "%</strong> Stagger and Unsteady effects for <strong>" + secondaryRelatedTargetGainStatusEffectDuration + "</strong> seconds to all targets. " + cooldown + " second cooldown.";
    }
    if (ability.name === "Loyal Guardian") {
      abilityDescription = "Give all targets' a <strong>" + (relatedTargetGainStatusEffectEffectivenessPercent) + "%</strong> Unsteady effect for <strong>" + relatedTargetGainStatusEffectDuration + "</strong> seconds. " + cooldown + " second cooldown.";
    }
    if (ability.name === "Hellfire") {
      abilityDescription = "Deal <strong>" + (effectivenessPercent) + "% of Attack</strong> Fire damage to all targets. " + cooldown + " second cooldown.";
    }
    if (ability.name === "Earthquake") {
      abilityDescription = "Deal <strong>" + (effectivenessPercent) + "% of Attack</strong> Earth damage to all targets. " + cooldown + " second cooldown.";
    }
    if (ability.name === "Natural Disaster") {
      abilityDescription = "Deal <strong>" + (effectivenessPercent) + "% of Attack</strong> damage to all targets. Repeat this for every element Hades attacked with since the last time it was used. " + cooldown + " second cooldown.";
    }
    if (ability.name === "Lord of the Underworld") {
      abilityDescription = "Give the user Lord of the Underworld, increasing Luck and Attack by <strong>" + relatedUserGainStatusEffectEffectivenessPercent + "%</strong> for <strong>" + relatedUserGainStatusEffectDuration + "</strong> seconds. This effect stacks. " + cooldown + " second cooldown.";
    }
    if (ability.name === "Fang") {
      abilityDescription = "Deal <strong>" + (effectivenessPercent) + "% of Attack</strong> damage to a target and reduce their Attack by <strong>" + (100 - relatedTargetGainStatusEffectEffectivenessPercent) + "%</strong> for <strong>" + relatedTargetGainStatusEffectDuration + "</strong> seconds. " + cooldown + " second cooldown.";
    }
    if (ability.name === "Plunge") {
      abilityDescription = "Become untargetable for for <strong>" + relatedUserGainStatusEffectDuration + "</strong> seconds. " + cooldown + " second cooldown.";
    }
    if (ability.name === "Zigzag") {
      abilityDescription = "Deal <strong>" + (effectivenessPercent) + "% of Attack</strong> damage to a target and increase the user's Agility by <strong>" + relatedUserGainStatusEffectEffectivenessPercent + "%</strong> permanently. This effect can stack. " + cooldown + " second cooldown.";
    }
    if (ability.name === "Apex Predator") {
      abilityDescription = "Increase the user's Attack and Defense by <strong>" + relatedUserGainStatusEffectEffectivenessPercent + "%</strong> for <strong>" + relatedUserGainStatusEffectDuration + "</strong> seconds. " + cooldown + " second cooldown.";
    }
    if (ability.name === "Blood in the Water") {
      abilityDescription = "Deal <strong>" + (effectivenessPercent) + "% of Attack</strong> damage to all targets and apply a damage over time effect that deals <strong>" + relatedTargetGainStatusEffectEffectivenessPercent + "% of Attack</strong> damage every " + relatedTargetGainStatusEffectTickFrequency + " seconds for <strong>" + relatedTargetGainStatusEffectDuration + "</strong> seconds. " + cooldown + " second cooldown.";
    }
    if (ability.name === "Dive") {
      abilityDescription = "Deal <strong>" + (effectivenessPercent) + "% of Attack</strong> damage to a target and then avoid all auto attacks for <strong>" + relatedUserGainStatusEffectDuration + "</strong> seconds. " + cooldown + " second cooldown.";
    }
    if (ability.name === "Trickster") {
      abilityDescription = "Reduce a target's Agility, Luck, and Resistance by <strong>" + (100 - relatedTargetGainStatusEffectEffectivenessPercent) + "%</strong> for <strong>" + relatedTargetGainStatusEffectDuration + "</strong> seconds. " + cooldown + " second cooldown.";
    }
    if (ability.name === "Throw Torch") {
      abilityDescription = "Deal <strong>" + (effectivenessPercent) + "% of Attack</strong> Fire damage to a target and apply a damage over time effect that deals <strong>" + relatedTargetGainStatusEffectEffectivenessPercent + "% of Attack</strong> Fire damage every " + relatedTargetGainStatusEffectTickFrequency + " seconds for <strong>" + relatedTargetGainStatusEffectDuration + "</strong> seconds. " + cooldown + " second cooldown.";
    }
    if (ability.name === "Shout") {
      abilityDescription = "Reduce all targets' Defense by <strong>" + (100 - relatedTargetGainStatusEffectEffectivenessPercent) + "%</strong> for <strong>" + relatedTargetGainStatusEffectDuration + "</strong> seconds and increase the party's Agility by <strong>" + relatedUserGainStatusEffectEffectivenessPercent + "%</strong> for <strong>" + relatedUserGainStatusEffectDuration + "</strong> seconds. " + cooldown + " second cooldown.";
    }
    if (ability.name === "Wild Swing") {
      abilityDescription = "Deal <strong>" + (effectivenessPercent) + "% of Attack</strong> damage to a target. Damage is randomly modified by " + (damageModifierRange * 100) + "% to " + ((damageModifierRange + 1) * 100) + "%. " + cooldown + " second cooldown.";
    }
    if (ability.name === "Wild Combo") {
      abilityDescription = "Deal <strong>" + (effectivenessPercent) + "% of Attack</strong> damage to all targets. Damage is randomly modified by " + (damageModifierRange * 100) + "% to " + ((damageModifierRange + 1) * 100) + "%. " + cooldown + " second cooldown.";
    }
    if (ability.name === "Roost") {
      abilityDescription = "Heal self for <strong>" + (effectivenessPercent) + "% of Attack</strong> HP and increase the user's Defense and Resistance by <strong>" + relatedUserGainStatusEffectEffectivenessPercent + "%</strong> for <strong>" + relatedUserGainStatusEffectDuration + "</strong> seconds. " + cooldown + " second cooldown.";
    }
    if (ability.name === "Tackle") {
      abilityDescription = "Deal <strong>" + (effectivenessPercent) + "% of Attack</strong> damage to a target and Stun the target for <strong>" + relatedTargetGainStatusEffectDuration + "</strong> seconds. " + cooldown + " second cooldown.";
    }
    if (ability.name === "Half Hearted Attack") {
      abilityDescription = "Deal <strong>" + (effectivenessPercent) + "% of Attack</strong> damage to a target. Damage is randomly modified by " + (damageModifierRange * 100) + "% to " + ((damageModifierRange + 1) * 100) + "%. " + cooldown + " second cooldown.";
    }
    if (ability.name === "Feeding Frenzy") {
      abilityDescription = "Deal <strong>" + (effectivenessPercent) + "% of Attack</strong> Water damage to a target two times. " + cooldown + " second cooldown.";
    }
    if (ability.name === "Click Click") {
      abilityDescription = "Increase the user's Attack and Agility by <strong>" + relatedUserGainStatusEffectEffectivenessPercent + "%</strong> permanently. This effect can stack. " + cooldown + " second cooldown.";
    }
    if (ability.name === "Snip Snip") {
      abilityDescription = "Deal <strong>" + (effectivenessPercent) + "% of Attack</strong> damage to a target. Apply a damage over time effect that deals an additional <strong>" + relatedTargetGainStatusEffectEffectivenessPercent + "%</strong> of the damage dealt every " + relatedTargetGainStatusEffectTickFrequency + " seconds for <strong>" + relatedTargetGainStatusEffectDuration + "</strong> seconds. " + cooldown + " second cooldown.";
    }
    if (ability.name === "Pressing Attack") {
      abilityDescription = "Deal <strong>" + (effectivenessPercent) + "% of Attack</strong> damage to a target and apply <strong>" + (secondaryRelatedTargetGainStatusEffectEffectivenessPercent) + "%</strong> Stagger and Unsteady effects for <strong>" + secondaryRelatedTargetGainStatusEffectDuration + "</strong> seconds to all targets. " + cooldown + " second cooldown.";
    }
    if (ability.name === "Harry") {
      abilityDescription = "Deal <strong>" + (effectivenessPercent) + "% of Attack</strong> damage to a target. Apply a damage over time effect that deals an additional <strong>" + effectiveAmount + "</strong> damage every " + relatedTargetGainStatusEffectTickFrequency + " seconds for <strong>" + relatedTargetGainStatusEffectDuration + "</strong> seconds. " + cooldown + " second cooldown.";
    }
    if (ability.name === "Windstorm") {
      abilityDescription = "Deal <strong>" + (effectivenessPercent) + "% of Attack</strong> Wind damage to a target and apply a damage over time effect that deals <strong>" + relatedTargetGainStatusEffectEffectivenessPercent + "% of Attack</strong> Wind damage every " + relatedTargetGainStatusEffectTickFrequency + " seconds for <strong>" + relatedTargetGainStatusEffectDuration + "</strong> seconds. " + cooldown + " second cooldown.";
    }
    if (ability.name === "Take to the Skies") {
      abilityDescription = "Increase the party's Air Damage Dealt, Agility, and Luck by <strong>" + relatedUserGainStatusEffectEffectivenessPercent + "%</strong> for <strong>" + relatedUserGainStatusEffectDuration + "</strong> seconds. " + cooldown + " second cooldown.";
    }
    if (ability.name === "Shell Cover") {
      abilityDescription = "Reduce the user's Damage Taken and increase the user's Resistance by <strong>" + relatedUserGainStatusEffectEffectivenessPercent + "%</strong> for <strong>" + relatedUserGainStatusEffectDuration + "</strong> seconds. " + cooldown + " second cooldown.";
    }
    if (ability.name === "Found Dinner") {
      abilityDescription = "Heal self for <strong>" + (effectivenessPercent) + "% of Attack</strong> HP and increase the user's Agility by <strong>" + relatedUserGainStatusEffectEffectivenessPercent + "%</strong> for <strong>" + relatedUserGainStatusEffectDuration + "</strong> seconds. " + cooldown + " second cooldown.";
    }
    if (ability.name === "Arm Swing") {
      abilityDescription = "Deal <strong>" + (effectivenessPercent) + "% of Attack</strong> damage to a target. Damage is randomly modified by " + (damageModifierRange * 100) + "% to " + ((damageModifierRange + 1) * 100) + "%. " + cooldown + " second cooldown.";
    }
    if (ability.name === "Aggressive Swipe") {
      abilityDescription = "Deal <strong>" + (effectivenessPercent) + "% of Attack</strong> damage to a target. Damage is randomly modified by " + (damageModifierRange * 100) + "% to " + ((damageModifierRange + 1) * 100) + "%. Increase the user's Attack by <strong>" + relatedUserGainStatusEffectEffectivenessPercent + "%</strong> for <strong>" + relatedUserGainStatusEffectDuration + "</strong> seconds. " + cooldown + " second cooldown.";
    }
    if (ability.name === "Mindless Attacks") {
      abilityDescription = "Deal <strong>" + (effectivenessPercent) + "% of Attack</strong> damage to all targets. Damage is randomly modified by " + (damageModifierRange * 100) + "% to " + ((damageModifierRange + 1) * 100) + "%. " + cooldown + " second cooldown.";
    }
    if (ability.name === "From Above") {
      abilityDescription = "Deal <strong>" + (effectivenessPercent) + "% of Attack</strong> Air damage to a target. " + cooldown + " second cooldown.";
    }
    if (ability.name === "Stinger") {
      abilityDescription = "Deal <strong>" + (effectivenessPercent) + "% of Attack</strong> damage to a target. Apply a damage over time effect that deals an additional <strong>" + relatedTargetGainStatusEffectEffectivenessPercent + "%</strong> of the damage dealt every " + relatedTargetGainStatusEffectTickFrequency + " seconds for <strong>" + relatedTargetGainStatusEffectDuration + "</strong> seconds. " + cooldown + " second cooldown.";
    }
    if (ability.name === "Weave" || ability.name === "Oath: Weave") {
      abilityDescription = "Deal <strong>" + (effectivenessPercent) + "% of Attack</strong> Water damage to a target and apply Unsteady debuff, reducing ability cooldown speed by " + relatedTargetGainStatusEffectEffectivenessPercent + "% for " + relatedTargetGainStatusEffectDuration + " seconds. " + cooldown + " second cooldown.";
    }
    if (ability.name === "Bombardment") {
      abilityDescription = "Deal <strong>" + (effectivenessPercent) + "% of Attack</strong> Air damage to all targets. " + cooldown + " second cooldown.";
    }
    if (ability.name === "Gouge") {
      abilityDescription = "Deal <strong>" + (effectivenessPercent) + "% of Attack</strong> Air damage to a target and apply a <strong>" + (relatedTargetGainStatusEffectEffectivenessPercent) + "%</strong> Blind for <strong>" + relatedTargetGainStatusEffectDuration + "</strong> seconds. " + cooldown + " second cooldown.";
    }
    if (ability.name === "Sky High") {
      abilityDescription = "Deal <strong>" + (effectivenessPercent) + "% of Attack</strong> damage to a target, clear all debuffs on you, and become Untargetable for <strong>" + relatedUserGainStatusEffectDuration + "</strong> seconds. " + cooldown + " second cooldown.";
    }
    if (ability.name === "Rake") {
      abilityDescription = "Deal <strong>" + (effectivenessPercent) + "% of Attack</strong> Air damage to a target and reduce their Agility and Defense by <strong>" + (100 - relatedTargetGainStatusEffectEffectivenessPercent) + "%</strong> for <strong>" + relatedTargetGainStatusEffectDuration + "</strong> seconds. " + cooldown + " second cooldown.";
    }
    if (ability.name === "Talon Combo") {
      abilityDescription = "Deal <strong>" + (effectivenessPercent) + "% of Attack</strong> Air damage to a target two times. " + cooldown + " second cooldown.";
    }
    if (ability.name === "Sharpen Talons") {
      abilityDescription = "Increase the user's Attack and Luck by <strong>" + relatedUserGainStatusEffectEffectivenessPercent + "%</strong> for <strong>" + relatedUserGainStatusEffectDuration + "</strong> seconds. " + cooldown + " second cooldown.";
    }
    if (ability.name === "Wind Tunnel") {
      abilityDescription = "Deal <strong>" + (effectivenessPercent) + "% of Attack</strong> Air damage to a target. Reduce target's auto attack cooldown rate by <strong>" + (100 - relatedTargetGainStatusEffectEffectivenessPercent) + "%</strong> for <strong>" + relatedTargetGainStatusEffectDuration + "</strong> seconds. " + cooldown + " second cooldown.";
    }
    if (ability.name === "Rushdown") {
      abilityDescription = "Deal <strong>" + (effectivenessPercent) + "% of Attack</strong> damage to a target three times. " + cooldown + " second cooldown.";
    }
    if (ability.name === "Lumbering Swipe") {
      abilityDescription = "Deal <strong>" + (effectivenessPercent) + "% of Attack</strong> damage to all targets. Damage is randomly modified by " + (damageModifierRange * 100) + "% to " + ((damageModifierRange + 1) * 100) + "%. " + cooldown + " second cooldown.";
    }
    if (ability.name === "Hunker Down") {
      abilityDescription = "Reduce the user's Damage Taken and increase the user's Resistance by <strong>" + relatedUserGainStatusEffectEffectivenessPercent + "%</strong> for <strong>" + relatedUserGainStatusEffectDuration + "</strong> seconds. " + cooldown + " second cooldown.";
    }
    if (ability.name === "Shuffle") {
      abilityDescription = "Avoid all auto attacks for <strong>" + relatedUserGainStatusEffectDuration + "</strong> seconds.";
    }
    if (ability.name === "Rock Punch") {
      abilityDescription = "Deal <strong>" + (effectivenessPercent) + "% of Attack</strong> damage to a target and reduce their Healing Received by <strong>" + (100 - relatedTargetGainStatusEffectEffectivenessPercent) + "%</strong> for <strong>" + relatedTargetGainStatusEffectDuration + "</strong> seconds. " + cooldown + " second cooldown.";
    }
    if (ability.name === "Despair") {
      abilityDescription = "Deal <strong>" + (effectivenessPercent) + "% of Attack</strong> damage to all targets and apply a damage over time effect that deals <strong>" + relatedTargetGainStatusEffectEffectivenessPercent + "% of Attack</strong> damage every " + relatedTargetGainStatusEffectTickFrequency + " seconds for <strong>" + relatedTargetGainStatusEffectDuration + "</strong> seconds. " + cooldown + " second cooldown.";
    }
    if (ability.name === "Flame Breath") {
      abilityDescription = "Deal <strong>" + (effectivenessPercent) + "% of Attack</strong> Fire damage to a target and apply a damage over time effect that deals <strong>" + relatedTargetGainStatusEffectEffectivenessPercent + "% of Attack</strong> Fire damage every " + relatedTargetGainStatusEffectTickFrequency + " seconds for <strong>" + relatedTargetGainStatusEffectDuration + "</strong> seconds. " + cooldown + " second cooldown.";
    }
    if (ability.name === "Flaming Stomp") {
      abilityDescription = "Deal <strong>" + (effectivenessPercent) + "% of Attack</strong> Fire damage to all targets. " + cooldown + " second cooldown.";
    }
    if (ability.name === "Snarl") {
      abilityDescription = "Increase the user's Multi Target Damage by <strong>" + relatedUserGainStatusEffectEffectivenessPercent + "%</strong> permanently. This effect can stack. " + cooldown + " second cooldown.";
    }
    if (ability.name === "Aeëtes' Protection") {
      abilityDescription = "Increase the user's Defense and Resistance by <strong>" + relatedUserGainStatusEffectEffectivenessPercent + "%</strong> for <strong>" + relatedUserGainStatusEffectDuration + "</strong> seconds. " + cooldown + " second cooldown.";
    }
    if (ability.name === "Khalkotauroi Fury") {
      abilityDescription = "After the first Khalkotauroi dies, apply a damage over time effect that deals <strong>" + relatedTargetGainStatusEffectEffectivenessPercent + "% of Attack</strong> Fire damage after <strong>" + relatedTargetGainStatusEffectDuration + "</strong> seconds.";
    }
    if (ability.name === "Nip") {
      abilityDescription = "Deal <strong>" + (effectivenessPercent) + "% of Attack</strong> damage to a target. " + cooldown + " second cooldown.";
    }
    if (ability.name === "Electric Shock") {
      abilityDescription = "Deal <strong>" + (effectivenessPercent) + "% of Attack</strong> Lightning damage to a target and apply Paralyze for <strong>" + relatedTargetGainStatusEffectDuration + "</strong> seconds. " + cooldown + " second cooldown.";
    }
    if (ability.name === "Swarm Attack") {
      abilityDescription = "Deal <strong>" + (effectivenessPercent) + "% of Attack</strong> Water damage to a target three times. " + cooldown + " second cooldown.";
    }

    return abilityDescription;
  }

  getStatusEffectDescription(statusEffect: StatusEffect) {
    var description = "";

    if (statusEffect.type === StatusEffectEnum.AgilityUp)
      description = "Increase Agility by " + Math.round((statusEffect.effectiveness - 1) * 100) + "%.";
    if (statusEffect.type === StatusEffectEnum.AttackUp)
      description = "Increase Attack by " + Math.round((statusEffect.effectiveness - 1) * 100) + "%.";
    if (statusEffect.type === StatusEffectEnum.DefenseUp)
      description = "Increase Defense by " + Math.round((statusEffect.effectiveness - 1) * 100) + "%.";
    if (statusEffect.type === StatusEffectEnum.LuckUp)
      description = "Increase Luck by " + Math.round((statusEffect.effectiveness - 1) * 100) + "%.";
    if (statusEffect.type === StatusEffectEnum.ResistanceUp)
      description = "Increase Resistance by " + Math.round((statusEffect.effectiveness - 1) * 100) + "%.";
    if (statusEffect.type === StatusEffectEnum.MaxHpUp)
      description = "Increase Max HP by " + Math.round((statusEffect.effectiveness - 1) * 100) + "%.";
    if (statusEffect.type === StatusEffectEnum.DamageDealtUp)
      description = "Increase damage dealt by " + Math.round((statusEffect.effectiveness - 1) * 100) + "%.";
    if (statusEffect.type === StatusEffectEnum.DamageTakenUp)
      description = "Increase damage taken by " + Math.round((statusEffect.effectiveness - 1) * 100) + "%.";

    if (statusEffect.type === StatusEffectEnum.AgilityDown)
      description = "Decrease Agility by " + Math.round((1 - statusEffect.effectiveness) * 100) + "%.";
    if (statusEffect.type === StatusEffectEnum.AttackDown)
      description = "Decrease Attack by " + Math.round((1 - statusEffect.effectiveness) * 100) + "%.";
    if (statusEffect.type === StatusEffectEnum.DefenseDown)
      description = "Decrease Defense by " + Math.round((1 - statusEffect.effectiveness) * 100) + "%.";
    if (statusEffect.type === StatusEffectEnum.LuckDown)
      description = "Decrease Luck by " + Math.round((1 - statusEffect.effectiveness) * 100) + "%.";
    if (statusEffect.type === StatusEffectEnum.ResistanceDown)
      description = "Decrease Resistance by " + Math.round((1 - statusEffect.effectiveness) * 100) + "%.";
    if (statusEffect.type === StatusEffectEnum.MaxHpDown)
      description = "Decrease Max HP by " + Math.round((1 - statusEffect.effectiveness) * 100) + "%.";
    if (statusEffect.type === StatusEffectEnum.DamageDealtDown)
      description = "Decrease damage dealt by " + Math.round((1 - statusEffect.effectiveness) * 100) + "%.";
    if (statusEffect.type === StatusEffectEnum.DamageTakenDown)
      description = "Decrease damage taken by " + Math.round((1 - statusEffect.effectiveness) * 100) + "%.";

    if (statusEffect.type === StatusEffectEnum.EarthDamageUp)
      description = "Increase Earth damage dealt by " + Math.round((statusEffect.effectiveness - 1) * 100) + "%.";
    if (statusEffect.type === StatusEffectEnum.FireDamageUp)
      description = "Increase Fire damage dealt by " + Math.round((statusEffect.effectiveness - 1) * 100) + "%.";
    if (statusEffect.type === StatusEffectEnum.AirDamageUp)
      description = "Increase Air damage dealt by " + Math.round((statusEffect.effectiveness - 1) * 100) + "%.";
    if (statusEffect.type === StatusEffectEnum.HolyDamageUp)
      description = "Increase Holy damage dealt by " + Math.round((statusEffect.effectiveness - 1) * 100) + "%.";
    if (statusEffect.type === StatusEffectEnum.WaterDamageUp)
      description = "Increase Water damage dealt by " + Math.round((statusEffect.effectiveness - 1) * 100) + "%.";
    if (statusEffect.type === StatusEffectEnum.LightningDamageUp)
      description = "Increase Lightning damage dealt by " + Math.round((statusEffect.effectiveness - 1) * 100) + "%.";

    if (statusEffect.type === StatusEffectEnum.EarthDamageDown)
      description = "Reduce Earth damage dealt by " + Math.round((1 - statusEffect.effectiveness) * 100) + "%.";
    if (statusEffect.type === StatusEffectEnum.FireDamageDown)
      description = "Reduce Fire damage dealt by " + Math.round((1 - statusEffect.effectiveness) * 100) + "%.";
    if (statusEffect.type === StatusEffectEnum.AirDamageDown)
      description = "Reduce Air damage dealt by " + Math.round((1 - statusEffect.effectiveness) * 100) + "%.";
    if (statusEffect.type === StatusEffectEnum.HolyDamageDown)
      description = "Reduce Holy damage dealt by " + Math.round((1 - statusEffect.effectiveness) * 100) + "%.";
    if (statusEffect.type === StatusEffectEnum.WaterDamageDown)
      description = "Reduce Water damage dealt by " + Math.round((1 - statusEffect.effectiveness) * 100) + "%.";
    if (statusEffect.type === StatusEffectEnum.LightningDamageDown)
      description = "Reduce Lightning damage dealt by " + Math.round((1 - statusEffect.effectiveness) * 100) + "%.";

    if (statusEffect.type === StatusEffectEnum.EarthDamageTakenUp)
      description = "Increase Earth damage taken by " + Math.round((statusEffect.effectiveness - 1) * 100) + "%.";
    if (statusEffect.type === StatusEffectEnum.FireDamageTakenUp)
      description = "Increase Fire damage taken by " + Math.round((statusEffect.effectiveness - 1) * 100) + "%.";
    if (statusEffect.type === StatusEffectEnum.AirDamageTakenUp)
      description = "Increase Air damage taken by " + Math.round((statusEffect.effectiveness - 1) * 100) + "%.";
    if (statusEffect.type === StatusEffectEnum.HolyDamageTakenUp)
      description = "Increase Holy damage taken by " + Math.round((statusEffect.effectiveness - 1) * 100) + "%.";
    if (statusEffect.type === StatusEffectEnum.WaterDamageTakenUp)
      description = "Increase Water damage taken by " + Math.round((statusEffect.effectiveness - 1) * 100) + "%.";
    if (statusEffect.type === StatusEffectEnum.LightningDamageTakenUp)
      description = "Increase Lightning damage taken by " + Math.round((statusEffect.effectiveness - 1) * 100) + "%.";

    if (statusEffect.type === StatusEffectEnum.EarthDamageTakenDown)
      description = "Reduce Earth damage taken by " + Math.round((1 - statusEffect.effectiveness) * 100) + "%.";
    if (statusEffect.type === StatusEffectEnum.FireDamageTakenDown)
      description = "Reduce Fire damage taken by " + Math.round((1 - statusEffect.effectiveness) * 100) + "%.";
    if (statusEffect.type === StatusEffectEnum.AirDamageTakenDown)
      description = "Reduce Air damage taken by " + Math.round((1 - statusEffect.effectiveness) * 100) + "%.";
    if (statusEffect.type === StatusEffectEnum.HolyDamageTakenDown)
      description = "Reduce Holy damage taken by " + Math.round((1 - statusEffect.effectiveness) * 100) + "%.";
    if (statusEffect.type === StatusEffectEnum.WaterDamageTakenDown)
      description = "Reduce Water damage taken by " + Math.round((1 - statusEffect.effectiveness) * 100) + "%.";
    if (statusEffect.type === StatusEffectEnum.LightningDamageTakenDown)
      description = "Reduce Lightning damage taken by " + Math.round((1 - statusEffect.effectiveness) * 100) + "%.";

    if (statusEffect.type === StatusEffectEnum.AoeDamageUp)
      description = "Increase multi target damage dealt by " + Math.round((statusEffect.effectiveness - 1) * 100) + "%.";

    if (statusEffect.type === StatusEffectEnum.ReduceHealing)
      description = "Decrease healing received by " + Math.round((1 - statusEffect.effectiveness) * 100) + "% from all sources.";
    if (statusEffect.type === StatusEffectEnum.Blind)
      description = "Auto attacks have a " + Math.round((statusEffect.effectiveness) * 100) + "% chance to miss, dealing no damage and not triggering any associated effects.";
    if (statusEffect.type === StatusEffectEnum.Fortissimo)
      description = "Apollo is playing at Fortissimo.";
    if (statusEffect.type === StatusEffectEnum.Coda)
      description = "Apollo is playing a Coda.";
    if (statusEffect.type === StatusEffectEnum.Staccato)
      description = "Apollo is playing a Staccato.";
    if (statusEffect.type === StatusEffectEnum.Dead)
      description = "This character is dead.";
    if (statusEffect.type === StatusEffectEnum.Dodge)
      description = "Avoid all auto attacks.";
    if (statusEffect.type === StatusEffectEnum.Untargetable)
      description = "Cannot be targeted directly by any attacks.";
    if (statusEffect.type === StatusEffectEnum.InstantHealAfterAutoAttack)
      description = "Your next auto attack will also heal you for " + statusEffect.effectiveness + " HP.";
    if (statusEffect.type === StatusEffectEnum.Mark)
      description = "Damage against this target is increased by " + this.utilityService.roundTo(((statusEffect.effectiveness - 1) * 100), 2) + "%.";
    if (statusEffect.type === StatusEffectEnum.Thyrsus)
      description = "Damage against this target is increased by " + this.utilityService.roundTo(((statusEffect.effectiveness - 1) * 100), 2) + "%.";
    if (statusEffect.type === StatusEffectEnum.Stun)
      description = "Auto attack and ability cooldowns are not charging.";
    if (statusEffect.type === StatusEffectEnum.Paralyze)
      description = "10% chance every second to be stunned for 2 seconds.";
    if (statusEffect.type === StatusEffectEnum.RecentlyDefeated)
      description = "You have recently been defeated and are still nursing your wounds. Your primary stats are reduced by " + Math.round((1 - statusEffect.effectiveness) * 100) + "%.";
    if (statusEffect.type === StatusEffectEnum.ThousandCuts)
      description = "Deal increased damage after every attack. Current damage increase: " + this.utilityService.genericRound(((statusEffect.effectiveness - 1) * statusEffect.count) * 100);
    if (statusEffect.type === StatusEffectEnum.DamageOverTime)
      description = "Taking " + Math.round(statusEffect.effectiveness) + " damage every " + this.utilityService.roundTo(statusEffect.tickFrequency, 2) + " seconds.";
    if (statusEffect.type === StatusEffectEnum.Thorns)
      description = "Dealing damage back to auto attackers.";
    if (statusEffect.type === StatusEffectEnum.Stagger)
      description = "Decrease auto attack cooldown speed by " + Math.round((statusEffect.effectiveness) * 100) + "%.";
    if (statusEffect.type === StatusEffectEnum.Unsteady)
      description = "Decrease ability cooldown speed by " + Math.round((statusEffect.effectiveness) * 100) + "%.";
    if (statusEffect.type === StatusEffectEnum.Enfire)
      description = "All auto attacks and non-elemental abilities have the Fire element.";
    if (statusEffect.type === StatusEffectEnum.Enholy)
      description = "All auto attacks and non-elemental abilities have the Holy element.";
    if (statusEffect.type === StatusEffectEnum.Enearth)
      description = "All auto attacks and non-elemental abilities have the Earth element.";
    if (statusEffect.type === StatusEffectEnum.Enwater)
      description = "All auto attacks and non-elemental abilities have the Water element.";
    if (statusEffect.type === StatusEffectEnum.Enlightning)
      description = "All auto attacks and non-elemental abilities have the Lightning element.";
    if (statusEffect.type === StatusEffectEnum.Enair)
      description = "All auto attacks and non-elemental abilities have the Air element.";
    if (statusEffect.type === StatusEffectEnum.AbsorbElementalDamage && statusEffect.element === ElementalTypeEnum.Air)
      description = "Absorbing Air damage.";
    if (statusEffect.type === StatusEffectEnum.AbsorbElementalDamage && statusEffect.element === ElementalTypeEnum.Holy)
      description = "Absorbing Holy damage.";
    if (statusEffect.type === StatusEffectEnum.AbsorbElementalDamage && statusEffect.element === ElementalTypeEnum.Lightning)
      description = "Absorbing Lightning damage.";
    if (statusEffect.type === StatusEffectEnum.AbsorbElementalDamage && statusEffect.element === ElementalTypeEnum.Fire)
      description = "Absorbing Fire damage.";
    if (statusEffect.type === StatusEffectEnum.AbsorbElementalDamage && statusEffect.element === ElementalTypeEnum.Water)
      description = "Absorbing Water damage.";
    if (statusEffect.type === StatusEffectEnum.AbsorbElementalDamage && statusEffect.element === ElementalTypeEnum.Earth)
      description = "Absorbing Earth damage.";
    if (statusEffect.type === StatusEffectEnum.ReduceDirectDamage)
      description = "Decrease any direct damage by " + Math.round(statusEffect.effectiveness) + ".";
    if (statusEffect.type === StatusEffectEnum.BlessingOfDionysus)
      description = Math.round((1 - statusEffect.effectiveness) * 100) + "% chance to avoid negative status effects.";
    if (statusEffect.type === StatusEffectEnum.AllElementalResistanceDown)
      description = "All elemental resistances reduced by " + Math.abs(statusEffect.effectiveness * 100) + "%.";
    if (statusEffect.type === StatusEffectEnum.Focus)
      description = statusEffect.caster + " is focusing all attacks on you.";
    if (statusEffect.type === StatusEffectEnum.Taunt)
      description = "All of your attacks must target " + statusEffect.caster + ".";
    if (statusEffect.type === StatusEffectEnum.BattleItemDamageUp)
      description = "Increase damage dealt by battle items by " + Math.round((statusEffect.effectiveness - 1) * 100) + "%."
    if (statusEffect.type === StatusEffectEnum.BattleItemEffectUp)
      description = "Increase healing or damage dealt by battle items by " + Math.round((statusEffect.effectiveness - 1) * 100) + "%. (Does not increase effectiveness of items that grant effects)";

    if (statusEffect.type === StatusEffectEnum.DebilitatingToxin)
      description = "10% chance on auto attack to reduce target's Agility by 20% for 14 seconds.";
    if (statusEffect.type === StatusEffectEnum.PoisonousToxin)
      description = "10% chance on auto attack to deal 65 additional damage.";
    if (statusEffect.type === StatusEffectEnum.WitheringToxin)
      description = "10% chance on auto attack to reduce target's Attack by 20% for 16 seconds.";
    if (statusEffect.type === StatusEffectEnum.VenomousToxin)
      description = "10% chance on auto attack to deal 432 additional damage.";

    if (statusEffect.type === StatusEffectEnum.HeroicElixir)
      description = "Increase Max HP by " + Math.round((statusEffect.effectiveness - 1) * 100) + "%.";
    if (statusEffect.type === StatusEffectEnum.RejuvenatingElixir)
      description = "Increase HP Regen by " + statusEffect.effectiveness + " HP per 5 seconds.";
    if (statusEffect.type === StatusEffectEnum.ElixirOfFortitude)
      description = "Increase Defense by " + Math.round((statusEffect.effectiveness - 1) * 100) + "%.";

    if (statusEffect.type === StatusEffectEnum.LordOfTheUnderworld)
      description = "Increasing Luck and Attack by <strong>" + this.utilityService.roundTo((statusEffect.effectiveness - 1) * 100, 2) + "%</strong>. " + statusEffect.stackCount + " total " + (statusEffect.stackCount === 1 ? "stack" : "stacks") + " worth " + this.utilityService.roundTo(((statusEffect.effectiveness - 1) / statusEffect.stackCount) * 100, 2) + "% each.";
    if (statusEffect.type === StatusEffectEnum.Onslaught)
      description = "Your next damaging ability will also apply a damage over time effect onto its targets.";
    if (statusEffect.type === StatusEffectEnum.DispenserOfDues)
      description = "Increase your next damaging ability by " + statusEffect.effectiveness + ".";
    if (statusEffect.type === StatusEffectEnum.Retribution)
      description = "Reduce the damage of the next " + statusEffect.count + " attacks you receive by " + Math.round((1 - statusEffect.effectiveness) * 100) + "% and counter attack the enemy who attacked you.";
      if (statusEffect.type === StatusEffectEnum.ChainsOfFate)
      description = "All of your attacks must target the enemy with Chains of Fate, and all of their attacks will target you.";


    return description;
  }

  getAltarEffectDescription(effect: AltarEffect) {
    var description = "";

    var duration = Math.round(effect.duration);
    var durationString = "";
    if (duration < 60) {
      if (duration === 1)
        durationString = duration + " second";
      else
        durationString = duration + " seconds";
    }
    else {
      if (Math.ceil(duration / 60) === 1)
        durationString = Math.ceil(duration / 60) + " minute";
      else
        durationString = Math.ceil(duration / 60) + " minutes";
    }

    /*if (effect.type === AltarEffectsEnum.SmallAltarPrayStrength)
      description = "Increase all Primary Stats by " + Math.round((effect.effectiveness - 1) * 100) + "%.<br/>Remaining Duration: " + durationString + "<br/>";
    if (effect.type === AltarEffectsEnum.SmallAltarPrayFortune)
      description = "Increase Coin gain from battle by " + Math.round((effect.effectiveness - 1) * 100) + "%.<br/>Remaining Duration: " + durationString + "<br/>";
*/
    if (effect.type === AltarEffectsEnum.AttackUp)
      description = "Increase Attack of all party members by " + this.utilityService.roundTo(((effect.effectiveness - 1) * 100), 2) + "%.";
    if (effect.type === AltarEffectsEnum.AthenaDefenseUp)
      description = "Increase Defense of all party members by " + this.utilityService.roundTo(((effect.effectiveness - 1) * 100), 2) + "%.";
    if (effect.type === AltarEffectsEnum.AthenaHeal)
      description = "When the duration expires, heal all party members for " + effect.effectiveness + " HP.";
    if (effect.type === AltarEffectsEnum.AthenaHealOverTime)
      description = "Heal all party members for " + effect.effectiveness + " HP every " + effect.tickFrequency + " seconds.";
    if (effect.type === AltarEffectsEnum.ArtemisLuckUp)
      description = "Increase Luck of all party members by " + this.utilityService.roundTo(((effect.effectiveness - 1) * 100), 2) + "%.";
    if (effect.type === AltarEffectsEnum.ArtemisCriticalDamageUp)
      description = "Increase Critical Damage Multiplier of all party members by " + this.utilityService.roundTo(((effect.effectiveness - 1) * 100), 2) + "%.";
    if (effect.type === AltarEffectsEnum.ArtemisDefenseDebuff)
      description = "When the duration expires, reduce all enemies' Defense by " + this.utilityService.roundTo(((1 - effect.effectiveness) * 100), 2) + "%.";
    if (effect.type === AltarEffectsEnum.HermesAgilityUp)
      description = "Increase Agility of all party members by " + this.utilityService.roundTo(((effect.effectiveness - 1) * 100), 2) + "%.";
    if (effect.type === AltarEffectsEnum.HermesAutoAttackUp)
      description = "Increase Auto Attack Damage of all party members by " + this.utilityService.roundTo(((effect.effectiveness - 1) * 100), 2) + "%.";
    if (effect.type === AltarEffectsEnum.HermesAbilityCooldown)
      description = "When the duration expires, reduce all party members' ability cooldowns by " + this.utilityService.roundTo(((effect.effectiveness - 1) * 100), 2) + "%.";
    if (effect.type === AltarEffectsEnum.ApolloBuffDurationUp)
      description = "Increase the duration of any buffs applied while this is active by " + this.utilityService.roundTo(((effect.effectiveness - 1) * 100), 2) + "%.";
    if (effect.type === AltarEffectsEnum.ApolloResistanceUp)
      description = "Increase Resistance of all party members by " + this.utilityService.roundTo(((effect.effectiveness - 1) * 100), 2) + "%.";
    if (effect.type === AltarEffectsEnum.ApolloHeal)
      description = "Heal the party member with the lowest HP % for " + effect.effectiveness + " HP.";
    if (effect.type === AltarEffectsEnum.AthenaRareHealOverTime)
      description = "Heal all party members for " + effect.effectiveness + " HP every " + effect.tickFrequency + " seconds.";
    if (effect.type === AltarEffectsEnum.AthenaRareBlind)
      description = "When the duration expires, apply a " + this.utilityService.roundTo(((effect.effectiveness - 1) * 100), 2) + "% Blind debuff to all enemies.";
    if (effect.type === AltarEffectsEnum.AthenaRareHolyDamageIncrease)
      description = "Increase Holy Damage Dealt by all party members by " + this.utilityService.roundTo(((effect.effectiveness - 1) * 100), 2) + "%.";
    if (effect.type === AltarEffectsEnum.ArtemisRareAttackDebuff)
      description = "When the duration expires, reduce all enemies' Attack by " + this.utilityService.roundTo(((1 - effect.effectiveness) * 100), 2) + "%.";
    if (effect.type === AltarEffectsEnum.ArtemisRareCriticalDamageUp)
      description = "Increase Critical Damage Multiplier of all party members by " + this.utilityService.roundTo(((effect.effectiveness - 1) * 100), 2) + "%.";
    if (effect.type === AltarEffectsEnum.ArtemisRareDebuffDurationUp)
      description = "Increase the duration of any debuffs applied while this is active by " + this.utilityService.roundTo(((effect.effectiveness - 1) * 100), 2) + "%.";
    if (effect.type === AltarEffectsEnum.HermesRareAutoAttackUp)
      description = "Increase Auto Attack Damage of all party members by " + this.utilityService.roundTo(((effect.effectiveness - 1) * 100), 2) + "%.";
    if (effect.type === AltarEffectsEnum.HermesRareReduceAbilityCooldownOverTime)
      description = "Reduce all party members' ability cooldowns by " + this.utilityService.roundTo(((effect.effectiveness - 1) * 100), 2) + "% every " + effect.tickFrequency + " seconds.";
    if (effect.type === AltarEffectsEnum.HermesRareReduceAutoAttackCooldown)
      description = "While this is active, reduce all party members' auto attack cooldown by " + this.utilityService.roundTo(((1 - effect.effectiveness) * 100), 2) + "%.";
    if (effect.type === AltarEffectsEnum.ApolloRareHpRegenIncrease)
      description = "Increase HP Regen of all party members by " + this.utilityService.roundTo(((effect.effectiveness - 1) * 100), 2) + "%.";
    if (effect.type === AltarEffectsEnum.ApolloRareBuffDurationUp)
      description = "Increase the duration of any buffs applied while this is active by " + this.utilityService.roundTo(((effect.effectiveness - 1) * 100), 2) + "%.";
    if (effect.type === AltarEffectsEnum.ApolloRareOstinato)
      description = "When the duration expires, trigger an Ostinato at " + this.utilityService.roundTo(((effect.effectiveness - 1) * 100), 2) + "% effectiveness.";
    if (effect.type === AltarEffectsEnum.AresDamageOverTime)
      description = "When the duration expires, apply a Damage over Time effect on all enemies, dealing " + this.utilityService.roundTo(((effect.effectiveness)), 2) + " damage every 3 seconds for 12 seconds.";
    if (effect.type === AltarEffectsEnum.AresMaxHpUp)
      description = "Increase Max HP of all party members by " + this.utilityService.roundTo(((effect.effectiveness - 1) * 100), 2) + "%.";
    if (effect.type === AltarEffectsEnum.AresOverdriveGain)
      description = "When the duration expires, fill " + this.utilityService.roundTo(((effect.effectiveness - 1) * 100), 2) + "% of each party member's Overdrive gauge.";
    if (effect.type === AltarEffectsEnum.AresRareOverdriveGain)
      description = "When the duration expires, fill " + this.utilityService.roundTo(((effect.effectiveness - 1) * 100), 2) + "% of each party member's Overdrive gauge.";
    if (effect.type === AltarEffectsEnum.AresRareIncreaseDamageOverTimeDamage)
      description = "Increase damage over time effectiveness by " + this.utilityService.roundTo(((effect.effectiveness - 1) * 100), 2) + "%";
    if (effect.type === AltarEffectsEnum.AresRareDealHpDamage)
      description = "When the duration expires, deal an amount equal to " + this.utilityService.roundTo(((1 - effect.effectiveness) * 100), 2) + "% of the party's total current HP to all enemies.";
    if (effect.type === AltarEffectsEnum.HadesFireDamageUp)
      description = "Increase Fire Damage Dealt by all party members by " + this.utilityService.roundTo(((effect.effectiveness - 1) * 100), 2) + "%.";
    if (effect.type === AltarEffectsEnum.HadesEarthDamageUp)
      description = "Increase Earth Damage Dealt by all party members by " + this.utilityService.roundTo(((effect.effectiveness - 1) * 100), 2) + "%.";
    if (effect.type === AltarEffectsEnum.HadesAoeDamageUp)
      description = "Increase the damage of any attack that hits multiple enemies by " + this.utilityService.roundTo(((effect.effectiveness - 1) * 100), 2) + "%.";
    if (effect.type === AltarEffectsEnum.HadesRareAoeDamageUp)
      description = "Increase the damage of any attack that hits multiple enemies by " + this.utilityService.roundTo(((effect.effectiveness - 1) * 100), 2) + "%.";
    if (effect.type === AltarEffectsEnum.HadesRareElementalDamageUp)
      description = "Increase all Elemental Damage Dealt by all party members by " + this.utilityService.roundTo(((effect.effectiveness - 1) * 100), 2) + "%.";
    if (effect.type === AltarEffectsEnum.HadesRareDealElementalDamage)
      description = "Deal " + effect.effectiveness + " " + this.getElementName(effect.element) + " damage to all enemies every " + effect.tickFrequency + " seconds.";
    if (effect.type === AltarEffectsEnum.DionysusRandomDebuff)
      description = "When the duration expires, reduce a random stat by " + this.utilityService.roundTo(((1 - effect.effectiveness) * 100), 2) + "% for all enemies.";
    if (effect.type === AltarEffectsEnum.DionysusRandomBuff)
      description = "When the duration expires, increase a random stat by " + this.utilityService.roundTo(((effect.effectiveness - 1) * 100), 2) + "% for all party members.";
    if (effect.type === AltarEffectsEnum.DionysusSingleBarrier)
      description = "When the duration expires, give a random party member a barrier for " + this.utilityService.roundTo(((effect.effectiveness - 1) * 100), 2) + "% of their HP.";
    if (effect.type === AltarEffectsEnum.DionysusRareMultiBarrier)
      description = "When the duration expires, give all party members a barrier for " + this.utilityService.roundTo(((effect.effectiveness - 1) * 100), 2) + "% of their HP.";
    if (effect.type === AltarEffectsEnum.DionysusRareFullDebuffs)
      description = "When the duration expires, reduce all primary stats of a target by " + this.utilityService.roundTo(((1 - effect.effectiveness) * 100), 2) + "%.";
    if (effect.type === AltarEffectsEnum.DionysusRareFastDebuffs)
      description = "Reduce the duration of any debuffs inflicted on party members by " + this.utilityService.roundTo(((effect.effectiveness - 1) * 100), 2) + "%.";
    if (effect.type === AltarEffectsEnum.NemesisLuckDebuff)
      description = "When the duration expires, reduce all enemies' Luck by " + this.utilityService.roundTo(((1 - effect.effectiveness) * 100), 2) + "%.";
    if (effect.type === AltarEffectsEnum.NemesisThorns)
      description = "Deal " + this.utilityService.roundTo(((effect.effectiveness - 1) * 100), 2) + "% of damage taken by party members back to their attacker.";
    if (effect.type === AltarEffectsEnum.NemesisDealDamage)
      description = "Deal " + effect.effectiveness + " damage to an enemy every " + effect.tickFrequency + " seconds.";
    if (effect.type === AltarEffectsEnum.NemesisRareThorns)
      description = "Deal " + this.utilityService.roundTo(((effect.effectiveness - 1) * 100), 2) + "% of damage taken by party members back to their attacker.";
    if (effect.type === AltarEffectsEnum.NemesisRareArmorPenetrationUp)
      description = "Increase the Armor Penetration of all party members by " + this.utilityService.roundTo(((effect.effectiveness - 1) * 100), 2) + "%.";
    if (effect.type === AltarEffectsEnum.NemesisRareDuesUp)
      description = "Increase the Dues of the party member using Nemesis by " + this.utilityService.roundTo(((effect.effectiveness - 1) * 100), 2) + "%.";

    description += "<br/>Remaining Duration: " + durationString + "<br/><hr/>";
    return description;
  }

  getBaseAltarEffectDescription(effect: AltarEffect) {
    var description = "";

    var duration = Math.round(effect.duration);
    var durationString = "";
    if (duration < 60) {
      if (duration === 1)
        durationString = duration + " second";
      else
        durationString = duration + " seconds";
    }
    else {
      if (Math.ceil(duration / 60) === 1)
        durationString = Math.ceil(duration / 60) + " minute";
      else
        durationString = Math.ceil(duration / 60) + " minutes";
    }

    /*if (effect.type === AltarEffectsEnum.SmallAltarPrayStrength)
      description = "Increase all Primary Stats by " + Math.round((effect.effectiveness - 1) * 100) + "%.<br/>Remaining Duration: " + durationString + "<br/>";
    if (effect.type === AltarEffectsEnum.SmallAltarPrayFortune)
      description = "Increase Coin gain from battle by " + Math.round((effect.effectiveness - 1) * 100) + "%.<br/>Remaining Duration: " + durationString + "<br/>";
*/
    if (effect.type === AltarEffectsEnum.AttackUp)
      description = "Increase Attack of all party members by " + this.utilityService.roundTo(((effect.effectiveness - 1) * 100), 2) + "%.";
    if (effect.type === AltarEffectsEnum.AthenaDefenseUp)
      description = "Increase Defense of all party members by " + this.utilityService.roundTo(((effect.effectiveness - 1) * 100), 2) + "%.";
    if (effect.type === AltarEffectsEnum.AthenaHeal)
      description = "When the duration expires, heal all party members for " + effect.effectiveness + " HP.";
    if (effect.type === AltarEffectsEnum.AthenaHealOverTime)
      description = "Heal all party members for " + effect.effectiveness + " HP every " + effect.tickFrequency + " seconds.";
    if (effect.type === AltarEffectsEnum.ArtemisLuckUp)
      description = "Increase Luck of all party members by " + this.utilityService.roundTo(((effect.effectiveness - 1) * 100), 2) + "%.";
    if (effect.type === AltarEffectsEnum.ArtemisCriticalDamageUp)
      description = "Increase Critical Damage Multiplier of all party members by " + this.utilityService.roundTo(((effect.effectiveness - 1) * 100), 2) + "%.";
    if (effect.type === AltarEffectsEnum.ArtemisDefenseDebuff)
      description = "When the duration expires, reduce all enemies' Defense by " + this.utilityService.roundTo(((1 - effect.effectiveness) * 100), 2) + "%.";
    if (effect.type === AltarEffectsEnum.HermesAgilityUp)
      description = "Increase Agility of all party members by " + this.utilityService.roundTo(((effect.effectiveness - 1) * 100), 2) + "%.";
    if (effect.type === AltarEffectsEnum.HermesAutoAttackUp)
      description = "Increase Auto Attack Damage of all party members by " + this.utilityService.roundTo(((effect.effectiveness - 1) * 100), 2) + "%.";
    if (effect.type === AltarEffectsEnum.HermesAbilityCooldown)
      description = "When the duration expires, reduce all party members' ability cooldowns by " + this.utilityService.roundTo(((effect.effectiveness - 1) * 100), 2) + "%.";
    if (effect.type === AltarEffectsEnum.ApolloBuffDurationUp)
      description = "Increase the duration of any buffs applied while this is active by " + this.utilityService.roundTo(((effect.effectiveness - 1) * 100), 2) + "%.";
    if (effect.type === AltarEffectsEnum.ApolloResistanceUp)
      description = "Increase Resistance of all party members by " + this.utilityService.roundTo(((effect.effectiveness - 1) * 100), 2) + "%.";
    if (effect.type === AltarEffectsEnum.ApolloHeal)
      description = "Heal the party member with the lowest HP % for " + effect.effectiveness + " HP.";
    if (effect.type === AltarEffectsEnum.AthenaRareHealOverTime)
      description = "Heal all party members for " + effect.effectiveness + " HP every " + effect.tickFrequency + " seconds.";
    if (effect.type === AltarEffectsEnum.AthenaRareBlind)
      description = "When the duration expires, apply a " + this.utilityService.roundTo(((effect.effectiveness - 1) * 100), 2) + "% Blind debuff to all enemies.";
    if (effect.type === AltarEffectsEnum.AthenaRareHolyDamageIncrease)
      description = "Only available when Athena is in your party. Increase Holy Damage Dealt by all party members by " + this.utilityService.roundTo(((effect.effectiveness - 1) * 100), 2) + "%.";
    if (effect.type === AltarEffectsEnum.ArtemisRareAttackDebuff)
      description = "When the duration expires, reduce all enemies' Attack by " + this.utilityService.roundTo(((1 - effect.effectiveness) * 100), 2) + "%.";
    if (effect.type === AltarEffectsEnum.ArtemisRareCriticalDamageUp)
      description = "Increase Critical Damage Multiplier of all party members by " + this.utilityService.roundTo(((effect.effectiveness - 1) * 100), 2) + "%.";
    if (effect.type === AltarEffectsEnum.ArtemisRareDebuffDurationUp)
      description = "Only available when Artemis is in your party. Increase the duration of any debuffs applied while this is active by " + this.utilityService.roundTo(((effect.effectiveness - 1) * 100), 2) + "%.";
    if (effect.type === AltarEffectsEnum.HermesRareAutoAttackUp)
      description = "Increase Auto Attack Damage of all party members by " + this.utilityService.roundTo(((effect.effectiveness - 1) * 100), 2) + "%.";
    if (effect.type === AltarEffectsEnum.HermesRareReduceAbilityCooldownOverTime)
      description = "Reduce all party members' ability cooldowns by " + this.utilityService.roundTo(((effect.effectiveness - 1) * 100), 2) + "% every " + effect.tickFrequency + " seconds.";
    if (effect.type === AltarEffectsEnum.HermesRareReduceAutoAttackCooldown)
      description = "Only available when Hermes is in your party. While this is active, reduce all party members' auto attack cooldown by " + this.utilityService.roundTo(((1 - effect.effectiveness) * 100), 2) + "%.";
    if (effect.type === AltarEffectsEnum.ApolloRareHpRegenIncrease)
      description = "Increase HP Regen of all party members by " + this.utilityService.roundTo(((effect.effectiveness - 1) * 100), 2) + "%.";
    if (effect.type === AltarEffectsEnum.ApolloRareBuffDurationUp)
      description = "Increase the duration of any buffs applied while this is active by " + this.utilityService.roundTo(((effect.effectiveness - 1) * 100), 2) + "%.";
    if (effect.type === AltarEffectsEnum.ApolloRareOstinato)
      description = "Only available when Apollo is in your party. When the duration expires, trigger an Ostinato at " + this.utilityService.roundTo(((effect.effectiveness - 1) * 100), 2) + "% effectiveness.";
    if (effect.type === AltarEffectsEnum.AresDamageOverTime)
      description = "When the duration expires, apply a Damage over Time effect on all enemies, dealing " + this.utilityService.roundTo(((effect.effectiveness)), 2) + " damage every 3 seconds for 12 seconds.";
    if (effect.type === AltarEffectsEnum.AresMaxHpUp)
      description = "Increase Max HP of all party members by " + this.utilityService.roundTo(((effect.effectiveness - 1) * 100), 2) + "%.";
    if (effect.type === AltarEffectsEnum.AresOverdriveGain)
      description = "When the duration expires, fill " + this.utilityService.roundTo(((effect.effectiveness - 1) * 100), 2) + "% of each party member's Overdrive gauge.";
    if (effect.type === AltarEffectsEnum.AresRareOverdriveGain)
      description = "When the duration expires, fill " + this.utilityService.roundTo(((effect.effectiveness - 1) * 100), 2) + "% of each party member's Overdrive gauge.";
    if (effect.type === AltarEffectsEnum.AresRareIncreaseDamageOverTimeDamage)
      description = "Increase damage over time effectiveness by " + this.utilityService.roundTo(((effect.effectiveness - 1) * 100), 2) + "%";
    if (effect.type === AltarEffectsEnum.AresRareDealHpDamage)
      description = "Only available when Ares is in your party. When the duration expires, deal an amount equal to " + this.utilityService.roundTo(((1 - effect.effectiveness) * 100), 2) + "% of the party's total current HP to all enemies.";
    if (effect.type === AltarEffectsEnum.HadesFireDamageUp)
      description = "Increase Fire Damage Dealt by all party members by " + this.utilityService.roundTo(((effect.effectiveness - 1) * 100), 2) + "%.";
    if (effect.type === AltarEffectsEnum.HadesEarthDamageUp)
      description = "Increase Earth Damage Dealt by all party members by " + this.utilityService.roundTo(((effect.effectiveness - 1) * 100), 2) + "%.";
    if (effect.type === AltarEffectsEnum.HadesAoeDamageUp)
      description = "Increase the damage of any attack that hits multiple enemies by " + this.utilityService.roundTo(((effect.effectiveness - 1) * 100), 2) + "%.";
    if (effect.type === AltarEffectsEnum.HadesRareAoeDamageUp)
      description = "Increase the damage of any attack that hits multiple enemies by " + this.utilityService.roundTo(((effect.effectiveness - 1) * 100), 2) + "%.";
    if (effect.type === AltarEffectsEnum.HadesRareElementalDamageUp)
      description = "Only available when Hades is in your party. Increase all Elemental Damage Dealt by all party members by " + this.utilityService.roundTo(((effect.effectiveness - 1) * 100), 2) + "%.";
    if (effect.type === AltarEffectsEnum.HadesRareDealElementalDamage)
      description = "Deal " + effect.effectiveness + " damage of a random element to all enemies every " + effect.tickFrequency + " seconds.";
    if (effect.type === AltarEffectsEnum.DionysusRandomDebuff)
      description = "When the duration expires, reduce a random stat by " + this.utilityService.roundTo(((1 - effect.effectiveness) * 100), 2) + "% for all enemies.";
    if (effect.type === AltarEffectsEnum.DionysusRandomBuff)
      description = "When the duration expires, increase a random stat by " + this.utilityService.roundTo(((effect.effectiveness - 1) * 100), 2) + "% for all party members.";
    if (effect.type === AltarEffectsEnum.DionysusSingleBarrier)
      description = "When the duration expires, give a random party member a barrier for " + this.utilityService.roundTo(((effect.effectiveness - 1) * 100), 2) + "% of their HP.";
    if (effect.type === AltarEffectsEnum.DionysusRareMultiBarrier)
      description = "When the duration expires, give all party members a barrier for " + this.utilityService.roundTo(((effect.effectiveness - 1) * 100), 2) + "% of their HP.";
    if (effect.type === AltarEffectsEnum.DionysusRareFullDebuffs)
      description = "Only available when Dionysus is in your party. When the duration expires, reduce all primary stats of a target by " + this.utilityService.roundTo(((1 - effect.effectiveness) * 100), 2) + "%.";
    if (effect.type === AltarEffectsEnum.DionysusRareFastDebuffs)
      description = "Reduce the duration of any debuffs inflicted on party members by " + this.utilityService.roundTo(((effect.effectiveness - 1) * 100), 2) + "%.";
    if (effect.type === AltarEffectsEnum.NemesisLuckDebuff)
      description = "When the duration expires, reduce all enemies' Luck by " + this.utilityService.roundTo(((1 - effect.effectiveness) * 100), 2) + "%.";
    if (effect.type === AltarEffectsEnum.NemesisThorns)
      description = "Deal " + this.utilityService.roundTo(((effect.effectiveness - 1) * 100), 2) + "% of damage taken by party members back to their attacker.";
    if (effect.type === AltarEffectsEnum.NemesisDealDamage)
      description = "Deal " + effect.effectiveness + " damage to an enemy every " + effect.tickFrequency + " seconds.";
    if (effect.type === AltarEffectsEnum.NemesisRareThorns)
      description = "Deal " + this.utilityService.roundTo(((effect.effectiveness - 1) * 100), 2) + "% of damage taken by party members back to their attacker.";
    if (effect.type === AltarEffectsEnum.NemesisRareArmorPenetrationUp)
      description = "Increase the Armor Penetration of all party members by " + this.utilityService.roundTo(((effect.effectiveness - 1) * 100), 2) + "%.";
    if (effect.type === AltarEffectsEnum.NemesisRareDuesUp)
      description = "Only available when Nemesis is in your party. Increase the Dues of the party member using Nemesis by " + this.utilityService.roundTo(((effect.effectiveness - 1) * 100), 2) + "%.";

    description += " Effect lasts for " + durationString + ".";
    return description;
  }

  getGodNameByType(godType: GodEnum) {
    var name = "";

    if (godType === GodEnum.Athena)
      name = "Athena";
    if (godType === GodEnum.Zeus)
      name = "Zeus";
    if (godType === GodEnum.Apollo)
      name = "Apollo";
    if (godType === GodEnum.Hermes)
      name = "Hermes";
    if (godType === GodEnum.Ares)
      name = "Ares";
    if (godType === GodEnum.Artemis)
      name = "Artemis";
    if (godType === GodEnum.Poseidon)
      name = "Poseidon";
    if (godType === GodEnum.Hades)
      name = "Hades";
    if (godType === GodEnum.Dionysus)
      name = "Dionysus";
    if (godType === GodEnum.Nemesis)
      name = "Nemesis";

    return name;
  }

  getResourceAmount(type: ItemsEnum, extras?: ItemsEnum[]) {
    var resource = this.globalService.globalVar.resources.find(item => item.item === type && this.globalService.extraItemsAreEqual(item.extras, extras));
    if (resource === undefined)
      return 0;

    if (type === ItemsEnum.Coin)
      return Math.floor(resource.amount);

    return resource.amount;
  }

  useResource(type: ItemsEnum, amount: number, extras?: ItemsEnum[]) {
    var resource = this.globalService.globalVar.resources.find(item => item.item === type && this.globalService.extraItemsAreEqual(item.extras, extras));
    if (resource === undefined)
      return;

    resource.amount -= amount;

    if (resource.amount < 0)
      resource.amount = 0;

    if (this.getItemTypeFromItemEnum(type) === ItemTypeEnum.Equipment) {
      var equipCount = this.getItemEquipCount(type);
      if (equipCount > 0 && resource.amount < equipCount) {
        while (resource.amount < equipCount) {
          var character = this.getCharacterTypeEquippedWithItem(type);
          this.globalService.unequipItem(this.getEquipmentPieceByItemType(type)?.equipmentType, character);

          equipCount -= 1;
        }
      }
    }

    this.globalService.globalVar.resources = this.globalService.globalVar.resources.filter(item => item.amount > 0);
  }

  getItemEquipCount(type: ItemsEnum, associatedResource?: ResourceValue) {
    var equipCount = 0;

    this.globalService.getActivePartyCharacters(true).forEach(member => {
      if (member.equipmentSet.weapon !== undefined && member.equipmentSet.weapon.itemType === type &&
        (associatedResource === undefined || (this.globalService.extraItemsAreEqual(associatedResource?.extras, member.equipmentSet.weapon.associatedResource?.extras))))
        equipCount += 1;
      if (member.equipmentSet.shield !== undefined && member.equipmentSet.shield.itemType === type &&
        (associatedResource === undefined || (this.globalService.extraItemsAreEqual(associatedResource?.extras, member.equipmentSet.shield.associatedResource?.extras))))
        equipCount += 1;
      if (member.equipmentSet.armor !== undefined && member.equipmentSet.armor.itemType === type &&
        (associatedResource === undefined || (this.globalService.extraItemsAreEqual(associatedResource?.extras, member.equipmentSet.armor.associatedResource?.extras))))
        equipCount += 1;
      if (member.equipmentSet.necklace !== undefined && member.equipmentSet.necklace.itemType === type &&
        (associatedResource === undefined || (this.globalService.extraItemsAreEqual(associatedResource?.extras, member.equipmentSet.necklace.associatedResource?.extras))))
        equipCount += 1;
      if (member.equipmentSet.ring !== undefined && member.equipmentSet.ring.itemType === type &&
        (associatedResource === undefined || (this.globalService.extraItemsAreEqual(associatedResource?.extras, member.equipmentSet.ring.associatedResource?.extras))))
        equipCount += 1;
    })

    return equipCount;
  }

  getCharacterTypeEquippedWithItem(type: ItemsEnum) {
    var characterType = CharacterEnum.None;

    this.globalService.getActivePartyCharacters(true).forEach(member => {
      if (member.equipmentSet.weapon !== undefined && member.equipmentSet.weapon.itemType === type)
        characterType = member.type;
      if (member.equipmentSet.shield !== undefined && member.equipmentSet.shield.itemType === type)
        characterType = member.type;
      if (member.equipmentSet.armor !== undefined && member.equipmentSet.armor.itemType === type)
        characterType = member.type;
      if (member.equipmentSet.necklace !== undefined && member.equipmentSet.necklace.itemType === type)
        characterType = member.type;
      if (member.equipmentSet.armor !== undefined && member.equipmentSet.armor.itemType === type)
        characterType = member.type;
    })

    return characterType;
  }

  gainResource(item: ResourceValue) {
    if (item === undefined)
      return;

    if (item.item === ItemsEnum.EternalMeleeTicket) {
      this.globalService.globalVar.sidequestData.weeklyMeleeEntries += item.amount;
    }
    else {
    var existingResource = this.globalService.globalVar.resources.find(resource => item.item === resource.item && this.globalService.extraItemsAreEqual(item.extras, resource.extras));
    if (existingResource === undefined) {
      this.globalService.globalVar.resources.push(item);
    }
    else {
      existingResource.amount += item.amount;
    }
    }
  }

  increaseItemBeltSize() {
    this.globalService.globalVar.itemBeltSize += 1;
  }

  itemDoesNotNeedSelection() {
    var doesNotNeedSelection = false;

    return doesNotNeedSelection;
  }

  getBattleItemEffect(item: ItemsEnum) {
    var itemEffect: UsableItemEffect = new UsableItemEffect();

    if (item === ItemsEnum.HealingHerb) {
      itemEffect.dealsDamage = false;
      itemEffect.healAmount = 50;
    }
    if (item === ItemsEnum.HealingPoultice) {
      itemEffect.dealsDamage = false;
      itemEffect.healAmount = 200;
    }
    if (item === ItemsEnum.HealingSalve) {
      itemEffect.dealsDamage = false;
      itemEffect.healAmount = 150;
      itemEffect.isAoe = true;
    }
    if (item === ItemsEnum.RestorativeHerb) {
      itemEffect.dealsDamage = false;
      itemEffect.healAmount = 150;
    }
    if (item === ItemsEnum.RestorativePoultice) {
      itemEffect.dealsDamage = false;
      itemEffect.healAmount = 600;
    }
    if (item === ItemsEnum.RestorativeSalve) {
      itemEffect.dealsDamage = false;
      itemEffect.healAmount = 350;
      itemEffect.isAoe = true;
    }
    if (item === ItemsEnum.FocusPotion) {
      itemEffect.dealsDamage = false;
      itemEffect.userEffect.push(this.globalService.createStatusEffect(StatusEffectEnum.FillOverdriveGauge, 0, .1, true, true));
      itemEffect.cooldown = 15;
    }
    if (item === ItemsEnum.ThrowingStone) {
      itemEffect.dealsDamage = true;
      itemEffect.trueDamageAmount = 3;
    }
    if (item === ItemsEnum.PoisonFang) {
      itemEffect.dealsDamage = true;
      itemEffect.targetEffect.push(this.globalService.createDamageOverTimeEffect(12, 3, 7, "Poison Fang", dotTypeEnum.TrueDamage));
    }
    if (item === ItemsEnum.ExplodingPotion) {
      itemEffect.dealsDamage = true;
      itemEffect.trueDamageAmount = 27;
    }
    if (item === ItemsEnum.FirePotion) {
      itemEffect.dealsDamage = true;
      itemEffect.trueDamageAmount = 60;
      itemEffect.elementalProperty = ElementalTypeEnum.Fire;
    }
    if (item === ItemsEnum.HeftyStone) {
      itemEffect.dealsDamage = true;
      itemEffect.trueDamageAmount = 42;
    }
    if (item === ItemsEnum.UnstablePotion) {
      itemEffect.dealsDamage = true;
      itemEffect.isAoe = true;
      itemEffect.trueDamageAmount = 125;
    }
    if (item === ItemsEnum.BoomingPotion) {
      itemEffect.dealsDamage = false;
      itemEffect.targetEffect.push(this.globalService.createStatusEffect(StatusEffectEnum.ResistanceDown, 20, .8, false, false, true));
    }
    if (item === ItemsEnum.StranglingGasPotion) {
      itemEffect.dealsDamage = true;
      itemEffect.targetEffect.push(this.globalService.createDamageOverTimeEffect(9, 3, 22, "Strangling Gas", dotTypeEnum.TrueDamage));
    }
    if (item === ItemsEnum.DebilitatingToxin) {
      itemEffect.dealsDamage = false;
      itemEffect.userEffect.push(this.globalService.createStatusEffect(StatusEffectEnum.DebilitatingToxin, 30 * 60, .1, false, true));
    }
    if (item === ItemsEnum.PoisonousToxin) {
      itemEffect.dealsDamage = false;
      itemEffect.userEffect.push(this.globalService.createStatusEffect(StatusEffectEnum.PoisonousToxin, 30 * 60, .1, false, true, undefined, "Poisonous Toxin"));
    }
    if (item === ItemsEnum.WitheringToxin) {
      itemEffect.dealsDamage = false;
      itemEffect.userEffect.push(this.globalService.createStatusEffect(StatusEffectEnum.WitheringToxin, 30 * 60, .1, false, true, undefined, "Withering Toxin"));
    }
    if (item === ItemsEnum.VenomousToxin) {
      itemEffect.dealsDamage = false;
      itemEffect.userEffect.push(this.globalService.createStatusEffect(StatusEffectEnum.VenomousToxin, 30 * 60, .1, false, true, undefined, "Venomous Toxin"));
    }
    if (item === ItemsEnum.PoisonExtractPotion) {
      itemEffect.dealsDamage = true;
      itemEffect.isAoe = true;
      itemEffect.targetEffect.push(this.globalService.createDamageOverTimeEffect(8, 2, 30, "Poison Extract", dotTypeEnum.TrueDamage));
    }
    if (item === ItemsEnum.HeroicElixir) {
      itemEffect.dealsDamage = false;
      itemEffect.userEffect.push(this.globalService.createStatusEffect(StatusEffectEnum.HeroicElixir, 30 * 60, 1.1, false, true));
    }
    if (item === ItemsEnum.RejuvenatingElixir) {
      itemEffect.dealsDamage = false;
      itemEffect.userEffect.push(this.globalService.createStatusEffect(StatusEffectEnum.RejuvenatingElixir, 30 * 60, 12, false, true));
    }
    if (item === ItemsEnum.ElixirOfFortitude) {
      itemEffect.dealsDamage = false;
      itemEffect.userEffect.push(this.globalService.createStatusEffect(StatusEffectEnum.ElixirOfFortitude, 30 * 60, 1.1, false, true));
    }

    return itemEffect;
  }

  getTotalAutoAttackCount(character: Character, forPartyMember: boolean = true, nonadjusted: boolean = false) {
    var adjustedAgility = this.getAdjustedAgility(character, forPartyMember);
    if (nonadjusted)
      adjustedAgility = character.battleStats.agility;
    var agilityPerAdditionalAttack = 750; //this is just a placeholder, gets overwritten below
    var remainingAgility = adjustedAgility;
    var attackCount = 1;
    var attackRemainder = 0;
    var reachedFinalBreakpoint = false;

    while (remainingAgility > 0 && !reachedFinalBreakpoint) {
      agilityPerAdditionalAttack = this.getAgilityPerAttackForAttackCount(attackCount);

      if (remainingAgility > agilityPerAdditionalAttack) {
        remainingAgility -= agilityPerAdditionalAttack;
        attackCount += 1;
      }
      else {
        reachedFinalBreakpoint = true;
      }
    }

    attackRemainder = remainingAgility / (agilityPerAdditionalAttack - this.getAgilityPerAttackForAttackCount(attackCount - 1));

    return attackCount + attackRemainder;
  }

  getAgilityPerAttackForAttackCount(attackCount: number) {
    var agilityCost = 1000; //for a specific attack
    var totalAgilityCost = agilityCost; //overall agility required

    if (attackCount <= 0)
      agilityCost = 0;

    for (var i = 2; i <= attackCount; i++) {
      agilityCost = totalAgilityCost * 4;
      totalAgilityCost += agilityCost;
    }
    //2 hits = 500, 3 hits = 2,000, 4 hits = 10,000, 5 hits = 50,000, 6 hits = 250,000   
    //Updated: 2 hits = 800, 3 hits = 2,400, 4 hits = 9,600, 5 hits = 60,000, 6 hits = 250,000   

    return agilityCost;
  }

  getDamageCriticalChance(attacker: Character, target: Character) {
    var criticalChance = .05;

    var attackerLuck = this.getAdjustedLuck(attacker);
    var targetResistance = this.getAdjustedResistance(target);

    criticalChance = this.getDamageCriticalChanceByNumbers(attackerLuck, targetResistance);

    var trueShot = this.characterHasAbility("True Shot", attacker);
    if (trueShot !== undefined && target.battleInfo.statusEffects.some(effect => !effect.isPositive)) {
      criticalChance *= trueShot.effectiveness;
    }

    if (criticalChance < .01)
      criticalChance = .01;

    if (criticalChance > 1)
      criticalChance = 1;

    return criticalChance;
  }

  getHealingCriticalChance(attacker: Character) {
    var criticalChance = .05;

    var attackerLuck = this.getAdjustedLuck(attacker);
    criticalChance = this.getHealingCriticalChanceByNumbers(attackerLuck);

    if (criticalChance > 1)
      criticalChance = 1;

    return criticalChance;
  }

  getDamageCriticalChanceByNumbers(attackerLuck: number, targetResistance: number) {
    var criticalChance = .05;

    var differential = attackerLuck / targetResistance;

    if (differential >= 1) {
      var horizontalStretch = .75;
      var horizontalPosition = .325;

      //log(.75 * x) + .325
      criticalChance = Math.log10(horizontalStretch * differential) + horizontalPosition;

      if (criticalChance > 1)
        criticalChance = 1;
    }
    else if (differential < 1) {
      //.2 * log(9^x) - .25      
      var amplifier = .2;
      var horizontalStretch = 9;
      var horizontalPosition = -.25;

      criticalChance = amplifier * (Math.log10(horizontalStretch * differential + horizontalPosition));

      if (criticalChance < 0)
        criticalChance = 0;
    }

    return criticalChance;
  }

  getHealingCriticalChanceByNumbers(attackerLuck: number) {
    var criticalChance = .05;

    var amplifier = 10;
    var horizontalStretch = .4;
    var horizontalPosition = 5;

    //500 * (log(.0035 * 10 + 1)) + 50      
    criticalChance = (amplifier * Math.log10(horizontalStretch * (attackerLuck) + horizontalPosition) / 100);

    return criticalChance;
  }

  getAdjustedMaxHp(character: Character, forPartyMember: boolean = true) {
    var maxHp = character.battleStats.maxHp;

    if (character.battleInfo !== undefined && character.battleInfo.statusEffects.length > 0) {
      var relevantStatusEffects = character.battleInfo.statusEffects.filter(effect => effect.type === StatusEffectEnum.MaxHpUp ||
        effect.type === StatusEffectEnum.MaxHpDown || effect.type === StatusEffectEnum.RecentlyDefeated || effect.type === StatusEffectEnum.HeroicElixir);

      if (relevantStatusEffects.length > 0) {
        relevantStatusEffects.forEach(effect => {
          if (effect.type === StatusEffectEnum.MaxHpUp || effect.type === StatusEffectEnum.MaxHpDown
            || effect.type === StatusEffectEnum.RecentlyDefeated || effect.type === StatusEffectEnum.HeroicElixir) {
            maxHp *= effect.effectiveness;
          }
        });
      }
    }

    if (maxHp < character.battleStats.currentHp)
      character.battleStats.currentHp = maxHp;

    if (forPartyMember && this.globalService.getAltarEffectWithEffect(AltarEffectsEnum.AresMaxHpUp) !== undefined) {
      var relevantAltarEffect = this.globalService.getAltarEffectWithEffect(AltarEffectsEnum.AresMaxHpUp);
      maxHp *= relevantAltarEffect!.effectiveness;
    }

    return maxHp;
  }

  getAdjustedAgility(character: Character, forPartyMember: boolean = true) {
    var agility = character.battleStats.agility;
    var activeStaccato: any;
    var party = this.globalService.getActivePartyCharacters(true);

    if (party.length > 0) {
      party.forEach(character => {
        var effect = character.battleInfo.statusEffects.find(item => item.type === StatusEffectEnum.Staccato);
        if (effect !== undefined)
          activeStaccato = effect;
      });

      if (activeStaccato !== undefined)
        agility *= activeStaccato.effectiveness;
    }

    if (character.battleInfo !== undefined && character.battleInfo.statusEffects.length > 0) {
      var relevantStatusEffects = character.battleInfo.statusEffects.filter(effect => effect.type === StatusEffectEnum.AgilityUp ||
        effect.type === StatusEffectEnum.AgilityDown
        || effect.type === StatusEffectEnum.RecentlyDefeated);

      if (relevantStatusEffects.length > 0) {
        relevantStatusEffects.forEach(effect => {
          if (effect.type === StatusEffectEnum.AgilityUp || effect.type === StatusEffectEnum.AgilityDown
            || effect.type === StatusEffectEnum.RecentlyDefeated) {
            agility *= effect.effectiveness;
          }
        });
      }
    }

    if (forPartyMember && this.globalService.getAltarEffectWithEffect(AltarEffectsEnum.HermesAgilityUp) !== undefined) {
      var relevantAltarEffect = this.globalService.getAltarEffectWithEffect(AltarEffectsEnum.HermesAgilityUp);
      agility *= relevantAltarEffect!.effectiveness;
    }

    return agility;
  }

  getAdjustedLuck(character: Character, forPartyMember: boolean = true) {
    var luck = character.battleStats.luck;
    var activeCoda: any;
    var party = this.globalService.getActivePartyCharacters(true);

    if (party.length > 0) {
      party.forEach(character => {
        var effect = character.battleInfo.statusEffects.find(item => item.type === StatusEffectEnum.Coda);
        if (effect !== undefined)
          activeCoda = effect;
      });

      if (activeCoda !== undefined)
        luck *= activeCoda.effectiveness;
    }

    if (character.battleInfo !== undefined && character.battleInfo.statusEffects.length > 0) {
      var relevantStatusEffects = character.battleInfo.statusEffects.filter(effect => effect.type === StatusEffectEnum.LuckUp ||
        effect.type === StatusEffectEnum.LuckDown || effect.type === StatusEffectEnum.LordOfTheUnderworld
        || effect.type === StatusEffectEnum.RecentlyDefeated);

      if (relevantStatusEffects.length > 0) {
        relevantStatusEffects.forEach(effect => {
          if (effect.type === StatusEffectEnum.LuckUp || effect.type === StatusEffectEnum.LuckDown
            || effect.type === StatusEffectEnum.RecentlyDefeated || effect.type === StatusEffectEnum.LordOfTheUnderworld) {
            luck *= effect.effectiveness;
          }
        });
      }
    }

    if (forPartyMember && this.globalService.getAltarEffectWithEffect(AltarEffectsEnum.ArtemisLuckUp) !== undefined) {
      var relevantAltarEffect = this.globalService.getAltarEffectWithEffect(AltarEffectsEnum.ArtemisLuckUp);
      luck *= relevantAltarEffect!.effectiveness;
    }

    return luck;
  }

  getAdjustedResistance(character: Character, forPartyMember: boolean = true) {
    var resistance = character.battleStats.resistance;

    if (character.battleInfo !== undefined && character.battleInfo.statusEffects.length > 0) {
      var relevantStatusEffects = character.battleInfo.statusEffects.filter(effect => effect.type === StatusEffectEnum.ResistanceUp ||
        effect.type === StatusEffectEnum.ResistanceDown
        || effect.type === StatusEffectEnum.RecentlyDefeated);

      if (relevantStatusEffects.length > 0) {
        relevantStatusEffects.forEach(effect => {
          if (effect.type === StatusEffectEnum.ResistanceUp || effect.type === StatusEffectEnum.ResistanceDown
            || effect.type === StatusEffectEnum.RecentlyDefeated) {
            resistance *= effect.effectiveness;
          }
        });
      }
    }

    if (forPartyMember && this.globalService.getAltarEffectWithEffect(AltarEffectsEnum.ApolloResistanceUp) !== undefined) {
      var relevantAltarEffect = this.globalService.getAltarEffectWithEffect(AltarEffectsEnum.ApolloResistanceUp);
      resistance *= relevantAltarEffect!.effectiveness;
    }

    return resistance;
  }

  getAdjustedAttack(character: Character, ability?: Ability, forPartyMember: boolean = true) {
    var attack = character.battleStats.attack;
    var activeFortissimo: any;
    var party = this.globalService.getActivePartyCharacters(true);

    if (party.length > 0 && forPartyMember) {
      party.forEach(character => {
        var effect = character.battleInfo.statusEffects.find(item => item.type === StatusEffectEnum.Fortissimo);
        if (effect !== undefined)
          activeFortissimo = effect;
      });

      if (activeFortissimo !== undefined)
        attack *= activeFortissimo.effectiveness;
    }

    if (character.battleInfo !== undefined && character.battleInfo.statusEffects.length > 0) {
      var relevantStatusEffects = character.battleInfo.statusEffects.filter(effect => effect.type === StatusEffectEnum.AttackUp ||
        effect.type === StatusEffectEnum.AttackDown || effect.type === StatusEffectEnum.LordOfTheUnderworld
        || effect.type === StatusEffectEnum.RecentlyDefeated);

      if (relevantStatusEffects.length > 0) {
        relevantStatusEffects.forEach(effect => {
          if (effect.type === StatusEffectEnum.AttackUp || effect.type === StatusEffectEnum.AttackDown
            || effect.type === StatusEffectEnum.RecentlyDefeated || effect.type === StatusEffectEnum.LordOfTheUnderworld) {
            attack *= effect.effectiveness;
          }
        });
      }
    }

    if (forPartyMember && this.globalService.getAltarEffectWithEffect(AltarEffectsEnum.AttackUp) !== undefined) {
      var relevantAltarEffect = this.globalService.getAltarEffectWithEffect(AltarEffectsEnum.AttackUp);
      attack *= relevantAltarEffect!.effectiveness;
    }

    if (ability !== undefined && ability.name === "Shield Slam") {
      //console.log("Shield Slam: " + this.getAdjustedDefense(character) + " * " + ability.secondaryEffectiveness);
      attack += this.getAdjustedDefense(character) * ability.secondaryEffectiveness;
    }

    //increase attack by % of barrier
    if (ability !== undefined && ability.name === "Gemini Strike") {
      attack *= 1 + (character.battleInfo.barrierValue / character.battleStats.maxHp);
    }

    return attack;
  }

  getAdjustedDefense(character: Character, forPartyMember: boolean = true) {
    var defense = character.battleStats.defense;

    if (character.battleInfo !== undefined && character.battleInfo.statusEffects.length > 0) {
      var relevantStatusEffects = character.battleInfo.statusEffects.filter(effect => effect.type === StatusEffectEnum.DefenseUp ||
        effect.type === StatusEffectEnum.DefenseDown
        || effect.type === StatusEffectEnum.RecentlyDefeated);

      if (relevantStatusEffects.length > 0) {
        relevantStatusEffects.forEach(effect => {
          if (effect.type === StatusEffectEnum.DefenseUp || effect.type === StatusEffectEnum.DefenseDown
            || effect.type === StatusEffectEnum.RecentlyDefeated) {
            defense *= effect.effectiveness;
          }
        });
      }
    }

    if (forPartyMember && this.globalService.getAltarEffectWithEffect(AltarEffectsEnum.AthenaDefenseUp) !== undefined) {
      var relevantAltarEffect = this.globalService.getAltarEffectWithEffect(AltarEffectsEnum.AthenaDefenseUp);
      defense *= relevantAltarEffect!.effectiveness;
    }

    var lastStand = character.abilityList.find(item => item.name === "Last Stand" && item.isAvailable);
    if (lastStand !== undefined && character.battleStats.getHpPercent() <= lastStand.threshold) {
      defense *= lastStand.effectiveness;
    }

    return defense;
  }

  getAdjustedCriticalMultiplier(character: Character, forPartyMember: boolean = true) {
    var defaultMultiplier = 1.25;

    var altarIncrease = 0;
    if (forPartyMember && this.globalService.getAltarEffectWithEffect(AltarEffectsEnum.ArtemisCriticalDamageUp) !== undefined) {
      var relevantAltarEffect = this.globalService.getAltarEffectWithEffect(AltarEffectsEnum.ArtemisCriticalDamageUp);
      altarIncrease *= relevantAltarEffect!.effectiveness;
    }

    if (forPartyMember && this.globalService.getAltarEffectWithEffect(AltarEffectsEnum.ArtemisRareCriticalDamageUp) !== undefined) {
      var relevantAltarEffect = this.globalService.getAltarEffectWithEffect(AltarEffectsEnum.ArtemisRareCriticalDamageUp);
      altarIncrease *= relevantAltarEffect!.effectiveness;
    }

    return defaultMultiplier + character.battleStats.criticalMultiplier + altarIncrease;
  }

  getOverdriveGainMultiplier(character: Character, isAutoAttack: boolean = false) {
    var defaultMultiplier = 1;
    var gainBonus = character.battleStats.overdriveGain;

    if (isAutoAttack)
      gainBonus += character.battleStats.overdriveGainFromAutoAttacks;

    return defaultMultiplier + gainBonus;
  }

  getArmorPenetrationMultiplier(character: Character) {
    var defaultMultiplier = 1;

    var altarMultiplier = 1;
    if (this.globalService.getAltarEffectWithEffect(AltarEffectsEnum.NemesisRareArmorPenetrationUp) !== undefined) {
      var relevantAltarEffect = this.globalService.getAltarEffectWithEffect(AltarEffectsEnum.NemesisRareArmorPenetrationUp);
      altarMultiplier *= relevantAltarEffect!.effectiveness;
    }

    return defaultMultiplier - (character.battleStats.armorPenetration * altarMultiplier);
  }

  getChthonicFavorMultiplier(asPercent: boolean = false) {
    var multiplier = 1;
    var breakpoint = 100;
    var chthonicFavor = this.getResourceAmount(ItemsEnum.ChthonicFavor);

    if (chthonicFavor <= breakpoint) {
      multiplier = chthonicFavor * 1.5;
    }
    else {
      var modifiedPreBreakpointAmount = 90;
      var modifiedFavorAmount = 15;
      var amplifier = 15;
      multiplier = amplifier * Math.sqrt(chthonicFavor + modifiedFavorAmount - breakpoint) + modifiedPreBreakpointAmount;
    }

    if (asPercent)
      return multiplier;
    else
      return multiplier / 100;
  }

  getEquipmentStats(equipment: Equipment | undefined, associatedResource?: ResourceValue, canRemoveExtra: boolean = false) {
    var equipmentStats = "";

    if (equipment === undefined)
      return equipmentStats;

    if (equipment.stats.maxHp > 0)
      equipmentStats += "+" + equipment.stats.maxHp + " Max HP<br />";
    if (equipment.stats.attack > 0)
      equipmentStats += "+" + equipment.stats.attack.toString() + " Attack<br />";
    if (equipment.stats.agility > 0)
      equipmentStats += "+" + equipment.stats.agility + " Agility<br />";
    if (equipment.stats.defense > 0)
      equipmentStats += "+" + equipment.stats.defense + " Defense<br />";
    if (equipment.stats.luck > 0)
      equipmentStats += "+" + equipment.stats.luck + " Luck<br />";
    if (equipment.stats.resistance > 0)
      equipmentStats += "+" + equipment.stats.resistance + " Resistance<br />";

    if (equipment.stats.hpRegen > 0)
      equipmentStats += "+" + equipment.stats.hpRegen + " HP / 5 Sec<br />";
    if (equipment.stats.criticalMultiplier > 0)
      equipmentStats += "+" + (equipment.stats.criticalMultiplier * 100) + "% Critical Damage Bonus<br />";
    if (equipment.stats.armorPenetration > 0)
      equipmentStats += "+" + (equipment.stats.armorPenetration * 100) + "% Armor Penetration<br />";
    if (equipment.stats.overdriveGain > 0)
      equipmentStats += "+" + (equipment.stats.overdriveGain * 100) + "% Overdrive Gain Bonus<br />";
    if (equipment.stats.abilityCooldownReduction > 0)
      equipmentStats += "+" + (equipment.stats.abilityCooldownReduction * 100) + "% Ability Cooldown Reduction<br />";
    if (equipment.stats.autoAttackCooldownReduction > 0)
      equipmentStats += "+" + (equipment.stats.autoAttackCooldownReduction * 100) + "% Auto Attack Cooldown Reduction<br />";
    if (equipment.stats.healingReceived > 0)
      equipmentStats += "+" + (equipment.stats.healingReceived * 100) + "% Healing Received<br />";
    if (equipment.stats.debuffDuration > 0)
      equipmentStats += "+" + (equipment.stats.debuffDuration * 100) + "% Debuff Duration<br />";
    if (equipment.stats.overdriveGainFromAutoAttacks > 0)
      equipmentStats += "+" + (equipment.stats.overdriveGainFromAutoAttacks * 100) + "% Overdrive Gain From Auto Attacks Bonus<br />";
    if (equipment.stats.healingDone > 0)
      equipmentStats += "+" + (equipment.stats.healingDone * 100) + "% Healing Done<br />";
    if (equipment.stats.aoeDamage > 0)
      equipmentStats += "+" + (equipment.stats.aoeDamage * 100) + "% Multiple Target Damage Increase<br />";
    if (equipment.stats.tickFrequency > 0)
      equipmentStats += "+" + (equipment.stats.tickFrequency * 100) + "% Damage Over Time Tick Frequency Reduction<br />";
    if (equipment.stats.abilityCooldownReductionStart > 0)
      equipmentStats += "+" + (equipment.stats.abilityCooldownReductionStart * 100) + "% Ability Cooldown Reduction Entering Subzone<br />";
    if (equipment.stats.abilityCooldownReductionWithBuffs > 0)
      equipmentStats += "+" + (equipment.stats.abilityCooldownReductionWithBuffs * 100) + "% Ability Cooldown Reduction With Buffs<br />";
    if (equipment.stats.thorns > 0)
      equipmentStats += "+" + (equipment.stats.thorns * 100) + "% Auto Attack Damage Reflected Back<br />";
    if (equipment.stats.elementIncrease.holy > 0)
      equipmentStats += "+" + (equipment.stats.elementIncrease.holy * 100) + "% Holy Damage Bonus<br />";
    if (equipment.stats.elementIncrease.fire > 0)
      equipmentStats += "+" + (equipment.stats.elementIncrease.fire * 100) + "% Fire Damage Bonus<br />";
    if (equipment.stats.elementIncrease.lightning > 0)
      equipmentStats += "+" + (equipment.stats.elementIncrease.lightning * 100) + "% Lightning Damage Bonus<br />";
    if (equipment.stats.elementIncrease.water > 0)
      equipmentStats += "+" + (equipment.stats.elementIncrease.water * 100) + "% Water Damage Bonus<br />";
    if (equipment.stats.elementIncrease.air > 0)
      equipmentStats += "+" + (equipment.stats.elementIncrease.air * 100) + "% Air Damage Bonus<br />";
    if (equipment.stats.elementIncrease.earth > 0)
      equipmentStats += "+" + (equipment.stats.elementIncrease.earth * 100) + "% Earth Damage Bonus<br />";
    if (equipment.stats.elementResistance.holy > 0)
      equipmentStats += "+" + (equipment.stats.elementResistance.holy * 100) + "% Holy Resistance Bonus<br />";
    if (equipment.stats.elementResistance.fire > 0)
      equipmentStats += "+" + (equipment.stats.elementResistance.fire * 100) + "% Fire Resistance Bonus<br />";
    if (equipment.stats.elementResistance.lightning > 0)
      equipmentStats += "+" + (equipment.stats.elementResistance.lightning * 100) + "% Lightning Resistance Bonus<br />";
    if (equipment.stats.elementResistance.air > 0)
      equipmentStats += "+" + (equipment.stats.elementResistance.air * 100) + "% Air Resistance Bonus<br />";
    if (equipment.stats.elementResistance.water > 0)
      equipmentStats += "+" + (equipment.stats.elementResistance.water * 100) + "% Water Resistance Bonus<br />";
    if (equipment.stats.elementResistance.earth > 0)
      equipmentStats += "+" + (equipment.stats.elementResistance.earth * 100) + "% Earth Resistance Bonus<br />";

    if (associatedResource === undefined && equipment.slotCount > 0) {
      equipmentStats += "<b>" + equipment.slotCount + " Open " + (equipment.slotCount === 1 ? "Slot" : "Slots") + "</b><br/>";
    }
    if (associatedResource !== undefined) {
      var totalSlotCount = equipment.slotCount;

      //check extras to see if slot count is increased      
      if ((associatedResource.extras === undefined || associatedResource.extras.length === 0) && totalSlotCount > 0)
        equipmentStats += "<b>" + equipment.slotCount + " Open " + (equipment.slotCount === 1 ? "Slot" : "Slots") + "</b><br/>";
      else if (associatedResource.extras !== undefined && associatedResource.extras.length > 0 && totalSlotCount >= 0) {
        var filledSlotCount = 0;
        associatedResource.extras.forEach(filledSlot => {
          if (this.isItemAddingASlot(filledSlot))
            totalSlotCount += 1;
          else {
            equipmentStats += "<b>Slot: </b> <strong class='basicEquipment'>" + this.getItemDescription(filledSlot) + "</strong>" + (canRemoveExtra ? "<span class='spanButtonStyled smallButtonStyled smallMarginLeft removeExtra " + filledSlot.toString() + "'>X</span>" : "") + "<br/>";
            filledSlotCount += 1;
          }
        });

        if (totalSlotCount > filledSlotCount) {
          equipmentStats += "<b>" + (totalSlotCount - filledSlotCount) + " Open " + ((totalSlotCount - filledSlotCount) === 1 ? "Slot" : "Slots") + "</b><br/>";
        }
      }
    }

    equipmentStats = this.utilityService.getSanitizedHtml(equipmentStats);

    return equipmentStats;
  }

  getEquipmentEffects(equipment: Equipment | undefined) {
    var equipmentEffects = "<b><span class='basicEquipment'>"; //using basic equipment color for equipment effect

    if (equipment === undefined)
      return equipmentEffects;

    if (equipment.equipmentEffect.trigger === EffectTriggerEnum.AlwaysActive)
      equipmentEffects += "Always Active: ";
    if (equipment.equipmentEffect.trigger === EffectTriggerEnum.OnAutoAttack)
      equipmentEffects += "On Auto Attack: ";
    if (equipment.equipmentEffect.trigger === EffectTriggerEnum.OnAbilityUse)
      equipmentEffects += "On Ability Use: ";
    if (equipment.equipmentEffect.trigger === EffectTriggerEnum.OnHit)
      equipmentEffects += "On Hit: ";
    if (equipment.equipmentEffect.trigger === EffectTriggerEnum.TriggersEvery)
      equipmentEffects += "Triggers Over Time: ";
    if (equipment.equipmentEffect.trigger === EffectTriggerEnum.ChanceOnAutoAttack)
      equipmentEffects += "Chance on Auto Attack (" + (equipment.equipmentEffect.chance * 100) + "%): ";

    equipmentEffects += "</span></b>";

    if (equipment.equipmentEffect.targetEffect !== undefined && equipment.equipmentEffect.targetEffect.length > 0) {
      equipment.equipmentEffect.targetEffect.forEach(effect => {
        if (effect.type === StatusEffectEnum.DamageOverTime) {
          if (equipment.itemType === ItemsEnum.Venomstrike)
            equipmentEffects += "Poison your target, dealing " + effect.effectiveness + " damage every " + effect.tickFrequency + " seconds for " + effect.duration + " seconds.<br/>";
        }

        if (effect.type === StatusEffectEnum.InstantTrueDamage) {
          if (equipment.itemType === ItemsEnum.SwordOfFlames)
            equipmentEffects += "Blast your target with fire, dealing " + effect.effectiveness + " Fire damage.<br/>";
          else if (equipment.itemType === ItemsEnum.ShieldOfTheSea)
            equipmentEffects += "Deal " + Math.round(effect.effectiveness * 100) + "% of Attack Water damage to all targets as true damage every " + effect.triggersEvery + " seconds. <br/>";
          else
            equipmentEffects += "Deal an additional " + effect.effectiveness + " damage.<br/>";
        }

        if (effect.type === StatusEffectEnum.RandomPrimaryStatDown) {
          equipmentEffects += "Inflict a <strong>" + Math.round((1 - effect.effectiveness) * 100) + "%</strong> random primary stat reduction on a target for <strong>" + effect.duration + "</strong> seconds.";
        }
        if (effect.type === StatusEffectEnum.RandomPrimaryStatDownExcludeHp) {
          equipmentEffects += "Inflict a <strong>" + Math.round((1 - effect.effectiveness) * 100) + "%</strong> random primary stat reduction (excluding HP) on a target for <strong>" + effect.duration + "</strong> seconds.";
        }
      });
    }

    if (equipment.equipmentEffect.userEffect !== undefined && equipment.equipmentEffect.userEffect.length > 0) {
      equipment.equipmentEffect.userEffect.forEach(effect => {
        if (effect.type === StatusEffectEnum.Thorns) {
          equipmentEffects += "Deal " + effect.effectiveness + " damage to those who auto attack you. <br/>";
        }

        if (effect.type === StatusEffectEnum.BattleItemDamageUp)
          equipmentEffects += "Increase damage dealt by battle items by " + Math.round((effect.effectiveness - 1) * 100) + "%.<br/>";

        if (effect.type === StatusEffectEnum.BattleItemEffectUp)
          equipmentEffects += "Increase healing or damage dealt by battle items by " + Math.round((effect.effectiveness - 1) * 100) + "%. (Does not increase effectiveness of items that grant effects)<br/>";

        if (effect.type === StatusEffectEnum.AgilityUp)
          equipmentEffects += "Increase Agility by " + Math.round((effect.effectiveness - 1) * 100) + "% for " + effect.duration + " seconds.<br/>";

        if (effect.type === StatusEffectEnum.ReduceDirectDamage)
          equipmentEffects += "Reduce damage from every direct attack by " + effect.effectiveness + ".<br/>";

        if (effect.type === StatusEffectEnum.Enearth)
          equipmentEffects += "All auto attacks and non-elemental abilities have the Earth element.<br/>";
        if (effect.type === StatusEffectEnum.Enfire)
          equipmentEffects += "All auto attacks and non-elemental abilities have the Fire element.<br/>";
        if (effect.type === StatusEffectEnum.Enholy)
          equipmentEffects += "All auto attacks and non-elemental abilities have the Holy element.<br/>";
        if (effect.type === StatusEffectEnum.Enwater)
          equipmentEffects += "All auto attacks and non-elemental abilities have the Water element.<br/>";
        if (effect.type === StatusEffectEnum.Enair)
          equipmentEffects += "All auto attacks and non-elemental abilities have the Air element.<br/>";
        if (effect.type === StatusEffectEnum.Enlightning)
          equipmentEffects += "All auto attacks and non-elemental abilities have the Lightning element.<br/>";

        if (equipment.itemType === ItemsEnum.FracturedRubyRing)
          equipmentEffects += "Absorb " + effect.effectiveness + " Fire damage for " + effect.duration + " seconds. Effect occurs every " + effect.triggersEvery + " seconds.<br/>";
        if (equipment.itemType === ItemsEnum.FracturedTopazRing)
          equipmentEffects += "Absorb " + effect.effectiveness + " Holy damage for " + effect.duration + " seconds. Effect occurs every " + effect.triggersEvery + " seconds.<br/>";
        if (equipment.itemType === ItemsEnum.FracturedOpalRing)
          equipmentEffects += "Absorb " + effect.effectiveness + " Lightning damage for " + effect.duration + " seconds. Effect occurs every " + effect.triggersEvery + " seconds.<br/>";
        if (equipment.itemType === ItemsEnum.FracturedAquamarineRing)
          equipmentEffects += "Absorb " + effect.effectiveness + " Water damage for " + effect.duration + " seconds. Effect occurs every " + effect.triggersEvery + " seconds.<br/>";
        if (equipment.itemType === ItemsEnum.FracturedAmethystRing)
          equipmentEffects += "Absorb " + effect.effectiveness + " Air damage for " + effect.duration + " seconds. Effect occurs every " + effect.triggersEvery + " seconds.<br/>";
        if (equipment.itemType === ItemsEnum.FracturedEmeraldRing)
          equipmentEffects += "Absorb " + effect.effectiveness + " Earth damage for " + effect.duration + " seconds. Effect occurs every " + effect.triggersEvery + " seconds.<br/>";
      });
    }

    equipmentEffects = this.utilityService.getSanitizedHtml(equipmentEffects);

    return equipmentEffects;
  }

  getCharacterColorClass(type: CharacterEnum) {
    return {
      'adventurerColor': type === CharacterEnum.Adventurer,
      'archerColor': type === CharacterEnum.Archer,
      'warriorColor': type === CharacterEnum.Warrior,
      'priestColor': type === CharacterEnum.Priest
    };
  }

  getGodColorClass(type: GodEnum) {
    return {
      'athenaColor': type === GodEnum.Athena,
      'zeusColor': type === GodEnum.Zeus,
      'apolloColor': type === GodEnum.Apollo,
      'aresColor': type === GodEnum.Ares,
      'poseidonColor': type === GodEnum.Poseidon,
      'artemisColor': type === GodEnum.Artemis,
      'hermesColor': type === GodEnum.Hermes,
      'hadesColor': type === GodEnum.Hades,
      'dionysusColor': type === GodEnum.Dionysus,
      'nemesisColor': type === GodEnum.Nemesis,
    };
  }

  getProfessionColorClass(type: ProfessionEnum) {
    return {
      'alchemyText': type === ProfessionEnum.Alchemy,
      'jewelcraftingText': type === ProfessionEnum.Jewelcrafting
    };
  }

  getItemImage(type: ItemsEnum) {
    var src = "assets/svg/";

    if (type === ItemsEnum.HealingHerb) {
      src += "healingHerb.svg";
    }
    if (type === ItemsEnum.RestorativeHerb) {
      src += "restorativeHerb.svg";
    }
    if (type === ItemsEnum.ThrowingStone) {
      src += "throwingStone.svg";
    }
    if (type === ItemsEnum.HeftyStone) {
      src += "heftyStone.svg";
    }
    if (type === ItemsEnum.PoisonFang) {
      src += "poisonFang.svg";
    }
    if (type === ItemsEnum.ExplodingPotion) {
      src += "explodingPotion.svg";
    }
    if (type === ItemsEnum.HealingPoultice) {
      src += "healingPoultice.svg";
    }
    if (type === ItemsEnum.HealingSalve) {
      src += "healingSalve.svg";
    }
    if (type === ItemsEnum.FocusPotion) {
      src += "focusPotion.svg";
    }
    if (type === ItemsEnum.FirePotion) {
      src += "firePotion.svg";
    }
    if (type === ItemsEnum.StranglingGasPotion) {
      src += "stranglingGasPotion.svg";
    }
    if (type === ItemsEnum.DebilitatingToxin) {
      src += "debilitatingToxin.svg";
    }
    if (type === ItemsEnum.PoisonousToxin) {
      src += "poisonousToxin.svg";
    }
    if (type === ItemsEnum.PoisonExtractPotion) {
      src += "poisonExtractPotion.svg";
    }
    if (type === ItemsEnum.HeroicElixir) {
      src += "heroicElixir.svg";
    }
    if (type === ItemsEnum.RejuvenatingElixir) {
      src += "rejuvenatingElixir.svg";
    }
    if (type === ItemsEnum.WitheringToxin) {
      src += "witheringToxin.svg";
    }
    if (type === ItemsEnum.VenomousToxin) {
      src += "venomousToxin.svg";
    }
    if (type === ItemsEnum.UnstablePotion) {
      src += "unstablePotion.svg";
    }
    if (type === ItemsEnum.BoomingPotion) {
      src += "boomingPotion.svg";
    }
    if (type === ItemsEnum.ElixirOfFortitude) {
      src += "elixirOfFortitude.svg";
    }
    if (type === ItemsEnum.RestorativePoultice) {
      src += "restorativePoultice.svg";
    }
    if (type === ItemsEnum.RestorativeSalve) {
      src += "restorativeSalve.svg";
    }

    return src;
  }

  getAbilityImage(abilityName: string) {
    var src = "assets/svg/";

    if (abilityName === "Quick Hit") {
      src += "quickHit.svg";
    }
    else if (abilityName === "Thousand Cuts") {
      src += "thousandCuts.svg";
    }
    else if (abilityName === "Sure Shot") {
      src += "bow.svg";
    }
    else if (abilityName === "Pinning Shot") {
      src += "pinningShot.svg";
    }
    else if (abilityName === "Battle Cry") {
      src += "battlecry.svg";
    }
    else if (abilityName === "Shield Slam") {
      src += "shieldSlam.svg";
    }
    else if (abilityName === "Heal") {
      src += "heal.svg";
    }
    else if (abilityName === "Pray") {
      src += "barrier.svg";
    }
    else if (abilityName === "Divine Strike") {
      src += "divineStrike.svg";
    }
    else if (abilityName === "Heavenly Shield") {
      src += "heavenlyShield.svg";
    }
    else if (abilityName === "Blinding Light") {
      src += "blindingLight.svg";
    }
    else if (abilityName === "Wounding Arrow") {
      src += "sureShot.svg";
    }
    else if (abilityName === "Paralyzing Volley") {
      src += "paralyzingVolley.svg";
    }
    else if (abilityName === "Expose Weakness") {
      src += "exposeWeakness.svg";
    }
    else if (abilityName === "Nimble Strike") {
      src += "nimbleStrike.svg";
    }
    else if (abilityName === "Take Flight") {
      src += "takeFlight.svg";
    }
    else if (abilityName === "Special Delivery") {
      src += "specialDelivery.svg";
    }
    else if (abilityName === "Staccato") {
      src += "staccato.svg";
    }
    else if (abilityName === "Fortissimo") {
      src += "fortissimo.svg";
    }
    else if (abilityName === "Coda") {
      src += "coda.svg";
    }
    else if (abilityName === "Hellfire") {
      src += "hellfire.svg";
    }
    else if (abilityName === "Earthquake") {
      src += "earthquake.svg";
    }
    else if (abilityName === "Natural Disaster") {
      src += "disaster.svg";
    }
    else if (abilityName === "Rupture") {
      src += "rupture.svg";
    }
    else if (abilityName === "Onslaught") {
      src += "onslaught.svg";
    }
    else if (abilityName === "Revel in Blood") {
      src += "revelInBlood.svg";
    }
    else if (abilityName === "Revelry") {
      src += "revelry.svg";
    }
    else if (abilityName === "Thyrsus") {
      src += "thyrsus.svg";
    }
    else if (abilityName === "Retribution") {
      src += "retribution.svg";
    }
    else if (abilityName === "Insanity") {
      src += "insanity.svg";
    }
    else if (abilityName === "Chains of Fate") {
      src += "chainsOfFate.svg";
    }
    else if (abilityName === "No Escape") {
      src += "noEscape.svg";
    }
    else
      src += "sword.svg";

    return src;
  }

  getAchievementDescription(type: AchievementTypeEnum) {
    var description = "";

    if (type === AchievementTypeEnum.HundredVictories)
      description = "Reach 100 victories";
    if (type === AchievementTypeEnum.ThousandVictories)
      description = "Reach 500 victories";
    if (type === AchievementTypeEnum.TenThousandVictories)
      description = "Reach 2,500 victories";
    if (type === AchievementTypeEnum.FiveThousandVictories)
      description = "Reach 5,000 victories";
    if (type === AchievementTypeEnum.FullHPClear)
      description = "Clear without losing HP";
    if (type === AchievementTypeEnum.TenSecondClear)
      description = "Clear in 10 seconds";
    if (type === AchievementTypeEnum.ThirtySecondClear)
      description = "Clear in 30 seconds";
    if (type === AchievementTypeEnum.Complete)
      description = "Complete Subzone";

    return description;
  }

  addTutorialToLog(type: TutorialTypeEnum) {
    var logItem = new LogData();
    logItem.type = LogViewEnum.Tutorials;
    logItem.relevantEnumValue = type;
    logItem.dateReceived = new Date().getTime(); //formatDate(new Date(), 'MMM d, y H:mm:ss', 'en');;

    this.globalService.globalVar.logData.push(logItem);
  }

  addStoryToLog(type: TutorialTypeEnum) {
    var logItem = new LogData();
    logItem.type = LogViewEnum.Story;
    logItem.relevantEnumValue = type;
    logItem.dateReceived = new Date().getTime();//formatDate(new Date(), 'MMM d, y H:mm:ss', 'en');;

    if (!this.globalService.globalVar.logData.some(item => item.relevantEnumValue === type && item.type === LogViewEnum.Story))
      this.globalService.globalVar.logData.push(logItem);
  }

  addLootToLog(type: ItemsEnum, amount: number) {
    var logItem = new LogData();
    logItem.type = LogViewEnum.Loot;
    logItem.relevantEnumValue = type;
    logItem.amount = amount;
    logItem.dateReceived = new Date().getTime();//formatDate(new Date(), 'MMM d, y H:mm:ss', 'en');;

    this.globalService.globalVar.logData.push(logItem);

    var logLengthTotal = 200;
    var currentItemLog = this.globalService.globalVar.logData.filter(item => item.type === LogViewEnum.Loot);
    if (currentItemLog.length > logLengthTotal) {
      for (var i = currentItemLog.length; i > logLengthTotal; i--) {
        this.globalService.globalVar.logData = this.globalService.globalVar.logData.filter(item => item != currentItemLog[0]);
        currentItemLog = this.globalService.globalVar.logData.filter(item => item.type === LogViewEnum.Loot);
      }
    }
  }

  getCharacterDps(character: Character, target?: Character) {
    var totalDps = 0;
    var adjustedAttack = this.getAdjustedAttack(character);
    var adjustedDefense = target === undefined ? 0 : this.getAdjustedDefense(target);
    var critChance = this.getDamageCriticalChance(character, target === undefined ? new Character() : target);
    var adjustedCriticalMultiplier = ((1 - critChance)) + (critChance * this.getAdjustedCriticalMultiplier(character));

    if (target === undefined) {
      totalDps += adjustedAttack * adjustedCriticalMultiplier / this.globalService.getAutoAttackTime(character);

      character.abilityList.filter(item => item.isAvailable).forEach(ability => {
        var damageMultiplier = 1;
        var abilityDamageMultiplier = this.getAbilityEffectiveAmount(character, ability);

        if (ability.dealsDirectDamage) {
          var damageMultiplier = 1;

          totalDps += Math.round((damageMultiplier * abilityDamageMultiplier * (adjustedAttack * (2 / 3) -
            (adjustedDefense * (2 / 5))) * adjustedCriticalMultiplier) / ability.cooldown);
        }
      });

    }
    else {
      var damageMultiplier = 1;
      var abilityDamageMultiplier = 1;

      //auto attack
      totalDps += Math.round((damageMultiplier * abilityDamageMultiplier * (adjustedAttack * (2 / 3) -
        (adjustedDefense * (2 / 5))) * adjustedCriticalMultiplier) / this.globalService.getAutoAttackTime(character));

      character.abilityList.filter(item => item.isAvailable).forEach(ability => {
        var damageMultiplier = 1;
        var abilityDamageMultiplier = this.getAbilityEffectiveAmount(character, ability);

        if (ability.dealsDirectDamage) {
          var damageMultiplier = 1;

          totalDps += Math.round((damageMultiplier * abilityDamageMultiplier * (adjustedAttack * (2 / 3) -
            (adjustedDefense * (2 / 5))) * adjustedCriticalMultiplier) / ability.cooldown);
        }
      });

      //console.log ("Total DPS = " + totalDps + " = (" + adjustedAttack + " (2 / 3)) - (" + adjustedDefense + " (2 / 5)) * " + adjustedCriticalMultiplier + ") / " + this.getAutoAttackTime(character));
    }

    return this.utilityService.roundTo(totalDps, 1);
  }

  getPartyDps(party: Character[], target?: Character) {
    var totalDps = 0;

    party.forEach(character => {
      totalDps += this.getCharacterDps(character, target);
    });

    return this.utilityService.roundTo(totalDps, 1);
  }

  getSubzoneExpPerSec(subzoneType: SubZoneEnum) {
    var expPerSecPerEnemyTeam: number[] = [];
    var enemyOptions = this.subzoneGeneratorService.generateBattleOptions(subzoneType);

    enemyOptions.forEach(enemyTeam => {
      var timeToClear = 0;
      var totalXp = 0;
      enemyTeam.enemyList.forEach(enemy => {
        var dpsAgainstEnemy = this.getPartyDps(this.globalService.getActivePartyCharacters(true), enemy);
        var enemyClearTime = enemy.battleStats.maxHp / dpsAgainstEnemy;
        timeToClear += enemyClearTime;
        totalXp += enemy.xpGainFromDefeat;
      });

      expPerSecPerEnemyTeam.push(totalXp / timeToClear);
    });

    return (expPerSecPerEnemyTeam.reduce((a, b) => a + b, 0) / expPerSecPerEnemyTeam.length) || 0;
  }

  characterHasAbility(abilityName: string, character: Character): Ability | undefined {
    var matchingAbility: Ability | undefined = undefined;

    if (character.abilityList !== undefined && character.abilityList.length > 0)
      character.abilityList.filter(ability => ability.isAvailable).forEach(ability => {
        if (ability.name === abilityName)
          matchingAbility = ability;
      });

    if (character.assignedGod1 !== undefined && character.assignedGod1 !== GodEnum.None) {
      var god = this.globalService.globalVar.gods.find(item => item.type === character.assignedGod1);
      if (god !== undefined) {
        if (god.abilityList !== undefined && god.abilityList.length > 0)
          god.abilityList.filter(ability => ability.isAvailable).forEach(ability => {
            if (ability.name === abilityName)
              matchingAbility = ability;
          });
      }
    }

    if (character.assignedGod2 !== undefined && character.assignedGod2 !== GodEnum.None) {
      var god = this.globalService.globalVar.gods.find(item => item.type === character.assignedGod2);
      if (god !== undefined) {
        if (god.abilityList !== undefined && god.abilityList.length > 0)
          god.abilityList.filter(ability => ability.isAvailable).forEach(ability => {
            if (ability.name === abilityName)
              matchingAbility = ability;
          });
      }
    }

    return matchingAbility;
  }

  getQualityEnumList() {
    var qualityTypes: EquipmentQualityEnum[] = [];
    for (const [propertyKey, propertyValue] of Object.entries(EquipmentQualityEnum)) {
      if (!Number.isNaN(Number(propertyKey))) {
        continue;
      }

      var enumValue = propertyValue as EquipmentQualityEnum;
      if (enumValue !== EquipmentQualityEnum.None)
        qualityTypes.push(enumValue);
    }

    return qualityTypes;
  }

  getGodXpBreakdown(god: God) {
    var breakdown = "Total God XP Bonus: " + this.utilityService.roundTo((this.globalService.getGodExpBonus(god) - 1) * 100, 2) + "% <hr/>";

    var boonOfOlympus = this.globalService.globalVar.resources.find(item => item.item === ItemsEnum.BoonOfOlympus);
    var boonOfOlympusValue = 1;
    if (boonOfOlympus !== undefined)
      boonOfOlympusValue += boonOfOlympus.amount;

    if (boonOfOlympusValue > 1)
      breakdown += "Boon of Olympus: *" + this.utilityService.roundTo(boonOfOlympusValue, 3) + "<br/>";

    var affinityBoost = 1;

    //repeats every 4 levels, duration increase is at level X3
    var affinityIncreaseCount = this.getGodAffinityXpIncreaseCount(god);

    affinityBoost = 1 + (affinityIncreaseCount * this.utilityService.affinityRewardGodXpBonus);

    if (affinityBoost > 1)
      breakdown += "Affinity Boost: *" + this.utilityService.roundTo(affinityBoost, 3) + "<br/>";

    return breakdown;
  }

  getMaxHpDescription() {
    return "The amount of damage you can take before being knocked unconscious. If your entire party is unconscious, you must retreat to a town.";
  }

  getAttackDescription() {
    return "Increase auto attack and ability damage.";
  }

  getDefenseDescription() {
    return "Reduce damage taken from enemy attacks.";
  }

  getAgilityDescription(character?: Character) {
    if (character === undefined) {
      return "Increase auto attack damage.";
    }

    var totalAutoAttackCount = this.getTotalAutoAttackCount(character, true, true);
    var description = "Increases the number of times you hit when auto attacking, multiplying auto attack damage by <strong>" + this.utilityService.roundTo(totalAutoAttackCount, 3) + "</strong>.";
    if (totalAutoAttackCount >= 2)
      description += " On Hit effects occur <strong>" + Math.floor(totalAutoAttackCount) + "</strong> times from auto attacks.";
    description += "<br/>Agility needed for <strong>" + Math.ceil(totalAutoAttackCount) + "</strong> total hits: <strong>" + this.getAgilityPerAttackForAttackCount(Math.floor(totalAutoAttackCount)).toLocaleString() + "</strong>.";
    return description;
  }

  getLuckDescription(character?: Character) {
    var description = "Increase your chance to deal a critical hit.";

    if (character === undefined)
      return description;

    var latestBallad = new Ballad();
    this.globalService.globalVar.ballads.forEach(item => {
      if (item.isAvailable)
        latestBallad = item;
    });
    var allPossibleEnemies: Enemy[] = [];
    var allPossibleEnemyResistances: number[] = [];
    latestBallad.zones.forEach(zone => {
      zone.subzones.forEach(subzone => {
        var enemyOptions = this.subzoneGeneratorService.generateBattleOptions(subzone.type);
        enemyOptions.forEach(option => {
          option.enemyList.forEach(enemy => {
            if (!allPossibleEnemies.some(possibleEnemy => possibleEnemy.bestiaryType === enemy.bestiaryType)) {
              allPossibleEnemies.push(enemy);
              allPossibleEnemyResistances.push(enemy.battleStats.resistance);
            }
          });
        });
      });
    });

    var sum = allPossibleEnemyResistances.reduce((acc, cur) => acc + cur, 0);
    var mean = Math.round(sum / allPossibleEnemyResistances.length);

    description += "<br/>Odds to critically hit an enemy from " + this.balladService.getBalladName(latestBallad.type) + " (Avg " + mean + " Resistance): <strong>" + this.utilityService.roundTo(this.getDamageCriticalChanceByNumbers(character.battleStats.luck, mean) * 100, 2) + "%</strong>" +
      "<br/>Odds to critically hit with a healing spell: <strong>" + this.utilityService.roundTo(this.getHealingCriticalChanceByNumbers(character.battleStats.luck) * 100, 2) + "%</strong>";

    return description;
  }

  getResistanceDescription(character?: Character) {
    var description = "Reduce your chance to be critically hit by enemies.";

    if (character === undefined)
      return description;

    var latestBallad = new Ballad();
    this.globalService.globalVar.ballads.forEach(item => {
      if (item.isAvailable)
        latestBallad = item;
    });
    var allPossibleEnemies: Enemy[] = [];
    var allPossibleEnemyLuck: number[] = [];
    latestBallad.zones.forEach(zone => {
      zone.subzones.forEach(subzone => {
        var enemyOptions = this.subzoneGeneratorService.generateBattleOptions(subzone.type);
        enemyOptions.forEach(option => {
          option.enemyList.forEach(enemy => {
            if (!allPossibleEnemies.some(possibleEnemy => possibleEnemy.bestiaryType === enemy.bestiaryType)) {
              allPossibleEnemies.push(enemy);
              allPossibleEnemyLuck.push(enemy.battleStats.luck);
            }
          });
        });
      });
    });

    var sum = allPossibleEnemyLuck.reduce((acc, cur) => acc + cur, 0);
    var mean = Math.round(sum / allPossibleEnemyLuck.length);

    description += "<br/>Odds to be critically hit by an enemy from " + this.balladService.getBalladName(latestBallad.type) + " (Avg " + mean + " Luck): <strong>" + this.utilityService.roundTo(this.getDamageCriticalChanceByNumbers(mean, character.battleStats.resistance) * 100, 2) + "%</strong>";

    return description;
  }

  getHpRegenDescription() {
    return "Amount of HP you gain every 5 seconds.";
  }

  getCriticalMultiplierDescription() {
    return "Increase the amount of damage dealt when dealing a critical hit.";
  }

  getArmorPenetrationDescription() {
    return "Reduce target's defense by this percentage before any attack.";
  }

  getOverdriveGainBonusDescription() {
    return "Increase the amount of overdrive gauge gained from all attacks and being attacked.";
  }

  getHealingReceivedBonusDescription() {
    return "Increase the amount of healing received.";
  }

  getDebuffDurationBonusDescription() {
    return "Increase the duration of any debuff you inflict.";
  }

  getOverdriveGainFromAutoAttacksBonusDescription() {
    return "Increase the amount of overdrive gauge gained from auto attacking.";
  }

  getHealingDoneBonusDescription() {
    return "Increase the amount of healing done.";
  }

  getAbilityCooldownReductionDescription() {
    return "Reduces cooldown for all abilities.";
  }

  getAutoAttackCooldownReductionDescription() {
    return "Reduces cooldown for auto attack.";
  }

  getAoeDamageBonusDescription() {
    return "Increase the amount of damage dealt when attacking multiple targets.";
  }

  getThornsBonusDescription() {
    return "When attacked, immediately return a percentage of the damage taken back to the enemy. This does not affect how much damage you receive.";
  }

  getAbilityCooldownReductionStartBonusDescription() {
    return "Reduces cooldown for all abilities when you first enter a subzone.";
  }

  getAbilityCooldownReductionWithBuffsBonusDescription() {
    return "Reduces cooldown for all abilities while you have a buff active.";
  }

  getTickFrequencyBonusDescription() {
    return "Increases how frequently your damage over time effects deal damage.";
  }

  getElementName(type?: ElementalTypeEnum, name?: string) {
    var element = "";

    if (type === ElementalTypeEnum.Holy || name === "Holy")
      element = "Holy";
    else if (type === ElementalTypeEnum.Fire || name === "Fire")
      element = "Fire";
    else if (type === ElementalTypeEnum.Lightning || name === "Lightning")
      element = "Lightning";
    else if (type === ElementalTypeEnum.Water || name === "Water")
      element = "Water";
    else if (type === ElementalTypeEnum.Air || name === "Air")
      element = "Air";
    else if (type === ElementalTypeEnum.Earth || name === "Earth")
      element = "Earth";

    return element;
  }

  getElementalDamageIncreaseDescription(type?: ElementalTypeEnum, name?: string) {
    var element = "";

    if (type === ElementalTypeEnum.Holy || name === "Holy")
      element = "Holy";
    else if (type === ElementalTypeEnum.Fire || name === "Fire")
      element = "Fire";
    else if (type === ElementalTypeEnum.Lightning || name === "Lightning")
      element = "Lightning";
    else if (type === ElementalTypeEnum.Water || name === "Water")
      element = "Water";
    else if (type === ElementalTypeEnum.Air || name === "Air")
      element = "Air";
    else if (type === ElementalTypeEnum.Earth || name === "Earth")
      element = "Earth";

    return "Increase " + element + " damage dealt.";
  }

  getElementalResistanceIncreaseDescription(type?: ElementalTypeEnum, name?: string) {
    var element = "";

    if (type === ElementalTypeEnum.Holy || name === "Holy")
      element = "Holy";
    else if (type === ElementalTypeEnum.Fire || name === "Fire")
      element = "Fire";
    else if (type === ElementalTypeEnum.Lightning || name === "Lightning")
      element = "Lightning";
    else if (type === ElementalTypeEnum.Water || name === "Water")
      element = "Water";
    else if (type === ElementalTypeEnum.Air || name === "Air")
      element = "Air";
    else if (type === ElementalTypeEnum.Earth || name === "Earth")
      element = "Earth";

    return "Reduce " + element + " damage taken.";
  }

  getGodMaxHpStatBreakdown(god: God) {
    var breakdown = "";

    if (god.statGain.maxHp > 0)
      breakdown += "Base Stat Gain: +" + Math.round(god.statGain.maxHp) + "<br />";
    if (god.permanentStatGain.maxHp > 0)
      breakdown += "Permanent Stat Gain: +" + Math.round(god.permanentStatGain.maxHp) + "<br />";

    return breakdown;
  }

  getGodAttackStatBreakdown(god: God) {
    var breakdown = "";

    if (god.statGain.attack > 0)
      breakdown += "Base Stat Gain: +" + Math.round(god.statGain.attack) + "<br />";
    if (god.permanentStatGain.attack > 0)
      breakdown += "Permanent Stat Gain: +" + Math.round(god.permanentStatGain.attack) + "<br />";

    return breakdown;
  }

  getGodDefenseStatBreakdown(god: God) {
    var breakdown = "";

    if (god.statGain.defense > 0)
      breakdown += "Base Stat Gain: +" + Math.round(god.statGain.defense) + "<br />";
    if (god.permanentStatGain.defense > 0)
      breakdown += "Permanent Stat Gain: +" + Math.round(god.permanentStatGain.defense) + "<br />";

    return breakdown;
  }

  getGodAgilityStatBreakdown(god: God) {
    var breakdown = "";

    if (god.statGain.agility > 0)
      breakdown += "Base Stat Gain: +" + Math.round(god.statGain.agility) + "<br />";
    if (god.permanentStatGain.agility > 0)
      breakdown += "Permanent Stat Gain: +" + Math.round(god.permanentStatGain.agility) + "<br />";

    return breakdown;
  }

  getGodLuckStatBreakdown(god: God) {
    var breakdown = "";

    if (god.statGain.luck > 0)
      breakdown += "Base Stat Gain: +" + Math.round(god.statGain.luck) + "<br />";
    if (god.permanentStatGain.luck > 0)
      breakdown += "Permanent Stat Gain: +" + Math.round(god.permanentStatGain.luck) + "<br />";

    return breakdown;
  }

  getGodResistanceStatBreakdown(god: God) {
    var breakdown = "";

    if (god.statGain.resistance > 0)
      breakdown += "Base Stat Gain: +" + Math.round(god.statGain.resistance) + "<br />";
    if (god.permanentStatGain.resistance > 0)
      breakdown += "Permanent Stat Gain: +" + Math.round(god.permanentStatGain.resistance) + "<br />";

    return breakdown;
  }

  getGodHpRegenStatBreakdown(god: God) {
    var breakdown = "";

    if (god.statGain.hpRegen > 0)
      breakdown += "Base Stat Gain: +" + this.utilityService.roundTo(god.statGain.hpRegen, 2) + "<br />";
    if (god.permanentStatGain.hpRegen > 0)
      breakdown += "Permanent Stat Gain: +" + this.utilityService.roundTo(god.permanentStatGain.hpRegen, 2) + "<br />";

    return breakdown;
  }

  getGodCriticalMultiplierStatBreakdown(god: God) {
    var breakdown = "";

    if (god.statGain.criticalMultiplier > 0)
      breakdown += "Base Stat Gain: +" + this.utilityService.roundTo(god.statGain.criticalMultiplier * 100, 2) + "%<br />";
    if (god.permanentStatGain.criticalMultiplier > 0)
      breakdown += "Permanent Stat Gain: +" + this.utilityService.roundTo(god.permanentStatGain.criticalMultiplier * 100, 2) + "%<br />";

    return breakdown;
  }

  getGodArmorPenetrationStatBreakdown(god: God) {
    var breakdown = "";

    if (god.statGain.armorPenetration > 0)
      breakdown += "Base Stat Gain: +" + this.utilityService.roundTo(god.statGain.armorPenetration * 100, 2) + "%<br />";
    if (god.permanentStatGain.armorPenetration > 0)
      breakdown += "Permanent Stat Gain: +" + this.utilityService.roundTo(god.permanentStatGain.armorPenetration * 100, 2) + "%<br />";

    return breakdown;
  }

  getGodOverdriveGainBonusStatBreakdown(god: God) {
    var breakdown = "";

    if (god.statGain.overdriveGain > 0)
      breakdown += "Base Stat Gain: +" + this.utilityService.roundTo(god.statGain.overdriveGain * 100, 2) + "%<br />";
    if (god.permanentStatGain.overdriveGain > 0)
      breakdown += "Permanent Stat Gain: +" + this.utilityService.roundTo(god.permanentStatGain.overdriveGain * 100, 2) + "%<br />";

    return breakdown;
  }

  getGodHealingReceivedBonusStatBreakdown(god: God) {
    var breakdown = "";

    if (god.statGain.healingReceived > 0)
      breakdown += "Base Stat Gain: +" + this.utilityService.roundTo(god.statGain.healingReceived * 100, 2) + "%<br />";
    if (god.permanentStatGain.healingReceived > 0)
      breakdown += "Permanent Stat Gain: +" + this.utilityService.roundTo(god.permanentStatGain.healingReceived * 100, 2) + "%<br />";

    return breakdown;
  }

  getGodDebuffDurationBonusStatBreakdown(god: God) {
    var breakdown = "";

    if (god.statGain.debuffDuration > 0)
      breakdown += "Base Stat Gain: +" + this.utilityService.roundTo(god.statGain.debuffDuration * 100, 2) + "%<br />";
    if (god.permanentStatGain.debuffDuration > 0)
      breakdown += "Permanent Stat Gain: +" + this.utilityService.roundTo(god.permanentStatGain.debuffDuration * 100, 2) + "%<br />";

    return breakdown;
  }

  getGodOverdriveGainFromAutoAttacksBonusStatBreakdown(god: God) {
    var breakdown = "";

    if (god.statGain.overdriveGainFromAutoAttacks > 0)
      breakdown += "Base Stat Gain: +" + this.utilityService.roundTo(god.statGain.overdriveGainFromAutoAttacks * 100, 2) + "%<br />";
    if (god.permanentStatGain.overdriveGainFromAutoAttacks > 0)
      breakdown += "Permanent Stat Gain: +" + this.utilityService.roundTo(god.permanentStatGain.overdriveGainFromAutoAttacks * 100, 2) + "%<br />";

    return breakdown;
  }

  getGodHealingDoneBonusStatBreakdown(god: God) {
    var breakdown = "";

    if (god.statGain.healingDone > 0)
      breakdown += "Base Stat Gain: +" + this.utilityService.roundTo(god.statGain.healingDone * 100, 2) + "%<br />";
    if (god.permanentStatGain.healingDone > 0)
      breakdown += "Permanent Stat Gain: +" + this.utilityService.roundTo(god.permanentStatGain.healingDone * 100, 2) + "%<br />";

    return breakdown;
  }

  getGodAbilityCooldownReductionStatBreakdown(god: God) {
    var breakdown = "";

    if (god.statGain.abilityCooldownReduction > 0)
      breakdown += "Base Stat Gain: +" + this.utilityService.roundTo(god.statGain.abilityCooldownReduction, 3) + "<br />";
    if (god.permanentStatGain.abilityCooldownReduction > 0)
      breakdown += "Permanent Stat Gain: +" + this.utilityService.roundTo(god.permanentStatGain.abilityCooldownReduction, 3) + "<br />";

    return breakdown;
  }

  getGodAutoAttackCooldownReductionStatBreakdown(god: God) {
    var breakdown = "";

    if (god.statGain.autoAttackCooldownReduction > 0)
      breakdown += "Base Stat Gain: +" + this.utilityService.roundTo(god.statGain.autoAttackCooldownReduction, 3) + "<br />";
    if (god.permanentStatGain.autoAttackCooldownReduction > 0)
      breakdown += "Permanent Stat Gain: +" + this.utilityService.roundTo(god.permanentStatGain.autoAttackCooldownReduction, 3) + "<br />";

    return breakdown;
  }

  getGodAoeDamageBonusStatBreakdown(god: God) {
    var breakdown = "";

    if (god.statGain.aoeDamage > 0)
      breakdown += "Base Stat Gain: +" + this.utilityService.roundTo(god.statGain.aoeDamage * 100, 2) + "%<br />";
    if (god.permanentStatGain.aoeDamage > 0)
      breakdown += "Permanent Stat Gain: +" + this.utilityService.roundTo(god.permanentStatGain.aoeDamage * 100, 2) + "%<br />";

    return breakdown;
  }

  getGodTickFrequencyBonusStatBreakdown(god: God) {
    var breakdown = "";

    if (god.statGain.tickFrequency > 0)
      breakdown += "Base Stat Gain: +" + this.utilityService.roundTo(god.statGain.tickFrequency * 100, 2) + "%<br />";
    if (god.permanentStatGain.tickFrequency > 0)
      breakdown += "Permanent Stat Gain: +" + this.utilityService.roundTo(god.permanentStatGain.tickFrequency * 100, 2) + "%<br />";

    return breakdown;
  }

  getGodThornsBonusStatBreakdown(god: God) {
    var breakdown = "";

    if (god.statGain.thorns > 0)
      breakdown += "Base Stat Gain: +" + this.utilityService.roundTo(god.statGain.thorns * 100, 2) + "%<br />";
    if (god.permanentStatGain.thorns > 0)
      breakdown += "Permanent Stat Gain: +" + this.utilityService.roundTo(god.permanentStatGain.thorns * 100, 2) + "%<br />";

    return breakdown;
  }

  getGodAbilityCooldownReductionStartBonusStatBreakdown(god: God) {
    var breakdown = "";

    if (god.statGain.abilityCooldownReductionStart > 0)
      breakdown += "Base Stat Gain: +" + this.utilityService.roundTo(god.statGain.abilityCooldownReductionStart * 100, 2) + "%<br />";
    if (god.permanentStatGain.abilityCooldownReductionStart > 0)
      breakdown += "Permanent Stat Gain: +" + this.utilityService.roundTo(god.permanentStatGain.abilityCooldownReductionStart * 100, 2) + "%<br />";

    return breakdown;
  }

  getGodAbilityCooldownReductionWithBuffsBonusStatBreakdown(god: God) {
    var breakdown = "";

    if (god.statGain.abilityCooldownReductionWithBuffs > 0)
      breakdown += "Base Stat Gain: +" + this.utilityService.roundTo(god.statGain.abilityCooldownReductionWithBuffs * 100, 2) + "%<br />";
    if (god.permanentStatGain.abilityCooldownReductionWithBuffs > 0)
      breakdown += "Permanent Stat Gain: +" + this.utilityService.roundTo(god.permanentStatGain.abilityCooldownReductionWithBuffs * 100, 2) + "%<br />";

    return breakdown;
  }

  getGodElementalDamageIncreaseStatBreakdown(god: God, type?: ElementalTypeEnum, name?: string) {
    var breakdown = "";

    if (type === ElementalTypeEnum.Holy || name === "Holy") {
      if (god.statGain.elementIncrease.holy > 0)
        breakdown += "Base Stat Gain: +" + this.utilityService.roundTo(god.statGain.elementIncrease.holy * 100, 2) + "%<br />";
      if (god.permanentStatGain.elementIncrease.holy > 0)
        breakdown += "Permanent Stat Gain: +" + this.utilityService.roundTo(god.permanentStatGain.elementIncrease.holy * 100, 2) + "%<br />";
    }
    else if (type === ElementalTypeEnum.Fire || name === "Fire") {
      if (god.statGain.elementIncrease.fire > 0)
        breakdown += "Base Stat Gain: +" + this.utilityService.roundTo(god.statGain.elementIncrease.fire * 100, 2) + "%<br />";
      if (god.permanentStatGain.elementIncrease.fire > 0)
        breakdown += "Permanent Stat Gain: +" + this.utilityService.roundTo(god.permanentStatGain.elementIncrease.fire * 100, 2) + "%<br />";
    }
    else if (type === ElementalTypeEnum.Lightning || name === "Lightning") {
      if (god.statGain.elementIncrease.lightning > 0)
        breakdown += "Base Stat Gain: +" + this.utilityService.roundTo(god.statGain.elementIncrease.lightning * 100, 2) + "%<br />";
      if (god.permanentStatGain.elementIncrease.lightning > 0)
        breakdown += "Permanent Stat Gain: +" + this.utilityService.roundTo(god.permanentStatGain.elementIncrease.lightning * 100, 2) + "%<br />";
    }
    else if (type === ElementalTypeEnum.Water || name === "Water") {
      if (god.statGain.elementIncrease.water > 0)
        breakdown += "Base Stat Gain: +" + this.utilityService.roundTo(god.statGain.elementIncrease.water * 100, 2) + "%<br />";
      if (god.permanentStatGain.elementIncrease.water > 0)
        breakdown += "Permanent Stat Gain: +" + this.utilityService.roundTo(god.permanentStatGain.elementIncrease.water * 100, 2) + "%<br />";
    }
    else if (type === ElementalTypeEnum.Air || name === "Air") {
      if (god.statGain.elementIncrease.air > 0)
        breakdown += "Base Stat Gain: +" + this.utilityService.roundTo(god.statGain.elementIncrease.air * 100, 2) + "%<br />";
      if (god.permanentStatGain.elementIncrease.air > 0)
        breakdown += "Permanent Stat Gain: +" + this.utilityService.roundTo(god.permanentStatGain.elementIncrease.air * 100, 2) + "%<br />";
    }
    else if (type === ElementalTypeEnum.Earth || name === "Earth") {
      if (god.statGain.elementIncrease.earth > 0)
        breakdown += "Base Stat Gain: +" + this.utilityService.roundTo(god.statGain.elementIncrease.earth * 100, 2) + "%<br />";
      if (god.permanentStatGain.elementIncrease.earth > 0)
        breakdown += "Permanent Stat Gain: +" + this.utilityService.roundTo(god.permanentStatGain.elementIncrease.earth * 100, 2) + "%<br />";
    }

    return breakdown;
  }

  getGodElementalDamageResistanceStatBreakdown(god: God, type?: ElementalTypeEnum, name?: string) {
    var breakdown = "";

    if (type === ElementalTypeEnum.Holy || name === "Holy") {
      if (god.statGain.elementResistance.holy > 0)
        breakdown += "Base Stat Gain: +" + this.utilityService.roundTo(god.statGain.elementResistance.holy * 100, 2) + "%<br />";
      if (god.permanentStatGain.elementResistance.holy > 0)
        breakdown += "Permanent Stat Gain: +" + this.utilityService.roundTo(god.permanentStatGain.elementResistance.holy * 100, 2) + "%<br />";
    }
    else if (type === ElementalTypeEnum.Fire || name === "Fire") {
      if (god.statGain.elementResistance.fire > 0)
        breakdown += "Base Stat Gain: +" + this.utilityService.roundTo(god.statGain.elementResistance.fire * 100, 2) + "%<br />";
      if (god.permanentStatGain.elementResistance.fire > 0)
        breakdown += "Permanent Stat Gain: +" + this.utilityService.roundTo(god.permanentStatGain.elementResistance.fire * 100, 2) + "%<br />";
    }
    else if (type === ElementalTypeEnum.Lightning || name === "Lightning") {
      if (god.statGain.elementResistance.lightning > 0)
        breakdown += "Base Stat Gain: +" + this.utilityService.roundTo(god.statGain.elementResistance.lightning * 100, 2) + "%<br />";
      if (god.permanentStatGain.elementResistance.lightning > 0)
        breakdown += "Permanent Stat Gain: +" + this.utilityService.roundTo(god.permanentStatGain.elementResistance.lightning * 100, 2) + "%<br />";
    }
    else if (type === ElementalTypeEnum.Water || name === "Water") {
      if (god.statGain.elementResistance.water > 0)
        breakdown += "Base Stat Gain: +" + this.utilityService.roundTo(god.statGain.elementResistance.water * 100, 2) + "%<br />";
      if (god.permanentStatGain.elementResistance.water > 0)
        breakdown += "Permanent Stat Gain: +" + this.utilityService.roundTo(god.permanentStatGain.elementResistance.water * 100, 2) + "%<br />";
    }
    else if (type === ElementalTypeEnum.Air || name === "Air") {
      if (god.statGain.elementResistance.air > 0)
        breakdown += "Base Stat Gain: +" + this.utilityService.roundTo(god.statGain.elementResistance.air * 100, 2) + "%<br />";
      if (god.permanentStatGain.elementResistance.air > 0)
        breakdown += "Permanent Stat Gain: +" + this.utilityService.roundTo(god.permanentStatGain.elementResistance.air * 100, 2) + "%<br />";
    }
    else if (type === ElementalTypeEnum.Earth || name === "Earth") {
      if (god.statGain.elementResistance.earth > 0)
        breakdown += "Base Stat Gain: +" + this.utilityService.roundTo(god.statGain.elementResistance.earth * 100, 2) + "%<br />";
      if (god.permanentStatGain.elementResistance.earth > 0)
        breakdown += "Permanent Stat Gain: +" + this.utilityService.roundTo(god.permanentStatGain.elementResistance.earth * 100, 2) + "%<br />";
    }

    return breakdown;
  }

  getMaxHpStatBreakdown(character: Character) {
    var breakdown = "";
    var assignedGod1 = this.globalService.globalVar.gods.find(item => item.type === character.assignedGod1);
    var assignedGod2 = this.globalService.globalVar.gods.find(item => item.type === character.assignedGod2);

    if (character.baseStats.maxHp > 0)
      breakdown += "Base Stat Gain: +" + Math.round(character.baseStats.maxHp) + "<br />";

    if (assignedGod1 !== undefined) {
      var godStatGain = assignedGod1.statGain.maxHp + assignedGod1.permanentStatGain.maxHp;
      if (godStatGain > 0)
        breakdown += assignedGod1.name + " Stat Gain: +" + Math.round(godStatGain) + "<br />";
    }

    if (assignedGod2 !== undefined) {
      var godStatGain = assignedGod2.statGain.maxHp + assignedGod2.permanentStatGain.maxHp;
      if (godStatGain > 0)
        breakdown += assignedGod2.name + " Stat Gain: +" + Math.round(godStatGain) + "<br />";
    }

    var equipmentMaxHpGain = this.equipmentService.getTotalMaxHpGain(character.equipmentSet);
    if (equipmentMaxHpGain > 0)
      breakdown += "Equipment: +" + equipmentMaxHpGain + "<br />";

    if (this.globalService.globalVar.chthonicPowers.getMaxHpBoostPercent() > 0)
      breakdown += "Chthonic Power: *" + this.utilityService.roundTo(1 + this.globalService.globalVar.chthonicPowers.getMaxHpBoostPercent(), 2) + "<br />";

    return breakdown;
  }

  getAttackStatBreakdown(character: Character) {
    var breakdown = "";
    var assignedGod1 = this.globalService.globalVar.gods.find(item => item.type === character.assignedGod1);
    var assignedGod2 = this.globalService.globalVar.gods.find(item => item.type === character.assignedGod2);

    if (character.baseStats.attack > 0)
      breakdown += "Base Stat Gain: +" + Math.round(character.baseStats.attack) + "<br />";

    if (assignedGod1 !== undefined) {
      var godStatGain = assignedGod1.statGain.attack + assignedGod1.permanentStatGain.attack;
      if (godStatGain > 0)
        breakdown += assignedGod1.name + " Stat Gain: +" + Math.round(godStatGain) + "<br />";
    }

    if (assignedGod2 !== undefined) {
      var godStatGain = assignedGod2.statGain.attack + assignedGod2.permanentStatGain.attack;
      if (godStatGain > 0)
        breakdown += assignedGod2.name + " Stat Gain: +" + Math.round(godStatGain) + "<br />";
    }

    var equipmentAttackGain = this.equipmentService.getTotalAttackGain(character.equipmentSet);
    if (equipmentAttackGain > 0)
      breakdown += "Equipment: +" + equipmentAttackGain + "<br />";

    if (this.globalService.globalVar.chthonicPowers.getAttackBoostPercent() > 0)
      breakdown += "Chthonic Power: *" + this.utilityService.roundTo(1 + this.globalService.globalVar.chthonicPowers.getAttackBoostPercent(), 2) + "<br />";

    return breakdown;
  }

  getDefenseStatBreakdown(character: Character) {
    var breakdown = "";
    var assignedGod1 = this.globalService.globalVar.gods.find(item => item.type === character.assignedGod1);
    var assignedGod2 = this.globalService.globalVar.gods.find(item => item.type === character.assignedGod2);

    if (character.baseStats.defense > 0)
      breakdown += "Base Stat Gain: +" + Math.round(character.baseStats.defense) + "<br />";

    if (assignedGod1 !== undefined) {
      var godStatGain = assignedGod1.statGain.defense + assignedGod1.permanentStatGain.defense;
      if (godStatGain > 0)
        breakdown += assignedGod1.name + " Stat Gain: +" + Math.round(godStatGain) + "<br />";
    }

    if (assignedGod2 !== undefined) {
      var godStatGain = assignedGod2.statGain.defense + assignedGod2.permanentStatGain.defense;
      if (godStatGain > 0)
        breakdown += assignedGod2.name + " Stat Gain: +" + Math.round(godStatGain) + "<br />";
    }

    var equipmentDefenseGain = this.equipmentService.getTotalDefenseGain(character.equipmentSet);
    if (equipmentDefenseGain > 0)
      breakdown += "Equipment: +" + equipmentDefenseGain + "<br />";

    if (this.globalService.globalVar.chthonicPowers.getDefenseBoostPercent() > 0)
      breakdown += "Chthonic Power: *" + this.utilityService.roundTo(1 + this.globalService.globalVar.chthonicPowers.getDefenseBoostPercent(), 2) + "<br />";

    return breakdown;
  }

  getAgilityStatBreakdown(character: Character) {
    var breakdown = "";
    var assignedGod1 = this.globalService.globalVar.gods.find(item => item.type === character.assignedGod1);
    var assignedGod2 = this.globalService.globalVar.gods.find(item => item.type === character.assignedGod2);

    if (character.baseStats.agility > 0)
      breakdown += "Base Stat Gain: +" + Math.round(character.baseStats.agility) + "<br />";

    if (assignedGod1 !== undefined) {
      var godStatGain = assignedGod1.statGain.agility + assignedGod1.permanentStatGain.agility;
      if (godStatGain > 0)
        breakdown += assignedGod1.name + " Stat Gain: +" + Math.round(godStatGain) + "<br />";
    }

    if (assignedGod2 !== undefined) {
      var godStatGain = assignedGod2.statGain.agility + assignedGod2.permanentStatGain.agility;
      if (godStatGain > 0)
        breakdown += assignedGod2.name + " Stat Gain: +" + Math.round(godStatGain) + "<br />";
    }

    var equipmentAgilityGain = this.equipmentService.getTotalAgilityGain(character.equipmentSet);
    if (equipmentAgilityGain > 0)
      breakdown += "Equipment: +" + equipmentAgilityGain + "<br />";

    if (this.globalService.globalVar.chthonicPowers.getAgilityBoostPercent() > 0)
      breakdown += "Chthonic Power: *" + this.utilityService.roundTo(1 + this.globalService.globalVar.chthonicPowers.getAgilityBoostPercent(), 2) + "<br />";

    return breakdown;
  }

  getLuckStatBreakdown(character: Character) {
    var breakdown = "";
    var assignedGod1 = this.globalService.globalVar.gods.find(item => item.type === character.assignedGod1);
    var assignedGod2 = this.globalService.globalVar.gods.find(item => item.type === character.assignedGod2);

    if (character.baseStats.luck > 0)
      breakdown += "Base Stat Gain: +" + Math.round(character.baseStats.luck) + "<br />";

    if (assignedGod1 !== undefined) {
      var godStatGain = assignedGod1.statGain.luck + assignedGod1.permanentStatGain.luck;
      if (godStatGain > 0)
        breakdown += assignedGod1.name + " Stat Gain: +" + Math.round(godStatGain) + "<br />";
    }

    if (assignedGod2 !== undefined) {
      var godStatGain = assignedGod2.statGain.luck + assignedGod2.permanentStatGain.luck;
      if (godStatGain > 0)
        breakdown += assignedGod2.name + " Stat Gain: +" + Math.round(godStatGain) + "<br />";
    }

    var equipmentLuckGain = this.equipmentService.getTotalLuckGain(character.equipmentSet);
    if (equipmentLuckGain > 0)
      breakdown += "Equipment: +" + equipmentLuckGain + "<br />";

    if (this.globalService.globalVar.chthonicPowers.getLuckBoostPercent() > 0)
      breakdown += "Chthonic Power: *" + this.utilityService.roundTo(1 + this.globalService.globalVar.chthonicPowers.getLuckBoostPercent(), 2) + "<br />";

    return breakdown;
  }

  getResistanceStatBreakdown(character: Character) {
    var breakdown = "";
    var assignedGod1 = this.globalService.globalVar.gods.find(item => item.type === character.assignedGod1);
    var assignedGod2 = this.globalService.globalVar.gods.find(item => item.type === character.assignedGod2);

    if (character.baseStats.resistance > 0)
      breakdown += "Base Stat Gain: +" + Math.round(character.baseStats.resistance) + "<br />";

    if (assignedGod1 !== undefined) {
      var godStatGain = assignedGod1.statGain.resistance + assignedGod1.permanentStatGain.resistance;
      if (godStatGain > 0)
        breakdown += assignedGod1.name + " Stat Gain: +" + Math.round(godStatGain) + "<br />";
    }

    if (assignedGod2 !== undefined) {
      var godStatGain = assignedGod2.statGain.resistance + assignedGod2.permanentStatGain.resistance;
      if (godStatGain > 0)
        breakdown += assignedGod2.name + " Stat Gain: +" + Math.round(godStatGain) + "<br />";
    }

    var equipmentResistanceGain = this.equipmentService.getTotalResistanceGain(character.equipmentSet);
    if (equipmentResistanceGain > 0)
      breakdown += "Equipment: +" + equipmentResistanceGain + "<br />";

    if (this.globalService.globalVar.chthonicPowers.getResistanceBoostPercent() > 0)
      breakdown += "Chthonic Power: *" + this.utilityService.roundTo(1 + this.globalService.globalVar.chthonicPowers.getResistanceBoostPercent(), 2) + "<br />";

    return breakdown;
  }

  getHpRegenStatBreakdown(character: Character) {
    var breakdown = "";
    var assignedGod1 = this.globalService.globalVar.gods.find(item => item.type === character.assignedGod1);
    var assignedGod2 = this.globalService.globalVar.gods.find(item => item.type === character.assignedGod2);

    if (character.baseStats.hpRegen > 0)
      breakdown += "Base Stat Gain: +" + this.utilityService.roundTo(character.baseStats.hpRegen, 2) + "<br />";

    if (assignedGod1 !== undefined) {
      var godStatGain = assignedGod1.statGain.hpRegen + assignedGod1.permanentStatGain.hpRegen;
      if (godStatGain > 0)
        breakdown += assignedGod1.name + " Stat Gain: +" + this.utilityService.roundTo(godStatGain, 2) + "<br />";
    }

    if (assignedGod2 !== undefined) {
      var godStatGain = assignedGod2.statGain.hpRegen + assignedGod2.permanentStatGain.hpRegen;
      if (godStatGain > 0)
        breakdown += assignedGod2.name + " Stat Gain: +" + this.utilityService.roundTo(godStatGain, 2) + "<br />";
    }

    var charmGain = this.charmService.getTotalHpRegenAdditionFromCharms(this.globalService.globalVar.resources);
    if (charmGain > 0) {
      breakdown += "Charm Total: +" + this.utilityService.roundTo(charmGain, 2) + "<br />";
    }

    var equipmentTotalHpRegenGain = this.equipmentService.getTotalHpRegenGain(character.equipmentSet);
    if (equipmentTotalHpRegenGain > 0)
      breakdown += "Equipment: +" + this.utilityService.roundTo(equipmentTotalHpRegenGain, 2) + "<br />";
    /*
        if (this.globalService.globalVar.chthonicPowers.getHpRegenBoostPercent() > 0)
          breakdown += "Chthonic Power: *" + (1 + this.globalService.globalVar.chthonicPowers.getHpRegenBoostPercent())+ "<br />";
    */
    return breakdown;
  }

  getCriticalMultiplierStatBreakdown(character: Character) {
    var breakdown = "";
    var defaultCriticalMultiplier = .25;
    var assignedGod1 = this.globalService.globalVar.gods.find(item => item.type === character.assignedGod1);
    var assignedGod2 = this.globalService.globalVar.gods.find(item => item.type === character.assignedGod2);

    breakdown += "Base Stat Gain: +" + Math.round((character.baseStats.criticalMultiplier + defaultCriticalMultiplier) * 100) + "%<br />";

    if (assignedGod1 !== undefined) {
      var godStatGain = assignedGod1.statGain.criticalMultiplier + assignedGod1.permanentStatGain.criticalMultiplier;
      if (godStatGain > 0)
        breakdown += assignedGod1.name + " Stat Gain: +" + Math.round(godStatGain * 100) + "%<br />";
    }

    if (assignedGod2 !== undefined) {
      var godStatGain = assignedGod2.statGain.criticalMultiplier + assignedGod2.permanentStatGain.criticalMultiplier;
      if (godStatGain > 0)
        breakdown += assignedGod2.name + " Stat Gain: +" + Math.round(godStatGain * 100) + "%<br />";
    }

    var charmGain = this.charmService.getTotalCriticalMultiplierAdditionFromCharms(this.globalService.globalVar.resources);
    if (charmGain > 0) {
      breakdown += "Charm Total: +" + Math.round(charmGain * 100) + "%<br />";
    }

    var equipmentTotalCriticalMultiplierGain = this.equipmentService.getTotalCriticalMultiplierGain(character.equipmentSet);
    if (equipmentTotalCriticalMultiplierGain > 0)
      breakdown += "Equipment: +" + Math.round(equipmentTotalCriticalMultiplierGain * 100) + "%<br />";

    return breakdown;
  }

  getOverdriveGainBonusStatBreakdown(character: Character) {
    var breakdown = "";
    var assignedGod1 = this.globalService.globalVar.gods.find(item => item.type === character.assignedGod1);
    var assignedGod2 = this.globalService.globalVar.gods.find(item => item.type === character.assignedGod2);

    if (character.baseStats.overdriveGain > 0)
      breakdown += "Base Stat Gain: +" + Math.round((character.baseStats.overdriveGain) * 100) + "%<br />";

    if (assignedGod1 !== undefined) {
      var godStatGain = assignedGod1.statGain.overdriveGain + assignedGod1.permanentStatGain.overdriveGain;
      if (godStatGain > 0)
        breakdown += assignedGod1.name + " Stat Gain: +" + Math.round(godStatGain * 100) + "%<br />";
    }

    if (assignedGod2 !== undefined) {
      var godStatGain = assignedGod2.statGain.overdriveGain + assignedGod2.permanentStatGain.overdriveGain;
      if (godStatGain > 0)
        breakdown += assignedGod2.name + " Stat Gain: +" + Math.round(godStatGain * 100) + "%<br />";
    }

    var charmGain = this.charmService.getTotalOverdriveGainAdditionFromCharms(this.globalService.globalVar.resources);
    if (charmGain > 0) {
      breakdown += "Charm Total: +" + Math.round(charmGain * 100) + "%<br />";
    }

    var equipmentOverdriveGain = this.equipmentService.getTotalOverdriveGain(character.equipmentSet);
    if (equipmentOverdriveGain > 0)
      breakdown += "Equipment: +" + Math.round(equipmentOverdriveGain * 100) + "%<br />";

    return breakdown;
  }

  getHealingReceivedBonusStatBreakdown(character: Character) {
    var breakdown = "";
    var assignedGod1 = this.globalService.globalVar.gods.find(item => item.type === character.assignedGod1);
    var assignedGod2 = this.globalService.globalVar.gods.find(item => item.type === character.assignedGod2);

    if (character.baseStats.healingReceived > 0)
      breakdown += "Base Stat Gain: +" + this.utilityService.roundTo((character.baseStats.healingReceived) * 100, 2) + "%<br />";

    if (assignedGod1 !== undefined) {
      var godStatGain = assignedGod1.statGain.healingReceived + assignedGod1.permanentStatGain.healingReceived;
      if (godStatGain > 0)
        breakdown += assignedGod1.name + " Stat Gain: +" + this.utilityService.roundTo(godStatGain * 100, 2) + "%<br />";
    }

    if (assignedGod2 !== undefined) {
      var godStatGain = assignedGod2.statGain.healingReceived + assignedGod2.permanentStatGain.healingReceived;
      if (godStatGain > 0)
        breakdown += assignedGod2.name + " Stat Gain: +" + this.utilityService.roundTo(godStatGain * 100, 2) + "%<br />";
    }

    var charmGain = this.charmService.getTotalHealingReceivedAdditionFromCharms(this.globalService.globalVar.resources, character);
    if (charmGain > 0) {
      breakdown += "Charm Total: +" + this.utilityService.roundTo(charmGain * 100, 2) + "%<br />";
    }

    var equipmentHealingReceivedGain = this.equipmentService.getTotalHealingReceivedGain(character.equipmentSet);
    if (equipmentHealingReceivedGain > 0)
      breakdown += "Equipment: +" + Math.round(equipmentHealingReceivedGain * 100) + "%<br />";

    return breakdown;
  }

  getDebuffDurationBonusStatBreakdown(character: Character) {
    var breakdown = "";
    var assignedGod1 = this.globalService.globalVar.gods.find(item => item.type === character.assignedGod1);
    var assignedGod2 = this.globalService.globalVar.gods.find(item => item.type === character.assignedGod2);

    if (character.baseStats.debuffDuration > 0)
      breakdown += "Base Stat Gain: +" + this.utilityService.roundTo((character.baseStats.debuffDuration) * 100, 2) + "%<br />";

    if (assignedGod1 !== undefined) {
      var godStatGain = assignedGod1.statGain.debuffDuration + assignedGod1.permanentStatGain.debuffDuration;
      if (godStatGain > 0)
        breakdown += assignedGod1.name + " Stat Gain: +" + this.utilityService.roundTo(godStatGain * 100, 2) + "%<br />";
    }

    if (assignedGod2 !== undefined) {
      var godStatGain = assignedGod2.statGain.debuffDuration + assignedGod2.permanentStatGain.debuffDuration;
      if (godStatGain > 0)
        breakdown += assignedGod2.name + " Stat Gain: +" + this.utilityService.roundTo(godStatGain * 100, 2) + "%<br />";
    }

    var charmGain = this.charmService.getTotalDebuffDurationAdditionFromCharms(this.globalService.globalVar.resources, character);
    if (charmGain > 0) {
      breakdown += "Charm Total: +" + this.utilityService.roundTo(charmGain * 100, 2) + "%<br />";
    }

    var equipmentDebuffDurationGain = this.equipmentService.getTotalDebuffDurationGain(character.equipmentSet);
    if (equipmentDebuffDurationGain > 0)
      breakdown += "Equipment: +" + this.utilityService.roundTo(equipmentDebuffDurationGain * 100, 2) + "%<br />";

    return breakdown;
  }

  getOverdriveGainFromAutoAttacksBonusStatBreakdown(character: Character) {
    var breakdown = "";
    var assignedGod1 = this.globalService.globalVar.gods.find(item => item.type === character.assignedGod1);
    var assignedGod2 = this.globalService.globalVar.gods.find(item => item.type === character.assignedGod2);

    if (character.baseStats.overdriveGainFromAutoAttacks > 0)
      breakdown += "Base Stat Gain: +" + this.utilityService.roundTo((character.baseStats.overdriveGainFromAutoAttacks) * 100, 2) + "%<br />";

    if (assignedGod1 !== undefined) {
      var godStatGain = assignedGod1.statGain.overdriveGainFromAutoAttacks + assignedGod1.permanentStatGain.overdriveGainFromAutoAttacks;
      if (godStatGain > 0)
        breakdown += assignedGod1.name + " Stat Gain: +" + this.utilityService.roundTo(godStatGain * 100, 2) + "%<br />";
    }

    if (assignedGod2 !== undefined) {
      var godStatGain = assignedGod2.statGain.overdriveGainFromAutoAttacks + assignedGod2.permanentStatGain.overdriveGainFromAutoAttacks;
      if (godStatGain > 0)
        breakdown += assignedGod2.name + " Stat Gain: +" + this.utilityService.roundTo(godStatGain * 100, 2) + "%<br />";
    }

    var charmGain = this.charmService.getTotalOverdriveGainFromAutoAttacksAdditionFromCharms(this.globalService.globalVar.resources, character);
    if (charmGain > 0) {
      breakdown += "Charm Total: +" + this.utilityService.roundTo(charmGain * 100, 2) + "%<br />";
    }

    var equipmentTotalOverdriveGainFromAutoAttacksGain = this.equipmentService.getTotalOverdriveGainFromAutoAttacksGain(character.equipmentSet);
    if (equipmentTotalOverdriveGainFromAutoAttacksGain > 0)
      breakdown += "Equipment: +" + equipmentTotalOverdriveGainFromAutoAttacksGain + "%<br />";

    return breakdown;
  }

  getHealingDoneBonusStatBreakdown(character: Character) {
    var breakdown = "";
    var assignedGod1 = this.globalService.globalVar.gods.find(item => item.type === character.assignedGod1);
    var assignedGod2 = this.globalService.globalVar.gods.find(item => item.type === character.assignedGod2);

    if (character.baseStats.healingDone > 0)
      breakdown += "Base Stat Gain: +" + this.utilityService.roundTo((character.baseStats.healingDone) * 100, 2) + "%<br />";

    if (assignedGod1 !== undefined) {
      var godStatGain = assignedGod1.statGain.healingDone + assignedGod1.permanentStatGain.healingDone;
      if (godStatGain > 0)
        breakdown += assignedGod1.name + " Stat Gain: +" + this.utilityService.roundTo(godStatGain * 100, 2) + "%<br />";
    }

    if (assignedGod2 !== undefined) {
      var godStatGain = assignedGod2.statGain.healingDone + assignedGod2.permanentStatGain.healingDone;
      if (godStatGain > 0)
        breakdown += assignedGod2.name + " Stat Gain: +" + this.utilityService.roundTo(godStatGain * 100, 2) + "%<br />";
    }

    var charmGain = this.charmService.getTotalHealingDoneAdditionFromCharms(this.globalService.globalVar.resources, character);
    if (charmGain > 0) {
      breakdown += "Charm Total: +" + this.utilityService.roundTo(charmGain * 100, 2) + "%<br />";
    }

    var equipmentHealingDoneGain = this.equipmentService.getTotalHealingDoneGain(character.equipmentSet);
    if (equipmentHealingDoneGain > 0)
      breakdown += "Equipment: +" + this.utilityService.roundTo(equipmentHealingDoneGain * 100, 2) + "%<br />";

    return breakdown;
  }

  getArmorPenetrationStatBreakdown(character: Character) {
    var breakdown = "";
    var assignedGod1 = this.globalService.globalVar.gods.find(item => item.type === character.assignedGod1);
    var assignedGod2 = this.globalService.globalVar.gods.find(item => item.type === character.assignedGod2);

    if (character.baseStats.armorPenetration > 0)
      breakdown += "Base Stat Gain: +" + this.utilityService.roundTo((character.baseStats.armorPenetration) * 100, 2) + "%<br />";

    if (assignedGod1 !== undefined) {
      var godStatGain = assignedGod1.statGain.armorPenetration + assignedGod1.permanentStatGain.armorPenetration;
      if (godStatGain > 0)
        breakdown += assignedGod1.name + " Stat Gain: +" + this.utilityService.roundTo(godStatGain * 100, 2) + "%<br />";
    }

    if (assignedGod2 !== undefined) {
      var godStatGain = assignedGod2.statGain.armorPenetration + assignedGod2.permanentStatGain.armorPenetration;
      if (godStatGain > 0)
        breakdown += assignedGod2.name + " Stat Gain: +" + this.utilityService.roundTo(godStatGain * 100, 2) + "%<br />";
    }

    var charmGain = this.charmService.getTotalArmorPenetrationAdditionFromCharms(this.globalService.globalVar.resources);
    if (charmGain > 0) {
      breakdown += "Charm Total: +" + this.utilityService.roundTo(charmGain * 100, 2) + "%<br />";
    }

    var equipmentArmorPenetrationGain = this.equipmentService.getTotalArmorPenetrationGain(character.equipmentSet);
    if (equipmentArmorPenetrationGain > 0)
      breakdown += "Equipment: +" + this.utilityService.roundTo(equipmentArmorPenetrationGain * 100, 2) + "%<br />";

    return breakdown;
  }

  getAbilityCooldownReductionStatBreakdown(character: Character) {
    var breakdown = "";
    var assignedGod1 = this.globalService.globalVar.gods.find(item => item.type === character.assignedGod1);
    var assignedGod2 = this.globalService.globalVar.gods.find(item => item.type === character.assignedGod2);

    if (character.baseStats.abilityCooldownReduction > 0)
      breakdown += "Base Stat Gain: *" + this.utilityService.roundTo(character.baseStats.abilityCooldownReduction * 100, 2) + "%<br />";

    if (assignedGod1 !== undefined) {
      var godStatGain = assignedGod1.statGain.abilityCooldownReduction + assignedGod1.permanentStatGain.abilityCooldownReduction;
      if (godStatGain > 0)
        breakdown += assignedGod1.name + " Stat Gain: *" + this.utilityService.roundTo(godStatGain * 100, 2) + "%<br />";
    }

    if (assignedGod2 !== undefined) {
      var godStatGain = assignedGod2.statGain.abilityCooldownReduction + assignedGod2.permanentStatGain.abilityCooldownReduction;
      if (godStatGain > 0)
        breakdown += assignedGod2.name + " Stat Gain: *" + this.utilityService.roundTo(godStatGain * 100, 2) + "%<br />";
    }

    var charmGain = this.charmService.getTotalAbilityCooldownReductionAdditionFromCharms(this.globalService.globalVar.resources);
    if (charmGain > 0) {
      breakdown += "Charm Total: *" + this.utilityService.roundTo(charmGain * 100, 2) + "%<br />";
    }

    var equipmentAbilityCooldownReductionGain = this.equipmentService.getTotalAbilityCooldownReductionGain(character.equipmentSet);
    if (equipmentAbilityCooldownReductionGain > 0)
      breakdown += "Equipment: *" + this.utilityService.roundTo(equipmentAbilityCooldownReductionGain * 100, 2) + "%<br />";

    return breakdown;
  }

  getAutoAttackCooldownReductionStatBreakdown(character: Character) {
    var breakdown = "";
    var assignedGod1 = this.globalService.globalVar.gods.find(item => item.type === character.assignedGod1);
    var assignedGod2 = this.globalService.globalVar.gods.find(item => item.type === character.assignedGod2);

    if (character.baseStats.autoAttackCooldownReduction > 0)
      breakdown += "Base Stat Gain: *" + this.utilityService.roundTo(character.baseStats.autoAttackCooldownReduction * 100, 2) + "%<br />";

    if (assignedGod1 !== undefined) {
      var godStatGain = assignedGod1.statGain.autoAttackCooldownReduction + assignedGod1.permanentStatGain.autoAttackCooldownReduction;
      if (godStatGain > 0)
        breakdown += assignedGod1.name + " Stat Gain: *" + this.utilityService.roundTo(godStatGain * 100, 2) + "%<br />";
    }

    if (assignedGod2 !== undefined) {
      var godStatGain = assignedGod2.statGain.autoAttackCooldownReduction + assignedGod2.permanentStatGain.autoAttackCooldownReduction;
      if (godStatGain > 0)
        breakdown += assignedGod2.name + " Stat Gain: *" + this.utilityService.roundTo(godStatGain * 100, 2) + "%<br />";
    }

    var charmGain = this.charmService.getTotalAutoAttackCooldownReductionAdditionFromCharms(this.globalService.globalVar.resources);
    if (charmGain > 0) {
      breakdown += "Charm Total: *" + this.utilityService.roundTo(charmGain * 100, 2) + "%<br />";
    }

    var equipmentAutoAttackCooldownReductionGain = this.equipmentService.getTotalAutoAttackCooldownReductionGain(character.equipmentSet);
    if (equipmentAutoAttackCooldownReductionGain > 0)
      breakdown += "Equipment: *" + this.utilityService.roundTo(equipmentAutoAttackCooldownReductionGain * 100, 2) + "%<br />";

    return breakdown;
  }

  getAoeDamageBonusStatBreakdown(character: Character) {
    var breakdown = "";
    var assignedGod1 = this.globalService.globalVar.gods.find(item => item.type === character.assignedGod1);
    var assignedGod2 = this.globalService.globalVar.gods.find(item => item.type === character.assignedGod2);

    if (character.baseStats.aoeDamage > 0)
      breakdown += "Base Stat Gain: +" + this.utilityService.roundTo((character.baseStats.aoeDamage) * 100, 2) + "%<br />";

    if (assignedGod1 !== undefined) {
      var godStatGain = assignedGod1.statGain.aoeDamage + assignedGod1.permanentStatGain.aoeDamage;
      if (godStatGain > 0)
        breakdown += assignedGod1.name + " Stat Gain: +" + this.utilityService.roundTo(godStatGain * 100, 2) + "%<br />";
    }

    if (assignedGod2 !== undefined) {
      var godStatGain = assignedGod2.statGain.aoeDamage + assignedGod2.permanentStatGain.aoeDamage;
      if (godStatGain > 0)
        breakdown += assignedGod2.name + " Stat Gain: +" + this.utilityService.roundTo(godStatGain * 100, 2) + "%<br />";
    }

    var charmGain = this.charmService.getTotalAoeDamageAdditionFromCharms(this.globalService.globalVar.resources, character);
    if (charmGain > 0) {
      breakdown += "Charm Total: +" + this.utilityService.roundTo(charmGain * 100, 2) + "%<br />";
    }

    var equipmentAoeDamageGain = this.equipmentService.getTotalAoeDamageGain(character.equipmentSet);
    if (equipmentAoeDamageGain > 0)
      breakdown += "Equipment: +" + Math.round(equipmentAoeDamageGain * 100) + "%<br />";

    return breakdown;
  }

  getAbilityCooldownReductionStartStatBreakdown(character: Character) {
    var breakdown = "";
    var assignedGod1 = this.globalService.globalVar.gods.find(item => item.type === character.assignedGod1);
    var assignedGod2 = this.globalService.globalVar.gods.find(item => item.type === character.assignedGod2);

    if (character.baseStats.abilityCooldownReductionStart > 0)
      breakdown += "Base Stat Gain: *" + this.utilityService.roundTo(character.baseStats.abilityCooldownReductionStart * 100, 2) + "%<br />";

    if (assignedGod1 !== undefined) {
      var godStatGain = assignedGod1.statGain.abilityCooldownReductionStart + assignedGod1.permanentStatGain.abilityCooldownReductionStart;
      if (godStatGain > 0)
        breakdown += assignedGod1.name + " Stat Gain: *" + this.utilityService.roundTo(godStatGain * 100, 2) + "%<br />";
    }

    if (assignedGod2 !== undefined) {
      var godStatGain = assignedGod2.statGain.abilityCooldownReductionStart + assignedGod2.permanentStatGain.abilityCooldownReductionStart;
      if (godStatGain > 0)
        breakdown += assignedGod2.name + " Stat Gain: *" + this.utilityService.roundTo(godStatGain * 100, 2) + "%<br />";
    }

    var charmGain = this.charmService.getTotalAbilityCooldownReductionStartAdditionFromCharms(this.globalService.globalVar.resources, character);
    if (charmGain > 0) {
      breakdown += "Charm Total: *" + this.utilityService.roundTo(charmGain * 100, 2) + "%<br />";
    }

    var equipmentAbilityCooldownReductionGain = this.equipmentService.getTotalAbilityCooldownReductionStartGain(character.equipmentSet);
    if (equipmentAbilityCooldownReductionGain > 0)
      breakdown += "Equipment: *" + this.utilityService.roundTo(equipmentAbilityCooldownReductionGain * 100, 2) + "%<br />";

    return breakdown;
  }

  getAbilityCooldownReductionWithBuffsStatBreakdown(character: Character) {
    var breakdown = "";
    var assignedGod1 = this.globalService.globalVar.gods.find(item => item.type === character.assignedGod1);
    var assignedGod2 = this.globalService.globalVar.gods.find(item => item.type === character.assignedGod2);

    if (character.baseStats.abilityCooldownReductionWithBuffs > 0)
      breakdown += "Base Stat Gain: *" + this.utilityService.roundTo(character.baseStats.abilityCooldownReductionWithBuffs * 100, 2) + "%<br />";

    if (assignedGod1 !== undefined) {
      var godStatGain = assignedGod1.statGain.abilityCooldownReductionWithBuffs + assignedGod1.permanentStatGain.abilityCooldownReductionWithBuffs;
      if (godStatGain > 0)
        breakdown += assignedGod1.name + " Stat Gain: *" + this.utilityService.roundTo(godStatGain * 100, 2) + "%<br />";
    }

    if (assignedGod2 !== undefined) {
      var godStatGain = assignedGod2.statGain.abilityCooldownReductionWithBuffs + assignedGod2.permanentStatGain.abilityCooldownReductionWithBuffs;
      if (godStatGain > 0)
        breakdown += assignedGod2.name + " Stat Gain: *" + this.utilityService.roundTo(godStatGain * 100, 2) + "%<br />";
    }

    var charmGain = this.charmService.getTotalAbilityCooldownReductionWithBuffsFromCharms(this.globalService.globalVar.resources, character);
    if (charmGain > 0) {
      breakdown += "Charm Total: *" + this.utilityService.roundTo(charmGain * 100, 2) + "%<br />";
    }

    var equipmentAbilityCooldownReductionWithBuffsGain = this.equipmentService.getTotalAbilityCooldownReductionWithBuffsGain(character.equipmentSet);
    if (equipmentAbilityCooldownReductionWithBuffsGain > 0)
      breakdown += "Equipment: *" + this.utilityService.roundTo(equipmentAbilityCooldownReductionWithBuffsGain * 100, 2) + "%<br />";

    return breakdown;
  }

  getTickFrequencyBonusStatBreakdown(character: Character) {
    var breakdown = "";
    var assignedGod1 = this.globalService.globalVar.gods.find(item => item.type === character.assignedGod1);
    var assignedGod2 = this.globalService.globalVar.gods.find(item => item.type === character.assignedGod2);

    if (character.baseStats.tickFrequency > 0)
      breakdown += "Base Stat Gain: +" + this.utilityService.roundTo((character.baseStats.tickFrequency) * 100, 2) + "%<br />";

    if (assignedGod1 !== undefined) {
      var godStatGain = assignedGod1.statGain.tickFrequency + assignedGod1.permanentStatGain.tickFrequency;
      if (godStatGain > 0)
        breakdown += assignedGod1.name + " Stat Gain: +" + this.utilityService.roundTo(godStatGain * 100, 2) + "%<br />";
    }

    if (assignedGod2 !== undefined) {
      var godStatGain = assignedGod2.statGain.tickFrequency + assignedGod2.permanentStatGain.tickFrequency;
      if (godStatGain > 0)
        breakdown += assignedGod2.name + " Stat Gain: +" + this.utilityService.roundTo(godStatGain * 100, 2) + "%<br />";
    }

    var charmGain = this.charmService.getTotalTickFrequencyAdditionFromCharms(this.globalService.globalVar.resources, character);
    if (charmGain > 0) {
      breakdown += "Charm Total: +" + this.utilityService.roundTo(charmGain * 100, 2) + "%<br />";
    }

    var equipmentTickFrequencyGain = this.equipmentService.getTotalTickFrequencyGain(character.equipmentSet);
    if (equipmentTickFrequencyGain > 0)
      breakdown += "Equipment: +" + Math.round(equipmentTickFrequencyGain * 100) + "%<br />";

    return breakdown;
  }

  getThornsBonusStatBreakdown(character: Character) {
    var breakdown = "";
    var assignedGod1 = this.globalService.globalVar.gods.find(item => item.type === character.assignedGod1);
    var assignedGod2 = this.globalService.globalVar.gods.find(item => item.type === character.assignedGod2);

    if (character.baseStats.thorns > 0)
      breakdown += "Base Stat Gain: +" + this.utilityService.roundTo((character.baseStats.thorns) * 100, 2) + "%<br />";

    if (assignedGod1 !== undefined) {
      var godStatGain = assignedGod1.statGain.thorns + assignedGod1.permanentStatGain.thorns;
      if (godStatGain > 0)
        breakdown += assignedGod1.name + " Stat Gain: +" + this.utilityService.roundTo(godStatGain * 100, 2) + "%<br />";
    }

    if (assignedGod2 !== undefined) {
      var godStatGain = assignedGod2.statGain.thorns + assignedGod2.permanentStatGain.thorns;
      if (godStatGain > 0)
        breakdown += assignedGod2.name + " Stat Gain: +" + this.utilityService.roundTo(godStatGain * 100, 2) + "%<br />";
    }

    var charmGain = this.charmService.getTotalThornsAdditionFromCharms(this.globalService.globalVar.resources, character);
    if (charmGain > 0) {
      breakdown += "Charm Total: +" + this.utilityService.roundTo(charmGain * 100, 2) + "%<br />";
    }

    var equipmentThornsGain = this.equipmentService.getTotalThornsGain(character.equipmentSet);
    if (equipmentThornsGain > 0)
      breakdown += "Equipment: +" + Math.round(equipmentThornsGain * 100) + "%<br />";

    return breakdown;
  }

  getElementalDamageIncreaseStatBreakdown(character: Character, type?: ElementalTypeEnum, name?: string) {
    var breakdown = "";
    var assignedGod1 = this.globalService.globalVar.gods.find(item => item.type === character.assignedGod1);
    var assignedGod2 = this.globalService.globalVar.gods.find(item => item.type === character.assignedGod2);

    if (type === ElementalTypeEnum.Holy || name === "Holy") {
      if (assignedGod1 !== undefined) {
        var godStatGain = assignedGod1.statGain.elementIncrease.holy + assignedGod1.permanentStatGain.elementIncrease.holy;
        if (godStatGain > 0)
          breakdown += assignedGod1.name + " Stat Gain: +" + this.utilityService.roundTo(godStatGain * 100, 2) + "%<br />";
      }

      if (assignedGod2 !== undefined) {
        var godStatGain = assignedGod2.statGain.elementIncrease.holy + assignedGod2.permanentStatGain.elementIncrease.holy;
        if (godStatGain > 0)
          breakdown += assignedGod2.name + " Stat Gain: +" + this.utilityService.roundTo(godStatGain * 100, 2) + "%<br />";
      }

      var equipmentHolyDamageIncreaseGain = this.equipmentService.getTotalHolyDamageIncreaseGain(character.equipmentSet);
      if (equipmentHolyDamageIncreaseGain > 0)
        breakdown += "Equipment: +" + Math.round(equipmentHolyDamageIncreaseGain * 100) + "%<br />";

      var charmGain = this.charmService.getTotalHolyDamageIncreaseAdditionFromCharms(this.globalService.globalVar.resources);
      if (charmGain > 0) {
        breakdown += "Charm Total: " + this.utilityService.roundTo(charmGain * 100, 2) + "%<br />";
      }
    }
    else if (type === ElementalTypeEnum.Fire || name === "Fire") {
      if (assignedGod1 !== undefined) {
        var godStatGain = assignedGod1.statGain.elementIncrease.fire + assignedGod1.permanentStatGain.elementIncrease.fire;
        if (godStatGain > 0)
          breakdown += assignedGod1.name + " Stat Gain: +" + this.utilityService.roundTo(godStatGain * 100, 2) + "%<br />";
      }

      if (assignedGod2 !== undefined) {
        var godStatGain = assignedGod2.statGain.elementIncrease.fire + assignedGod2.permanentStatGain.elementIncrease.fire;
        if (godStatGain > 0)
          breakdown += assignedGod2.name + " Stat Gain: +" + this.utilityService.roundTo(godStatGain * 100, 2) + "%<br />";
      }

      var equipmentFireDamageIncreaseGain = this.equipmentService.getTotalFireDamageIncreaseGain(character.equipmentSet);
      if (equipmentFireDamageIncreaseGain > 0)
        breakdown += "Equipment: +" + Math.round(equipmentFireDamageIncreaseGain * 100) + "%<br />";

      var charmGain = this.charmService.getTotalFireDamageIncreaseAdditionFromCharms(this.globalService.globalVar.resources);
      if (charmGain > 0) {
        breakdown += "Charm Total: " + this.utilityService.roundTo(charmGain * 100, 2) + "%<br />";
      }
    }
    else if (type === ElementalTypeEnum.Lightning || name === "Lightning") {
      if (assignedGod1 !== undefined) {
        var godStatGain = assignedGod1.statGain.elementIncrease.lightning + assignedGod1.permanentStatGain.elementIncrease.lightning;
        if (godStatGain > 0)
          breakdown += assignedGod1.name + " Stat Gain: +" + this.utilityService.roundTo(godStatGain * 100, 2) + "%<br />";
      }

      if (assignedGod2 !== undefined) {
        var godStatGain = assignedGod2.statGain.elementIncrease.lightning + assignedGod2.permanentStatGain.elementIncrease.lightning;
        if (godStatGain > 0)
          breakdown += assignedGod2.name + " Stat Gain: +" + this.utilityService.roundTo(godStatGain * 100, 2) + "%<br />";
      }

      var equipmentLightningDamageIncreaseGain = this.equipmentService.getTotalLightningDamageIncreaseGain(character.equipmentSet);
      if (equipmentLightningDamageIncreaseGain > 0)
        breakdown += "Equipment: +" + this.utilityService.roundTo(equipmentLightningDamageIncreaseGain * 100, 2) + "%<br />";

      var charmGain = this.charmService.getTotalLightningDamageIncreaseAdditionFromCharms(this.globalService.globalVar.resources);
      if (charmGain > 0) {
        breakdown += "Charm Total: " + this.utilityService.roundTo(charmGain * 100, 2) + "%<br />";
      }
    }
    else if (type === ElementalTypeEnum.Water || name === "Water") {
      if (assignedGod1 !== undefined) {
        var godStatGain = assignedGod1.statGain.elementIncrease.water + assignedGod1.permanentStatGain.elementIncrease.water;
        if (godStatGain > 0)
          breakdown += assignedGod1.name + " Stat Gain: +" + this.utilityService.roundTo(godStatGain * 100, 2) + "%<br />";
      }

      if (assignedGod2 !== undefined) {
        var godStatGain = assignedGod2.statGain.elementIncrease.water + assignedGod2.permanentStatGain.elementIncrease.water;
        if (godStatGain > 0)
          breakdown += assignedGod2.name + " Stat Gain: +" + this.utilityService.roundTo(godStatGain * 100, 2) + "%<br />";
      }

      var equipmentWaterDamageIncreaseGain = this.equipmentService.getTotalWaterDamageIncreaseGain(character.equipmentSet);
      if (equipmentWaterDamageIncreaseGain > 0)
        breakdown += "Equipment: +" + this.utilityService.roundTo(equipmentWaterDamageIncreaseGain * 100, 2) + "%<br />";

      var charmGain = this.charmService.getTotalWaterDamageIncreaseAdditionFromCharms(this.globalService.globalVar.resources);
      if (charmGain > 0) {
        breakdown += "Charm Total: " + this.utilityService.roundTo(charmGain * 100, 2) + "%<br />";
      }
    }
    else if (type === ElementalTypeEnum.Air || name === "Air") {
      if (assignedGod1 !== undefined) {
        var godStatGain = assignedGod1.statGain.elementIncrease.air + assignedGod1.permanentStatGain.elementIncrease.air;
        if (godStatGain > 0)
          breakdown += assignedGod1.name + " Stat Gain: +" + this.utilityService.roundTo(godStatGain * 100, 2) + "%<br />";
      }

      if (assignedGod2 !== undefined) {
        var godStatGain = assignedGod2.statGain.elementIncrease.air + assignedGod2.permanentStatGain.elementIncrease.air;
        if (godStatGain > 0)
          breakdown += assignedGod2.name + " Stat Gain: +" + this.utilityService.roundTo(godStatGain * 100, 2) + "%<br />";
      }

      var equipmentAirDamageIncreaseGain = this.equipmentService.getTotalAirDamageIncreaseGain(character.equipmentSet);
      if (equipmentAirDamageIncreaseGain > 0)
        breakdown += "Equipment: +" + this.utilityService.roundTo(equipmentAirDamageIncreaseGain * 100, 2) + "%<br />";

      var charmGain = this.charmService.getTotalAirDamageIncreaseAdditionFromCharms(this.globalService.globalVar.resources);
      if (charmGain > 0) {
        breakdown += "Charm Total: " + this.utilityService.roundTo(charmGain * 100, 2) + "%<br />";
      }
    }
    else if (type === ElementalTypeEnum.Earth || name === "Earth") {
      if (assignedGod1 !== undefined) {
        var godStatGain = assignedGod1.statGain.elementIncrease.earth + assignedGod1.permanentStatGain.elementIncrease.earth;
        if (godStatGain > 0)
          breakdown += assignedGod1.name + " Stat Gain: +" + this.utilityService.roundTo(godStatGain * 100, 2) + "%<br />";
      }

      if (assignedGod2 !== undefined) {
        var godStatGain = assignedGod2.statGain.elementIncrease.earth + assignedGod2.permanentStatGain.elementIncrease.earth;
        if (godStatGain > 0)
          breakdown += assignedGod2.name + " Stat Gain: +" + this.utilityService.roundTo(godStatGain * 100, 2) + "%<br />";
      }

      var equipmentEarthDamageIncreaseGain = this.equipmentService.getTotalEarthDamageIncreaseGain(character.equipmentSet);
      if (equipmentEarthDamageIncreaseGain > 0)
        breakdown += "Equipment: +" + this.utilityService.roundTo(equipmentEarthDamageIncreaseGain * 100, 2) + "%<br />";

      var charmGain = this.charmService.getTotalEarthDamageIncreaseAdditionFromCharms(this.globalService.globalVar.resources);
      if (charmGain > 0) {
        breakdown += "Charm Total: " + this.utilityService.roundTo(charmGain * 100, 2) + "%<br />";
      }
    }

    return breakdown;
  }

  getElementalDamageResistanceStatBreakdown(character: Character, type?: ElementalTypeEnum, name?: string) {
    var breakdown = "";

    var breakdown = "";
    var assignedGod1 = this.globalService.globalVar.gods.find(item => item.type === character.assignedGod1);
    var assignedGod2 = this.globalService.globalVar.gods.find(item => item.type === character.assignedGod2);

    if (type === ElementalTypeEnum.Holy || name === "Holy") {
      if (assignedGod1 !== undefined) {
        var godStatGain = assignedGod1.statGain.elementResistance.holy + assignedGod1.permanentStatGain.elementResistance.holy;
        if (godStatGain > 0)
          breakdown += assignedGod1.name + " Stat Gain: +" + this.utilityService.roundTo(godStatGain * 100, 2) + "%<br />";
      }

      if (assignedGod2 !== undefined) {
        var godStatGain = assignedGod2.statGain.elementResistance.holy + assignedGod2.permanentStatGain.elementResistance.holy;
        if (godStatGain > 0)
          breakdown += assignedGod2.name + " Stat Gain: +" + this.utilityService.roundTo(godStatGain * 100, 2) + "%<br />";
      }

      var equipmentHolyDamageResistanceGain = this.equipmentService.getTotalHolyDamageResistanceGain(character.equipmentSet);
      if (equipmentHolyDamageResistanceGain > 0)
        breakdown += "Equipment: +" + this.utilityService.roundTo(equipmentHolyDamageResistanceGain * 100, 2) + "%<br />";

      var charmGain = this.charmService.getTotalHolyDamageResistanceAdditionFromCharms(this.globalService.globalVar.resources);
      if (charmGain > 0) {
        breakdown += "Charm Total: " + this.utilityService.roundTo(charmGain * 100, 2) + "%<br />";
      }
    }
    else if (type === ElementalTypeEnum.Fire || name === "Fire") {
      if (assignedGod1 !== undefined) {
        var godStatGain = assignedGod1.statGain.elementResistance.fire + assignedGod1.permanentStatGain.elementResistance.fire;
        if (godStatGain > 0)
          breakdown += assignedGod1.name + " Stat Gain: +" + this.utilityService.roundTo(godStatGain * 100, 2) + "%<br />";
      }

      if (assignedGod2 !== undefined) {
        var godStatGain = assignedGod2.statGain.elementResistance.fire + assignedGod2.permanentStatGain.elementResistance.fire;
        if (godStatGain > 0)
          breakdown += assignedGod2.name + " Stat Gain: +" + this.utilityService.roundTo(godStatGain * 100, 2) + "%<br />";
      }

      var equipmentFireDamageResistanceGain = this.equipmentService.getTotalFireDamageResistanceGain(character.equipmentSet);
      if (equipmentFireDamageResistanceGain > 0)
        breakdown += "Equipment: +" + this.utilityService.roundTo(equipmentFireDamageResistanceGain * 100, 2) + "%<br />";


      var charmGain = this.charmService.getTotalFireDamageResistanceAdditionFromCharms(this.globalService.globalVar.resources);
      if (charmGain > 0) {
        breakdown += "Charm Total: " + Math.round(charmGain * 100) + "%<br />";
      }
    }
    else if (type === ElementalTypeEnum.Lightning || name === "Lightning") {
      if (assignedGod1 !== undefined) {
        var godStatGain = assignedGod1.statGain.elementResistance.lightning + assignedGod1.permanentStatGain.elementResistance.lightning;
        if (godStatGain > 0)
          breakdown += assignedGod1.name + " Stat Gain: +" + this.utilityService.roundTo(godStatGain * 100, 2) + "%<br />";
      }

      if (assignedGod2 !== undefined) {
        var godStatGain = assignedGod2.statGain.elementResistance.lightning + assignedGod2.permanentStatGain.elementResistance.lightning;
        if (godStatGain > 0)
          breakdown += assignedGod2.name + " Stat Gain: +" + this.utilityService.roundTo(godStatGain * 100, 2) + "%<br />";
      }

      var equipmentLightningDamageResistanceGain = this.equipmentService.getTotalLightningDamageResistanceGain(character.equipmentSet);
      if (equipmentLightningDamageResistanceGain > 0)
        breakdown += "Equipment: +" + Math.round(equipmentLightningDamageResistanceGain * 100) + "%<br />";


      var charmGain = this.charmService.getTotalLightningDamageResistanceAdditionFromCharms(this.globalService.globalVar.resources);
      if (charmGain > 0) {
        breakdown += "Charm Total: " + Math.round(charmGain * 100) + "%<br />";
      }
    }
    else if (type === ElementalTypeEnum.Water || name === "Water") {
      if (assignedGod1 !== undefined) {
        var godStatGain = assignedGod1.statGain.elementResistance.water + assignedGod1.permanentStatGain.elementResistance.water;
        if (godStatGain > 0)
          breakdown += assignedGod1.name + " Stat Gain: +" + this.utilityService.roundTo(godStatGain * 100, 2) + "%<br />";
      }

      if (assignedGod2 !== undefined) {
        var godStatGain = assignedGod2.statGain.elementResistance.water + assignedGod2.permanentStatGain.elementResistance.water;
        if (godStatGain > 0)
          breakdown += assignedGod2.name + " Stat Gain: +" + this.utilityService.roundTo(godStatGain * 100, 2) + "%<br />";
      }

      var equipmentWaterDamageResistanceGain = this.equipmentService.getTotalWaterDamageResistanceGain(character.equipmentSet);
      if (equipmentWaterDamageResistanceGain > 0)
        breakdown += "Equipment: +" + this.utilityService.roundTo(equipmentWaterDamageResistanceGain * 100, 2) + "%<br />";


      var charmGain = this.charmService.getTotalWaterDamageResistanceAdditionFromCharms(this.globalService.globalVar.resources);
      if (charmGain > 0) {
        breakdown += "Charm Total: " + this.utilityService.roundTo(charmGain * 100, 2) + "%<br />";
      }
    }
    else if (type === ElementalTypeEnum.Air || name === "Air") {
      if (assignedGod1 !== undefined) {
        var godStatGain = assignedGod1.statGain.elementResistance.air + assignedGod1.permanentStatGain.elementResistance.air;
        if (godStatGain > 0)
          breakdown += assignedGod1.name + " Stat Gain: +" + this.utilityService.roundTo(godStatGain * 100, 2) + "%<br />";
      }

      if (assignedGod2 !== undefined) {
        var godStatGain = assignedGod2.statGain.elementResistance.air + assignedGod2.permanentStatGain.elementResistance.air;
        if (godStatGain > 0)
          breakdown += assignedGod2.name + " Stat Gain: +" + this.utilityService.roundTo(godStatGain * 100, 2) + "%<br />";
      }

      var equipmentAirDamageResistanceGain = this.equipmentService.getTotalAirDamageResistanceGain(character.equipmentSet);
      if (equipmentAirDamageResistanceGain > 0)
        breakdown += "Equipment: +" + this.utilityService.roundTo(equipmentAirDamageResistanceGain * 100, 2) + "%<br />";


      var charmGain = this.charmService.getTotalAirDamageResistanceAdditionFromCharms(this.globalService.globalVar.resources);
      if (charmGain > 0) {
        breakdown += "Charm Total: " + this.utilityService.roundTo(charmGain * 100, 2) + "%<br />";
      }
    }
    else if (type === ElementalTypeEnum.Earth || name === "Earth") {
      if (assignedGod1 !== undefined) {
        var godStatGain = assignedGod1.statGain.elementResistance.earth + assignedGod1.permanentStatGain.elementResistance.earth;
        if (godStatGain > 0)
          breakdown += assignedGod1.name + " Stat Gain: +" + this.utilityService.roundTo(godStatGain * 100, 2) + "%<br />";
      }

      if (assignedGod2 !== undefined) {
        var godStatGain = assignedGod2.statGain.elementResistance.earth + assignedGod2.permanentStatGain.elementResistance.earth;
        if (godStatGain > 0)
          breakdown += assignedGod2.name + " Stat Gain: +" + this.utilityService.roundTo(godStatGain * 100, 2) + "%<br />";
      }

      var equipmentEarthDamageResistanceGain = this.equipmentService.getTotalEarthDamageResistanceGain(character.equipmentSet);
      if (equipmentEarthDamageResistanceGain > 0)
        breakdown += "Equipment: +" + this.utilityService.roundTo(equipmentEarthDamageResistanceGain * 100, 2) + "%<br />";


      var charmGain = this.charmService.getTotalEarthDamageResistanceAdditionFromCharms(this.globalService.globalVar.resources);
      if (charmGain > 0) {
        breakdown += "Charm Total: " + this.utilityService.roundTo(charmGain * 100, 2) + "%<br />";
      }
    }

    return breakdown;
  }

  isSubzoneATown(subzoneEnum: SubZoneEnum) {
    if (subzoneEnum === SubZoneEnum.DodonaDelphi || subzoneEnum === SubZoneEnum.DodonaArta || subzoneEnum === SubZoneEnum.AsphodelPalaceOfHades ||
      subzoneEnum === SubZoneEnum.AsphodelLostHaven || subzoneEnum === SubZoneEnum.ElysiumColiseum || subzoneEnum === SubZoneEnum.PeloposNisosTravelPost
      || subzoneEnum === SubZoneEnum.CalydonTownMarket || subzoneEnum === SubZoneEnum.CalydonAltarOfAsclepius || subzoneEnum === SubZoneEnum.AegeanSeaIolcus ||
      subzoneEnum === SubZoneEnum.AegeanSeaSalmydessus || subzoneEnum === SubZoneEnum.BlackSeaMariandyna || subzoneEnum === SubZoneEnum.ColchisCityCenter)
      return true;

    return false;
  }

  isSubzoneInZone(subzoneEnum: SubZoneEnum, zoneEnum: ZoneEnum) {
    var inZone = false;

    this.globalService.globalVar.ballads.forEach(ballad => {
      ballad.zones.forEach(zone => {
        if (zone.type.toString() === zoneEnum.toString()) {
          zone.subzones.forEach(subzone => {
            if (subzone.type === subzoneEnum)
              inZone = true;
          });
        }
      });
    });

    return inZone;
  }

  getRandomGodEnum(noRepeatingAltars: boolean = false) {
    var availableEnums: GodEnum[] = [];

    this.globalService.globalVar.gods.forEach(god => {
      if (god.isAvailable && (!noRepeatingAltars || (noRepeatingAltars &&
        (this.globalService.globalVar.altars.altar1 === undefined || this.globalService.globalVar.altars.altar1.god !== god.type) &&
        (this.globalService.globalVar.altars.altar2 === undefined || this.globalService.globalVar.altars.altar2.god !== god.type) &&
        (this.globalService.globalVar.altars.altar3 === undefined || this.globalService.globalVar.altars.altar3.god !== god.type))))
        availableEnums.push(god.type);
    });

    var rng = this.utilityService.getRandomInteger(0, availableEnums.length - 1);

    return availableEnums[rng];
  }

  //seeded by time
  getPreferredGod() {
    var availableEnums: GodEnum[] = [];

    var date = new Date();
    var dayBreakpoint = 1; //between 4:00 AM and 11:59 AM

    if (date.getHours() >= this.utilityService.preferredGodStartTime2 && date.getHours() < this.utilityService.preferredGodEndTime2) //between 12 PM and 7:59 PM
      dayBreakpoint = 2;
    else if (date.getHours() >= this.utilityService.preferredGodStartTime3 || date.getHours() < this.utilityService.preferredGodEndTime3) //between 8 PM and 3:59 AM
      dayBreakpoint = 3;

    var seedValue = date.getDay() + date.getMonth() + date.getFullYear() + dayBreakpoint;

    var previousSeedValue = 0;

    if (dayBreakpoint === 3)
      previousSeedValue = date.getDay() + date.getMonth() + date.getFullYear() + 2;
    else if (dayBreakpoint === 2)
      previousSeedValue = date.getDay() + date.getMonth() + date.getFullYear() + 1;
    else if (dayBreakpoint === 1) {
      var yesterday = new Date(date);
      yesterday.setDate(yesterday.getDate() - 1);

      previousSeedValue = yesterday.getDay() + yesterday.getMonth() + yesterday.getFullYear() + 3;
    }

    this.globalService.globalVar.gods.filter(item => item.isAvailable).forEach(god => {
      availableEnums.push(god.type);
    });

    var rng = this.utilityService.getRandomSeededInteger(0, availableEnums.length - 1, previousSeedValue.toString());

    var previousGod = availableEnums[rng];

    availableEnums = [];
    this.globalService.globalVar.gods.filter(item => item.isAvailable).forEach(god => {
      if (god.type !== previousGod)
        availableEnums.push(god.type);
    });
    rng = this.utilityService.getRandomSeededInteger(0, availableEnums.length - 1, seedValue.toString());

    return availableEnums[rng];
  }

  getAffinityRewardForLevel(level: number) {
    var reward: AffinityLevelRewardEnum = AffinityLevelRewardEnum.None;

    if (level % 8 === 0)
      reward = AffinityLevelRewardEnum.LargeCharm;
    else if (level % 4 === 0)
      reward = AffinityLevelRewardEnum.SmallCharm;
    else if (level % 4 === 1)
      reward = AffinityLevelRewardEnum.PrayerDuration;
    else if (level % 4 === 2)
      reward = AffinityLevelRewardEnum.PrayerEffectiveness;
    else if (level % 4 === 3)
      reward = AffinityLevelRewardEnum.GodXp;

    return reward;
  }

  getBoonName(effect: AltarEffectsEnum) {
    var name = "";
    if (effect === AltarEffectsEnum.AthenaDefenseUp)
      name = "Defense Up";
    if (effect === AltarEffectsEnum.AthenaHeal)
      name = "Heal Party After";
    if (effect === AltarEffectsEnum.AthenaHealOverTime)
      name = "Heal Party Over Time";
    if (effect === AltarEffectsEnum.AthenaRareHealOverTime)
      name = "Large Heal Party Over Time";
    if (effect === AltarEffectsEnum.AthenaRareHolyDamageIncrease)
      name = "Holy Damage Dealt Up";
    if (effect === AltarEffectsEnum.AthenaRareBlind)
      name = "Blind Debuff After";

    if (effect === AltarEffectsEnum.ArtemisCriticalDamageUp)
      name = "Critical Damage Up";
    if (effect === AltarEffectsEnum.ArtemisLuckUp)
      name = "Luck Up";
    if (effect === AltarEffectsEnum.ArtemisDefenseDebuff)
      name = "Defense Debuff After";
    if (effect === AltarEffectsEnum.ArtemisRareAttackDebuff)
      name = "Attack Debuff After";
    if (effect === AltarEffectsEnum.ArtemisRareCriticalDamageUp)
      name = "Large Critical Damage Up";
    if (effect === AltarEffectsEnum.ArtemisRareDebuffDurationUp)
      name = "Debuff Duration Up";

    if (effect === AltarEffectsEnum.HermesAbilityCooldown)
      name = "Ability Cooldown Reduction After";
    if (effect === AltarEffectsEnum.HermesAgilityUp)
      name = "Agility Up";
    if (effect === AltarEffectsEnum.HermesAutoAttackUp)
      name = "Auto Attack Damage Up";
    if (effect === AltarEffectsEnum.HermesRareReduceAutoAttackCooldown)
      name = "Auto Attack Cooldown Reduction";
    if (effect === AltarEffectsEnum.HermesRareAutoAttackUp)
      name = "Large Auto Attack Damage Up";
    if (effect === AltarEffectsEnum.HermesRareReduceAbilityCooldownOverTime)
      name = "Ability Cooldown Reduction Over Time";

    if (effect === AltarEffectsEnum.ApolloHeal)
      name = "Heal After";
    if (effect === AltarEffectsEnum.ApolloResistanceUp)
      name = "Resistance Up";
    if (effect === AltarEffectsEnum.ApolloBuffDurationUp)
      name = "Buff Duration Up";
    if (effect === AltarEffectsEnum.ApolloRareBuffDurationUp)
      name = "Large Buff Duration Up";
    if (effect === AltarEffectsEnum.ApolloRareHpRegenIncrease)
      name = "HP Regen Up";
    if (effect === AltarEffectsEnum.ApolloRareOstinato)
      name = "Ostinato After";

    if (effect === AltarEffectsEnum.AresDamageOverTime)
      name = "Damage Over Time After";
    if (effect === AltarEffectsEnum.AresMaxHpUp)
      name = "Max HP Up";
    if (effect === AltarEffectsEnum.AresOverdriveGain)
      name = "Increase Overdrive Gauge After";
    if (effect === AltarEffectsEnum.AresRareOverdriveGain)
      name = "Large Increase Overdrive Gauge After";
    if (effect === AltarEffectsEnum.AresRareIncreaseDamageOverTimeDamage)
      name = "Increase Damage Over Time Effectiveness";
    if (effect === AltarEffectsEnum.AresRareDealHpDamage)
      name = "Deal HP Damage After";

    if (effect === AltarEffectsEnum.HadesEarthDamageUp)
      name = "Earth Damage Dealt Up";
    if (effect === AltarEffectsEnum.HadesFireDamageUp)
      name = "Fire Damage Dealt Up";
    if (effect === AltarEffectsEnum.HadesAoeDamageUp)
      name = "Multiple Target Damage Dealt Up";
    if (effect === AltarEffectsEnum.HadesRareAoeDamageUp)
      name = "Large Multiple Target Damage Dealt Up";
    if (effect === AltarEffectsEnum.HadesRareElementalDamageUp)
      name = "Elemental Damage Dealt Up";
    if (effect === AltarEffectsEnum.HadesRareDealElementalDamage)
      name = "Deal Random Elemental Damage Over Time";

    if (effect === AltarEffectsEnum.DionysusRandomBuff)
      name = "Random Buff After";
    if (effect === AltarEffectsEnum.DionysusRandomDebuff)
      name = "Random Debuff After";
    if (effect === AltarEffectsEnum.DionysusSingleBarrier)
      name = "Single Barrier After";
    if (effect === AltarEffectsEnum.DionysusRareMultiBarrier)
      name = "All Barrier After";
    if (effect === AltarEffectsEnum.DionysusRareFastDebuffs)
      name = "Debuff Duration Reduction";
    if (effect === AltarEffectsEnum.DionysusRareFullDebuffs)
      name = "All Stat Debuffs After";

    if (effect === AltarEffectsEnum.NemesisLuckDebuff)
      name = "Luck Debuff After";
    if (effect === AltarEffectsEnum.NemesisDealDamage)
      name = "Deal Damage Over Time";
    if (effect === AltarEffectsEnum.NemesisThorns)
      name = "Thorns Damage";
    if (effect === AltarEffectsEnum.NemesisRareThorns)
      name = "Large Thorns Damage";
    if (effect === AltarEffectsEnum.NemesisRareArmorPenetrationUp)
      name = "Armor Penetration Up";
    if (effect === AltarEffectsEnum.NemesisRareDuesUp)
      name = "Dues Up After";

    return name;
  }


  getQualityTypeName(quality: EquipmentQualityEnum, includeClass: boolean = false) {
    var name = "";

    if (quality === EquipmentQualityEnum.Basic)
      name = "Basic";
    if (quality === EquipmentQualityEnum.Uncommon)
      name = "Uncommon";
    if (quality === EquipmentQualityEnum.Rare)
      name = "Rare";
    if (quality === EquipmentQualityEnum.Epic)
      name = "Epic";
    if (quality === EquipmentQualityEnum.Special)
      name = "Special";
    if (quality === EquipmentQualityEnum.Extraordinary)
      name = "Extraordinary";
    if (quality === EquipmentQualityEnum.Unique)
      name = "Unique";

    if (includeClass) {
      name = "<span class='" + name.toLowerCase() + "Equipment'>" + name + "</span>";
    }

    return name;
  }


  getQualityStars(quality: EquipmentQualityEnum) {
    if (quality === EquipmentQualityEnum.Basic)
      return "★";
    if (quality === EquipmentQualityEnum.Uncommon)
      return "★★";
    if (quality === EquipmentQualityEnum.Rare)
      return "★★★";
    if (quality === EquipmentQualityEnum.Epic)
      return "★★★★";
    if (quality === EquipmentQualityEnum.Special)
      return "★★★★★";
    if (quality === EquipmentQualityEnum.Extraordinary)
      return "★★★★★★";
    if (quality === EquipmentQualityEnum.Unique)
      return "★★★★★★★";

    return "";
  }

  getAbilityGameLogMessage() {

  }

  getProfessionName(profession: ProfessionEnum) {
    if (profession === ProfessionEnum.Alchemy)
      return "Alchemy";
    if (profession === ProfessionEnum.Jewelcrafting)
      return "Jewelcrafting";

    return "";
  }

  subzoneHasObscurredPath(type: SubZoneEnum) {
    if (type === SubZoneEnum.CalydonBabblingStream || type === SubZoneEnum.CalydonDeadEnd || type === SubZoneEnum.CalydonHeavyThicket ||
      type === SubZoneEnum.CalydonMarkedTreeTrail || type === SubZoneEnum.CalydonMudpit || type === SubZoneEnum.CalydonOvergrownVerdure ||
      type === SubZoneEnum.CalydonShroudedFoliage || type === SubZoneEnum.CalydonSparseClearing || type === SubZoneEnum.CalydonTallGrass ||
      type === SubZoneEnum.CalydonWateringHole || type === SubZoneEnum.CalydonWelltroddenPathway || type === SubZoneEnum.CalydonWornDownBarn)
      return true;

    return false;
  }

  resourceHasSlotsAdded(resource: ResourceValue) {
    var slotsAdded = false;

    if (resource.extras !== undefined && resource.extras.length > 0) {
      resource.extras.forEach(extra => {
        if (this.isItemAddingASlot(extra))
          slotsAdded = true;
      });
    }

    return slotsAdded;
  }

  getEquipmentExtraNameAddition(resource?: ResourceValue) {
    var addition = "";
    if (resource === undefined)
      return addition;

    var totalSlotCount = this.getTotalNumberOfSlots(resource);
    if (totalSlotCount === 0)
      return addition;

    var openSlotCount = this.getNumberOfOpenSlots(resource);
    addition = " (" + (totalSlotCount - openSlotCount) + "/" + totalSlotCount + ")";

    return addition;
  }

  equipmentPieceHasSlots(equipment?: ResourceValue) {
    if (equipment === undefined)
      return false;

    var equipmentPiece = this.getEquipmentPieceByItemType(equipment.item);

    if (this.resourceHasSlotsAdded(equipment) || (equipmentPiece !== undefined && equipmentPiece.slotCount > 0))
      return true;

    return false;
  }

  getTotalNumberOfSlots(item?: ResourceValue) {
    var openSlots = 0;
    if (item === undefined)
      return openSlots;

    var equipment = this.getEquipmentPieceByItemType(item.item);

    if (item === undefined || equipment === undefined)
      return openSlots;

    var totalSlotCount = equipment.slotCount;

    if ((item.extras === undefined || item.extras.length === 0) && totalSlotCount >= 0)
      return totalSlotCount;
    else if (item.extras !== undefined && item.extras.length > 0 && totalSlotCount >= 0) {
      var filledSlotCount = 0;
      item.extras.forEach(filledSlot => {
        if (this.isItemAddingASlot(filledSlot))
          totalSlotCount += 1;
      });
    }

    return totalSlotCount;
  }

  getNumberOfOpenSlots(item?: ResourceValue) {
    var openSlots = 0;
    if (item === undefined)
      return openSlots;

    var equipment = this.getEquipmentPieceByItemType(item.item);

    if (item === undefined || equipment === undefined)
      return openSlots;

    var totalSlotCount = equipment.slotCount;

    if ((item.extras === undefined || item.extras.length === 0) && totalSlotCount >= 0)
      return totalSlotCount;
    else if (item.extras !== undefined && item.extras.length > 0 && totalSlotCount >= 0) {
      var filledSlotCount = 0;
      item.extras.forEach(filledSlot => {
        //Will need to check what each slot is eventually when you can add slots
        if (this.isItemAddingASlot(filledSlot))
          totalSlotCount += 1;
        else
          filledSlotCount += 1; //if it's not adding a slot, it's using one
      });

      if (totalSlotCount > filledSlotCount) {
        openSlots = totalSlotCount - filledSlotCount;
      }
    }

    return openSlots;
  }

  isItemAddingASlot(item: ItemsEnum) {
    var isAddingASlot = false;

    if (item === ItemsEnum.MinorWeaponSlotAddition || item === ItemsEnum.MinorRingSlotAddition || item === ItemsEnum.MinorArmorSlotAddition ||
      item === ItemsEnum.MinorNecklaceSlotAddition || item === ItemsEnum.MinorShieldSlotAddition)
      isAddingASlot = true;

    return isAddingASlot;
  }

  getMaxSlotsPerItem(item?: ResourceValue, equipment?: Equipment) {
    if (item !== undefined) {
      equipment = this.getEquipmentPieceByItemType(item.item);
    }

    if (equipment === undefined)
      return 0;

    if (equipment.quality === EquipmentQualityEnum.Basic)
      return 1;
    if (equipment.quality === EquipmentQualityEnum.Uncommon)
      return 2;
    if (equipment.quality === EquipmentQualityEnum.Rare)
      return 3;
    if (equipment.quality === EquipmentQualityEnum.Epic)
      return 4;
    if (equipment.quality === EquipmentQualityEnum.Special)
      return 5;
    if (equipment.quality === EquipmentQualityEnum.Extraordinary)
      return 6;
    if (equipment.quality === EquipmentQualityEnum.Unique)
      return 7;

    return 0;
  }

  makeResourceCopy(existingResource: ResourceValue) {
    var copy = new ResourceValue(existingResource.item, existingResource.amount);
    if (existingResource.extras !== undefined && existingResource.extras.length > 0) {
      copy.extras = [];
      existingResource.extras.forEach(extra => {
        copy.extras.push(extra);
      });
    }
    return copy;
  }

  getRandomPartyMember(party: Character[]) {
    var partyLength = party.filter(item => !item.battleInfo.statusEffects.some(effect => effect.type === StatusEffectEnum.Dead)).length;
    var rng = this.utilityService.getRandomInteger(0, partyLength - 1);
    return party.filter(item => !item.battleInfo.statusEffects.some(effect => effect.type === StatusEffectEnum.Dead))[rng];
  }

  getGodAffinityBoonDurationIncreaseCount(god: God) {
    var durationIncreaseCount = Math.floor(god.affinityLevel / 4);
    if (god.affinityLevel % 4 >= 1)
      durationIncreaseCount += 1;

    return durationIncreaseCount;
  }

  getGodAffinityBoonEffectivenessIncreaseCount(god: God) {
    var effectivenessIncreaseCount = Math.floor(god.affinityLevel / 4);
    if (god.affinityLevel % 4 >= 2)
      effectivenessIncreaseCount += 1;

    return effectivenessIncreaseCount;
  }

  getGodAffinityXpIncreaseCount(god: God) {
    var affinityIncreaseCount = Math.floor(god.affinityLevel / 4);
    if (god.affinityLevel % 4 >= 3)
      affinityIncreaseCount += 1;

    return affinityIncreaseCount;
  }

  getGodAffinitySmallCharmCount(god: God) {
    var affinityIncreaseCount = Math.floor(god.affinityLevel / 8);
    if (god.affinityLevel % 8 >= 4)
      affinityIncreaseCount += 1;

    return affinityIncreaseCount;
  }

  getGodAffinityLargeCharmCount(god: God) {
    var affinityIncreaseCount = Math.floor(god.affinityLevel / 8);

    return affinityIncreaseCount;
  }

  getShopOptionText(type: ShopTypeEnum) {
    var text = "";

    if (type === ShopTypeEnum.General) {
      text = "General";
    }
    if (type === ShopTypeEnum.Crafter) {
      text = "Crafter";
    }
    if (type === ShopTypeEnum.Alchemist) {
      text = "Alchemist";
    }
    if (type === ShopTypeEnum.ChthonicFavor) {
      text = "Chthonic Favor";
    }
    if (type === ShopTypeEnum.Coliseum) {
      text = "Coliseum";
    }
    if (type === ShopTypeEnum.Traveler) {
      text = "Traveler";
    }
    if (type === ShopTypeEnum.Jewelcrafter) {
      text = "Jewelcrafter";
    }

    return text;
  }

  getBalladDescription(type: BalladEnum) {
    var description = "";

    if (type === BalladEnum.Champion)
      description = "Where your journey to become a hero begins. After many attempts, Thales finally pushes past his limits and has a meeting with divinity.";
    else if (type === BalladEnum.Gorgon)
      description = "Following in the footsteps of the hero Perseus, you travel Greece to do battle with the monster Medusa. Along the way, you gain an ally with a similar goal.";
    else if (type === BalladEnum.Underworld)
      description = "Your overconfidence led to some missteps and you now find yourself in the Underworld. Many heroes have had their dealings in Hades' realm and you are no exception. Your journey continues to Elysium and, if you can obtain Hades's blessing, back to the surface.";
    else if (type === BalladEnum.Boar)
      description = "At Zosime's request, you take a detour to Calydon to follow through Atalanta's story. You visit her birthplace and then traverse the forest where she finally put a stop to the monstrous boar rampaging the countryside.";
    else if (type === BalladEnum.Argo)
      description = "Thales and Zosime begin to pick up their rhythm again and now take to the seas to follow in the footsteps of Jason and the Argonauts. As they travel east to Colchis, they soon realize that all is not quite like the stories.";
    else if (type === BalladEnum.Labors)
      description = "You finally feel ready to take on the trials of Heracles, the greatest of all mortals. Each step is a difficult one, but you gain strength along the way.";

    return description;
  }
}
