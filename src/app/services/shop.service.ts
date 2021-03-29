import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ShopService {

  buy = false;
  flowerChoice: string;
  amountChoice = 1;
  methodsList = ["checkPlantPrices()", "buyPlant(flowerChoice: string, amountChoice: number)"]

  constructor() { }

  buyPlant(flowerChoice: string, amountChoice: number) {
    this.buy = true;
    this.flowerChoice = flowerChoice;
    this.amountChoice = amountChoice;
  }

  checkPlantPrices() {

  }

  update() {
    
  }
}
