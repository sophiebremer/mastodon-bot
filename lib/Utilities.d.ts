declare function assembleString(text: string, addition: string, maxLength: number): string;
declare function attributeOrText(xmlNode: unknown, attribute?: string): string;
declare function includes(text: string, searchTerms: Array<string>): boolean;
declare function removeXML(text: string): string;
declare function replacePatterns(text: string, replacementPatterns: Record<string, string>): string;
declare function trimSpaces(text: string, removeBreaks?: boolean): string;
export declare const Utilities: {
    assembleString: typeof assembleString;
    attributeOrText: typeof attributeOrText;
    includes: typeof includes;
    removeXML: typeof removeXML;
    replacePatterns: typeof replacePatterns;
    trimSpaces: typeof trimSpaces;
};
export default Utilities;
