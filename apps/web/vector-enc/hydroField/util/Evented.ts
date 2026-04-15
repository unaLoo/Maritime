type Fn = (data?: any) => void

export class Evented {
	private m = new Map<string, Set<Fn>>()

	on(type: string, fn: Fn) {
		if (!this.m.has(type)) this.m.set(type, new Set())
		this.m.get(type)!.add(fn)
		return this
	}

	off(type: string, fn: Fn) {
		this.m.get(type)?.delete(fn)
		return this
	}

	once(type: string, fn: Fn) {
		const wrap: Fn = (data) => {
			this.off(type, wrap)
			fn(data)
		}
		return this.on(type, wrap)
	}

	emit(type: string, data?: any) {
		// 拷贝一份，避免回调里 off/on 影响遍历
		for (const fn of Array.from(this.m.get(type) ?? [])) fn(data)
		return this
	}

	remove() {
		this.m.clear()
	}
}
