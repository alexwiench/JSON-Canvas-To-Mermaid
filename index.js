// ========== CREATE NODE HIERARCHY ==========
//Create group & node heirarchy by assigning children to groups.
/**
 * Builds a hierarchical structure from JSON Canvas data by assigning children to group nodes.
 *
 * @param {Object} data - The JSON Canvas data object.
 * @param {Array} data.nodes - An array of nodes from the JSON Canvas data.
 * @param {Array} data.edges - An array of edges from the JSON Canvas data.
 * @returns {Object} The hierarchical structure object.
 * @returns {Array} output.nodes - An array of nodes with the `children` property added.
 * @returns {Array} output.edges - An array of edges (remains unchanged from the input).
 *
 * @description
 * This function creates a parent-child hierarchy for nodes based on their spatial relationships:
 * - Group nodes can contain other nodes (including other groups).
 * - A node is considered a child of a group if its center point is within the group's bounds.
 * - Each node can have only one parent group.
 * - Non-group nodes have their 'children' property set to null.
 * - The function preserves the original edge data.
 */
export function buildJsonCanvasHierarchy(data) {
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

/**
 * Generates a Mermaid Flowchart syntax based on the provided JSON Canvas data.
 *
 * @param {Object} data - The JSON Canvas data object containing nodes and edges.
 * @param {Object} [customColors={}] - Optional custom color mapping for nodes and edges.
 *   Keys are color identifiers, values are hex color codes. Maximum of 6 colors.
 *   Example: { 1: '#ff0000', 2: '#00ff00', 3: '#0000ff' }
 * @param {string} [graphDirection='TB'] - Optional direction of the graph.
 *   Valid options are: 'TB' (top to bottom), 'LR' (left to right),
 *   'BT' (bottom to top), 'RL' (right to left).
 * @returns {string} The generated Mermaid Flowchart syntax.
 * @throws {Error} If an invalid graph direction is provided.
 *
 * @description
 * This function converts JSON Canvas data into Mermaid Flowchart syntax:
 * - Supports various node types: text, file, link, and group.
 * - Handles nested group structures.
 * - Applies custom colors to nodes and edges if provided.
 * - Generates appropriate syntax for different edge types and labels.
 * - The output can be used directly with Mermaid to render a flowchart.
 */
export default function generateMermaidFlowchart(data, customColors = {}, graphDirection = 'TB') {
	// ========== PARAMATER VALIDATION ==========

	//todo - add data validation

	//todo - add custom color validation

	// Validate the direction parameter
	const validDirections = ['TB', 'LR', 'BT', 'RL'];
	if (!validDirections.includes(graphDirection)) {
		throw new Error('Invalid graph direction. Only "TB", "LR", "BT", and "RL" are allowed.');
	}

	// ========== COLOR GENERATION ==========
	// Adds custom colors to the default color map if provided.
	function createColorMap(customColors) {
		const defaultColorMap = {
			1: '#fb464c', // red
			2: '#e9973f', // orange
			3: '#e0de71', // yellow
			4: '#44cf6e', // green
			5: '#53dfdd', // cyan
			6: '#a882ff', // purple
		};

		const colorMap = { ...defaultColorMap, ...customColors };
		return colorMap;
	}

	const colorMap = createColorMap(customColors);

	// Helper function to get the color based on the custom color map
	function getColor(color) {
		return colorMap[color] || color;
	}

	//Bu8ild new data with children arrays
	const hierarchicalData = buildJsonCanvasHierarchy(data);

	// ========== GENERATE MERMAID CODE ==========
	// Uses the hierarchical data to generate the Mermaid Flowchart syntax
	function generateMermaidFlowchart(data) {
		const { nodes, edges } = data;

		// This will store styles for nodes and edges/lines for use later
		let graphStyles = '';

		// Helper function to generate Mermaid Flowchart syntax for a node
		function generateNodeSyntax(node) {
			const { id, type, label, text, file, subpath, url, color } = node;

			// Add styling for node
			generateNodeStyle(node);

			if (type === 'group') {
				// Handle empty group label
				let newGroupLabel;
				if (label === '') {
					newGroupLabel = ' ';
				} else {
					newGroupLabel = label;
				}
				return `subgraph ${id}["${newGroupLabel}"]\n${generateSubgraphSyntax(node)}\nend\n`;
			} else if (type === 'text') {
				//Handle empty node label
				let newText;
				if (text === '') {
					newText = ' ';
				} else {
					newText = text;
				}
				return `${id}["${newText}"]\n`;
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
			generateEdgeStyle(edge);

			const arrowStyleMap = {
				'none-arrow': '-->',
				'arrow-none': '<--',
				'arrow-arrow': '<-->',
				'none-none': '---',
			};
			const arrowStyle = arrowStyleMap[`${fromEnd}-${toEnd}`] || '---';

			// check if lable exists
			const edgeLabel = label ? ` |${label}|` : '';

			return `${fromNode} ${arrowStyle}${edgeLabel} ${toNode}\n`;
		}

		// Helper function to push brightness of hex colors around
		function adjustBrightness(hex, percent) {
			// Remove the '#' character if present
			hex = hex.replace('#', '');

			// Convert the hex color to RGB
			let r = parseInt(hex.substring(0, 2), 16);
			let g = parseInt(hex.substring(2, 4), 16);
			let b = parseInt(hex.substring(4, 6), 16);

			// Adjust the brightness by the specified percentage
			const amount = Math.round(2.55 * percent);
			r = Math.max(0, Math.min(255, r + amount));
			g = Math.max(0, Math.min(255, g + amount));
			b = Math.max(0, Math.min(255, b + amount));

			// Convert the RGB values back to hex
			const rr = r.toString(16).padStart(2, '0');
			const gg = g.toString(16).padStart(2, '0');
			const bb = b.toString(16).padStart(2, '0');

			return `#${rr}${gg}${bb}`;
		}

		// Helper function to generate Mermaid Styling for a node
		function generateNodeStyle(node) {
			const { id, color, type } = node;

			// Check to see if color exists
			if (!color) {
				return;
			}

			const nodeColor = getColor(color);
			const nodeColorALT = adjustBrightness(nodeColor, -20);

			let nodeStyle = `style ${id} fill:${nodeColor}, stroke:${nodeColorALT}\n`;

			graphStyles += nodeStyle;
		}

		// Helper function to generate Mermaid Styling for an edge
		let edgeCounter = 0;
		function generateEdgeStyle(edge) {
			const { color } = edge;

			// Check to see if color exists
			if (!color) {
				edgeCounter++;
				return;
			}
			const edgeColor = getColor(color);
			let edgeStyle = `linkStyle ${edgeCounter} stroke:${edgeColor}\n`;

			edgeCounter++;
			graphStyles += edgeStyle;
		}

		// Start writing graph syntax
		let flowchartSyntax = `graph ${graphDirection}\n`;

		// Generate Mermaid Flowchart syntax for each node
		for (const node of nodes) {
			flowchartSyntax += generateNodeSyntax(node);
		}

		// Generate Mermaid Flowchart syntax for each edge/line
		for (const edge of edges) {
			flowchartSyntax += generateEdgeSyntax(edge);
		}

		// Add generated styles at the end
		flowchartSyntax += graphStyles;

		return flowchartSyntax;
	}

	const mermaidFlowchart = generateMermaidFlowchart(hierarchicalData);

	return mermaidFlowchart;
}
