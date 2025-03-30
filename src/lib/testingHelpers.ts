// src/app/lib/testingHelpers.ts
export function logData(label: string, data: unknown, important = false) {
	const prefix = important ? '🔴 ' : '🔵 '
	console.info(`${prefix}${label}:`)

	try {
		// Format the data nicely
		if (typeof data === 'object') {
			console.info(JSON.stringify(data, null, 2))
		} else {
			console.info(data)
		}
		console.info('----------------------------')
	} catch (error) {
		console.info('Error logging data:', error)
		console.info('Raw data:', data)
	}
}
