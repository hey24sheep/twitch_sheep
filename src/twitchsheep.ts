import * as tmi from "tmi.js";
import { options } from "./contants/options"; // options file
import { CommandHandler } from "./handlers/commandHandler";

let client: tmi.Client;
let commandHandler: CommandHandler;

init();

function init() {
    // Create a client with our options
    client = tmi.client(options);

    // Register our event handlers (defined below)
    client.on("message", onMessageHandler);
    client.on("connected", onConnectedHandler);
    client.on("action", onAnyActionHandler);

    client.connect().catch(console.error);

    commandHandler = new CommandHandler(client);
}

function onAnyActionHandler(channel: string,
    userstate: tmi.ChatUserstate,
    message: string,
    self: boolean): void {
    // Remove whitespace from chat message
    const commandName = message.trim();

    if (self || !commandHandler.isValidCommand(commandName)) {
        return;
    } // Ignore messages from the bot
}

// Called every time a message comes in
function onMessageHandler(channel: string,
    userstate: tmi.ChatUserstate,
    message: string,
    self: boolean): void {
    if (self) {
        // Ignore messages from self
        return;
    }
    console.log("Userstate : ", userstate, "Channel : ", channel);
    commandHandler.handleCommand(channel, message.trim());
}

// Called every time the bot connects to Twitch chat
function onConnectedHandler(addr: string, port: number) {
    console.log(`* Connected to ${addr}:${port}`);
}
