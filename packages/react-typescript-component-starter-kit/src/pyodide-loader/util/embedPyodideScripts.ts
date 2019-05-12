import { MessageCallback, PyodideFactory, PyodideModule } from '../types'
import { loadPackage as loadPackageInternal } from './loadPackage'

/**
 * Embeds the pyodide ASM scripts onto the page
 * @param {string} baseURL
 * @param {*} Module
 */
export function embedPyodideScripts(baseURL: string, pymod: PyodideModule) {
	// Pack the module into the window. This is required for Emscripten to work
	// (https://kripken.github.io/emscripten-site/docs/api_reference/module.html)
	let loadPackagePromise = Promise.resolve()
	;(window as any).Module = pymod
	/**
	 *
	 * @param {string[]} names the module names
	 * @param {*} messageCallback
	 */
	const loadPackage = (names: string[], messageCallback: MessageCallback) => {
		/* We want to make sure that only one loadPackage invocation runs at any
		 * given time, so this creates a "chain" of promises. */
		loadPackagePromise = loadPackagePromise.then(() =>
			loadPackageInternal(baseURL, pymod, names || [], messageCallback),
		)
		return loadPackagePromise
	}

	const asmDataScript = document.createElement('script')
	asmDataScript.src = `${baseURL}pyodide.asm.data.js`
	asmDataScript.onload = () => {
		const script = document.createElement('script')
		script.src = `${baseURL}pyodide.asm.js`
		script.onload = () => {
			// The emscripten module needs to be at this location for the core
			// filesystem to install itself. Once that's complete, it will be replaced
			// by the call to `makePublicAPI` with a more limited public API.

			window.pyodide = ((window.pyodide as any) as PyodideFactory)(pymod)
			window.pyodide.loadedPackages = new Array() as any
			window.pyodide.loadPackage = loadPackage
		}
		document.head!.appendChild(script)
	}

	document.head!.appendChild(asmDataScript)
}
