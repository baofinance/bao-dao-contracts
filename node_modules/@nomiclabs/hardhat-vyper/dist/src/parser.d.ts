import { VyperFilesCache } from "./cache";
interface ParsedData {
    versionPragma: string;
}
export declare class Parser {
    private _vyperFilesCache;
    private _cache;
    constructor(_vyperFilesCache?: VyperFilesCache);
    parse(fileContent: string, absolutePath: string, contentHash: string): ParsedData;
    private _getFromCache;
}
export {};
//# sourceMappingURL=parser.d.ts.map