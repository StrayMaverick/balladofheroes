import { Component, Input, OnInit } from '@angular/core';
import { AchievementTypeEnum } from 'src/app/models/enums/achievement-type-enum.copy';
import { BalladEnum } from 'src/app/models/enums/ballad-enum.model';
import { SubZoneEnum } from 'src/app/models/enums/sub-zone-enum.model';
import { ZoneEnum } from 'src/app/models/enums/zone-enum.model';
import { Achievement } from 'src/app/models/global/achievement.model';
import { Ballad } from 'src/app/models/zone/ballad.model';
import { SubZone } from 'src/app/models/zone/sub-zone.model';
import { Zone } from 'src/app/models/zone/zone.model';
import { AchievementService } from 'src/app/services/achievements/achievement.service';
import { BalladService } from 'src/app/services/ballad/ballad.service';
import { GlobalService } from 'src/app/services/global/global.service';
import { LookupService } from 'src/app/services/lookup.service';

@Component({
  selector: 'app-achievements-view',
  templateUrl: './achievements-view.component.html',
  styleUrls: ['./achievements-view.component.css']
})
export class AchievementsViewComponent implements OnInit {
  achievementsBySubZone: Achievement[][] = [];
  achievementsBySubZonePaged: Achievement[][] = [];
  cellsPerRow = 3;
  currentPage = 1;
  itemsPerPage = 5;
  lastPage = 0;
  @Input() isMobile = false;

  ballads: BalladEnum[] = [];
  zones: ZoneEnum[] = [];
  subzones: SubZoneEnum[] = [];
  selectedBallad: BalladEnum = BalladEnum.None;
  selectedZone: ZoneEnum = ZoneEnum.None;
  selectedSubzone: SubZoneEnum = SubZoneEnum.None;
  showUncompleted = false;

  constructor(private globalService: GlobalService, public balladService: BalladService, private lookupService: LookupService,
    private achievementService: AchievementService) { }

  ngOnInit(): void {
    if (this.isMobile)
      this.cellsPerRow = 2;

    this.ballads.push(BalladEnum.None);
    this.globalService.globalVar.ballads.filter(item => item.isAvailable).forEach(ballad => {
      this.ballads.push(ballad.type);
    });

    //this.ballads = this.globalService.globalVar.ballads.filter(item => item.isAvailable);
    //this.ballads.unshift(new Ballad());
    this.zones.push(ZoneEnum.None);
    this.subzones.push(SubZoneEnum.None);

    var showOnlyUncompletedAchievements = this.globalService.globalVar.settings.get("showOnlyUncompletedAchievements");
    if (showOnlyUncompletedAchievements !== undefined)
      this.showUncompleted = showOnlyUncompletedAchievements;

    var achievementsPerPage = this.globalService.globalVar.settings.get("achievementsPerPage");
    if (achievementsPerPage !== undefined)
      this.itemsPerPage = achievementsPerPage;

    this.globalService.globalVar.achievements.forEach(achievement => {
      var achievementSubsection = this.achievementsBySubZone.find(item => item[0].subzone === achievement.subzone)
      if (achievementSubsection !== undefined) {
        achievementSubsection.push(achievement);
      }
      else {
        var newSubsection = [];
        newSubsection.push(achievement);
        this.achievementsBySubZone.push(newSubsection);
      }
    });

    this.lastPage = Math.ceil(this.achievementsBySubZone.length / this.itemsPerPage);
    this.getAchievementsByPage();
    this.filterList();
  }

  getAchievementsByPage() {
    this.currentPage = +this.currentPage;
    this.achievementsBySubZonePaged = [];
    var startingPoint = (this.currentPage - 1) * this.itemsPerPage;


    for (var i = startingPoint; i < startingPoint + this.itemsPerPage; i++) {
      if (this.achievementsBySubZone.length > i) {
        this.achievementsBySubZonePaged.push(this.achievementsBySubZone[i]);
      }
    }
  }

  getZoneName(type: ZoneEnum) {
    return this.balladService.findZone(type)?.zoneName;
  }

  getUnstyledSubzoneName(type: SubZoneEnum) {
    return this.balladService.getSubZoneName(type);
  }

  getSubZoneBalladName(type: SubZoneEnum) {
    var ballad = this.balladService.findBalladOfSubzone(type);

    var achievementsCompleted = this.achievementService.getUncompletedAchievementCountBySubZone(type, this.globalService.globalVar.achievements) === 0;
    var className = "";

    if (achievementsCompleted)
      className = 'completedSubzoneColor';

    if (ballad !== undefined)
      return "<span class='" + className + "'>" + this.balladService.getBalladName(ballad.type) + "</span>";

    return "";
  }

  getSubZoneName(type: SubZoneEnum) {
    var subzone = this.balladService.findSubzone(type);

    var achievementsCompleted = this.achievementService.getUncompletedAchievementCountBySubZone(type, this.globalService.globalVar.achievements) === 0;
    var className = "";

    if (achievementsCompleted)
      className = 'completedSubzoneColor';

    if (subzone !== undefined)
      return "<span class='" + className + "'>" + this.balladService.getSubZoneName(subzone.type) + "</span>";

    return "";
  }

  getSubZoneRows(section: Achievement[]) {
    var rows = 0;

    rows = Math.ceil(section.length / this.cellsPerRow);

    return rows;
  }

  getSubZoneColumnsPerRow(section: Achievement[], rowCount: number) {
    var columns = 0;

    var totalRows = this.getSubZoneRows(section);
    if (rowCount < totalRows - 1) {
      if (totalRows > 1)
        columns = this.cellsPerRow;
      else
        columns = section.length;
    }
    else {
      columns = section.length % this.cellsPerRow;
      if (columns === 0)
        columns = this.cellsPerRow;
    }

    return columns;
  }

  getAchievement(section: Achievement[], rowCount: number, columnCount: number) {
    if (section.length > rowCount * this.cellsPerRow + columnCount)
      return section[rowCount * this.cellsPerRow + columnCount];

    return new Achievement(AchievementTypeEnum.None);
  }

  getAchievementStatus(section: Achievement[], rowCount: number, columnCount: number) {
    var achievement = this.getAchievement(section, rowCount, columnCount);

    var achievementsCompleted = this.achievementService.getUncompletedAchievementCountBySubZone(achievement.subzone, this.globalService.globalVar.achievements) === 0;

    return {
      'achievementUncompleted': !achievement.completed && !achievementsCompleted,
      'achievementCompleted': achievement.completed && !achievementsCompleted,
      'subzoneAchievementsCompleted': achievementsCompleted
    };
  }

  populateZones() {
    this.zones = [];
    this.subzones = [];
    this.zones.push(ZoneEnum.None);
    this.subzones.push(SubZoneEnum.None);

    var selectedBallad = this.balladService.findBallad(parseInt(this.selectedBallad.toString()));    
    if (selectedBallad !== undefined)
    {
      selectedBallad.zones.forEach(zone => {
        this.zones.push(zone.type);
      });      
    }

    if (parseInt(this.selectedBallad.toString()) === BalladEnum.None) {
      this.selectedZone = this.zones[0];
      this.selectedSubzone = this.subzones[0];
    }
  }

  populateSubzones() {
    this.subzones = [];
    this.subzones.push(SubZoneEnum.None);

    var selectedZone = this.balladService.findZone(parseInt(this.selectedZone.toString()));    
    if (selectedZone !== undefined)
    {
      selectedZone.subzones.forEach(subzone => {
        this.subzones.push(subzone.type);
      });      
    }    

    if (parseInt(this.selectedZone.toString()) === ZoneEnum.None) {
      this.selectedSubzone = this.subzones[0];
    }
  }

  showUncompletedToggle() {
    this.filterList();
    this.globalService.globalVar.settings.set("showOnlyUncompletedAchievements", this.showUncompleted);
  }

  filterList() {
    this.achievementsBySubZone = [];
    var mainList = this.globalService.globalVar.achievements;

    if (this.selectedBallad !== undefined && parseInt(this.selectedBallad.toString()) !== BalladEnum.None) {
      mainList = mainList.filter(item => this.balladService.isSubzoneInBallad(item.subzone, this.selectedBallad));
    }

    if (this.selectedZone !== undefined && parseInt(this.selectedZone.toString()) !== ZoneEnum.None) {
      mainList = mainList.filter(item => this.balladService.isSubzoneInZone(item.subzone, this.selectedZone));
    }

    if (this.selectedSubzone !== undefined && parseInt(this.selectedSubzone.toString()) !== SubZoneEnum.None) {
      mainList = mainList.filter(item => item.subzone === parseInt(this.selectedSubzone.toString()));
    }

    if (this.showUncompleted) {
      mainList = mainList.filter(item => !item.completed);
    }

    mainList.forEach(achievement => {
      var achievementSubsection = this.achievementsBySubZone.find(item => item[0].subzone === achievement.subzone)
      if (achievementSubsection !== undefined) {
        achievementSubsection.push(achievement);
      }
      else {
        var newSubsection = [];
        newSubsection.push(achievement);
        this.achievementsBySubZone.push(newSubsection);
      }
    });

    this.currentPage = 1;
    this.lastPage = Math.ceil(this.achievementsBySubZone.length / this.itemsPerPage);
    this.getAchievementsByPage();
  }

  jumpToFirstPage() {
    this.currentPage = 1;
    this.getAchievementsByPage();
  }

  jumpToPreviousPage() {
    if (this.currentPage > 1)
      this.currentPage -= 1;

    this.getAchievementsByPage();
  }

  jumpToNextPage() {
    if (this.currentPage < this.lastPage)
      this.currentPage += 1;

    this.getAchievementsByPage();
  }

  jumpToLastPage() {
    this.currentPage = this.lastPage;
    this.getAchievementsByPage();
  }

  setPageAmount(amount: number) {
    this.itemsPerPage = amount;
    this.currentPage = 1;
    this.lastPage = Math.ceil(this.achievementsBySubZone.length / this.itemsPerPage);    
    this.globalService.globalVar.settings.set("achievementsPerPage", this.itemsPerPage);
    this.getAchievementsByPage();
  }

  preventRightClick() {
    return false;
  }
}
