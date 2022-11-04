declare function assembleString(text: string, addition: string, maxLength: number): string;
declare function includes(text: string, searchTerms: Array<string>): boolean;
declare function replacePatterns(text: string, replacementPatterns: Record<string, string>): string;
declare function trimSpaces(text: string, removeBreaks?: boolean): string;
export declare const Utilities: {
    assembleString: typeof assembleString;
    includes: typeof includes;
    replacePatterns: typeof replacePatterns;
    trimSpaces: typeof trimSpaces;
};
export default Utilities;
