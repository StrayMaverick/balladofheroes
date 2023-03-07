import { Component, Input, OnInit } from '@angular/core';
import { AchievementTypeEnum } from 'src/app/models/enums/achievement-type-enum.copy';
import { DirectionEnum } from 'src/app/models/enums/direction-enum.model';
import { ItemsEnum } from 'src/app/models/enums/items-enum.model';
import { Achievement } from 'src/app/models/global/achievement.model';
import { ResourceValue } from 'src/app/models/resources/resource-value.model';
import { LookupService } from 'src/app/services/lookup.service';

@Component({
  selector: 'app-individual-achievement-view',
  templateUrl: './individual-achievement-view.component.html',
  styleUrls: ['./individual-achievement-view.component.css']
})
export class IndividualAchievementViewComponent implements OnInit {
  @Input() achievement: Achievement;
  tooltipDirection = DirectionEnum.Down;

  constructor(private lookupService: LookupService) { }

  ngOnInit(): void {
  }


  getAchievementDescription(type: AchievementTypeEnum) {
    return this.lookupService.getAchievementDescription(type);
  }

  //you were adding bonus xp to medusa so you need to make this an ngFor and display all possible achievements
  getAchievementReward(resource: ResourceValue) {
    var reward = "";
    //this.achievement.bonusResources.forEach(resource => {
    var amount = resource.amount.toString();
    if (resource.item === ItemsEnum.BoonOfOlympus)
      amount = (resource.amount * 100) + "%";

    reward += amount + " " + this.lookupService.getItemName(resource.item);
    //});

    return reward;
  }

  getRewardDescription() {
    var description = "";

    for (var i = 0; i < this.achievement.bonusResources.length; i++) {
      var resource = this.achievement.bonusResources[i];
      description += this.lookupService.getItemDescription(resource.item);
      console.log("Get description for " + resource.item);

      if (i < this.achievement.bonusResources.length - 1)
      {
        description += "<br/>";
      }
    }

    return description;
  }
}
