
// Project File for the Game

import type { buildconfig } from "samengine/config";
import { new_buildconfig } from "samengine/config";
import { newMarkdownStyle } from "samengine/config";

export default function defineConfig(): buildconfig {
    let config: buildconfig = new_buildconfig();

    config.title = "Ninjago Memory";
    config.gameauthor = "Shadowdara";
    config.version = "Version: Alpha 1";

    config.markdown_notes = [{title: "Infos", content: 
`# Ninjago Memory

This is a Ninjago Memory Game made with the Database from [Ninjagonator](https://shadowdara.github.io/r/a)!

made by Shadowdara with samengine (my own framework for webgames)!

More Infos are available [here](https://shadowdara.github.io/r/b)!

### Ideas

feel free to message me for Ideas or other Stuff on Discord at **@shadowdara**!

`, style: newMarkdownStyle()},
// {
//     title: "Info",
//     content: "Hello World",
//     style: {
//         bg: "#0f172a",
//         color: "#38bdf8"
//     }
// },
// {
//     title: "Warning",
//     content: "Danger Zone",
//     style: {
//         bg: "#3b0a0a",
//         color: "#ff6b6b"
//     }
// }
]
    
    config.dev_server_port = 3001;

    config.htmlMenu.enable_menu = true;

    config.htmlMenu.settings.push({
        id: "cards",
        title: "Cards",

        default_value: "8",

        // How many Cards
        options: [
            {
                text: "4",
                value: "4",
            },
            {
                text: "8",
                value: "8",
            },
            {
                text: "16",
                value: "16",
            },
            {
                text: "24",
                value: "24",
            },
            {
                text: "32",
                value: "32",
            },
            {
                text: "64",
                value: "64",
            },
            {
                text: "128",
                value: "128",
            },
            {
                text: "256",
                value: "256",
            },
            {
                text: "512",
                value: "512",
            },
        ],
    });

    config.htmlMenu.style.startbutton_bgcolor = "#ff8a98";
    config.htmlMenu.style.startbutton_bgc_hover = "#ffeff1";
    config.htmlMenu.style.bgcolor = "#510009";
    config.htmlMenu.style.settingsmenu_bgcolor = "#2c0005";
    config.htmlMenu.style.settingsmenu_button = "#000000";
    config.htmlMenu.style.settingsmenu_button_clicked ="#ff0000";

    config.releaseMode.singlefile = true;
    
    return config;
}
