import * as validation from './validation.js';
import { createNodeTree } from './createNodeTree.js';
import { convertToMermaid } from './convertToMermaid.js';

/**
 * JSON Canvas utility library for working with JSON Canvas data and generating Mermaid flowcharts.
 * @namespace
 */
export const jsonCanvas = {
	/**
	 * Validation functions for JSON Canvas data and related parameters.
	 * @namespace
	 */
	validate: {
		data: validation.validateJsonCanvasData,
		colors: validation.validateCustomColors,
		direction: validation.validateGraphDirection,
	},

	createNodeTree,
	convertToMermaid,
};

export default convertToMermaid;
