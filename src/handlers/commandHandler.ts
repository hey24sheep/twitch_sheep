import * as tmi from "tmi.js";
import { OBSHandler } from "../modules/obs/obsHandler";
import { TeslaHandler } from "../modules/tesla/teslajs";

export class CommandHandler {
    public twitchClient: tmi.Client;
    public obsHandler: OBSHandler;
    public teslaHandler: TeslaHandler;

    public constructor(private client: tmi.Client) {
        this.obsHandler = new OBSHandler(this.client);
        this.teslaHandler = new TeslaHandler();
    }

    public isValidCommand(command: string) {
        return command
            && command.trim()
            && command.startsWith("!");
    }

    public handleCommand(channel: string, command: string) {
        try {
            switch (command) {
                case "!dice":
                    this.rollDice(channel, command);
                    break;
                default:
                    this.handleOtherCommands(channel, command);
                    break;
            }
        } catch (e) {
            console.log(e);
        }
    }

    private rollDice(channel: string, commandName: string) {
        const availableDice = [4, 6, 8, 10, 12];
        const sides = availableDice[Math.floor(Math.random() * availableDice.length)];
        const num = Math.floor(Math.random() * sides) + 1;
        this.client.say(channel, `You rolled a ${num} using D${sides}`);
        console.log(`* Executed ${commandName} command`);
    }

    private handleOtherCommands(channel: string, commandName: string) {
        this.obsHandler.handleCommand(commandName, channel);

        this.teslaHandler.handleCommand(commandName).then((result) => {
            if (result) {
                this.client.say(channel, `Tesla Response : ${result}`);
            } else {
                this.client.say(channel, `No data available`);
            }
        }, (err) => {
            console.log(err);
        });
    }
}