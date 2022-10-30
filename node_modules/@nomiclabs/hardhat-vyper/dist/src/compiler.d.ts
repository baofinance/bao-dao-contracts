export declare class Compiler {
    private _pathToVyper;
    constructor(_pathToVyper: string);
    /**
     *
     * @param inputPaths array of paths to contracts to be compiled
     */
    compile(inputPaths: string[]): Promise<any>;
}
//# sourceMappingURL=compiler.d.ts.map