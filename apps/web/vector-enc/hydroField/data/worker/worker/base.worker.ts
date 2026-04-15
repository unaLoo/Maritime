import Actor from '../message/actor'
import { Callback, WorkerSelf } from '../types'
import * as module from './loadTile.worker'

// Base Worker Types //////////////////////////////////////////////////

type FuncModule = { [key: string]: (...args: any[]) => any }
declare const self: WorkerGlobalScope & Record<string, any>

// Base Worker Members ////////////////////////////////////////////////

self.actor = new Actor(self, self)

for (const [key, val] of Object.entries(module)) {
	self[key] = val.bind(self)
}

function registerModule(this: WorkerSelf, modulePath: string, callback: Callback<any>) {
	import(/* @vite-ignore */ modulePath)
		.then((module: FuncModule) => {
			for (const [key, val] of Object.entries(module)) {
				self[key] = val.bind(self)
			}
			callback(null, true)
		})
		.catch((err) => {
			callback(err)
		})
}

function checkIfReady(this: WorkerSelf, callback: Callback<any>) {
	callback()
}
