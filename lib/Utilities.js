/* *
 *
 *  Constants
 *
 * */
const BREAKS_REGEXP = /[\n\r]+/gu;
const SPACES_REGEXP = /\s+/gu;
/* *
 *
 *  Functions
 *
 * */
function assembleString(text, addition, maxLength) {
    if (text.length + addition.length <= maxLength) {
        return text + addition;
    }
    text = text.substring(0, maxLength - addition.length - 3) + '...';
    return text + addition;
}
function includes(text, searchTerms) {
    for (const term of searchTerms) {
        if (text.includes(term)) {
            return true;
        }
    }
    return false;
}
function replacePatterns(text, replacementPatterns) {
    let replacement;
    for (const pattern in replacementPatterns) {
        replacement = replacementPatterns[pattern];
        if (pattern.length > 2 &&
            pattern.startsWith('/') &&
            pattern.endsWith('/')) {
            text = text.replace(new RegExp(pattern.substring(1, pattern.length - 1), 'gsu'), replacement);
        }
        else {
            text = text
                .split(pattern)
                .join(replacement);
        }
    }
    return text;
}
function trimSpaces(text, removeBreaks) {
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
    includes,
    replacePatterns,
    trimSpaces
};
export default Utilities;
