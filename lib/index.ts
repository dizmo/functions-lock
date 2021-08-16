/* eslint @typescript-eslint/no-explicit-any: ["off"] */
/**
 * Returns list of provided arguments as is without any modification.
 *
 * The identify function is a no-operation and it does not modify the
 * provided list of arguments. If no or a single argument is provided
 * then `undefined` or the same argument is returned.
 *
 * @param {any[]} args
 *  object of arguments
 * @returns {any[]|undefined}
 *  array of arguments or `undefined`
 */
export function id(...args: any[]): any[]|undefined {
    if (args.length === 0) {
        return undefined;
    }
    if (args.length === 1) {
        return args[0];
    }
    return args;
}
export default id;
