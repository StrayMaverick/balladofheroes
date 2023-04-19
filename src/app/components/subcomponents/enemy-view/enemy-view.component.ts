import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { EnemyDefeatCount } from 'src/app/models/battle/enemy-defeat-count.model';
import { Ability } from 'src/app/models/character/ability.model';
import { Character } from 'src/app/models/character/character.model';
import { Enemy } from 'src/app/models/character/enemy.model';
import { CharacterEnum } from 'src/app/models/enums/character-enum.model';
import { DirectionEnum } from 'src/app/models/enums/direction-enum.model';
import { ItemsEnum } from 'src/app/models/enums/items-enum.model';
import { LootItem } from 'src/app/models/resources/loot-item.model';
import { BattleService } from 'src/app/services/battle/battle.service';
import { GameLoopService } from 'src/app/services/game-loop/game-loop.service';
import { GlobalService } from 'src/app/services/global/global.service';
import { LookupService } from 'src/app/services/lookup.service';
import { UtilityService } from 'src/app/services/utility/utility.service';
import { StatusEffectEnum } from 'src/app/models/enums/status-effects-enum.model';
import { OverlayRef } from '@angular/cdk/overlay';

@Component({
  selector: 'app-enemy-view',
  templateUrl: './enemy-view.component.html',
  styleUrls: ['./enemy-view.component.css']
})
export class EnemyViewComponent implements OnInit {
  @Input() enemyParty: Enemy[];
  @Input() character: Enemy;
  @Input() showNewEnemyGroupAnimation: boolean = false;
  @Input() isBoss = false;
  tooltipDirection = DirectionEnum.Down;
  defeatCount: number;
  subscription: any;
  characterTargeting: boolean = false;
  bothCharactersTargeting: boolean = false;
  @ViewChild('enemyNameContainer') enemyNameContainer: ElementRef;
  @ViewChild('enemyName') enemyName: ElementRef;
  previousName = "";
  overlayRef: OverlayRef;
  showEnemyHpAsPercent: boolean = false;

  constructor(public battleService: BattleService, public lookupService: LookupService, public utilityService: UtilityService,
    public globalService: GlobalService, private gameLoopService: GameLoopService) { }

  ngOnInit(): void {
    console.log("New enemy view");
    this.showEnemyHpAsPercent = this.globalService.globalVar.settings.get("showEnemyHpAsPercent") ?? false;

    this.subscription = this.gameLoopService.gameUpdateEvent.subscribe(async () => {
      var defeatCount: EnemyDefeatCount | undefined;

      if (this.character !== undefined) {
        defeatCount = this.globalService.globalVar.enemyDefeatCount.find(item => item.bestiaryEnum === this.character.bestiaryType);

        if (this.previousName !== this.character.name) {
          this.enemyName.nativeElement.classList.remove('smallText');
          this.enemyName.nativeElement.classList.remove('verySmallText');
        }

        if (this.enemyName.nativeElement.classList.contains('smallText') && (this.enemyNameContainer.nativeElement.offsetHeight * 1.4) < this.enemyName.nativeElement.offsetHeight) {
          this.enemyName.nativeElement.classList.remove('smallText');
          this.enemyName.nativeElement.classList.add('verySmallText');
        }

        if ((this.enemyNameContainer.nativeElement.offsetHeight * 1.4) < this.enemyName.nativeElement.offsetHeight) {
          this.enemyName.nativeElement.classList.add('smallText');
        }

        this.previousName = this.character.name;
      }

      if (defeatCount !== undefined)
        this.defeatCount = defeatCount.count;
      else
        this.defeatCount = 0;

      this.characterTargeting = this.globalService.getActivePartyCharacters(true).some(item => item.targeting === this.character);
      this.bothCharactersTargeting = this.globalService.getActivePartyCharacters(true).filter(item => item.targeting === this.character).length > 1;
    });
  }

  getCharacterHpPercent(character: Enemy) {
    return (character.battleStats.currentHp / character.battleStats.maxHp) * 100;
  }

  getCharacterBarrierPercent(character: Enemy) {
    return (character.battleInfo.barrierValue / character.battleStats.maxHp) * 100;
  }

  getCharacterAutoAttackProgress(character: Enemy) {
    return (character.battleInfo.autoAttackTimer / character.battleInfo.timeToAutoAttack) * 100;
  }

  targetCharacterWithItem(character: Character) {
    var isTargeted = false;

    var isTargetable = this.battleService.isTargetableWithItem(character, true);

    if (this.battleService.targetbattleItemMode && isTargetable) //need to check if item targets allies or enemies
      isTargeted = true;

    return isTargeted;
  }

  partyCharacterTargeting(character: Character) {
    var isTargeted = false;

    if (this.battleService.targetCharacterMode)
      isTargeted = true;

    return isTargeted;
  }

  useBattleItemOnCharacter(character: Character) {
    //console.log("Checking battle item");
    if (!this.battleService.targetCharacterMode && this.targetCharacterWithItem(character))
      return this.battleService.useBattleItemOnCharacter(character, this.enemyParty);
  }

  characterTargetEnemy(character: Character) {
    if (character.battleInfo.statusEffects.find(item => item.type === StatusEffectEnum.Dead) !== undefined)
      return;

    if (this.battleService.targetCharacterMode) {
      var targetingCharacter = this.globalService.globalVar.characters.find(item => item.type === this.battleService.characterInTargetMode);
      if (targetingCharacter !== undefined) {
        targetingCharacter.targeting = character;
      }
    }

    this.battleService.targetCharacterMode = false;
  }

  getCharacterBarrierValue(character: Character) {
    return character.battleInfo.barrierValue;
  }

  getCharacterCurrentHp() {
    return this.utilityService.bigNumberReducer(Math.ceil(this.character.battleStats.currentHp + this.getCharacterBarrierValue(this.character)));
  }

  getCharacterMaxHp() {
    return this.utilityService.bigNumberReducer(this.character.battleStats.maxHp);
  }

  getLootItem(loot: LootItem) {
    var name = "";

    if (this.defeatCount >= this.utilityService.killCountDisplayFullEnemyLoot) {
      name = loot.amount + "x " + this.lookupService.getItemName(loot.item) + " (" + (loot.chance * 100) + "%)";
    }
    else if (this.defeatCount >= this.utilityService.killCountDisplayBasicEnemyLoot) {
      name = this.lookupService.getItemName(loot.item);
    }

    return name;
  }

  getTargetClass() {
    return {
      'characterTargeted': this.targetCharacterWithItem(this.character),
      'characterTargetedAdventurer': this.partyCharacterTargeting(this.character) && this.battleService.characterInTargetMode === CharacterEnum.Adventurer,
      'characterTargetedArcher': this.partyCharacterTargeting(this.character) && this.battleService.characterInTargetMode === CharacterEnum.Archer,
      'characterTargetedWarrior': this.partyCharacterTargeting(this.character) && this.battleService.characterInTargetMode === CharacterEnum.Warrior,
      'characterTargetedPriest': this.partyCharacterTargeting(this.character) && this.battleService.characterInTargetMode === CharacterEnum.Priest
    };
  }

  getFirstCharacterTargeting() {
    var src = "assets/svg/";

    var character = this.globalService.getActivePartyCharacters(true).find(item => item.targeting === this.character);

    if (character !== undefined) {
      if (character.type === CharacterEnum.Adventurer)
        src += "adventurerTarget.svg";
      if (character.type === CharacterEnum.Archer)
        src += "archerTarget.svg";
      if (character.type === CharacterEnum.Warrior)
        src += "warriorTarget.svg";
      if (character.type === CharacterEnum.Priest)
        src += "priestTarget.svg";
    }
    return src;
  }

  getSecondCharacterTargeting() {
    var src = "assets/svg/";

    if (this.globalService.globalVar.activePartyMember2 === CharacterEnum.Adventurer)
      src += "adventurerTarget.svg";
    if (this.globalService.globalVar.activePartyMember2 === CharacterEnum.Archer)
      src += "archerTarget.svg";
    if (this.globalService.globalVar.activePartyMember2 === CharacterEnum.Warrior)
      src += "warriorTarget.svg";
    if (this.globalService.globalVar.activePartyMember2 === CharacterEnum.Priest)
      src += "priestTarget.svg";

    return src;
  }

  getCharacterAttackSpeed() {
    if (this.character.battleInfo.timeToAutoAttack === this.utilityService.enemyAverageAutoAttackSpeed)
      return "Average";
    if (this.character.battleInfo.timeToAutoAttack === this.utilityService.enemyQuickAutoAttackSpeed)
      return "Quick";
    if (this.character.battleInfo.timeToAutoAttack === this.utilityService.enemyLongAutoAttackSpeed)
      return "Long";
    if (this.character.battleInfo.timeToAutoAttack === this.utilityService.enemyVeryLongAutoAttackSpeed)
      return "Very Long";

    return "";
  }

  getElementalStrengths() {
    var increases = "";
    if (this.character.battleStats.elementIncrease.fire > 0) {
      if (increases !== "")
        increases += "<br/>";
      increases += "<span class='statLabel'>Fire Damage Dealt:</span> <span class='statValue'>+" + this.character.battleStats.elementIncrease.fire * 100 + "%</span>";
    }
    if (this.character.battleStats.elementIncrease.holy > 0) {
      if (increases !== "")
        increases += "<br/>";
      increases += "<span class='statLabel'>Holy Damage Dealt:</span> <span class='statValue'>+" + this.character.battleStats.elementIncrease.holy * 100 + "%</span>";
    }
    if (this.character.battleStats.elementIncrease.water > 0) {
      if (increases !== "")
        increases += "<br/>";
      increases += "<span class='statLabel'>Water Damage Dealt:</span> <span class='statValue'>+" + this.character.battleStats.elementIncrease.water * 100 + "%</span>";
    }
    if (this.character.battleStats.elementIncrease.air > 0) {
      if (increases !== "")
        increases += "<br/>";
      increases += "<span class='statLabel'>Air Damage Dealt:</span> <span class='statValue'>+" + this.character.battleStats.elementIncrease.air * 100 + "%</span>";
    }
    if (this.character.battleStats.elementIncrease.earth > 0) {
      if (increases !== "")
        increases += "<br/>";
      increases += "<span class='statLabel'>Earth Damage Dealt:</span> <span class='statValue'>+" + this.character.battleStats.elementIncrease.earth * 100 + "%</span>";
    }
    if (this.character.battleStats.elementIncrease.lightning > 0) {
      if (increases !== "")
        increases += "<br/>";
      increases += "<span class='statLabel'>Lightning Damage Dealt:</span> <span class='statValue'>+" + this.character.battleStats.elementIncrease.lightning * 100 + "%</span>";
    }

    return increases;
  }

  getElementalWeaknesses() {
    var decreases = "";
    if (this.character.battleStats.elementResistance.water > 0) {
      if (decreases !== "")
        decreases += "<br/>";
      decreases += "<span class='statLabel'>Water Damage Taken:</span> <span class='statValue'>-" + this.character.battleStats.elementResistance.water * 100 + "%</span>";
    }
    if (this.character.battleStats.elementResistance.fire > 0) {
      if (decreases !== "")
        decreases += "<br/>";
      decreases += "<span class='statLabel'>Fire Damage Taken:</span> <span class='statValue'>-" + this.character.battleStats.elementResistance.fire * 100 + "%</span>";
    }
    if (this.character.battleStats.elementResistance.holy > 0) {
      if (decreases !== "")
        decreases += "<br/>";
      decreases += "<span class='statLabel'>Holy Damage Taken:</span> <span class='statValue'>-" + this.character.battleStats.elementResistance.holy * 100 + "%</span>";
    }
    if (this.character.battleStats.elementResistance.air > 0) {
      if (decreases !== "")
        decreases += "<br/>";
      decreases += "<span class='statLabel'>Air Damage Taken:</span> <span class='statValue'>-" + this.character.battleStats.elementResistance.air * 100 + "%</span>";
    }
    if (this.character.battleStats.elementResistance.earth > 0) {
      if (decreases !== "")
        decreases += "<br/>";
      decreases += "<span class='statLabel'>Earth Damage Taken:</span> <span class='statValue'>-" + this.character.battleStats.elementResistance.earth * 100 + "%</span>";
    }
    if (this.character.battleStats.elementResistance.lightning > 0) {
      if (decreases !== "")
        decreases += "<br/>";
      decreases += "<span class='statLabel'>Lightning Damage Taken:</span> <span class='statValue'>-" + this.character.battleStats.elementResistance.lightning * 100 + "%</span>";
    }

    if (this.character.battleStats.elementResistance.water < 0) {
      if (decreases !== "")
        decreases += "<br/>";
      decreases += "<span class='statLabel'>Water Damage Taken:</span> <span class='statValue'>+" + Math.abs(this.character.battleStats.elementResistance.water) * 100 + "%</span>";
    }
    if (this.character.battleStats.elementResistance.holy < 0) {
      if (decreases !== "")
        decreases += "<br/>";
      decreases += "<span class='statLabel'>Holy Damage Taken:</span> <span class='statValue'>+" + Math.abs(this.character.battleStats.elementResistance.holy) * 100 + "%</span>";
    }
    if (this.character.battleStats.elementResistance.air < 0) {
      if (decreases !== "")
        decreases += "<br/>";
      decreases += "<span class='statLabel'>Air Damage Taken:</span> <span class='statValue'>+" + Math.abs(this.character.battleStats.elementResistance.air) * 100 + "%</span>";
    }
    if (this.character.battleStats.elementResistance.earth < 0) {
      if (decreases !== "")
        decreases += "<br/>";
      decreases += "<span class='statLabel'>Earth Damage Taken:</span> <span class='statValue'>+" + Math.abs(this.character.battleStats.elementResistance.earth) * 100 + "%</span>";
    }
    if (this.character.battleStats.elementResistance.fire < 0) {
      if (decreases !== "")
        decreases += "<br/>";
      decreases += "<span class='statLabel'>Fire Damage Taken:</span> <span class='statValue'>+" + Math.abs(this.character.battleStats.elementResistance.fire) * 100 + "%</span>";
    }
    if (this.character.battleStats.elementResistance.lightning < 0) {
      if (decreases !== "")
        decreases += "<br/>";
      decreases += "<span class='statLabel'>Lightning Damage Taken:</span> <span class='statValue'>+" + Math.abs(this.character.battleStats.elementResistance.lightning) * 100 + "%</span>";
    }

    return decreases;
  }

  overlayEmitter(overlayRef: OverlayRef) {    
    if (this.overlayRef !== undefined) {      
      this.overlayRef.detach();
      this.overlayRef.dispose();
    }

    this.overlayRef = overlayRef;
  }

  ngOnDestroy() {
    if (this.subscription !== undefined)
      this.subscription.unsubscribe();

    console.log("Disposing");
    console.log(this.overlayRef);

      if (this.overlayRef !== undefined) {        
        this.overlayRef.detach();
        this.overlayRef.dispose();
      }
  }

  /*ngOnChanges(changes: any) {
    this.showNewEnemyGroupAnimation = changes.showNewEnemyGroupAnimation.currentValue;    
  }*/
}
