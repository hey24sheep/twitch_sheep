//NODE-OBSosc
//by Joe Shea (https://github.com/jshea2/Node-OBSosc)
/* tslint:disable */

//Get Modules and Setup
const OBSWebSocket = require("obs-websocket-js");
const { Client, Server } = require("node-osc");

//INPUT YOUR STUFF HERE:
//OBS Config
const obsIp = "127.0.0.1";
const obsPort = 4444;
const obsPassword = "";
//OSC Server (IN) Config
const oscServerIp = "127.0.0.1";
const oscPortIn = 3333;
//OSC Client (OUT) Config
const oscClientIp = "127.0.0.1";
const oscPortOut = 53000;
const oscOutPrefix = "/cue/";
const oscOutSuffix = "/start";

export const obs = new OBSWebSocket();

//Connect to OSC
export const oscClient = new Client(oscClientIp, oscPortOut);
export const oscServer = new Server(oscPortIn, oscServerIp);

//Connect to OBS
obs.connect({
    address: obsIp + ":" + obsPort,
    password: obsPassword
})
    .then(() => {
        console.log(`\nConnected & authenticated to OBS Websockets...\nIP: ${obsIp}\nPort: ` + obsPort);

        return obs.send("GetSceneList");                                    //Send a Get Scene List Promise
    })
    .then(data => {
        console.log(`\n${data.scenes.length} Available Scenes.` + "\n");    //Log Total Scenes
        console.log(data.scenes.forEach((thing, index) => {
            console.log((index + 1) + " - " + thing.name);                  //Log List of Available Scenes with OSC Index
        }));

        console.log("-- Use /scene[index] For OSC Control --\n\n");      //Log OSC Scene Syntax
    })
    .catch(err => {
        console.log(err);                                                   //Log Catch Errors
        console.log("-!- Make Sure OBS is Running and Websocket IP/Port/Password are Correct -!-");
    });

//Listen and Log When New Scene is Activated
obs.on("SwitchScenes", data => {
    console.log(`New Active Scene: ${data.sceneName}`);
});



// Handler to Avoid Uncaught Exceptions.
obs.on("error", err => {
    console.error("socket error:", err);
});

//OSC Server (IN)
oscServer.on("listening", () => {
    console.log("\n\n" + "OSC Server is listening on...\n IP: " + oscServerIp + "\n Port: " + oscPortIn);
    console.log("\nOSC Server is sending back on...\n IP: " + oscClientIp + "\n Port: " + oscPortOut);
})

//OSC -> OBS
export function handleObsCommands(msg: any[]) {
    console.log("OBS Command Rec", msg);
    //Trigger Scene by Index Number
    if (msg.length > 0
        && msg[0] === "/scene") {
        console.log("number thing works")                                     //When OSC Recieves a /scene do...
        var sceneNum = parseInt(msg[1]);
        var oscMessage = sceneNum - 1;                                          //Convert Index Number to Start at 1
        var oscMessage = Math.floor(oscMessage);                              //Converts Any Float Argument to Lowest Integer
        return obs.send("GetSceneList").then(data => {                          //Request Scene List Array
            console.log(`OSC IN: ${msg[0]} ${oscMessage + 1} (${data.scenes[oscMessage].name})`)
            obs.send("SetCurrentScene", {
                "scene-name": data.scenes[oscMessage].name                      //Set to Scene from OSC
            })
        }).catch(() => {
            console.log("Error: Out Of / scene Range");                    //Catch Error
        });
    }

    //Trigger Scene if Argument is a String and Contains a Space
    else if (msg[0] === "/scene" && msg.length > 2) {                      //When OSC Recieves a /scene do...                                       
        var firstIndex = msg.shift();                                       //Removes First Index from "msg" and Stores it to Another Variable
        let oscMultiArg = msg.join(" ")                                         //Converts "msg" to a String with spaces
        return obs.send("GetSceneList").then(data => {                        //Request Scene List Array
            console.log(`OSC IN: ${firstIndex} ${oscMultiArg}`)
            obs.send("SetCurrentScene", {
                "scene-name": oscMultiArg                                     //Set to Scene from OSC
            }).catch(() => {
                console.log(`Error: There is no Scene "${oscMultiArg}" in OBS. Double check case sensitivity.`);
            })
        }).catch((err) => {
            console.log(err)                                                            //Catch Error
        });
    }

    //Trigger Scene if Argument is a String
    else if (msg[0] === "/scene" && typeof msg[1] === "string") {          //When OSC Recieves a /scene do...
        let oscMessage = msg[1];
        return obs.send("GetSceneList").then(data => {                         //Request Scene List Array
            console.log(`OSC IN: ${msg[0]} ${oscMessage}`)
            obs.send("SetCurrentScene", {
                "scene-name": oscMessage                                       //Set to Scene from OSC
            }).catch(() => {
                console.log(`Error: There is no Scene "${msg[1]}" in OBS. Double check case sensitivity.`);
            })
        }).catch((err) => {
            console.log(err)                                                            //Catch Error
        });
    }

    //Trigger Scene if Scene Name is in the OSC String
    else if (msg[0].includes("/scene") && msg.length === 1) {
        var msgArray = msg[0].split("/")
        msgArray.shift()
        msgArray.shift()
        obs.send("SetCurrentScene", {
            "scene-name": msgArray[0].split("_").join(" ").toString(),                                          //Set to Scene from OSC
        }).catch(() => {
            console.log(`Error: There is no Scene "${msgArray}" in OBS. Double check case sensitivity.`);
        }).catch((err) => {
            console.log(err)                                                //Catch Error
        });

    }

    //Triggers to "GO" to the Next Scene
    else if (msg[0] === "/go") {                                          //When OSC Recieves a /go do...

        return obs.send("GetSceneList").then(data => {                      //Request Scene List Array

            var cleanArray = []
            var rawSceneList = data                                         //Assign Get Scene List "data" to variable 
            data.scenes.forEach(element => { cleanArray.push(element.name) }); //Converting Scene List To a Cleaner(Less Nested) Array (Getting the Desired Nested Values) 
            return obs.send("GetCurrentScene").then(data => {               //Request Current Scene Name
                var currentSceneIndex = cleanArray.indexOf(data.name)       //Get the Index of the Current Scene Referenced from the Clean Array
                if (currentSceneIndex + 1 >= rawSceneList.scenes.length) {   //When the Current Scene is More than the Total Scenes...
                    obs.send("SetCurrentScene", {
                        "scene-name": rawSceneList.scenes[0].name           //Set the Scene to First Scene
                    })
                } else {
                    obs.send("SetCurrentScene", {
                        "scene-name": rawSceneList.scenes[currentSceneIndex + 1].name  //Set Scene to Next Scene (Referenced from the Current Scene and Array)
                    })
                }
            }).catch(() => {
                console.log("Error: Invalid OSC Message");                              //Catch Error
            });
        })
    }

    //Triggers Previous Scene to go "BACK"
    else if (msg[0] === "/back") {                                                 //Same Concept as Above Except Going to the Previous Scene

        return obs.send("GetSceneList").then(data => {

            var cleanArray = []
            var rawSceneList = data
            data.scenes.forEach(element => { cleanArray.push(element.name) });
            return obs.send("GetCurrentScene").then(data => {
                var currentSceneIndex = cleanArray.indexOf(data.name)
                if (currentSceneIndex - 1 <= -1) {
                    obs.send("SetCurrentScene", {
                        "scene-name": rawSceneList.scenes[rawSceneList.scenes.length - 1].name
                    })
                } else {
                    obs.send("SetCurrentScene", {
                        "scene-name": rawSceneList.scenes[currentSceneIndex - 1].name
                    })
                }
            }).catch(() => {
                console.log("Error: Invalid OSC Message");
            });
        })


    }
    //Triggers Toggle Studio Mode
    else if (msg[0] === "/toggleStudioMode") {
        obs.send("ToggleStudioMode").catch((err) => {
            console.log(err)
        })
    }

    //Set Transition Type and Duration
    else if (msg[0] === "/transition") {
        if (msg[1] === "Cut" || msg[1] === "Stinger") {
            console.log(`OSC IN: ${msg[0]} ${msg[1]}`)
            obs.send("SetCurrentTransition", {
                "transition-name": msg[1].toString()
            }).catch(() => {
                console.log("Whoops")
            })
        } else if (msg[1] === "Fade" || msg[1] === "Move" || msg[1] === "Luma_Wipe" || msg[1] === "Fade_to_Color" || msg[1] === "Slide" || msg[1] === "Swipe") {
            if (msg[2] === undefined) {
                obs.send("GetTransitionDuration").then(data => {
                    var tranisionTime = data["transition-duration"]
                    console.log(`OSC IN: ${msg[0]} ${msg[1]}\nCurrent Duration: ${tranisionTime}`)
                })
            } else {
                console.log(`OSC IN: ${msg[0]} ${msg[1]} ${msg[2]}`)
            }
            var makeSpace = msg[1].split("_").join(" ");
            obs.send("SetCurrentTransition", {
                "transition-name": makeSpace.toString()
            })
            if (msg.length === 3) {
                obs.send("SetTransitionDuration", {
                    "duration": msg[2]
                })
            }
        } else {
            console.log("ERROR: Invalid Transition Name. It's Case Sensitive.Or if it contains SPACES use '_' instead")
        }

    }

    //Log Error
    else {
        console.log("Error: Invalid OSC command. Please refer to Node OBSosc on Github for Command List")
    }
}

//OBS -> OSC Client (OUT)
obs.on("SwitchScenes", data => {
    oscClient.send(`${oscOutPrefix}${data.sceneName}${oscOutSuffix}`, (err) => {  //Takes OBS Scene Name and Sends it Out as OSC String (Along with Prefix and Suffix)
        if (err) console.error(err);
    });
})