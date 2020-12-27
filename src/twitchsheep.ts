import * as tmi from "tmi.js";
import { options } from "./contants/options"; // options file
import { OBSHandler } from "./module/obs/obsHandler";

let client: tmi.Client;
let obsHandler: OBSHandler;

init();

function init() {
    // Create a client with our options
    client = tmi.client(options);

    // Register our event handlers (defined below)
    client.on("message", onMessageHandler);
    client.on("connected", onConnectedHandler);
    client.on("action", onAnyActionHandler);

    // Connect to Twitch:
    client.connect().then(() => {
        setInterval(() => {
            client.say("#hey24sheep", "<3 Hope, you are having great time. Check @hey24sheep on socials");
        }, 30 * 60000);
    });

    obsHandler = new OBSHandler(client);
}

function onAnyActionHandler(channel: string,
    userstate: tmi.ChatUserstate,
    message: string,
    self: boolean): void {
    // Remove whitespace from chat message
    const commandName = message.trim();

    if (self || !commandName.startsWith("!")) { return; } // Ignore messages from the bot
}

// Called every time a message comes in
function onMessageHandler(channel: string,
    userstate: tmi.ChatUserstate,
    message: string,
    self: boolean): void {
    // Remove whitespace from chat message
    const commandName = message.trim();

    if (self
        || !commandName.startsWith("!")) {
        return;
    } // Ignore messages from the bot

    console.log("Userstate : ", userstate);
    console.log("Channel : ", channel);

    switch (commandName) {
        case "!dice":
            rollDice(channel, commandName);
            break;
        case "!obsHelp":
            obsHandler.helpObsComands(channel, commandName);
            break;
        case "!cam":
            handleCamCommands(channel, commandName);
            break;
        default:
            obsHandler.handleObsCommands(channel, commandName);
            handleUnknownCommand(channel, commandName);
            break;
    }
}

// function called when the "dice" command is issued
function rollDice(channel: string, commandName: string) {
    const sides = 6;
    const num = Math.floor(Math.random() * sides) + 1;
    client.say(channel, `You rolled a ${num}`);
    console.log(`* Executed ${commandName} command`);
}

// Called every time the bot connects to Twitch chat
function onConnectedHandler(addr: string, port: number) {
    console.log(`* Connected to ${addr}:${port}`);
}

function handleCamCommands(channel: string, commandName: string) {
    // TODO : add obs scene switch for cam or add camera pan/zoom/night mode if supported
    client.say(channel, "Oops!! Not implemented yet");
}

function handleUnknownCommand(channel: string, commandName: string) {
    console.log(`* Unknown command ${commandName}`);
}