import * as tmi from "tmi.js";
import * as nodeobsosc from "./nodeobsosc";

export class OBSHandler {
    public constructor(private client: tmi.Client) { }

    public helpObsComands(channel: string, commandName: string): void {
        this.client.say(channel, "Some available commands are");
        this.client.say(channel, `"!scene scenenumber example : !scene 5",\n
        "!go : go to next scene",\n
        "!back : go to previous scene",\n
        "!toggleStudioMode : toggle obs studio mode",\n
        "!transition name duration : change my transition settings"`);
    }

    public handleObsCommands(channel: string, commandName: string) {
        const obsCommandName = "/" + commandName.substr(1);
        const splits = obsCommandName.split(" ");
        nodeobsosc.handleObsCommands(splits);
        return;
    }
}