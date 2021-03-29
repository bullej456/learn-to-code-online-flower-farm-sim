import { ThrowStmt } from '@angular/compiler';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class PlantService {

  private name: string;
  private stage: number;
  private fertilized: boolean;
  private days: number;
  private stages: number[];
  private waterLevel: number;
  private waterLevelMax: number;
  methodsList = ["getStage()", "getWaterLevel()", "getName()", "getWaterLevelMax()"];

  constructor() { }

  setAll (name: string,
    stage: number,
    fertilized: boolean,
    days: number,
    stages: number[],
    waterLevel: number,
    waterLevelMax: number) {
      this.name = name;
      this.stage = stage;
      this.fertilized = fertilized;
      this.days = days;
      this.stages = stages;
      this.waterLevel = waterLevel;
      this.waterLevelMax = waterLevelMax;
    }

    getStage(): number {
      return this.stage;
    }

    getWaterLevel(): number {
      return this.waterLevel;
    }

    getName(): string {
      return this.name;
    }

    setWaterLevel(waterLevel: number) {
      this.waterLevel = waterLevel;
    }

    getWaterLevelMax(): number {
      return this.waterLevelMax;
    }

    update(){
      this.days++;
      if (this.waterLevel !== -1) this.waterLevel--;
      for (let i = 0; i < this.stages.length; i++) {
        if (this.stages[i] === this.days && this.days <= this.stages[this.stages.length - 1]) {
          this.stage++;
        }
      }
    }
}
