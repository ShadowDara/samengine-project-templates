
// Project File for the Game

import type { buildconfig } from "samengine/config";
import { new_buildconfig } from "samengine/config";

export default function defineConfig(): buildconfig {
    let config: buildconfig = new_buildconfig();
    config.title = "Pong";
    config.releaseMode.singlefile = true;
    return config;
}
