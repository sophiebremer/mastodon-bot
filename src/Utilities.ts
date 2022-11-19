/* *
 *
 *  Constants
 *
 * */

const BREAKS_REGEXP = /[\n\r]+/gu;

const SPACES_REGEXP = /\s+/gu;

const XML_REGEXP = /<!\[CDATA\[(.*?)\]\]>|<([\/!?]?[\w\-]+)(\s+\w+(?:\s*=\s*(?:'[^']*'|"[^"]*")))*\s*\/?>/gsu;

/* *
 *
 *  Functions
 *
 * */

function assembleString(
    text: string,
    addition: string,
    maxLength: number
): string {

    if (text.length + addition.length <= maxLength) {
        return text + addition;
    }

    text = text.substring(0, maxLength - addition.length - 3) + '...';

    return text + addition;
}

function attributeOrText(
    xmlNode: unknown,
    attribute?: string
): string {

    if (!xmlNode) {
        return '';
    }

    if (typeof xmlNode !== 'object') {
        return `${xmlNode}`;
    }

    const obj = xmlNode as Record<string, string>;

    return '' + (
        attribute && obj[`@_${attribute}`] ||
        obj['#text']
    );
}

function includes(
    text: string,
    searchTerms: Array<string>
): boolean {

    for (const term of searchTerms) {
        if (text.includes(term)) {
            return true;
        }
    }

    return false;
}

function removeXML(
    text: string
): string {
    return text.replace(XML_REGEXP, '$1 ');
}

function replacePatterns(
    text: string,
    replacementPatterns: Record<string, string>
): string {
    let replacement: string;

    for (const pattern in replacementPatterns) {
        replacement = replacementPatterns[pattern];

        if (
            pattern.length > 2 &&
            pattern.startsWith('/') &&
            pattern.endsWith('/')
        ) {
            text = text.replace(
                new RegExp(pattern.substring(1, pattern.length - 1), 'gsu'),
                replacement
            );
        }
        else {
            text = text
                .split(pattern)
                .join(replacement);
        }
    }

    return text;
}

function trimSpaces(
    text: string,
    removeBreaks?: boolean
) {

    if (removeBreaks) {
        text = text.replace(BREAKS_REGEXP, ' ');
    }

    return text.replace(SPACES_REGEXP, ' ').trim();
}

/* *
 *
 *  Default Export
 *
 * */

export const Utilities = {
    assembleString,
    attributeOrText,
    includes,
    removeXML,
    replacePatterns,
    trimSpaces
};

export default Utilities;
