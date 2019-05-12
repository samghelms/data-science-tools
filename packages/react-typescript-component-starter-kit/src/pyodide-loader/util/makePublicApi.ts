/**
 * Rearrange namespace for public API
 * @param {*} module the raw module
 * @param {string[]} api the api methods
 */
export function makePublicApi<T>(module: any, api: string[]): T {
	const namespace: { [key: string]: any } = { _module: module }
	for (const name of api) {
		namespace[name] = module[name]
	}
	return namespace as T
}
