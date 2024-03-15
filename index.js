const fs = require('fs');

// Read the JSON Canvas input from a file
const jsonCanvasInput = fs.readFileSync('input.json', 'utf-8');
const canvasData = JSON.parse(jsonCanvasInput);

// Generate Mermaid code
const data = {
	nodes: [
		{
			id: '2c84aa1f63c31e69',
			type: 'group',
			x: -800,
			y: -500,
			width: 440,
			height: 540,
			label: 'Group 1',
		},
		{
			id: '2a4c24fb5a61ed90',
			type: 'group',
			x: -780,
			y: -380,
			width: 360,
			height: 360,
			label: 'Group 2',
		},
		{
			id: 'd60f7799dd041e28',
			type: 'group',
			x: -720,
			y: -350,
			width: 240,
			height: 120,
			label: 'Group 3',
		},
		{
			id: 'd7be75e3f059a54c',
			x: -760,
			y: -140,
			width: 280,
			height: 84,
			type: 'group',
			label: 'group 4',
		},
		{
			id: '0c0736376854e5b2',
			type: 'text',
			text: 'Node 2',
			x: -653,
			y: -320,
			width: 117,
			height: 60,
		},
		{
			id: 'cd3ed1bf0a49b9e3',
			type: 'text',
			text: 'Node 1',
			x: -700,
			y: 80,
			width: 284,
			height: 100,
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
		return nodes.slice().sort((a, b) => {
			if (a.type !== 'group' || b.type !== 'group') return 0;
			const areaA = a.width * a.height;
			const areaB = b.width * b.height;
			return areaA - areaB;
		});
	}

	const sortedNodes = sortGroupsByArea(data.nodes);

	const output = {
		nodes: [],
		edges: [...data.edges],
	};

	sortedNodes.forEach((node) => {
		output.nodes.push({
			...node,
			children: node.type === 'group' ? [] : null,
		});
	});

	const nodeMap = output.nodes.reduce((acc, node) => {
		acc[node.id] = node;
		return acc;
	}, {});

	output.nodes.forEach((node, index) => {
		if (node.type === 'group') {
			const midpoint = findMidpoint(node);
			for (let i = index + 1; i < sortedNodes.length; i++) {
				const potentialParent = sortedNodes[i];
				if (potentialParent.type !== 'group') continue;
				if (isPointInsideGroup(midpoint, potentialParent)) {
					nodeMap[potentialParent.id].children.push(node.id);
					break;
				}
			}
		} else {
			const nodeCenter = findMidpoint(node);
			for (let i = 0; i < sortedNodes.length; i++) {
				const potentialParent = sortedNodes[i];
				if (potentialParent.type !== 'group') continue;
				if (isPointInsideGroup(nodeCenter, potentialParent)) {
					nodeMap[potentialParent.id].children.push(node.id);
					break;
				}
			}
		}
	});

	return output;
}
// Example usage:
const enhancedDataWithNonGroups = findChildrenEnhanced(data);
console.log(enhancedDataWithNonGroups);
