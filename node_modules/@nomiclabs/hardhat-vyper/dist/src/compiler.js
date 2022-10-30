"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Compiler = void 0;
const child_process_1 = require("child_process");
class Compiler {
    constructor(_pathToVyper) {
        this._pathToVyper = _pathToVyper;
    }
    /**
     *
     * @param inputPaths array of paths to contracts to be compiled
     */
    async compile(inputPaths) {
        const output = await new Promise((resolve, reject) => {
            const process = (0, child_process_1.exec)(`${this._pathToVyper} -f combined_json ${inputPaths.join(" ")}`, {
                maxBuffer: 1024 * 1024 * 500,
            }, (err, stdout) => {
                if (err !== null) {
                    return reject(err);
                }
                resolve(stdout);
            });
            process.stdin.end();
        });
        return JSON.parse(output);
    }
}
exports.Compiler = Compiler;
//# sourceMappingURL=compiler.js.map