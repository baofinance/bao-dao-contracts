export declare type VyperUserConfig = string | VyperConfig | MultiVyperConfig;
export interface VyperConfig {
    version: string;
}
export interface MultiVyperConfig {
    compilers: VyperConfig[];
}
export declare enum CompilerPlatform {
    LINUX = "linux",
    WINDOWS = "windows",
    MACOS = "darwin"
}
export interface CompilerReleaseAsset {
    name: string;
    browser_download_url: string;
}
export interface CompilerRelease {
    assets: CompilerReleaseAsset[];
    tag_name: string;
}
export declare type CompilersList = CompilerRelease[];
export interface VyperBuild {
    version: string;
    compilerPath: string;
}
/**
 * A Vyper file.
 */
export interface ResolvedFile {
    sourceName: string;
    absolutePath: string;
    content: FileContent;
    lastModificationDate: Date;
    contentHash: string;
}
/**
 * The content of a Vyper file. Including its raw content, its imports
 * and version pragma directives.
 */
export interface FileContent {
    rawContent: string;
    versionPragma: string;
}
export interface VyperOutput {
    version: string;
    [sourceName: `${string}.vy`]: ContractOutput;
    [sourceName: `${string}.v.py`]: ContractOutput;
}
export interface ContractOutput {
    bytecode: string;
    bytecode_runtime: string;
    abi: string[];
    layout: any;
    source_map: any;
    method_identifiers: {
        [signature: string]: string;
    };
    userdoc: any;
    devdoc: any;
}
//# sourceMappingURL=types.d.ts.map