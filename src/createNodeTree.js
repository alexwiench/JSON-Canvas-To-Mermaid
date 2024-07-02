import { validateJsonCanvasData } from './validation.js';

// ========== CREATE NODE HIERARCHY ==========
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

export function createNodeTree(data) {
	validateJsonCanvasData(data);

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
