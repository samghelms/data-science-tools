import { embedPyodideScripts } from './util/embedPyodideScripts'
import { createInitialModule } from './util/createInitialModule'
import { Pyodide } from './types'

/**
 * The main bootstrap script for loading pyodide.
 *
 * @param {string} baseURL the base URL for pyodide scripts
 */
export default async function languagePluginLoader(
	baseURL: string,
): Promise<Pyodide> {
	// kicks off the wasm download and creates the initial interop module
	const [Module, moduleLoadComplete] = await createInitialModule(baseURL)

	// loads the dependency chain
	embedPyodideScripts(baseURL, Module)

	await moduleLoadComplete
	return window.pyodide
}
