import { expect, test, describe } from 'bun:test';
import generateMermaidFlowchart from '../index.js';

describe('generateMermaidFlowchart', () => {
	describe('Basic Functionality', () => {
		test('should generate correct Mermaid syntax for simple 2-node graph', () => {
			const input = {
				nodes: [
					{
						id: '6b9bdbf30d75d3e5',
						x: -348,
						y: -229,
						width: 250,
						height: 60,
						type: 'text',
						text: 'Node 1',
					},
					{
						id: 'b955705e854ced5f',
						x: -20,
						y: -229,
						width: 250,
						height: 60,
						type: 'text',
						text: 'Node 2',
					},
				],
				edges: [
					{
						id: 'cfcd19ac442c28b9',
						fromNode: '6b9bdbf30d75d3e5',
						fromSide: 'right',
						toNode: 'b955705e854ced5f',
						toSide: 'left',
					},
				],
			};

			const result = generateMermaidFlowchart(input);

			expect(result).toContain('graph TB');
			expect(result).toContain('6b9bdbf30d75d3e5["Node 1"]');
			expect(result).toContain('b955705e854ced5f["Node 2"]');
			expect(result).toContain('6b9bdbf30d75d3e5 --> b955705e854ced5f');
		});

		test('should change graph direction when specified', () => {
			const input = {
				nodes: [
					{ id: 'node1', x: 0, y: 0, width: 100, height: 50, type: 'text', text: 'Node 1' },
					{ id: 'node2', x: 100, y: 100, width: 100, height: 50, type: 'text', text: 'Node 2' },
				],
				edges: [{ id: 'edge', fromNode: 'node1', toNode: 'node2' }],
			};

			const result = generateMermaidFlowchart(input, {}, 'LR');

			expect(result).toContain('graph LR');
		});
	});

	describe('Node Types', () => {
		test('should handle different node types: text, file, link', () => {
			const input = {
				nodes: [
					{ id: 'text1', x: 0, y: 0, width: 100, height: 50, type: 'text', text: 'Text Node' },
					{ id: 'file1', x: 100, y: 0, width: 100, height: 50, type: 'file', file: 'example.txt' },
					{
						id: 'link1',
						x: 200,
						y: 0,
						width: 100,
						height: 50,
						type: 'link',
						url: 'https://example.com',
					},
				],
				edges: [],
			};

			const result = generateMermaidFlowchart(input);

			expect(result).toContain('text1["Text Node"]');
			expect(result).toContain('file1["example.txt"]');
			expect(result).toContain('link1["https://example.com"]');
		});

		test('should handle group nodes with nested nodes', () => {
			const input = {
				nodes: [
					{ id: 'group1', type: 'group', label: 'Group 1', x: 0, y: 0, width: 300, height: 200 },
					{ id: 'text1', type: 'text', text: 'Nested Text', x: 50, y: 50, width: 100, height: 50 },
				],
				edges: [],
			};

			const result = generateMermaidFlowchart(input);

			expect(result).toContain('subgraph group1["Group 1"]');
			expect(result).toContain('text1["Nested Text"]');
			expect(result).toContain('end');
		});

		test('should handle subpaths in file nodes', () => {
			const input = {
				nodes: [
					{
						id: 'file1',
						type: 'file',
						file: 'example.txt',
						subpath: '/section1',
						x: 0,
						y: 0,
						width: 100,
						height: 50,
					},
				],
				edges: [],
			};

			const result = generateMermaidFlowchart(input);

			expect(result).toContain('file1["example.txt/section1"]');
		});
	});

	describe('Edge Handling', () => {
		test('should handle edges with different end types', () => {
			const input = {
				nodes: [
					{ id: 'node1', type: 'text', text: 'Node 1', x: 0, y: 0, width: 100, height: 50 },
					{ id: 'node2', type: 'text', text: 'Node 2', x: 200, y: 0, width: 100, height: 50 },
				],
				edges: [
					{ id: 'edge1', fromNode: 'node1', toNode: 'node2', fromEnd: 'none', toEnd: 'arrow' },
					{ id: 'edge2', fromNode: 'node2', toNode: 'node1', fromEnd: 'arrow', toEnd: 'none' },
				],
			};

			const result = generateMermaidFlowchart(input);

			expect(result).toContain('node1 --> node2');
			expect(result).toContain('node2 <-- node1');
		});

		test('should handle edge labels', () => {
			const input = {
				nodes: [
					{ id: 'node1', type: 'text', text: 'Node 1', x: 0, y: 0, width: 100, height: 50 },
					{ id: 'node2', type: 'text', text: 'Node 2', x: 200, y: 0, width: 100, height: 50 },
				],
				edges: [{ id: 'edge1', fromNode: 'node1', toNode: 'node2', label: 'Connection' }],
			};

			const result = generateMermaidFlowchart(input);

			expect(result).toContain('node1 --> |Connection| node2');
		});
	});

	describe('Styling', () => {
		test('should apply custom colors to nodes when provided', () => {
			const input = {
				nodes: [
					{
						id: 'node1',
						x: 0,
						y: 0,
						width: 100,
						height: 50,
						type: 'text',
						text: 'Colored Node',
						color: '1',
					},
				],
				edges: [],
			};
			const customColors = { 1: '#ff0000' };

			const result = generateMermaidFlowchart(input, customColors);

			expect(result).toContain('style node1 fill:#ff0000');
		});

		test('should apply custom colors to edges when provided', () => {
			const input = {
				nodes: [{ id: 'node1', type: 'text', text: 'Node 1', x: 0, y: 0, width: 100, height: 50 }],
				edges: [{ id: 'edge1', fromNode: 'node1', toNode: 'node1', color: '2' }],
			};

			const result = generateMermaidFlowchart(input, { 2: '#00ff00' });

			expect(result).toContain('linkStyle 0 stroke:#00ff00');
		});
	});
});
