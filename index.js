//sample data
const data = {
	nodes: [
		{
			id: '3ea9a8d983999dff',
			x: -1399,
			y: -797,
			width: 290,
			height: 277,
			color: '#6100c2',
			type: 'group',
			label: 'Custom Color Group',
		},
		{
			id: 'ab749aad051ef1ba',
			type: 'text',
			text: 'Red Node',
			x: -1379,
			y: -777,
			width: 250,
			height: 60,
			color: '1',
		},
		{
			id: '475c4e9b9527f089',
			type: 'text',
			text: 'Yellow Node',
			x: -1379,
			y: -600,
			width: 250,
			height: 60,
			color: '3',
		},
	],
	edges: [
		{
			id: '6eb92706a8b669d5',
			fromNode: 'ab749aad051ef1ba',
			fromSide: 'bottom',
			toNode: '475c4e9b9527f089',
			toSide: 'top',
			color: '2',
			label: 'Orange Line',
		},
	],
};

//Create group & node heirarchy by assigning children to groups.
function findChildren(data) {
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

//New data with children arrays
const hierarchicalData = findChildren(data);

function generateMermaidFlowchart(data) {
	const { nodes, edges } = data;

	// Helper function to generate Mermaid Flowchart syntax for a node
	function generateNodeSyntax(node) {
		const { id, type, label, text, file, subpath, url } = node;
		if (type === 'group') {
			return `subgraph ${id}["${label}"]\n${generateSubgraphSyntax(node)}\nend\n`;
		} else if (type === 'text') {
			return `${id}["${text}"]\n`;
		} else if (type === 'file') {
			const fileLabel = subpath ? `${file}${subpath}` : file;
			return `${id}["${fileLabel}"]\n`;
		} else if (type === 'link') {
			return `${id}["${url}"]\n`;
		}
		return '';
	}

	// Helper function to generate Mermaid Flowchart syntax for a subgraph
	function generateSubgraphSyntax(node) {
		const { children } = node;
		let syntax = '';
		if (children && children.length > 0) {
			for (const childId of children) {
				const childNode = nodes.find((n) => n.id === childId);
				if (childNode) {
					syntax += generateNodeSyntax(childNode);
				}
			}
		}
		return syntax;
	}
	// Helper function to generate Mermaid Flowchart syntax for an edge
	function generateEdgeSyntax(edge) {
		const { fromNode, toNode, fromEnd = 'none', toEnd = 'arrow', label } = edge;

		const arrowStyleMap = {
			'none-arrow': '-->',
			'arrow-none': '<--',
			'arrow-arrow': '<-->',
			'none-none': '---',
		};
		const arrowStyle = arrowStyleMap[`${fromEnd}-${toEnd}`] || '---';

		// check if lable exists
		const edgeLabel = label ? `|${label}|` : '';

		return `${fromNode} ${arrowStyle} ${edgeLabel} ${toNode}\n`;
	}

	// Generate Mermaid Flowchart syntax for each node
	let flowchartSyntax = 'graph TB\n';
	for (const node of nodes) {
		flowchartSyntax += generateNodeSyntax(node);
	}

	// Generate Mermaid Flowchart syntax for each edge/line
	for (const edge of edges) {
		flowchartSyntax += generateEdgeSyntax(edge);
	}

	return flowchartSyntax;
}

const mermaidFlowchart = generateMermaidFlowchart(hierarchicalData);
console.log(mermaidFlowchart);
