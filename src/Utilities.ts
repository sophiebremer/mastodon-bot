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

/* *
 *
 *  Default Export
 *
 * */

export const Utilities = {
    assembleString
};

export default Utilities;