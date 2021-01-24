import { stringify } from "querystring";
import * as nodeobsosc from "./nodeobsosc";

export class OBSHandler {
    public constructor() { }

    public handleCommand(command: string) {
        let result: any;
        switch (command) {
            case "!obsHelp":
                result = this.helpObsComands();
                break;
            default:
                result = this.handleObsCommands(command);
                break;
        }

        // if undefined/null return null
        if (!result) {
            return null;
        }

        if (typeof result === "object") {
            return stringify(result);
        }

        return result.toString();
    }

    private helpObsComands() {
        return `Some available commands are
        \r\n "!scene scenenumber example : !scene 5",\n
        "!go : go to next scene",\n
        "!back : go to previous scene",\n
        "!toggleStudioMode : toggle obs studio mode",\n
        "!transition name duration : change my transition settings"`;
    }

    private handleObsCommands(commandName: string) {
        const obsCommandName = "/" + commandName.substr(1);
        const splits = obsCommandName.split(" ");
        const result = nodeobsosc.handleObsCommands(splits);
        return result;
    }
}