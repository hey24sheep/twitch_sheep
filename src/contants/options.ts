import dotenv from "dotenv";

// initialize configuration
dotenv.config();

export const options = {
  options: {
    debug: true,
  },
  connection: {
    secure: true,
    reconnect: true,
  },
  identity: {
    username: process.env.TWITCH_USERNAME,
    password: process.env.TWITCH_PASSWORD,
    clientId: process.env.TWITCH_CLIENTID,
    clientSecret: process.env.TWITCH_CLIENTSECRET,
    appName: process.env.TWITCHAPPNAME,
    redirectUrl: process.env.TWITCHREDIRECTURL,
  },
  channels: [process.env.TWITCH_CHANNEL],
};
