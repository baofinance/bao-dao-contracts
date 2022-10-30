import type { ProjectPathsConfig } from "hardhat/types/config";
import type { VyperConfig } from "./types";
export interface CacheEntry {
    lastModificationDate: number;
    contentHash: string;
    sourceName: string;
    vyperConfig: VyperConfig;
    versionPragma: string;
    artifacts: string[];
}
export interface Cache {
    _format: string;
    files: Record<string, CacheEntry>;
}
export declare class VyperFilesCache {
    private _cache;
    constructor(_cache: Cache);
    static createEmpty(): VyperFilesCache;
    static readFromFile(vyperFilesCachePath: string): Promise<VyperFilesCache>;
    removeNonExistingFiles(): Promise<void>;
    writeToFile(vyperFilesCachePath: string): Promise<void>;
    addFile(absolutePath: string, entry: CacheEntry): void;
    getEntries(): CacheEntry[];
    getEntry(file: string): CacheEntry | undefined;
    removeEntry(file: string): void;
    hasFileChanged(absolutePath: string, contentHash: string, vyperConfig?: VyperConfig): boolean;
}
export declare function getVyperFilesCachePath(paths: ProjectPathsConfig): string;
//# sourceMappingURL=cache.d.ts.map