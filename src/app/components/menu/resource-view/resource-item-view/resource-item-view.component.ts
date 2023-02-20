import { Component, Input, OnInit } from '@angular/core';
import { ItemsEnum } from 'src/app/models/enums/items-enum.model';
import { LookupService } from 'src/app/services/lookup.service';
import * as pluralize from 'pluralize';
import { DirectionEnum } from 'src/app/models/enums/direction-enum.model';
import { GlobalService } from 'src/app/services/global/global.service';
import { ResourceValue } from 'src/app/models/resources/resource-value.model';

@Component({
  selector: 'app-resource-item-view',
  templateUrl: './resource-item-view.component.html',
  styleUrls: ['./resource-item-view.component.css']
})
export class ResourceItemViewComponent implements OnInit {
  @Input() resource: ItemsEnum;
  tooltipDirection = DirectionEnum.Up;
  showTooltip = false;
  @Input() canSetTrackingResource: boolean = false;

  constructor(public lookupService: LookupService, public globalService: GlobalService) { }

  ngOnInit(): void {
  }

  
  getPluralizedItemName(type: ItemsEnum) {
    return pluralize(this.lookupService.getItemName(type));
  }

  setTrackingResource() {
    if (!this.canSetTrackingResource)
      return;

    if (this.globalService.globalVar.trackedResources.some(item => item === this.resource))
    {
      this.globalService.globalVar.trackedResources = this.globalService.globalVar.trackedResources.filter(item => item != this.resource);
    }
    else
    {
      this.globalService.globalVar.trackedResources.push(this.resource);
    }
  }
}
