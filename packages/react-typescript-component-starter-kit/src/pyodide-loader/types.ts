export type MessageCallback = (msg: any) => void
export type PyodideFactory = (input: Partial<PyodideModule>) => Pyodide

export interface Pyodide {
	_module: PyodideModule

	/**
	 * The loaded Package Map
	 */
	loadedPackages: { [key: string]: string }

	loadPackage(
		packages: string | string[],
		callback?: MessageCallback,
	): Promise<void>
	runPython(script: string): void
	runPythonAsync(script: string, callback?: MessageCallback): Promise<void>
	version(): string
}

export interface PyodideModule {
	FS: any
	noImageDecoding: boolean
	noAudioDecoding: boolean
	noWasmDecoding: boolean
	preloadedWasm: any
	packages: {
		dependencies: { [key: string]: string[] }
		import_name_to_package_name: { [key: string]: string }
	}
	locateFile: (path: string) => string
	instantiateWasm(info: any, receiveInstance: (instance: any) => void): any
	postRun(): void
	monitorRunDependencies(n: number): void
	loadWebAssemblyModule(file: any, flag: boolean): Promise<any>
}

declare global {
	interface Window {
		pyodide: Pyodide
	}
}
