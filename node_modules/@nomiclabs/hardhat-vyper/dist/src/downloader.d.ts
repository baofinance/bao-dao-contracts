import { CompilerReleaseAsset, CompilersList } from "./types";
declare type DownloadFunction = (url: string, destinationFile: string) => Promise<void>;
interface CompilerDownloaderOptions {
    download?: DownloadFunction;
}
export declare class CompilerDownloader {
    private readonly _compilersDir;
    private readonly _download;
    private readonly _platform;
    compilersList: CompilersList;
    constructor(_compilersDir: string, options?: CompilerDownloaderOptions);
    get compilersListExists(): boolean;
    get downloadsDir(): string;
    get compilersListPath(): string;
    isCompilerDownloaded(version: string): boolean;
    initCompilersList({ forceDownload }?: {
        forceDownload: boolean;
    }): Promise<void>;
    getCompilerAsset(version: string): Promise<CompilerReleaseAsset>;
    getOrDownloadCompiler(version: string): Promise<string | undefined>;
    private _findVersionRelease;
    private _downloadCompilersList;
    private _getCompilersListFromDisk;
    private get _isUnix();
    private _downloadCompiler;
    private _getDownloadedFilePath;
    private _fileExists;
    private _getCurrentPlatform;
}
export {};
//# sourceMappingURL=downloader.d.ts.map