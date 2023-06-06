import { computed, effect, ref } from "vue"

/**
 * Creates a conditional ref that only notifies subscribers when entering or
 * exiting their key matching the value. Useful for delegated selection state,
 * as it makes the operation O(1) instead of O(n).
 */
export function selector(source, equals = (a, b) => a === b) {
    let subscriptions = new Map()
    let value

    effect(() => {
        value = source.value

        for (const key of [...subscriptions.keys()]) {
            const o = subscriptions.get(key)
            if (o) o.value = equals(key, value) ? value : undefined
        }
    })

    return key => {
        return computed(() => {
            let tracker = subscriptions.get(key)

            if (!tracker) {
                tracker = ref(undefined)
                subscriptions.set(key, tracker)
            }

            tracker.value

            if (tracker._count) {
                tracker._count++
            } else {
                tracker._count = 1
            }

            if (tracker._count > 1) {
                tracker._count--
            }

            return equals(key, value)
        }).value
    }
}
