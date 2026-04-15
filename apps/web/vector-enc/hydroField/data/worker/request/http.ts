type httpRequestType = {
	headers?: Record<string, string>
	params?: Record<string, string | number>
	timeout?: number // ms
	responseType?: 'json' | 'arrayBuffer' | 'blob' | 'text'
}

type RequestType = {
	url: string
	method: 'GET' | 'POST'
	data?: any // for POST body
} & httpRequestType

type ResponseType<T = any> = {
	data: T
	status: number
	statusText: string
	headers: Headers
	config: RequestType
	request: Request
}

const RESPONSE_PARSE_MAP = {
	arrayBuffer: (res: Response) => res.arrayBuffer(),
	blob: (res: Response) => res.blob(),
	text: (res: Response) => res.text(),
	json: (res: Response) => res.json(),
}

class HTTP {
	async request<T = any>(config: RequestType): Promise<ResponseType<T>> {
		const { url, method, headers = {}, params, data, timeout, responseType = 'json' } = config

		const fullUrl = this._buildUrl(url, params)

		const controller = new AbortController()
		if (timeout) {
			setTimeout(() => controller.abort(), timeout)
		}

		const init: RequestInit = {
			method,
			headers: {
				...headers,
			},
			signal: controller.signal,
		}

		if (method === 'POST' && data !== undefined) {
			init.body = JSON.stringify(data)
		}

		const req = new Request(fullUrl, init)

		try {
			const res = await fetch(req)

			const resData = await RESPONSE_PARSE_MAP[responseType || 'json'](res)

			const ResponseType: ResponseType<T> = {
				data: resData,
				status: res.status,
				statusText: res.statusText,
				headers: res.headers,
				config,
				request: req,
			}

			return ResponseType
		} catch (err: any) {
			if (err.name === 'AbortError') {
				throw new Error('Request timed out')
			}
			throw err
		}
	}

	get<T = any>(url: string, config: httpRequestType) {
		return this.request<T>({ ...config, url, method: 'GET' })
	}

	post<T = any>(url: string, data: any, config: httpRequestType) {
		return this.request<T>({ ...config, url, data, method: 'POST' })
	}

	private _buildUrl(baseUrl: string, params?: Record<string, string | number>): string {
		if (!params) return baseUrl
		const usp = new URLSearchParams()
		for (const [key, val] of Object.entries(params)) {
			usp.set(key, String(val))
		}
		return `${baseUrl}?${usp.toString()}`
	}
}

export const http = new HTTP()
