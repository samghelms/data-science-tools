import { uriToPackageName } from './uriToPackageName'
import { Pyodide } from '../types'

/**
 * DFS to find all dependencies of the requested packages
 * @param names The packages to load
 * @param pyodide The pyodide instance
 */
export function getPackageDependencies(names: string[], pyodide: Pyodide) {
	const queue: string[] = [...(names || [])]
	const toLoad: { [key: string]: string } = {}
	const loadedPackages = pyodide.loadedPackages
	const packages = pyodide._module.packages.dependencies

	while (queue.length) {
		let uri = queue.pop()!
		const pkgName = uriToPackageName(uri) as any

		if (pkgName == null) {
			throw new Error(`Invalid package name or URI '${uri}'`)
		} else if (pkgName === uri) {
			uri = 'default channel'
		}

		if (pkgName in loadedPackages) {
			if (uri !== loadedPackages[pkgName]) {
				throw new Error(
					`URI mismatch, attempting to load package ` +
						`${pkgName} from ${uri} while it is already ` +
						`loaded from ${loadedPackages[pkgName]}!`,
				)
			}
		} else if (pkgName in toLoad) {
			if (uri !== toLoad[pkgName]) {
				throw new Error(
					`URI mismatch, attempting to load package ` +
						`${pkgName} from ${uri} while it is already ` +
						`being loaded from ${toLoad[pkgName]}!`,
				)
			}
		} else {
			toLoad[pkgName] = uri
			if (packages.hasOwnProperty(pkgName)) {
				packages[pkgName].forEach((subpackage: string) => {
					if (!(subpackage in loadedPackages) && !(subpackage in toLoad)) {
						queue.push(subpackage)
					}
				})
			} else {
				throw new Error(`Unknown package '${pkgName}'`)
			}
		}
	}

	return toLoad
}
