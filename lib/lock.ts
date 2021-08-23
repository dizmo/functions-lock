/* eslint @typescript-eslint/no-explicit-any: [off] */
import { random } from '@dizmo/functions-random';
export type Global = Record<string, any>;
declare const global: Global;

/**
 * Composite structure to manage identities
 */
export interface MasterId {
    /** timestamp regarding when the identity has been acquired */
    now: string;
    /** ephemeral identifier (stored in the `global` object) */
    eid: string;
    /** session identifier (stored by default in `localStorage`) */
    sid: string | null;
}
/**
 * Wrapper structure to manage identities
 */
export interface MasterIdWrapped {
    /** master identifier */
    value: MasterId | null;
    /** random number */
    nonce: string;
}
/**
 * Interface for the storage layer
 */
export interface Storage {
    /** setter function returning a promise for the provided value or `null` */
    set: <T>(key: string, value: T | null) => Promise<T | null>;
    /** getter function returning a promise for the desired value or `null` */
    get: <T>(key: string) => Promise<T | null>;
    /** optional delete function to remove the desired value */
    delete?: (key: string) => Promise<void>;
}
/**
 * Class to acquire and release locks: Each instance manages a separate lock,
 * unless they have the same (optional) `name`. Also, an (optional) `clear` flag
 * can be used to clear an existing lock (by having its corresponding internal
 * identity discarded).
 *
 * Further, an optional storage layer can be specified to persist the internal
 * (composite) identity and state of the lock. By default, it is used to handle
 * the session component of a master identitiy, where it requires the existence
 * of `localStorage` (otherwise the `global` object is used).
 */
export class Lock {
    /**
     * Instantiates a new lock object to acquire and release locks.
     *
     * @param name
     *  optional name to access the same lock across multiple instances
     * @param clear
     *  optional flag to suspend an (existing) identity
     * @param storage
     *  optional storage layer to handle persistence
     */
    public constructor(
        name?: string | null, clear?: boolean, storage?: Storage
    ) {
        function compare<T>(lhs: T, rhs: T) {
            return JSON.stringify(lhs) === JSON.stringify(rhs);
        }
        this._storage = storage ?? {
            set: async <T>(key: string, value: T | null) => {
                if (typeof localStorage !== 'undefined') {
                    localStorage.setItem(key, JSON.stringify(value));
                } else {
                    global[key] = JSON.stringify(value);
                }
                const result = await this.storage.get<T>(key);
                return compare(result, value) ? value : null;
            },
            get: async <T>(key: string) => {
                const result = typeof localStorage !== 'undefined'
                    ? localStorage.getItem(key) : global[key];
                if (typeof result === 'string') try {
                    return JSON.parse(result) as T;
                } catch (ex) {
                    return result as any;
                }
                return null;
            },
            delete: async (key: string) => {
                if (typeof localStorage !== 'undefined') {
                    localStorage.removeItem(key);
                } else {
                    delete global[key];
                }
            }
        }
        if (name) {
            this._name = name;
        } else {
            this._name = random(8);
        }
        if (clear) {
            delete global[this.getEphemeralPath()]; // clear id
        }
    }
    /**
     * Acquires a lock at an optional index, with an optional auto expiration
     * time (in milleseconds).
     *
     * @param index
     *  optional index to acquire lock at (defaults to `0`)
     * @param expire
     *  optional auto expiration time (in milliseconds)
     * @returns
     *  a promise for the duration (in milliseconds) it took to acquire the lock
     */
    public async acquire(
        index = 0, expire?: number
    ): Promise<number | null> {
        return await this.lockAge(index, expire);
    }
    /**
     * Releases a lock at on optional index (by setting an internal master
     * identity in the storage layer to `null`).
     *
     * @param index
     *  optional index to release lock at (defaults to `0`)
     * @returns
     *  `true` if the internal master identitiy has indeed been cleared;
     *  otherwise `false`
     */
    public async release(index = 0): Promise<boolean> {
        return await this.setMasterId(index, null) === null;
    }
    protected async lockAge(
        index: number, expire?: number, force = false
    ): Promise<number | null> {
        const global_id = await this.getMasterId(index, force);
        if (global_id !== null) {
            const master_id = await this.newMasterId();
            const global_ms = new Date(global_id.now).getTime();
            const master_ms = new Date(master_id.now).getTime();
            const result_ms = master_ms - global_ms;
            if (typeof expire === 'number' && Math.abs(result_ms) > expire) {
                return await this.lockAge(index, expire, true);
            }
            if (this.cmpMasterId(global_id, master_id)) {
                return result_ms > 0 ? result_ms : 1;
            }
        }
        return null;
    }
    protected async setMasterId(
        index: number, value: MasterId | null
    ): Promise<MasterId | null> {
        const result = await this.storage.set(
            this.getMasterIdPath(index), {
                value, nonce: random(8)
            }
        );
        return result ? result.value : null;
    }
    protected async getMasterId(
        index: number, force = false
    ): Promise<MasterId | null> {
        const wid = await this.storage.get<MasterIdWrapped>(
            this.getMasterIdPath(index)
        );
        if (typeof wid === 'object' && wid?.value && !force) {
            return wid.value;
        }
        return await this.setMasterId(index, await this.newMasterId());
    }
    protected getMasterIdPath(index: number): string {
        return `${this.name}/master-id/${index}`;
    }
    protected async newMasterId(): Promise<MasterId> {
        return {
            now: new Date().toISOString(),
            eid: await this.getEphemeralId(),
            sid: await this.getSessionId(),
        };
    }
    protected cmpMasterId(
        lhs: MasterId, rhs: MasterId
    ): boolean {
        if (lhs.eid === rhs.eid) {
            if (lhs.sid === rhs.sid) {
                if (lhs.sid !== null &&
                    rhs.sid !== null
                ) {
                    return true;
                }
            }
        }
        return false;
    }
    protected async setSessionId(value: string): Promise<string | null> {
        return await this.storage.set(this.getSessionIdPath(), value);
    }
    protected async getSessionId(): Promise<string | null> {
        const id = await this.storage.get<string | null>(
            this.getSessionIdPath()
        );
        if (typeof id === 'string' && id) {
            return id;
        }
        return await this.setSessionId(random(8));
    }
    protected getSessionIdPath(): string {
        return `${this.name}/session-id`;
    }
    protected async setEphemeralId(value: string): Promise<string> {
        return global[this.getEphemeralPath()] = value;
    }
    protected async getEphemeralId(): Promise<string> {
        const id = global[this.getEphemeralPath()];
        if (typeof id === 'string' && id) {
            return id;
        }
        return await this.setEphemeralId(random(8));
    }
    protected getEphemeralPath(): string {
        return `${this.name}/ephemeral-id`;
    }
    protected get name(): string {
        return this._name;
    }
    protected get storage(): Storage {
        return this._storage;
    }
    private _name: string;
    private _storage: Storage;
}
export default Lock;
