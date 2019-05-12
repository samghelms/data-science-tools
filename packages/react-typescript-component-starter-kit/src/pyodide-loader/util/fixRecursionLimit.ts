import { Pyodide } from '../types'
const PYTHON_STACK_LIMIT = 1000

/**
 * The Javascript/Wasm call stack may be too small to handle the default
 * Python call stack limit of 1000 frames. This is generally the case on
 * Chrom(ium), but not on Firefox. Here, we determine the Javascript call
 * stack depth available, and then divide by 50 (determined heuristically)
 * to set the maximum Python call stack depth.
 * @param {*} pyodide
 */
export function fixRecursionLimit(pyodide: Pyodide) {
	let recursionLimit = getRecursionDepth() / 50
	if (recursionLimit > PYTHON_STACK_LIMIT) {
		recursionLimit = PYTHON_STACK_LIMIT
	}
	pyodide.runPython(`import sys; sys.setrecursionlimit(int(${recursionLimit}))`)
}

function getRecursionDepth() {
	let depth = 0
	function recurse() {
		depth += 1
		recurse()
	}
	try {
		recurse()
	} catch {
		// do nothing
	}
	return depth
}
