import type { FileContent, ResolvedFile as IResolvedFile } from "./types";
import { Parser } from "./parser";
export declare class ResolvedFile implements IResolvedFile {
    readonly sourceName: string;
    readonly absolutePath: string;
    readonly content: FileContent;
    readonly contentHash: string;
    readonly lastModificationDate: Date;
    constructor(sourceName: string, absolutePath: string, content: FileContent, contentHash: string, lastModificationDate: Date);
}
export declare class Resolver {
    private readonly _projectRoot;
    private readonly _parser;
    private readonly _readFile;
    constructor(_projectRoot: string, _parser: Parser, _readFile: (absolutePath: string) => Promise<string>);
    resolveSourceName: (sourceName: string) => Promise<ResolvedFile>;
    private _resolveLocalSourceName;
    private _resolveFile;
    private _validateSourceNameExistenceAndCasing;
}
//# sourceMappingURL=resolver.d.ts.map