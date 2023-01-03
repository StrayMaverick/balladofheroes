import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { Ability } from 'src/app/models/character/ability.model';
import { Character } from 'src/app/models/character/character.model';
import { God } from 'src/app/models/character/god.model';
import { CharacterEnum } from 'src/app/models/enums/character-enum.model';
import { GodEnum } from 'src/app/models/enums/god-enum.model';
import { LookupService } from 'src/app/services/lookup.service';
import { UtilityService } from 'src/app/services/utility/utility.service';

@Component({
  selector: 'app-ability-view',
  templateUrl: './ability-view.component.html',
  styleUrls: ['./ability-view.component.css']
})
export class AbilityViewComponent implements OnInit {
  @Input() character: Character;
  @Input() ability: Ability;
  @Input() isAutoAttack: boolean = false;
  @Input() god: GodEnum | undefined = undefined;
  @ViewChild('spinnerDiv') spinnerDiv: ElementRef;
  spinnerDiameter = 10;
  strokeWidth = 5;
  autoMode: boolean;

  constructor(public lookupService: LookupService, private utilityService: UtilityService) { }

  ngOnInit(): void {
    if (this.ability === undefined)
      this.autoMode = this.character.battleInfo.autoAttackAutoMode;
    else
      this.autoMode = this.ability.autoMode;
  }

  ngAfterViewInit(): void {
    this.spinnerDiameter = this.spinnerDiv.nativeElement.offsetHeight;
  }

  getCharacterAutoAttackProgress() {
    var timeToAutoAttack = this.lookupService.getAutoAttackTime(this.character);
    return (this.character.battleInfo.autoAttackTimer / timeToAutoAttack) * 100;
  }

  getAbilityProgress() {
    if (this.ability === undefined)
      return;

    var progress = 100 - ((this.ability.currentCooldown / this.ability.cooldown) * 100);
    
    if (progress < 0)
      progress = 0;

    return progress;
  }

  getAbilityName() {
    if (this.isAutoAttack)
      return "Auto Attack";

    if (this.ability === undefined)
      return;

    return this.utilityService.getSanitizedHtml(this.ability.name);
  }

  getAbilityDescription() {
    var description = "";

    if (this.isAutoAttack)
      description = this.lookupService.getAutoAttackDescription(this.character);
    else
      description = this.lookupService.getCharacterAbilityDescription(this.ability.name, this.character, this.ability);

    if (description === "")
      description = this.lookupService.getGodAbilityDescription(this.ability.name, this.character, this.ability);

    return this.utilityService.getSanitizedHtml(description);
  }

  toggleAuto() {
    this.autoMode = !this.autoMode;
    if (this.ability !== undefined)    
      this.ability.autoMode = this.autoMode;  
    else
      this.character.battleInfo.autoAttackAutoMode = this.autoMode;

    return false;
  }

  manuallyTrigger() {
    if (this.ability !== undefined)
      this.ability.manuallyTriggered = true;
    else
      this.character.battleInfo.autoAttackManuallyTriggered = true;
  }

  getStrokeColor() {
    if (this.god !== undefined) {
      return this.lookupService.getGodColorClass(this.god);
    }
    else {
      return this.lookupService.getCharacterColorClass(this.character.type);
    }
  }
}
