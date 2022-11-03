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
    trimSpaces
};

export default Utilities;
