import ck from "ckey";

export const options = {
  options: {
    debug: true,
  },
  connection: {
    secure: true,
    reconnect: true,
  },
  identity: {
    username: ck.TWITCH_USERNAME,
    password: ck.TWITCH_PASSWORD,
  },
  channels: [ck.TWITCH_CHANNEL],
};