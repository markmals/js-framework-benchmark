import { WritableSignal, computed, effect, signal } from "@angular/core"

export type Selector<U> = (key: U) => boolean

/**
 * Creates a conditional signal that only notifies subscribers when entering or
 * exiting their key matching the value. Useful for delegated selection state,
 * as it makes the operation O(1) instead of O(n).
 *
 * @param source
 * @param equals a function that receives its previous or the initial value, if set, and returns a new value used to react on a computation
 * @returns the selector function
 *
 * @example
 * ```ts
 * ```
 */
export function selector<T, U extends T>(
    source: () => T,
    equals: (a: U, b: T) => boolean = (a, b) => a === b
): Selector<U> {
    let subscriptions = new Map<U, WritableSignal<U | undefined | null>>()
    let value: T

    effect(
        () => {
            value = source()

            for (const key of [...subscriptions.keys()]) {
                const o = subscriptions.get(key)
                if (o) o.set(equals(key, value) ? (value as U) : null)
            }
        },
        { allowSignalWrites: true }
    )

    return (key: U) => {
        const c = computed(() => {
            type Tracker = (WritableSignal<U | undefined | null> & { _count?: number }) | undefined
            let tracker: Tracker = subscriptions.get(key)

            if (!tracker) {
                tracker = signal(undefined)
                subscriptions.set(key, tracker)
            }

            tracker()

            if (tracker._count) {
                tracker._count++
            } else {
                tracker._count = 1
            }

            if (tracker._count > 1) {
                tracker._count--
            }

            return equals(key, value)
        })

        return c()
    }
}
