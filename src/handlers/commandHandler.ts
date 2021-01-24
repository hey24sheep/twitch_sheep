import * as tmi from "tmi.js";
import { OBSHandler } from "../modules/obs/obsHandler";
import { TeslaHandler } from "../modules/tesla/teslajs";

export class CommandHandler {
    public twitchClient: tmi.Client;
    public obsHandler: OBSHandler;
    public teslaHandler: TeslaHandler;

    public constructor(private client: tmi.Client) {
        this.obsHandler = new OBSHandler();
        this.teslaHandler = new TeslaHandler();
    }

    public isValidCommand(command: string) {
        return command.startsWith("!");
    }

    public handleCommand(channel: string, command: string) {
        try {
            if (!this.isValidCommand(command)) {
                return;
            }
            this.rollDice(channel, command);
            this.handleOtherCommands(channel, command);
        } catch (e) {
            console.log(e);
        }
    }

    private rollDice(channel: string, command: string) {
        if (command !== "!dice") {
            return;
        }
        const availableDice = [4, 6, 8, 10, 12];
        const sides = availableDice[Math.floor(Math.random() * availableDice.length)];
        const num = Math.floor(Math.random() * sides) + 1;
        this.client.say(channel, `You rolled a ${num} using D${sides}`);
        console.log(`* Executed ${command} command`);
    }

    private handleOtherCommands(channel: string, command: string) {
        if (command === "!dice") {
            return;
        }

        const obsResult = this.obsHandler.handleCommand(command);
        if (obsResult) {
            this.client.say(channel, obsResult);
            return;
        }

        this.teslaHandler.handleCommand(command).then((result) => {
            if (result) {
                this.client.say(channel, `${result}`);
                return;
            }
        }, (err) => {
            console.log(err);
        });
    }

}