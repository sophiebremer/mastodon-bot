/* *
 *
 *  Imports
 *
 * */
import * as FS from 'fs';
/* *
 *
 *  Namespace
 *
 * */
export var Config;
(function (Config) {
    /* *
     *
     *  Functions
     *
     * */
    function load(path) {
        const json = FS
            .readFileSync(path)
            .toString()
            .replace(/^\s*\/\/.*$/gm, '');
        const config = JSON.parse(json);
        if (!config || config instanceof Array) {
            throw new Error('Missing config with keys and values.');
        }
        return config;
    }
    Config.load = load;
    function save(path, config) {
        FS.writeFileSync(path, JSON.stringify(config, undefined, '    '));
    }
    Config.save = save;
})(Config = Config || (Config = {}));
/* *
 *
 *  Default Export
 *
 * */
export default Config;
