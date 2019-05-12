import { PyodideModule } from '../types'

export function preloadWasm(pymod: PyodideModule) {
	// On Chrome, we have to instantiate wasm asynchronously. Since that
	// can't be done synchronously within the call to dlopen, we instantiate
	// every .so that comes our way up front, caching it in the
	// `preloadedWasm` dictionary.
	let promise = Promise.resolve()
	const FS = window.pyodide._module.FS

	const handleSoFile = (path: string) => {
		if (pymod.preloadedWasm[path] === undefined) {
			promise = promise
				.then(() => pymod.loadWebAssemblyModule(FS.readFile(path), true))
				.then(module => (pymod.preloadedWasm[path] = module))
		}
	}

	recurseDir('/', handleSoFile, FS)
	return promise
}

/**
 * Recurse a FS
 * @param rootpath The root path to recurse
 * @param handleSoFile Handler for .so files
 * @param FS The FS Utility object
 */
function recurseDir(
	rootpath: string,
	handleSoFile: (path: string) => void,
	FS: any,
) {
	let dirs
	try {
		dirs = FS.readdir(rootpath)
	} catch {
		return
	}
	for (const entry of dirs) {
		if (entry.startsWith('.')) {
			continue
		}
		const path = rootpath + entry
		if (entry.endsWith('.so')) {
			handleSoFile(path)
		} else if (FS.isDir(FS.lookupPath(path).node.mode)) {
			recurseDir(path + '/', handleSoFile, FS)
		}
	}
}
