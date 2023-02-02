import { Component, Input, OnInit } from '@angular/core';
import { Character } from 'src/app/models/character/character.model';
import { God } from 'src/app/models/character/god.model';
import { GodEnum } from 'src/app/models/enums/god-enum.model';
import { GlobalService } from 'src/app/services/global/global.service';
import { LookupService } from 'src/app/services/lookup.service';

@Component({
  selector: 'app-change-god-view',
  templateUrl: './change-god-view.component.html',
  styleUrls: ['./change-god-view.component.css']
})
export class ChangeGodViewComponent implements OnInit {
  @Input() character: Character;
  swappingGod: number | undefined;
  allGods: God[];

  godRows: God[][];
  godCells: God[];

  constructor(private lookupService: LookupService, private globalService: GlobalService) { }

  ngOnInit(): void {
    this.allGods = this.globalService.globalVar.gods.filter(item => item.isAvailable);
    this.setupDisplayGods();
  }

  swapGod(whichGod: number) {
    this.swappingGod = whichGod;
  }
 
  getGodName(whichGod?: number, type?: GodEnum) {
    if (type === undefined) {
      type = this.character.assignedGod1;
      if (whichGod === 2)
        type = this.character.assignedGod2;
    }

    return this.lookupService.getGodNameByType(type);
  }

  getGodLevel(whichGod?: number, type?: GodEnum) {
    if (type === undefined) {
      type = this.character.assignedGod1;
      if (whichGod === 2)
        type = this.character.assignedGod2;
    }

    return "Lv " + this.globalService.globalVar.gods.find(item => item.type === type)?.level;
  }

  currentlyAssignedToSameCharacter(type: GodEnum) {    
    return this.character.assignedGod1 === type || this.character.assignedGod2 === type;
  }

  getGodColor(whichGod?: number, type?: GodEnum) {
    if (type === undefined) {
      type = this.character.assignedGod1;
      if (whichGod === 2)
        type = this.character.assignedGod2;
    }

    return this.lookupService.getGodColorClass(type);
  }

  getGodDescription(whichGod?: number, type?: GodEnum) {
    if (type === undefined) {
      type = this.character.assignedGod1;
      if (whichGod === 2)
        type = this.character.assignedGod2;
    }

    return this.lookupService.getGodDescription(type);
  }

  setupDisplayGods(): void {
    this.godCells = [];
    this.godRows = [];

    //var filteredItems = this.filterItems(this.shopItems);

    var maxColumns = 4;

    for (var i = 1; i <= this.allGods.length; i++) {
      this.godCells.push(this.allGods[i - 1]);
      if ((i % maxColumns) == 0) {
        this.godRows.push(this.godCells);
        this.godCells = [];
      }
    }

    if (this.godCells.length !== 0)
      this.godRows.push(this.godCells);
  }

  selectNewGod(type: GodEnum) {
    if (this.isCurrentlyAssigned(type))
    {
      var party = this.globalService.getActivePartyCharacters(true);
      party.forEach(member => {
        if (member.assignedGod1 === type)
          member.assignedGod1 = this.character.assignedGod1;
        else if (member.assignedGod2 === type)
          member.assignedGod2 = this.character.assignedGod2;
      })
    }

    if (this.swappingGod === 1)
      this.character.assignedGod1 = type;
    else if (this.swappingGod === 2)
      this.character.assignedGod2 = type;

    this.swappingGod = undefined;
  }

  isCurrentlyAssigned(type: GodEnum) {
    var isAssigned = false;
    var party = this.globalService.getActivePartyCharacters(true);

    party.forEach(member => {
      if (member.assignedGod1 === type || member.assignedGod2 === type)
        isAssigned = true;
    });

    return isAssigned;
  }

  GetCurrentlyAssignedCharacter(type: GodEnum) {
    var party = this.globalService.getActivePartyCharacters(true);
    var assignedCharacter = new Character();

    party.forEach(member => {
      if (member.assignedGod1 === type || member.assignedGod2 === type)
        assignedCharacter = member;
    });

    return "<span class='" + this.globalService.getCharacterColorClassText(assignedCharacter.type) + "'>" + assignedCharacter.name + "</span>";
  }
}