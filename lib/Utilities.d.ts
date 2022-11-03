declare function assembleString(text: string, addition: string, maxLength: number): string;
declare function includes(text: string, searchTerms: Array<string>): boolean;
declare function trimSpaces(text: string, removeBreaks?: boolean): string;
export declare const Utilities: {
    assembleString: typeof assembleString;
    includes: typeof includes;
    trimSpaces: typeof trimSpaces;
};
export default Utilities;
