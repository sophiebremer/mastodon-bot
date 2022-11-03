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
    includes,
    trimSpaces
};

export default Utilities;
