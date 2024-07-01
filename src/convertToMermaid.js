import { createNodeTree } from './createNodeTree.js';
import { validateCustomColors, validateGraphDirection } from './validation.js';

// ========== CREATE MERMAID SYNTAX ==========
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

export function convertToMermaid(data, customColors = {}, graphDirection = 'TB') {
	// Validate parameters
	// The data parameter is validated in the createNodeTree function so we don't need to validate it here.
	validateCustomColors(customColors);
	validateGraphDirection(graphDirection);

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
	const hierarchicalData = createNodeTree(data);

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
