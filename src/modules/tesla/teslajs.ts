import ck from "ckey";
import { stringify } from "querystring";
import * as tjs from "teslajs";
import { teslaCommands } from "./tesla_commands";

export class TeslaHandler {
  private lastCommandTime: Date;
  private tokenResponse: tjs.TokenResponse;
  public constructor() {
    this.login();
  }

  public async handleCommand(command: string) {
    command = command.substr(1);
    const splits = command.split(" ");
    let carIndex: number;
    if (splits[1]) {
      carIndex = parseInt(splits[1], 10);
    }
    let result: any;
    const timeoutVal = this.isTimeout();
    if (timeoutVal && splits[0] !== "tesla") {
      return timeoutVal;
    }
    switch (splits[0]) {
      case "tesla":
        result = await this.teslaHelp();
        break;
      case "vehiclestate":
        result = await this.vehicleState(carIndex);
        break;
      case "honkhorn":
        result = await this.honkHorn(carIndex);
        break;
      case "chargestate":
        result = await this.chargeState(carIndex);
        break;
      case "startcharge":
        result = await this.startCharge(carIndex);
        break;
      case "stopcharge":
        result = await this.stopCharge(carIndex);
        break;
      case "flashlights":
        result = await this.flashLights(carIndex);
        break;
      default: break;
    }

    // if undefined/null return null
    if (!result) {
      return null;
    }

    if (splits[0] !== "tesla") {
      // valid command set timeout
      this.lastCommandTime = new Date();
    }

    if (typeof result === "object") {
      return stringify(result);
    }

    return result.toString();
  }

  private isTimeout() {
    if (this.lastCommandTime) {
      const curr = new Date();

      // 5 min
      const FIVE_MIN = 5 * 60 * 1000;

      if ((curr.valueOf() - this.lastCommandTime.valueOf()) < FIVE_MIN) {
        return "You need to wait for 5 mins before your next command";
      }
    }
    return null;
  }

  private async teslaHelp() {
    const command1 = teslaCommands[Math.floor(Math.random() * teslaCommands.length)];
    const command2 = teslaCommands[Math.floor(Math.random() * teslaCommands.length)];
    const command3 = teslaCommands[Math.floor(Math.random() * teslaCommands.length)];
    return "Control my Tesla, try \n"
      + command1
      + ",\r\n"
      + command2
      + ",\r\n"
      + command3
      + "\n";
  }

  private async vehicleState(carIdx: number) {
    const options = await this.createOptions(carIdx);
    const result = await tjs.vehicleStateAsync(options);
    const key = "odometer";
    if (result && result[key]) {
      const miles = this.addCommas(Math.round(result[key]).toString());

      const km = this.addCommas(Math.round(result[key] * 1.609344).toString());
      return "Odometer : " + miles + ", " + km;
    }
    return result ? result : null;
  }

  private async honkHorn(carIdx: number) {
    const options = await this.createOptions(carIdx);
    const result = await tjs.honkHornAsync(options);
    return result.result ? "Honk!! Honk!!" : "Oops!! Try later";
  }

  private async chargeState(carIdx: number) {
    const options = await this.createOptions(carIdx);
    const result = await tjs.chargeStateAsync(options);
    return result;
  }

  private async startCharge(carIdx: number) {
    const options = await this.createOptions(carIdx);
    const result = await tjs.startChargeAsync(options);
    return result.result ? "Charging started" : "Oops!! Try later";
  }

  private async stopCharge(carIdx: number) {
    const options = await this.createOptions(carIdx);
    const result = await tjs.stopChargeAsync(options);
    return result.result ? "Charging stopped" : "Oops!! Try later";
  }

  private async flashLights(carIdx: number) {
    const options = await this.createOptions(carIdx);
    const result = await tjs.flashLightsAsync(options);
    return result.result ? "Flashing lights" : "Oops!! Try later";
  }

  // private helpers

  private async login() {
    const email = ck.TESLA_EMAIL;
    const password = ck.TESLA_PASS;

    if (!email || !password) {
      console.log("Login failed, invalid email and pass");
      return null;
    }

    if (!this.tokenResponse) {
      const result = await tjs.loginAsync(email, password);
      this.tokenResponse = result;
    }
    return this.tokenResponse;
  }

  private async vehicle(carIdx?: number) {
    if (!this.tokenResponse) {
      this.login();
    }
    // will return the first car always
    const options: tjs.optionsType = {
      authToken: this.tokenResponse.authToken,
      vehicleID: null,
      carIndex: carIdx,
    };
    const result = await tjs.vehicleAsync(options);
    console.log(result);
    return result;
  }

  private async createOptions(carIdx: number): Promise<tjs.optionsType> {
    const vehicle = await this.vehicle(carIdx);
    const options: tjs.optionsType = {
      authToken: this.tokenResponse.authToken,
      vehicleID: vehicle.id,
      carIndex: carIdx,
    };
    return options;
  }

  private addCommas(str: string) {
    str += "";
    const x = str.split(".");
    let x1 = x[0];
    const x2 = x.length > 1 ? "." + x[1] : "";
    const rgx = /(\d+)(\d{3})/;

    while (rgx.test(x1)) {
      x1 = x1.replace(rgx, "$1" + "," + "$2");
    }

    return x1 + x2;
  }
}