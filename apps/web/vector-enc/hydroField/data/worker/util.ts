/**
 * Utility functions
 */

/**
 * Generate a unique ID
 */
export function uniqueId(): string {
	return Math.random().toString(36).substring(2) + Date.now().toString(36)
}

/**
 * Check if running in a Web Worker
 */
export function isWorker(): boolean {
	return typeof WorkerGlobalScope !== 'undefined' && self instanceof WorkerGlobalScope
}

/**
 * Bind all methods of an object to itself
 */
export function bindAll(methods: string[], target: any): void {
	methods.forEach((method) => {
		if (typeof target[method] === 'function') {
			target[method] = target[method].bind(target)
		}
	})
}

/**
 * Execute async operations on an array and call callback when all complete
 */
export function asyncAll<T>(
	array: T[],
	iterator: (item: T, callback: (error?: Error | null, result?: any) => void) => void,
	callback: (error?: Error | null, results?: any[]) => void,
): void {
	if (!array.length) {
		return callback(null, [])
	}

	let remaining = array.length
	const results: any[] = []
	let error: Error | null = null

	array.forEach((item, index) => {
		iterator(item, (err, result) => {
			if (err) {
				error = err
			}
			results[index] = result
			remaining--
			if (remaining === 0) {
				callback(error, results)
			}
		})
	})
}
