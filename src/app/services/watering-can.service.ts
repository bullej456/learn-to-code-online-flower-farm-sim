import { Injectable } from '@angular/core';
import { PlantService } from './plant.service';

@Injectable({
  providedIn: 'root'
})
export class WateringCanService {

  private currentPlant: PlantService;
  private watering: boolean;
  methodsList = ["waterPlant(plant)"];

  constructor() { }

  waterPlant(plant: PlantService) {
    this.currentPlant = plant;
    this.water();
  }

  water() {
    this.watering = true;
    this.currentPlant.setWaterLevel(this.currentPlant.getWaterLevelMax());
  }

  update(){
    
  }
}
