import { Injectable } from '@angular/core';
import { AltarEffect } from 'src/app/models/altar/altar-effect.model';
import { AltarInfo } from 'src/app/models/altar/altar-info.model';
import { God } from 'src/app/models/character/god.model';
import { AffinityLevelRewardEnum } from 'src/app/models/enums/affinity-level-reward-enum.model';
import { AltarConditionEnum } from 'src/app/models/enums/altar-condition-enum.model';
import { AltarEffectsEnum } from 'src/app/models/enums/altar-effects-enum.model';
import { AltarEnum } from 'src/app/models/enums/altar-enum.model';
import { AltarPrayOptionsEnum } from 'src/app/models/enums/altar-pray-options-enum.model';
import { BalladEnum } from 'src/app/models/enums/ballad-enum.model';
import { GodEnum } from 'src/app/models/enums/god-enum.model';
import { ItemTypeEnum } from 'src/app/models/enums/item-type-enum.model';
import { ItemsEnum } from 'src/app/models/enums/items-enum.model';
import { ResourceValue } from 'src/app/models/resources/resource-value.model';
import { GlobalService } from '../global/global.service';
import { LookupService } from '../lookup.service';
import { UtilityService } from '../utility/utility.service';

@Injectable({
  providedIn: 'root'
})
export class AltarService {

  constructor(private globalService: GlobalService, private lookupService: LookupService, private utilityService: UtilityService) { }

  getTutorialAltar() {
    var altar = new AltarInfo();
    altar.type = AltarEnum.Small;
    altar.god = GodEnum.Athena;
    altar.condition = AltarConditionEnum.Victories;
    altar.conditionCount = altar.conditionMax = 1;

    return altar;
  }

  getNewSmallAltar() {
    var altar = new AltarInfo();

    altar.type = AltarEnum.Small;
    altar.god = this.lookupService.getRandomGodEnum();
    altar.condition = this.getRandomSmallAltarCondition();
    altar.conditionMax = this.getAltarMaxConditions(altar);

    return altar;
  }

  getAltarMaxConditions(altar: AltarInfo) {
    var maxCount = 0;
    var tutorialAmount = false;
    if (!this.globalService.globalVar.ballads.find(item => item.type === BalladEnum.Underworld)?.isAvailable)
      tutorialAmount = true;

    if (altar.condition === AltarConditionEnum.OverdriveUse) {
      if (altar.type === AltarEnum.Small)
        maxCount = tutorialAmount ? 2 : 4;
    }
    if (altar.condition === AltarConditionEnum.Victories) {
      if (altar.type === AltarEnum.Small)
        maxCount = tutorialAmount ? 10 : 25;
    }
    if (altar.condition === AltarConditionEnum.AutoAttackUse) {
      if (altar.type === AltarEnum.Small)
        maxCount = tutorialAmount ? 50 : 75;
    }
    if (altar.condition === AltarConditionEnum.AbilityUse) {
      if (altar.type === AltarEnum.Small)
        maxCount = tutorialAmount ? 50 : 100;
    }

    return maxCount;
  }

  incrementAltarCount(condition: AltarConditionEnum) {
    this.globalService.globalVar.altarInfo.forEach(altar => {
      if (altar.condition === condition && altar.conditionCount < altar.conditionMax)
        altar.conditionCount += 1;
    });
  }

  getButtonOptions(altar: AltarInfo) {
    var options: AltarPrayOptionsEnum[] = [];

    if (altar.type === AltarEnum.Small) {
      options.push(AltarPrayOptionsEnum.Strength);
      options.push(AltarPrayOptionsEnum.Fortune);
    }

    return options;
  }

  getButtonText(option: AltarPrayOptionsEnum, altar: AltarInfo) {
    var text = "";

    if (option === AltarPrayOptionsEnum.Strength)
      text = "Pray for Strength";
    if (option === AltarPrayOptionsEnum.Fortune)
      text = "Pray for Fortune";

    return text;
  }

  pray(option: AltarPrayOptionsEnum, altar: AltarInfo) {
    this.globalService.globalVar.altarInfo = this.globalService.globalVar.altarInfo.filter(item => item != altar);

    if (altar.type === AltarEnum.Small) {
      this.setAltarEffect(option, altar);

      var god = this.globalService.globalVar.gods.find(item => item.type === altar.god);
      if (god !== undefined) {
        god.affinityExp += this.utilityService.smallAltarAffinityGain;
        if (god.affinityExp >= god.affinityExpToNextLevel) {
          god.affinityExp -= god.affinityExpToNextLevel;
          god.affinityLevel += 1;
          god.affinityExpToNextLevel *= this.utilityService.getFibonacciValue(god.affinityLevel + 2);

          if (this.lookupService.getAffinityRewardForLevel(god.affinityLevel) === AffinityLevelRewardEnum.SmallCharm)
          {
            this.lookupService.gainResource(new ResourceValue(this.getSmallCharmOfGod(god.type), ItemTypeEnum.Charm, 1));
          }
          else if (this.lookupService.getAffinityRewardForLevel(god.affinityLevel) === AffinityLevelRewardEnum.LargeCharm)
          {
            this.lookupService.gainResource(new ResourceValue(this.getLargeCharmOfGod(god.type), ItemTypeEnum.Charm, 1));
          }
        }
      }

      if (this.globalService.globalVar.altarInfo.length === 0)
        this.globalService.globalVar.altarInfo.push(this.getNewSmallAltar());
    }
  }

  setAltarEffect(option: AltarPrayOptionsEnum, altar: AltarInfo) {
    //if strength, give stat buff
    var altarEffect = new AltarEffect();

    if (altar.type === AltarEnum.Small && option === AltarPrayOptionsEnum.Strength) {
      altarEffect.type = AltarEffectsEnum.SmallAltarPrayStrength;
      altarEffect.duration = 2 * 60;
      altarEffect.effectiveness = 1.05;
      altarEffect.stacks = false;
    }
    if (altar.type === AltarEnum.Small && option === AltarPrayOptionsEnum.Fortune) {
      altarEffect.type = AltarEffectsEnum.SmallAltarPrayFortune;
      altarEffect.duration = 2 * 60;
      altarEffect.effectiveness = 1.1;
      altarEffect.stacks = false;
    }

    var god = this.globalService.globalVar.gods.find(item => item.type === altar.god);

    if (god !== undefined) {
      //repeats every 4 levels, duration increase is at level X1
      var durationIncreaseCount = Math.floor(god.affinityLevel / 4);
      if (god.affinityLevel % 4 >= 1)
        durationIncreaseCount += 1;

      altarEffect.duration *= 1 + (durationIncreaseCount * this.utilityService.affinityRewardPrayerDuration);

      //repeats every 4 levels, effectiveness increase is at level X2
      var effectivenessIncreaseCount = Math.floor(god.affinityLevel / 4);
      if (god.affinityLevel % 4 >= 2)
        effectivenessIncreaseCount += 1;

      altarEffect.duration *= 1 + (effectivenessIncreaseCount * this.utilityService.affinityRewardPrayerEffectiveness);
    }

    this.globalService.globalVar.activeAltarEffects.push(altarEffect);
  }

  getSmallCharmOfGod(type: GodEnum) {
    var item: ItemsEnum = ItemsEnum.None;

    if (type === GodEnum.Athena)
      item = ItemsEnum.SmallCharmOfAthena;
      if (type === GodEnum.Artemis)
      item = ItemsEnum.SmallCharmOfArtemis;
      if (type === GodEnum.Hermes)
      item = ItemsEnum.SmallCharmOfHermes;
      if (type === GodEnum.Apollo)
      item = ItemsEnum.SmallCharmOfApollo;
      if (type === GodEnum.Ares)
      item = ItemsEnum.SmallCharmOfAres;
      if (type === GodEnum.Zeus)
      item = ItemsEnum.SmallCharmOfZeus;
      if (type === GodEnum.Poseidon)
      item = ItemsEnum.SmallCharmOfPoseidon;

    return item;
  }

  getLargeCharmOfGod(type: GodEnum) {
    var item: ItemsEnum = ItemsEnum.None;

    if (type === GodEnum.Athena)
      item = ItemsEnum.LargeCharmOfAthena;
      if (type === GodEnum.Artemis)
      item = ItemsEnum.LargeCharmOfArtemis;
      if (type === GodEnum.Hermes)
      item = ItemsEnum.LargeCharmOfHermes;
      if (type === GodEnum.Apollo)
      item = ItemsEnum.LargeCharmOfApollo;
      if (type === GodEnum.Ares)
      item = ItemsEnum.LargeCharmOfAres;
      if (type === GodEnum.Zeus)
      item = ItemsEnum.LargeCharmOfZeus;
      if (type === GodEnum.Poseidon)
      item = ItemsEnum.LargeCharmOfPoseidon;

    return item;
  }

  getRandomSmallAltarCondition() {
    var availableEnums: AltarConditionEnum[] = [];

    for (const [propertyKey, propertyValue] of Object.entries(AltarConditionEnum)) {
      if (!Number.isNaN(Number(propertyKey))) {
        continue;
      }

      var enumValue = propertyValue as AltarConditionEnum;
      //break down what can be chosen for small, large, etc
      if (enumValue !== AltarConditionEnum.None && enumValue !== AltarConditionEnum.CoinSpent)
      {
        if (enumValue !== AltarConditionEnum.OverdriveUse ||
          (enumValue === AltarConditionEnum.OverdriveUse && this.globalService.globalVar.characters.some(item => item.level >= this.utilityService.characterOverdriveLevel)))
          availableEnums.push(enumValue);
      }
    }

    var rng = this.utilityService.getRandomInteger(0, availableEnums.length - 1);

    return availableEnums[rng];
  }
}
