import { bindAll } from '../util'
import ThrottledInvoker from './throttledInvoker'
import type { Cancelable, TaskType } from '../types'

export type TaskMetadata = {
	type: TaskType
	zoom?: number
}

export type Task = {
	id: number
	fn: (...args: any[]) => any
	metadata: TaskMetadata
	priority: number
}

class Scheduler {
	nextId = 0
	taskQueue: number[] = []
	tasks: { [key: number]: Task } = {}

	invoker: ThrottledInvoker

	constructor() {
		bindAll(['process'], this)
		this.invoker = new ThrottledInvoker(this.process)
	}

	add(fn: (...args: any[]) => any, metadata: TaskMetadata): Cancelable {
		// if (isWorker()) {
		//     console.log("Worker Scheduler Tasks : ", this.taskQueue)
		// } else {
		//     console.log("Main Scheduler Tasks : ", this.taskQueue)
		// }
		const id = this.nextId++
		const priority = getPriority(metadata)

		this.tasks[id] = { id, fn, metadata, priority }
		this.taskQueue.push(id)
		this.invoker.trigger()
		return {
			cancel: () => {
				delete this.tasks[id]
			},
		}
	}

	process() {
		this.taskQueue = this.taskQueue.filter((id) => !!this.tasks[id])

		if (!this.taskQueue.length) return

		const id = this.pick()
		if (id === null) return

		const task = this.tasks[id]
		delete this.tasks[id]

		if (this.taskQueue.length) {
			this.invoker.trigger()
		}
		if (!task) return

		task.fn()
	}

	pick(): null | number {
		let id = null

		let minPriority = Infinity
		let minIndex = 0
		for (let i = 0; i < this.taskQueue.length; i++) {
			const taskId = this.taskQueue[i]
			const task = this.tasks[taskId]
			if (!task) continue

			if (task.priority < minPriority) {
				minPriority = task.priority
				minIndex = i
			}
		}

		id = this.taskQueue[minIndex]
		this.taskQueue.splice(minIndex, 1)

		// console.log('Scheduler Pick : ', this.tasks[id], id)

		return id
	}

	remove() {
		this.invoker.remove()
	}
}

function getPriority(metadata: TaskMetadata) {
	// the smaller the priority value, the higher the priority
	const zoom = metadata.zoom || 0
	return 100 - zoom
}

export default Scheduler
