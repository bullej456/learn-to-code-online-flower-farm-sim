import { Component, ElementRef, OnDestroy, OnInit, Pipe, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { interval, ObjectUnsubscribedError, Subscription } from 'rxjs';
import { PlantService } from 'src/app/services/plant.service';
import { ShopService } from 'src/app/services/shop.service';
import { WateringCanService } from 'src/app/services/watering-can.service';

interface Variable {
  name: string,
  value: any,
  icon: string
}

interface ThisObject {
  name: string,
  actualName: string,
  value: any,
}

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit, OnDestroy {

  variables: Variable[] = [];
  subs: Subscription[] = [];
  source = interval(1000);
  code: string[] = [];
  error: string = "";
  methodListFinal: string[] = [];
  methodList: string[] = ["setSpeed(speed)"];
  speed = 0.1;
  tulipPrice = 50;

  wateringCan: WateringCanService = new WateringCanService();
  plants: PlantService[] = [new PlantService, new PlantService]
  shop: ShopService = new ShopService();
  @ViewChildren("flower") plantsHTML: QueryList<ElementRef>;
  objects: ThisObject[] = [
    {name: "wateringCan", actualName: "wateringCan", value: this.wateringCan},
    {name: "plants[plant]", actualName: "plants", value: this.plants},
    {name: "this.", actualName: "***", value: "this"},
    {name: "shop", actualName: "shop", value: this.shop}
  ];

  acceptedTerms: string[] = ["for", "if", "let", "wateringCan", "plants", "console.log", "}", "shop", "setSpeed("];

  testFunction (word: string){
    console.log(word);
  }

  setAllPlants(plants: PlantService[]) {
    for (let p of plants) {
      p.setAll("tulip", 0, false, 0, [2, 5, 8], 2, 5);
    }
  }

  private buyPlant(amount, type) {
    if (this.getV("money") >= this.tulipPrice*amount) {
      for (let i = 0; i < amount; i++) {
        let tempPlant = new PlantService;
        tempPlant.setAll(type, 0, false, 0, [2, 5, 8], 2, 5);
        this.plants.push(tempPlant);
        this.setV("plants", this.plants.length);
        this.addToV("money", -this.tulipPrice);
      }
    } else {
      this.error = "you don't have enough money"
    }
  }

  setSpeed(speed) {
    if (speed > 2 || speed < 0.0499) {
      this.error = "speed can only be set between 0.05 and 2.0"
    } else {
      this.speed = speed;
    }
  }

  constructor() { 
    // this.plants = [];
    this.newV("day", 0.00, "light_mode");
    this.newV("money", 100, "local_atm");
    this.newV("plants", this.plants.length, "eco");
    this.newV("season", 1, "event");
    this.setAllPlants(this.plants);
    this.subs.push(this.source.subscribe(val => this.update()));
  }

  ngOnDestroy(): void {
    for (let s of this.subs){
      s.unsubscribe();
    }
  }

  ngOnInit(): void {
    this.updateMethods(this.objects[0].value);
  }

  updateMethods(object: any) {
    if (object === "this") {
      this.methodListFinal = this.methodList;
    }
    else if (Array.isArray(object)) {
      this.methodListFinal = object[0].methodsList;
    } else {
      this.methodListFinal = object.methodsList;
    }
  }

  triggerFunction(event, value: string) {
    if (event.ctrlKey && event.key === 'Enter') {
      this.submitCode(value);
    } 
  }

  submitCode(event: string) {
    this.code = [];
    let numberOfLineBreaks = (event.match(/\n/g)||[]).length;
    let characterCount = event.length + numberOfLineBreaks;
    if (numberOfLineBreaks > 0) {
      this.code = event.split(/\n/g);
    } else {
      this.code.push(event);
    }
    this.code = this.code.filter(x => x !== "");
    let counter = 0;
    for (let i of this.code) {
      for (let o of this.objects) {
        if (i.includes(o.actualName)) {
          let newString = "this." + o.actualName;
          this.code[counter] = i.replace(o.actualName, newString);
          i = this.code[counter];
        }
      }
      counter++;
    }
    console.log(this.code);
    this.compileCode();
  }

  compileCode() {
    this.error = "";
    let status;
    for (let i of this.code) {
      if (this.acceptedTerms.find(x => i.includes(x))) {
        if (i.includes("{") && i.includes("}")) {
          status = 0;
          this.error = "cant open and close brackets on the same line";
        }
        if ((i.startsWith("if") || i.startsWith("for")) && !i.includes("{")) {
          status = 0;
          this.error = "if using if or for you must include { on the same line";
        }
      } else {
        status = 0;
        this.error = "all lines must include an acceptable method, object, or empty space"
      }
    }
    if (status !== 0) {
      eval(this.code.join(""));
    } else {

    }
  }

  update() {
    this.addToV("day", this.speed);
    if (this.getV("day") % 91 === 0) {
      if (this.getV("season") === 4) {
        this.setV("season", 1);
      } else {
        this.addToV("season", 1);
      }
    }
    this.setPlantColours();
    if (this.shop.buy) {
      this.buyPlant(this.shop.amountChoice, this.shop.flowerChoice);
      this.shop.buy = false;
    }
    if (this.getV("day") % 1 === 0) {
      for (let o of this.objects) {
        if (o.value === "this") continue;
        if (Array.isArray(o.value)) {
          for (let so of o.value) {
            so.update();
          }
        } else {
          o.value.update();
        }
      }
    }
  }

  setPlantColours() {
    if (this.plantsHTML !== undefined) {
      for (let i = 0; i < this.plants.length; i++) {
        switch (this.plants[i].getName()) {
          case "tulip":
            this.plantsHTML.toArray()[i].nativeElement.children[0].style.color = "red";
            break;
          default:
            this.plantsHTML.toArray()[i].nativeElement.children[0].style.color = "black";
        }
      }
    }
  }

  newV(name, value, icon){
    this.variables.push({name: name, value: value, icon: icon});
  }

  setV(name, value) {
    let v = this.variables.find(x => x.name === name);
    v.value = value;
  }

  getV(name) {
    let v = this.variables.find(x => x.name === name);
    return v.value;
  }

  addToV(name, value) {
    let v = this.variables.find(x => x.name === name);
    v.value += value;
    v.value = Math.round(v.value * 100) / 100;
  }

}
