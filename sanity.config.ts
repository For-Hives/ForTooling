'use client'

import { visionTool } from '@sanity/vision'
import { defineConfig } from 'sanity'
import { structureTool } from 'sanity/structure'
import {
	apiVersion,
	dataset,
	projectId,
} from './src/app/(marketing)/sanity/env'
import { schema } from './src/app/(marketing)/sanity/schema'

export default defineConfig({
	basePath: '/studio',
	projectId,
	dataset,
	schema,
	plugins: [structureTool(), visionTool({ defaultApiVersion: apiVersion })],
})
