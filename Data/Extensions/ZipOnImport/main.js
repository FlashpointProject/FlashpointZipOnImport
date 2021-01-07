module.exports.activate = () => {

    let flashpoint = require("flashpoint-launcher");
    let child_process = require("child_process");
    let path = require("path");

    flashpoint.games.onWillImportGame(curationImportState => {
        let curationPath = curationImportState.curationPath;
        curationImportState.contentToMove = curationImportState.contentToMove.filter(([source, dest]) => {
            return path.join(curationPath, "content") !== source; // TODO: Overly reliant on matching Launcher implementation?
        });
        let bluezip = child_process.spawn("..\\Utilities\\bluezip\\bluezip", [curationPath, "-no", "..\\Games"]);
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