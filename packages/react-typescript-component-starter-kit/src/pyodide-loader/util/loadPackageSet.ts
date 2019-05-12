import { Pyodide, MessageCallback, PyodideModule } from '../types'
import { usePromise } from './usePromise'
import { isFirefox } from '../flags'
import { preloadWasm } from './preloadWasm'

export function loadPackageSet(
	toLoad: { [key: string]: string },
	messageCallback: MessageCallback,
	pyodide: Pyodide,
	pymod: PyodideModule,
	baseURL: string,
): Promise<string> {
	if (Object.keys(toLoad).length === 0) {
		return Promise.resolve('No new packages to load')
	}

	const [promise, resolve, reject] = usePromise<string>()
	const packageList = Array.from(Object.keys(toLoad)).join(', ')
	if (messageCallback !== undefined) {
		messageCallback(`Loading ${packageList}`)
	}

	let packageCounter = Object.keys(toLoad).length
	pyodide._module.monitorRunDependencies = () => {
		packageCounter--
		if (packageCounter === 0) {
			markPackagesAsLoaded(pyodide, toLoad)
			delete pyodide._module.monitorRunDependencies
			if (!isFirefox) {
				preloadWasm(pymod).then(() => resolve(`Loaded ${packageList}`))
			} else {
				resolve(`Loaded ${packageList}`)
			}
		}
	}

	pyodide._module.locateFile = fileLocator(baseURL, toLoad)
	for (const pkg in toLoad) {
		if (toLoad.hasOwnProperty(pkg)) {
			const script = makeLoadScript(baseURL, pkg, toLoad[pkg], reject)
			document.body.appendChild(script)
		}
	}

	return promise
}

function markPackagesAsLoaded(
	pyodide: Pyodide,
	toLoad: { [key: string]: string },
) {
	for (const pkg in toLoad) {
		if (toLoad.hasOwnProperty(pkg)) {
			pyodide.loadedPackages[pkg] = toLoad[pkg]
		}
	}
}

function makeLoadScript(
	baseURL: string,
	pkg: string,
	uri: string,
	onError: (e: any) => void,
) {
	const isDefaultChannel = uri === 'default channel'
	const script = document.createElement('script')
	script.src = isDefaultChannel ? `${baseURL}${pkg}.js` : `${uri}`
	script.onerror = onError
	return script
}

function fileLocator(baseURL: string, toLoad: { [key: string]: string }) {
	return (path: string) => {
		// handle packages loaded from custom URLs
		const pkg = path.replace(/\.data$/, '')
		if (pkg in toLoad) {
			const uri = (toLoad as any)[pkg]
			if (uri !== 'default channel') {
				return uri.replace(/\.js$/, '.data')
			}
		}
		return baseURL + path
	}
}
