import { ZoneEnum } from "../enums/zone-enum.model";
import { SubZone } from "./sub-zone.model";

export class Zone {
    zoneName: string;
    type: ZoneEnum;
    isSelected: boolean;
    subzones: SubZone[];

    constructor() {
        this.subzones = [];
    }
}