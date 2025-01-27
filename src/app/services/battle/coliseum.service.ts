import { Injectable } from '@angular/core';
import { ColiseumDefeatCount } from 'src/app/models/battle/coliseum-defeat-count.model';
import { ColiseumTournament } from 'src/app/models/battle/coliseum-tournament.model';
import { EnemyTeam } from 'src/app/models/character/enemy-team.model';
import { BestiaryEnum } from 'src/app/models/enums/bestiary-enum.model';
import { ColiseumTournamentEnum } from 'src/app/models/enums/coliseum-tournament-enum.model';
import { GameLogEntryEnum } from 'src/app/models/enums/game-log-entry-enum.model';
import { ItemTypeEnum } from 'src/app/models/enums/item-type-enum.model';
import { ItemsEnum } from 'src/app/models/enums/items-enum.model';
import { ProfessionEnum } from 'src/app/models/enums/professions-enum.model';
import { SubZoneEnum } from 'src/app/models/enums/sub-zone-enum.model';
import { ResourceValue } from 'src/app/models/resources/resource-value.model';
import { AchievementService } from '../achievements/achievement.service';
import { EnemyGeneratorService } from '../enemy-generator/enemy-generator.service';
import { GlobalService } from '../global/global.service';
import { LookupService } from '../lookup.service';
import { ProfessionService } from '../professions/profession.service';
import { UtilityService } from '../utility/utility.service';
import { GameLogService } from './game-log.service';
import { GodEnum } from 'src/app/models/enums/god-enum.model';
import { Enemy } from 'src/app/models/character/enemy.model';
import { SubZoneGeneratorService } from '../sub-zone-generator/sub-zone-generator.service';
import { BalladEnum } from 'src/app/models/enums/ballad-enum.model';
import { PrimaryStats } from 'src/app/models/character/primary-stats.model';
import { Ballad } from 'src/app/models/zone/ballad.model';
import { SubZone } from 'src/app/models/zone/sub-zone.model';
import { DictionaryService } from '../utility/dictionary.service';

@Injectable({
  providedIn: 'root'
})
export class ColiseumService {

  weeklyMeleeReleased = true;

  constructor(private enemyGeneratorService: EnemyGeneratorService, private globalService: GlobalService, private utilityService: UtilityService,
    private lookupService: LookupService, private gameLogService: GameLogService, private achievementService: AchievementService,
    private professionService: ProfessionService, private subZoneGeneratorService: SubZoneGeneratorService, private dictionaryService: DictionaryService) { }

  getColiseumInfoFromType(type: ColiseumTournamentEnum) {
    var tournament = new ColiseumTournament();
    tournament.type = type;
    tournament.currentRound = 1;
    tournament.tournamentTimer = 0;

    if (type === ColiseumTournamentEnum.TournamentOfTheDead) {
      tournament.maxRounds = 5;
      tournament.tournamentTimerLength = 300;
      tournament.quickVictoryThreshold = 120;
      tournament.completionReward.push(new ResourceValue(ItemsEnum.UnderworldAccess, 1));
      tournament.quickCompletionReward.push(new ResourceValue(ItemsEnum.LargeCharmOfIngenuity, 1));
    }
    if (type === ColiseumTournamentEnum.FlamesOfTartarus) {
      tournament.maxRounds = 5;
      tournament.tournamentTimerLength = 300;
      tournament.quickVictoryThreshold = 120;
      tournament.completionReward.push(new ResourceValue(ItemsEnum.Coin, 2500));
      tournament.completionReward.push(new ResourceValue(ItemsEnum.BonusXp, 10000));
      tournament.quickCompletionReward.push(new ResourceValue(ItemsEnum.LargeCharmOfFireDestruction, 1));
    }
    if (type === ColiseumTournamentEnum.ForgottenKings) {
      tournament.maxRounds = 5;
      tournament.tournamentTimerLength = 300;
      tournament.quickVictoryThreshold = 120;
      tournament.completionReward.push(new ResourceValue(ItemsEnum.HeroicElixirRecipe, 1));
      tournament.completionReward.push(new ResourceValue(ItemsEnum.BonusXp, 25000));
      tournament.quickCompletionReward.push(new ResourceValue(ItemsEnum.LargeCharmOfRejuvenation, 1));
    }
    if (type === ColiseumTournamentEnum.RiverLords) {
      tournament.maxRounds = 5;
      tournament.tournamentTimerLength = 300;
      tournament.quickVictoryThreshold = 120;
      tournament.completionReward.push(new ResourceValue(ItemsEnum.Coin, 8000));
      tournament.completionReward.push(new ResourceValue(ItemsEnum.BonusXp, 65000));
      tournament.quickCompletionReward.push(new ResourceValue(ItemsEnum.LargeCharmOfWaterProtection, 1));
    }
    if (type === ColiseumTournamentEnum.HadesTrial) {
      tournament.maxRounds = 5;
      tournament.tournamentTimerLength = 300;
      tournament.quickVictoryThreshold = 120;
      tournament.completionReward.push(new ResourceValue(ItemsEnum.BonusXp, 90000));
      tournament.completionReward.push(new ResourceValue(ItemsEnum.Hades, 1));
      tournament.quickCompletionReward.push(new ResourceValue(ItemsEnum.LargeCharmOfEarthDestruction, 1));
    }
    if (type === ColiseumTournamentEnum.WeeklyMelee) {
      tournament.maxRounds = -1;
      tournament.tournamentTimerLength = 300;
    }

    return tournament;
  }

  getTournamentName(type: ColiseumTournamentEnum) {
    if (type === ColiseumTournamentEnum.TournamentOfTheDead)
      return "Tournament of the Dead";
    if (type === ColiseumTournamentEnum.FlamesOfTartarus)
      return "Flames of Tartarus";
    if (type === ColiseumTournamentEnum.ForgottenKings)
      return "Forgotten Kings and Queens";
    if (type === ColiseumTournamentEnum.RiverLords)
      return "River Lords";
    else if (type === ColiseumTournamentEnum.HadesTrial)
      return "Hades' Trial";
    else if (type === ColiseumTournamentEnum.WeeklyMelee)
      return "Eternal Melee";
    return "";
  }

  getTournamentDescription(type: ColiseumTournamentEnum) {
    var info = this.getColiseumInfoFromType(type);

    if (type === ColiseumTournamentEnum.WeeklyMelee)
      return "Complete as many rounds as you can in " + info.tournamentTimerLength + " seconds. Each round is progressively more difficult. Gain one entry per day.";

    return "Complete " + info.maxRounds + " rounds in " + info.tournamentTimerLength + " seconds.";
  }

  getRequiredDps(type: ColiseumTournamentEnum) {
    var info = this.getColiseumInfoFromType(type);
    var totalHp = 0;

    for (var i = 1; i <= info.maxRounds; i++) {
      var enemies = this.generateBattleOptions(type, i);
      var enemyTeam = enemies[0].enemyList;
      enemyTeam.forEach(enemy => {
        totalHp += enemy.battleStats.maxHp + enemy.battleInfo.barrierValue;
      });
    }

    return totalHp / info.tournamentTimerLength;
  }

  handleColiseumVictory(type: ColiseumTournamentEnum) {
    this.globalService.resetCooldowns();

    var tournamentType = this.globalService.globalVar.coliseumDefeatCount.find(item => item.type === type);
    if (tournamentType !== undefined) {
      tournamentType.count += 1;

      var tournamentInfo = this.getColiseumInfoFromType(type);

      if (tournamentType.count === 1) {
        this.unlockNextColiseumTournament(type);

        tournamentInfo.completionReward.forEach(reward => {
          if (reward.item === ItemsEnum.UnderworldAccess) {
            var gates = this.findSubzone(SubZoneEnum.ElysiumGatesOfHornAndIvory);
            if (gates !== undefined) {
              gates.isAvailable = true;

              this.achievementService.createDefaultAchievementsForSubzone(gates.type).forEach(achievement => {
                this.globalService.globalVar.achievements.push(achievement);
              });
            }
          }
          else if (reward.item === ItemsEnum.HeroicElixirRecipe) {
            this.professionService.learnRecipe(ProfessionEnum.Alchemy, ItemsEnum.HeroicElixir);
          }
          else if (reward.item === ItemsEnum.BonusXp) {
            this.globalService.giveCharactersBonusExp(this.globalService.getActivePartyCharacters(true), reward.amount);
          }
          else if (reward.item === ItemsEnum.Hades) {
            var hades = this.globalService.globalVar.gods.find(item => item.type === GodEnum.Hades);
            if (hades !== undefined) {
              hades.isAvailable = true;
              hades.abilityList.forEach(ability => {
                if (hades!.level >= ability.requiredLevel)
                  ability.isAvailable = true;
              });
              this.gameLogService.updateGameLog(GameLogEntryEnum.BattleRewards, "Your strength has impressed Hades, God of the Underworld. Hades will now assist you on your journey.");
            }
          }
          else {
            this.lookupService.gainResource(reward);
            this.lookupService.addLootToLog(reward.item, reward.amount);
          }

          if (this.globalService.globalVar.gameLogSettings.get("battleRewards")) {
            this.gameLogService.updateGameLog(GameLogEntryEnum.BattleRewards, "You win <strong>" + reward.amount + " " + (reward.amount === 1 ? this.dictionaryService.getItemName(reward.item) : this.utilityService.handlePlural(this.dictionaryService.getItemName(reward.item))) + "</strong>.");
          }
        });
      }

      if (!tournamentType.quickVictoryCompleted && this.globalService.globalVar.activeBattle.activeTournament.tournamentTimer <= tournamentInfo.quickVictoryThreshold) {
        tournamentType.quickVictoryCompleted = true;

        tournamentInfo.quickCompletionReward.forEach(reward => {
          this.lookupService.gainResource(reward);
          this.lookupService.addLootToLog(reward.item, reward.amount);
          if (this.globalService.globalVar.gameLogSettings.get("battleRewards")) {
            this.gameLogService.updateGameLog(GameLogEntryEnum.BattleRewards, "You win <strong>" + reward.amount + " " + (reward.amount === 1 ? this.dictionaryService.getItemName(reward.item) : this.utilityService.handlePlural(this.dictionaryService.getItemName(reward.item))) + "</strong>.");
          }
        });
      }
    }
    //then reset
    this.globalService.globalVar.activeBattle.activeTournament = new ColiseumTournament();
  }

  unlockNextColiseumTournament(type: ColiseumTournamentEnum) {
    var tournamentType: ColiseumDefeatCount | undefined = undefined;

    if (type === ColiseumTournamentEnum.TournamentOfTheDead) {
      tournamentType = this.globalService.globalVar.coliseumDefeatCount.find(item => item.type === ColiseumTournamentEnum.FlamesOfTartarus);
    }

    if (type === ColiseumTournamentEnum.FlamesOfTartarus) {
      tournamentType = this.globalService.globalVar.coliseumDefeatCount.find(item => item.type === ColiseumTournamentEnum.ForgottenKings);
    }

    if (type === ColiseumTournamentEnum.ForgottenKings) {
      tournamentType = this.globalService.globalVar.coliseumDefeatCount.find(item => item.type === ColiseumTournamentEnum.RiverLords);
    }

    if (type === ColiseumTournamentEnum.RiverLords) {
      tournamentType = this.globalService.globalVar.coliseumDefeatCount.find(item => item.type === ColiseumTournamentEnum.HadesTrial);
    }

    if (tournamentType !== undefined) {
      tournamentType.isAvailable = true;
    }

    if (type === ColiseumTournamentEnum.TournamentOfTheDead) {
      var weeklyMelee = this.globalService.globalVar.coliseumDefeatCount.find(item => item.type === ColiseumTournamentEnum.WeeklyMelee);
      if (weeklyMelee !== undefined)
        weeklyMelee.isAvailable = true;
    }
  }

  generateBattleOptions(type: ColiseumTournamentEnum, round: number) {
    var battleOptions: EnemyTeam[] = [];

    if (type === ColiseumTournamentEnum.TournamentOfTheDead && round === 1) {
      var enemyTeam: EnemyTeam = new EnemyTeam();
      enemyTeam.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.FallenHero));
      enemyTeam.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.FallenHero));
      battleOptions.push(enemyTeam);
    }
    if (type === ColiseumTournamentEnum.TournamentOfTheDead && round === 2) {
      var enemyTeam: EnemyTeam = new EnemyTeam();
      enemyTeam.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.DualWieldingButcher));
      enemyTeam.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.Butcher));
      enemyTeam.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.Butcher));
      battleOptions.push(enemyTeam);
    }
    if (type === ColiseumTournamentEnum.TournamentOfTheDead && round === 3) {
      var enemyTeam: EnemyTeam = new EnemyTeam();
      enemyTeam.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.ExiledHoplite));
      enemyTeam.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.ExiledHoplite));
      battleOptions.push(enemyTeam);
    }
    if (type === ColiseumTournamentEnum.TournamentOfTheDead && round === 4) {
      var enemyTeam: EnemyTeam = new EnemyTeam();
      enemyTeam.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.FallenHero));
      enemyTeam.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.FallenHero));
      enemyTeam.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.FallenHero));
      enemyTeam.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.FallenHero));
      battleOptions.push(enemyTeam);
    }
    if (type === ColiseumTournamentEnum.TournamentOfTheDead && round === 5) {
      var enemyTeam: EnemyTeam = new EnemyTeam();
      enemyTeam.isDoubleBossFight = true;
      enemyTeam.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.Castor));
      enemyTeam.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.Pollux));
      battleOptions.push(enemyTeam);
    }

    if (type === ColiseumTournamentEnum.FlamesOfTartarus && round === 1) {
      var enemyTeam: EnemyTeam = new EnemyTeam();
      enemyTeam.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.WheelOfFire));
      enemyTeam.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.WheelOfFire));
      enemyTeam.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.WheelOfFire));
      enemyTeam.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.WheelOfFire));
      battleOptions.push(enemyTeam);
    }
    if (type === ColiseumTournamentEnum.FlamesOfTartarus && round === 2) {
      var enemyTeam: EnemyTeam = new EnemyTeam();
      enemyTeam.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.ExplodingSoul));
      enemyTeam.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.ExplodingSoul));
      enemyTeam.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.ExplodingSoul));
      battleOptions.push(enemyTeam);
    }
    if (type === ColiseumTournamentEnum.FlamesOfTartarus && round === 3) {
      var enemyTeam: EnemyTeam = new EnemyTeam();
      enemyTeam.isBossFight = true;
      enemyTeam.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.Tantalus));
      battleOptions.push(enemyTeam);
    }
    if (type === ColiseumTournamentEnum.FlamesOfTartarus && round === 4) {
      var enemyTeam: EnemyTeam = new EnemyTeam();
      enemyTeam.isBossFight = true;
      enemyTeam.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.Ixion));
      battleOptions.push(enemyTeam);
    }
    if (type === ColiseumTournamentEnum.FlamesOfTartarus && round === 5) {
      var enemyTeam: EnemyTeam = new EnemyTeam();
      enemyTeam.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.Sisyphus));
      enemyTeam.isBossFight = true;

      battleOptions.push(enemyTeam);
    }

    if (type === ColiseumTournamentEnum.ForgottenKings && round === 1) {
      var enemyTeam: EnemyTeam = new EnemyTeam();
      enemyTeam.isBossFight = true;
      enemyTeam.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.Lycaon));
      battleOptions.push(enemyTeam);
    }
    if (type === ColiseumTournamentEnum.ForgottenKings && round === 2) {
      var enemyTeam: EnemyTeam = new EnemyTeam();
      enemyTeam.isBossFight = true;
      enemyTeam.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.Melampus));
      battleOptions.push(enemyTeam);
    }
    if (type === ColiseumTournamentEnum.ForgottenKings && round === 3) {
      var enemyTeam: EnemyTeam = new EnemyTeam();
      enemyTeam.isBossFight = true;
      enemyTeam.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.Atreus));
      battleOptions.push(enemyTeam);
    }
    if (type === ColiseumTournamentEnum.ForgottenKings && round === 4) {
      var enemyTeam: EnemyTeam = new EnemyTeam();
      enemyTeam.isDoubleBossFight = true;
      enemyTeam.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.Helenus));
      enemyTeam.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.Cassandra));
      battleOptions.push(enemyTeam);
    }
    if (type === ColiseumTournamentEnum.ForgottenKings && round === 5) {
      var enemyTeam: EnemyTeam = new EnemyTeam();
      enemyTeam.isBossFight = true;
      enemyTeam.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.Minos));
      enemyTeam.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.Rhadamanthus));
      enemyTeam.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.Aeacus));
      battleOptions.push(enemyTeam);
    }
    if (type === ColiseumTournamentEnum.RiverLords && round === 1) {
      var enemyTeam: EnemyTeam = new EnemyTeam();
      enemyTeam.isBossFight = true;
      enemyTeam.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.Acheron2));
      battleOptions.push(enemyTeam);
    }
    if (type === ColiseumTournamentEnum.RiverLords && round === 2) {
      var enemyTeam: EnemyTeam = new EnemyTeam();
      enemyTeam.isBossFight = true;
      enemyTeam.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.Cocytus));
      battleOptions.push(enemyTeam);
    }
    if (type === ColiseumTournamentEnum.RiverLords && round === 3) {
      var enemyTeam: EnemyTeam = new EnemyTeam();
      enemyTeam.isBossFight = true;
      enemyTeam.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.Lethe));
      battleOptions.push(enemyTeam);
    }
    if (type === ColiseumTournamentEnum.RiverLords && round === 4) {
      var enemyTeam: EnemyTeam = new EnemyTeam();
      enemyTeam.isBossFight = true;
      enemyTeam.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.Phlegethon));
      battleOptions.push(enemyTeam);
    }
    if (type === ColiseumTournamentEnum.RiverLords && round === 5) {
      var enemyTeam: EnemyTeam = new EnemyTeam();
      enemyTeam.isBossFight = true;
      enemyTeam.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.Styx));
      battleOptions.push(enemyTeam);
    }
    if (type === ColiseumTournamentEnum.HadesTrial && round === 1) {
      var enemyTeam: EnemyTeam = new EnemyTeam();
      enemyTeam.isBossFight = true;
      enemyTeam.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.Charon));
      battleOptions.push(enemyTeam);
    }
    if (type === ColiseumTournamentEnum.HadesTrial && round === 2) {
      var enemyTeam: EnemyTeam = new EnemyTeam();
      enemyTeam.isBossFight = true;
      enemyTeam.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.Megaera));
      enemyTeam.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.Alecto));
      enemyTeam.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.Tisiphone));
      battleOptions.push(enemyTeam);
    }
    if (type === ColiseumTournamentEnum.HadesTrial && round === 3) {
      var enemyTeam: EnemyTeam = new EnemyTeam();
      enemyTeam.isBossFight = true;
      enemyTeam.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.Thanatos));
      battleOptions.push(enemyTeam);
    }
    if (type === ColiseumTournamentEnum.HadesTrial && round === 4) {
      var enemyTeam: EnemyTeam = new EnemyTeam();
      enemyTeam.isBossFight = true;
      enemyTeam.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.Cerberus));
      battleOptions.push(enemyTeam);
    }
    if (type === ColiseumTournamentEnum.HadesTrial && round === 5) {
      var enemyTeam: EnemyTeam = new EnemyTeam();
      enemyTeam.isBossFight = true;
      enemyTeam.enemyList.push(this.enemyGeneratorService.generateEnemy(BestiaryEnum.Hades));
      battleOptions.push(enemyTeam);
    }

    if (type === ColiseumTournamentEnum.WeeklyMelee)
      battleOptions.push(this.generateWeeklyMeleeOptions(round));

    battleOptions.forEach(enemyTeam => {
      enemyTeam.enemyList.forEach(enemy => {
        var duplicateNameList = enemyTeam.enemyList.filter(item => item.name === enemy.name);
        if (duplicateNameList.length > 1) {
          var count = "A";
          duplicateNameList.forEach(duplicateEnemy => {
            if (duplicateEnemy.abilityList.length > 0) {
              //go through user/target effects, look for caster, update name
              duplicateEnemy.abilityList.forEach(ability => {
                if (ability.userEffect.length > 0 && ability.userEffect.filter(item => item.caster !== "").length > 0) {
                  ability.userEffect.filter(item => item.caster !== "").forEach(effect => {
                    if (effect.caster === duplicateEnemy.name)
                      effect.caster = duplicateEnemy.name + " " + count;
                  });
                }

                if (ability.targetEffect.length > 0 && ability.targetEffect.filter(item => item.caster !== "").length > 0) {
                  ability.targetEffect.filter(item => item.caster !== "").forEach(effect => {
                    if (effect.caster === duplicateEnemy.name)
                      effect.caster = duplicateEnemy.name + " " + count;
                  });
                }
              })
            }
            duplicateEnemy.name += " " + count;

            var charCode = count.charCodeAt(0);
            count = String.fromCharCode(++charCode);
          })
        }
      });
    });

    return battleOptions;
  }

  generateWeeklyMeleeOptions(round: number) {
    var enemyCount = 3;
    if (round % 5 < 4)
      enemyCount = this.utilityService.getRandomInteger(2, 3);
    else
      enemyCount = 4;

    var isBoss = false;
    if (round % 5 === 0)
      isBoss = true;

    var expectedCharacterStats = new PrimaryStats(2500, 210, 300, 225, 225, 275);
    var defensiveGrowthFactor = 1.32;
    var offensiveGrowthFactor = 1.21;

    expectedCharacterStats.maxHp *= defensiveGrowthFactor ** ((round % 5) + 1);
    expectedCharacterStats.defense *= defensiveGrowthFactor ** ((round % 5) + 1);
    expectedCharacterStats.resistance *= defensiveGrowthFactor ** ((round % 5) + 1);
    expectedCharacterStats.attack *= offensiveGrowthFactor ** ((round % 5) + 1);
    expectedCharacterStats.agility *= offensiveGrowthFactor ** ((round % 5) + 1);
    expectedCharacterStats.luck *= offensiveGrowthFactor ** ((round % 5) + 1);

    if (round > 5 && round <= 10) {
      var expectedCharacterStats = new PrimaryStats(8000, 380, 800, 450, 650, 850);

      expectedCharacterStats.maxHp *= defensiveGrowthFactor ** ((round % 5) + 1);
      expectedCharacterStats.defense *= defensiveGrowthFactor ** ((round % 5) + 1);
      expectedCharacterStats.resistance *= defensiveGrowthFactor ** ((round % 5) + 1);
      expectedCharacterStats.attack *= offensiveGrowthFactor ** ((round % 5) + 1);
      expectedCharacterStats.agility *= offensiveGrowthFactor ** ((round % 5) + 1);
      expectedCharacterStats.luck *= offensiveGrowthFactor ** ((round % 5) + 1);
    }
    else if (round > 10) {
      //enemy.battleStats = new CharacterStats(37630, 530, 1670, 500, 750, 1350);
      var expectedCharacterStats = new PrimaryStats(1000, 225, 750, 275, 400, 600);
 
      var offsetRound = round - 10;
      defensiveGrowthFactor = 1.18;
      offensiveGrowthFactor = 1.07;
      expectedCharacterStats.maxHp *= defensiveGrowthFactor ** (offsetRound) + (offsetRound * 80);
      expectedCharacterStats.defense *= defensiveGrowthFactor ** (offsetRound) + (offsetRound * 7);
      expectedCharacterStats.resistance *= defensiveGrowthFactor ** (offsetRound) + (offsetRound * 6);      
      expectedCharacterStats.attack *= offensiveGrowthFactor ** (offsetRound) + (offsetRound * 2);
      expectedCharacterStats.agility *= offensiveGrowthFactor ** (offsetRound) + (offsetRound * 5);
      expectedCharacterStats.luck *= offensiveGrowthFactor ** (offsetRound) + (offsetRound * 5);
    }

    //to account for multiple enemies
    var multipleEnemyModifier = enemyCount;
    if (isBoss)
    {
      multipleEnemyModifier = 5;
    }    

    expectedCharacterStats.maxHp *= multipleEnemyModifier; 
    expectedCharacterStats.attack *= multipleEnemyModifier; 
    expectedCharacterStats.defense *= multipleEnemyModifier; 
    expectedCharacterStats.agility *= multipleEnemyModifier; 
    expectedCharacterStats.luck *= multipleEnemyModifier; 
    expectedCharacterStats.resistance *= multipleEnemyModifier; 

    //console.log("Searching for: ");
    //console.log("Is Boss: " + isBoss);
    //console.log("Enemy Count: " + enemyCount);

    var allRelevantEnemyParties: EnemyTeam[] = [];
    for (const [propertyKey, propertyValue] of Object.entries(SubZoneEnum)) {
      if (!Number.isNaN(Number(propertyKey))) {
        continue;
      }

      var enumValue = propertyValue as SubZoneEnum;

      if (round <= 10 && (this.findBalladOfSubzone(enumValue)?.type !== BalladEnum.Champion &&
        this.findBalladOfSubzone(enumValue)?.type !== BalladEnum.Gorgon && this.findBalladOfSubzone(enumValue)?.type !== BalladEnum.Underworld)) {
        continue;
      }

      var battleOptions = this.subZoneGeneratorService.generateBattleOptions(enumValue);
      battleOptions.filter(option => (!isBoss && option.enemyList.length === enemyCount && !option.isBossFight && !option.isDoubleBossFight) ||
        (isBoss && (option.isBossFight || option.isDoubleBossFight))).forEach(option => {
          allRelevantEnemyParties.push(option);
        });
    }

    var rng = this.utilityService.getRandomInteger(0, allRelevantEnemyParties.length - 1);
    var selectedEnemyTeam = allRelevantEnemyParties[rng];
    //console.log("Normalize stats for round " + round + " , expected HP Total is " + expectedHpTotal);
    this.normalizeEnemyTeamStats(selectedEnemyTeam, expectedCharacterStats);

    return selectedEnemyTeam;
  }

  multiplyCharacterStats(enemy: Enemy, amount: number) {
    enemy.battleStats.maxHp *= amount;
    enemy.battleStats.attack *= amount;
    enemy.battleStats.defense *= amount;
    enemy.battleStats.agility *= amount;
    enemy.battleStats.luck *= amount;
    enemy.battleStats.resistance *= amount;

    enemy.battleStats.currentHp = enemy.battleStats.maxHp;
  }

  normalizeEnemyTeamStats(enemyTeam: EnemyTeam, expectedStats: PrimaryStats) {
    //should look at each enemy on the team and get the discrepancy of their HPs then multiply to keep the same discrepancy
    var totalHp = 0;
    var totalAttack = 0;
    var totalDefense = 0;
    var totalAgility = 0;
    var totalLuck = 0;
    var totalResistance = 0;

    enemyTeam.enemyList.forEach(enemy => {
      totalHp += enemy.battleStats.maxHp;
      totalAttack += enemy.battleStats.attack;
      totalDefense += enemy.battleStats.defense;
      totalAgility += enemy.battleStats.agility;
      totalLuck += enemy.battleStats.luck;
      totalResistance += enemy.battleStats.resistance;      
    });

    enemyTeam.enemyList.forEach(enemy => {      
      enemy.battleStats.maxHp = Math.round(enemy.battleStats.maxHp * (expectedStats.maxHp / totalHp));
      enemy.battleStats.attack = Math.round(enemy.battleStats.attack * (expectedStats.attack / totalAttack));      
      enemy.battleStats.defense = Math.round(enemy.battleStats.defense * (expectedStats.defense / totalDefense));
      enemy.battleStats.agility = Math.round(enemy.battleStats.agility * (expectedStats.agility / totalAgility));
      enemy.battleStats.luck = Math.round(enemy.battleStats.luck * (expectedStats.luck / totalLuck));
      enemy.battleStats.resistance = Math.round(enemy.battleStats.resistance * (expectedStats.resistance / totalResistance));

      enemy.battleStats.currentHp = enemy.battleStats.maxHp;      
    });
  }

  isTournamentTypeSpecial(type: ColiseumTournamentEnum) {
    if (type === ColiseumTournamentEnum.WeeklyMelee)
      return true;

    return false;
  }

  findSubzone(type: SubZoneEnum) {
    var returnSubzone: SubZone | undefined;
    var subzoneFound = false;

    this.globalService.globalVar.ballads.forEach(ballad => {
      if (!subzoneFound) {
        ballad.zones.forEach(zone => {
          if (!subzoneFound) {
            zone.subzones.forEach(subzone => {
              if (subzone.type === type) {
                returnSubzone = subzone;
                subzoneFound = true;
              }
            });
          }
        });
      }
    });

    return returnSubzone;
  }

  findBalladOfSubzone(type: SubZoneEnum) {
    var returnBallad: Ballad | undefined;

    this.globalService.globalVar.ballads.forEach(ballad => {
      ballad.zones.forEach(zone => {
        zone.subzones.forEach(subzone => {
          if (subzone.type === type)
            returnBallad = ballad;
        })
      })
    });

    return returnBallad;
  }
}
