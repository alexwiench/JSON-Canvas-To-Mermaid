const fs = require('fs');

// Read the JSON Canvas input from a file
const jsonCanvasInput = fs.readFileSync('input.json', 'utf-8');
const canvasData = JSON.parse(jsonCanvasInput);

// Generate Mermaid code
const data = {
	nodes: [
		{
			id: '2c84aa1f63c31e69',
			x: -800,
			y: -500,
			width: 440,
			height: 540,
			type: 'group',
			label: 'Group 1',
		},
		{
			id: '2a4c24fb5a61ed90',
			x: -780,
			y: -380,
			width: 360,
			height: 260,
			type: 'group',
			label: 'Group 2',
		},
		{
			id: 'd60f7799dd041e28',
			x: -720,
			y: -350,
			width: 240,
			height: 120,
			type: 'group',
			label: 'Group 3',
		},
		{
			id: 'cd3ed1bf0a49b9e3',
			x: -720,
			y: -200,
			width: 250,
			height: 60,
			type: 'text',
			text: 'Node 1',
		},
		{
			id: '0c0736376854e5b2',
			x: -653,
			y: -320,
			width: 117,
			height: 60,
			type: 'text',
			text: 'Node 2',
		},
	],
	edges: [],
};

function isPointInsideGroup(point, group) {
	const { x, y, width, height } = group;
	return point.x >= x && point.x <= x + width && point.y >= y && point.y <= y + height;
}

function findMidpoint(node) {
	return {
		x: node.x + node.width / 2,
		y: node.y + node.height / 2,
	};
}

function findChildrenEnhanced(data) {
	function sortGroupsByArea(nodes) {
		// This time, keep all nodes but still sort groups by area for parent-child calculation
		return nodes.slice().sort((a, b) => {
			if (a.type !== 'group' || b.type !== 'group') return 0; // Keep non-groups in their original order
			const areaA = a.width * a.height;
			const areaB = b.width * b.height;
			return areaA - areaB; // Sort groups from smallest to largest
		});
	}

	const sortedNodes = sortGroupsByArea(data.nodes);
	// Initialize the output structure
	const output = { nodes: [], edges: [...data.edges] }; // Copy edges as is

	// Create the base structure for each node in the output
	sortedNodes.forEach((node) => {
		output.nodes.push({
			...node, // Spread all existing node properties
			children: node.type === 'group' ? [] : null, // Add children array only for groups
		});
	});

	// Map to quickly find node entries in the output by ID
	const nodeMap = output.nodes.reduce((acc, node) => {
		acc[node.id] = node;
		return acc;
	}, {});

	// Determine and record parent-child relationships for groups
	output.nodes.forEach((node, index) => {
		if (node.type !== 'group') return; // Skip non-group nodes

		const midpoint = findMidpoint(node);

		for (let i = index + 1; i < sortedNodes.length; i++) {
			const potentialParent = sortedNodes[i];
			if (potentialParent.type !== 'group') continue; // Skip non-group potential parents
			if (isPointInsideGroup(midpoint, potentialParent)) {
				nodeMap[potentialParent.id].children.push(node.id);
				break; // Found the most immediate parent group, no need to check further
			}
		}
	});

	return output;
}

// Example usage:
const enhancedData = findChildrenEnhanced(data);
console.log(enhancedData);
