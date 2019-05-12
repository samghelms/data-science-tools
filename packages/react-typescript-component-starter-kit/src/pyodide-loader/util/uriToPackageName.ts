const NAME_REGEXP = '[a-z0-9_][a-z0-9_-]*'
const PACKAGE_URI_REGEXP = new RegExp(`^https?://.*?(${NAME_REGEXP}).js$`, 'i')
const PACKAGE_NAME_REGEXP = new RegExp(`^${NAME_REGEXP}$`, 'i')

/**
 * Generate a unique package name from URI
 * @param {string} uri The package URI
 * @returns {string | null} The package name inferred from the URI
 */
export function uriToPackageName(uri: string): string | null {
	if (PACKAGE_NAME_REGEXP.test(uri)) {
		return uri
	} else if (PACKAGE_URI_REGEXP.test(uri)) {
		const match = PACKAGE_URI_REGEXP.exec(uri)
		// Get the regexp group corresponding to the package name
		return match && match[1]
	} else {
		return null
	}
}
