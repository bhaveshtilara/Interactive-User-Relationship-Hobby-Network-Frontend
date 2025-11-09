// This file defines the shape of our data

import type { Node, Edge } from 'reactflow';
/**
 * Data stored inside a User node
 */
export interface UserNodeData {
  label: string;      // The username
  age: number;
  hobbies: string[];
  popularityScore: number;
  createdAt: string;
}

/**
 * A custom Graph Node type
 */
export type GraphNode = Node<UserNodeData>;

/**
 * A standard Graph Edge type
 */
export type GraphEdge = Edge;

/**
 * The response from our GET /api/graph endpoint
 */
export interface GraphData {
  nodes: GraphNode[];
  edges: GraphEdge[];
}

/**
 * The User object for POST/PUT operations
 */
export interface UserInput {
  username: string;
  age: number;
  hobbies: string[];
}