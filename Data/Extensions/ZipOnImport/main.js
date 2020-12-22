module.exports.activate = () => {
    let flashpoint = require("flashpoint-launcher");
    let child_process = require("child_process");

    flashpoint.games.onWillImportGame(curationImportState => {
        let curationPath = curationImportState.curationPath;
        let bluezip = child_process.spawn("..\\Utilities\\bluezip\\bluezip", [curationPath, "-o", "..\\Games"]);
        return new Promise((resolve, reject) => {
            bluezip.stdout.on("data", (data) => {
                flashpoint.log.info(`Bluezip output: ${data}`);
            });
            bluezip.stderr.on("data", (data) => {
                flashpoint.log.info(`Bluezip error: ${data}`);
            });
            bluezip.on("close", code => {
                if(code) {
                    flashpoint.log.info(`Bluezip exited with code: ${code}`);
                    reject();
                } else {
                    flashpoint.log.info(`Bluezip exited successfully.`);
                    resolve();
                }
            });
        });
    });
};