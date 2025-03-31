/**
 * Convert tags array to string format for PocketBase storage
 * @param tags Array of tag strings
 * @returns JSON string representation or null
 */
export function tagsToStorage(tags?: string[]): string | null {
	if (!tags || tags.length === 0) return null
	return JSON.stringify(tags)
}

/**
 * Convert tags from PocketBase storage format to array for UI
 * @param tagsString JSON string or null from PocketBase
 * @returns Array of tag strings
 */
export function tagsFromStorage(tagsString: string | null): string[] {
	if (!tagsString) return []

	try {
		const parsed = JSON.parse(tagsString)
		if (Array.isArray(parsed)) {
			return parsed
		}
		// Handle case where it might be a comma-separated string
		if (typeof parsed === 'string') {
			return parsed
				.split(',')
				.map(tag => tag.trim())
				.filter(Boolean)
		}
		return []
	} catch (error) {
		// If JSON parsing fails, try treating it as a comma-separated string
		if (typeof tagsString === 'string') {
			return tagsString
				.split(',')
				.map(tag => tag.trim())
				.filter(Boolean)
		}
		console.error('Error parsing tags:', error)
		return []
	}
}
