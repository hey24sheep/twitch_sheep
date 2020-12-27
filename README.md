# Twitch Sheep

"Twitch Sheep" is a partial/unpolished Twitch chat sheep.

It is not just a bot it's more than that. You control what your chat can do. Why just give them the power to control mere LED's, SFX or Alexa (using speakers). When you can do all of that from just single app and custom code your own stuff. 

**NOTE : This is not an extension on twitch. This project is not affiliated or partnered by Twitch. This is an independent project made for my own stream but could be used by anyone.**

## Why this project?
I created this for my personal channel (show some love here : [hey24sheep](https://twitch.tv/hey24sheep)). **To make a single most powerful, customizable and no limit control room for my chat.** There is no project like this online (at least for now) I didn't find any. There are either specific use case librarys like linked below or just APIs that you can implement.

Other projects to control single specific thing:-
- [Screm](https://github.com/bfroggio/screm) (SFX)
- [LumiaStream](https://lumiastream.com/lumiatwitch) (Lights)
- StreamLabs or Stream Elements (Chat Commands + Timers)

## Features / Future

- [x] OBS (scenes + scene switch + transitions) (non-destructive only)
  - !scene scenenumber example : !scene 5
  - !go : go to next scene
  - !back : go to previous scene
  - !toggleStudioMode : toggle obs studio mode
  - !transition transitionname duration : change my transition settings
- [x] Custom Commands
- [x] Custom Timers (without minimum chat line condition)
- [x] Anything (literally) (pre-requisite : know how to code, fork this repo and make http requests to your digital devices.)
  - Your code, your permissions, your features
  - like Arduino/ESP control send http requests. Add a command and send. 
  - Camera control
  - TV Control
  - Thermostat Control
  - Door control
  - Any IOT device control
- [ ] User Interface, so non-coders can use this. (PRs are welcomed)
- [ ] LED / Light Control (PRs are welcomed)
- [ ] Mouse / Keyboard (PRs are welcomed)
- [ ] Ability to do all of this using bits/dono (PRs are welcomed)
- [ ] Control your **Tesla** 😆 use this https://github.com/mseminatore/TeslaJS 
- [ ] Alternate use
  - [ ] Use Twitch as **Home Automation** 😄


## Requirements

- VSCode
- Node
- Basic coding skills
- Twitch oauth token generate using one of the following
  - https://twitchapps.com/tmi/ (recommended + easy) 
  - https://twitchtokengenerator.com/

## Setup
- Download or Clone this project locally
- Download latest VSCode
- Download latest Node
- Open this project in vscode
- Add oauth token generated to `options.ts`
- `npm install` on the project
- Run using `npm run-script start`

## Contribute / Customize
- Setup for contribute is same above
- Add more commands to `twitchsheep.ts` or if it is a proper module add it to a separate folder
- To customize, add stuff to `twitchsheep.ts`

## Improve
Pull requests are always welcome. For any issue / bug / enhancement
- please open an issue first to discuss
- And don't forget to hit the **like button** for this package ✌️

## License
MIT