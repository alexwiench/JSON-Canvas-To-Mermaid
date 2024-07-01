/**
 * Validates the structure and content of JSON Canvas data.
 * @param {Object} data - The JSON Canvas data to validate.
 * @throws {Error} If the data is invalid.
 */
export function validateJsonCanvasData(data) {
	if (typeof data !== 'object' || data === null) {
		throw new Error('Invalid data: must be a non-null object');
	}

	if (!Array.isArray(data.nodes)) {
		throw new Error('Invalid data: nodes must be an array');
	}

	if (!Array.isArray(data.edges)) {
		throw new Error('Invalid data: edges must be an array');
	}

	// Validate nodes
	const nodeIds = new Set();
	data.nodes.forEach((node, index) => {
		if (typeof node !== 'object' || node === null) {
			throw new Error(`Invalid node at index ${index}: must be a non-null object`);
		}

		if (typeof node.id !== 'string' || node.id.trim() === '') {
			throw new Error(`Invalid node at index ${index}: id must be a non-empty string`);
		}

		if (nodeIds.has(node.id)) {
			throw new Error(`Duplicate node id: ${node.id}`);
		}
		nodeIds.add(node.id);

		if (!['text', 'file', 'link', 'group'].includes(node.type)) {
			throw new Error(`Invalid node type at index ${index}: ${node.type}`);
		}

		if (
			typeof node.x !== 'number' ||
			typeof node.y !== 'number' ||
			typeof node.width !== 'number' ||
			typeof node.height !== 'number'
		) {
			throw new Error(`Invalid node dimensions at index ${index}`);
		}

		if (node.color && typeof node.color !== 'string') {
			throw new Error(`Invalid node color at index ${index}: must be a string`);
		}

		// Type-specific validations
		switch (node.type) {
			case 'text':
				if (typeof node.text !== 'string') {
					throw new Error(`Invalid text node at index ${index}: text must be a string`);
				}
				break;
			case 'file':
				if (typeof node.file !== 'string' || node.file.trim() === '') {
					throw new Error(`Invalid file node at index ${index}: file must be a non-empty string`);
				}
				if (node.subpath && typeof node.subpath !== 'string') {
					throw new Error(`Invalid file node at index ${index}: subpath must be a string`);
				}
				break;
			case 'link':
				if (typeof node.url !== 'string' || node.url.trim() === '') {
					throw new Error(`Invalid link node at index ${index}: url must be a non-empty string`);
				}
				break;
			case 'group':
				if (node.label && typeof node.label !== 'string') {
					throw new Error(`Invalid group node at index ${index}: label must be a string`);
				}
				break;
		}
	});

	// Validate edges
	data.edges.forEach((edge, index) => {
		if (typeof edge !== 'object' || edge === null) {
			throw new Error(`Invalid edge at index ${index}: must be a non-null object`);
		}

		if (typeof edge.id !== 'string' || edge.id.trim() === '') {
			throw new Error(`Invalid edge at index ${index}: id must be a non-empty string`);
		}

		if (!nodeIds.has(edge.fromNode) || !nodeIds.has(edge.toNode)) {
			throw new Error(`Invalid edge at index ${index}: fromNode or toNode does not exist`);
		}

		if (edge.fromSide && !['top', 'right', 'bottom', 'left'].includes(edge.fromSide)) {
			throw new Error(`Invalid edge fromSide at index ${index}: ${edge.fromSide}`);
		}

		if (edge.toSide && !['top', 'right', 'bottom', 'left'].includes(edge.toSide)) {
			throw new Error(`Invalid edge toSide at index ${index}: ${edge.toSide}`);
		}

		if (edge.fromEnd && !['none', 'arrow'].includes(edge.fromEnd)) {
			throw new Error(`Invalid edge fromEnd at index ${index}: ${edge.fromEnd}`);
		}

		if (edge.toEnd && !['none', 'arrow'].includes(edge.toEnd)) {
			throw new Error(`Invalid edge toEnd at index ${index}: ${edge.toEnd}`);
		}

		if (edge.color && typeof edge.color !== 'string') {
			throw new Error(`Invalid edge color at index ${index}: must be a string`);
		}

		if (edge.label && typeof edge.label !== 'string') {
			throw new Error(`Invalid edge label at index ${index}: must be a string`);
		}
	});
}

/**
 * Validates the custom colors object.
 * @param {Object} customColors - The custom colors object to validate.
 * @throws {Error} If the custom colors are invalid.
 */
export function validateCustomColors(customColors) {
	if (typeof customColors !== 'object' || customColors === null) {
		throw new Error('Invalid customColors: must be a non-null object');
	}

	if (Object.keys(customColors).length > 6) {
		throw new Error('Invalid customColors: maximum of 6 colors allowed');
	}

	for (const [key, value] of Object.entries(customColors)) {
		if (!/^[1-6]$/.test(key)) {
			throw new Error(`Invalid color key: ${key}. Must be a number from 1 to 6.`);
		}

		if (typeof value !== 'string' || !/^#[0-9A-Fa-f]{6}$/.test(value)) {
			throw new Error(
				`Invalid color value for key ${key}: ${value}. Must be a valid hex color code.`
			);
		}
	}
}

/**
 * Validates the custom direction parameter.
 * @param {string} graphDirection - The graph direction to validate.
 * @throws {Error} If the graph direction is invalid.
 */
export function validateGraphDirection(graphDirection) {
	const validDirections = ['TB', 'LR', 'BT', 'RL'];
	if (!validDirections.includes(graphDirection)) {
		throw new Error(
			`Invalid graph direction ${graphDirection}. Only "TB", "LR", "BT", and "RL" are allowed.`
		);
	}
}
