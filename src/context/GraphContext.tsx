import { createContext, useContext, useReducer, type ReactNode, useCallback } from 'react';
import type { GraphNode, GraphEdge } from '../types';
import { getGraphData } from '../services/api';

// 1. Define the shape of our state
interface GraphState {
  nodes: GraphNode[];
  edges: GraphEdge[];
  isLoading: boolean;
  error: string | null;
}

// 2. Define the actions our reducer can handle
type GraphAction =
  | { type: 'FETCH_START' }
  | { type: 'FETCH_SUCCESS'; payload: { nodes: GraphNode[]; edges: GraphEdge[] } }
  | { type: 'FETCH_ERROR'; payload: string };

// 3. Define the context value
interface GraphContextType {
  state: GraphState;
  fetchData: () => Promise<void>; // A function to refetch data
  // We'll add mutation functions (like createUser) here later
}

// 4. Create the Context
const GraphContext = createContext<GraphContextType | undefined>(undefined);

// 5. Define the initial state
const initialState: GraphState = {
  nodes: [],
  edges: [],
  isLoading: true,
  error: null,
};

// 6. Create the Reducer function
const graphReducer = (state: GraphState, action: GraphAction): GraphState => {
  switch (action.type) {
    case 'FETCH_START':
      return { ...state, isLoading: true, error: null };
    case 'FETCH_SUCCESS':
      return {
        ...state,
        isLoading: false,
        nodes: action.payload.nodes,
        edges: action.payload.edges,
      };
    case 'FETCH_ERROR':
      return { ...state, isLoading: false, error: action.payload };
    default:
      return state;
  }
};

// 7. Create the Provider Component
interface GraphProviderProps {
  children: ReactNode;
}

export const GraphProvider = ({ children }: GraphProviderProps) => {
  const [state, dispatch] = useReducer(graphReducer, initialState);

  const fetchData = useCallback(async () => {
    dispatch({ type: 'FETCH_START' });
    try {
      const data = await getGraphData(); 

      if (data && Array.isArray(data.nodes) && Array.isArray(data.edges)) {
        dispatch({ type: 'FETCH_SUCCESS', payload: { nodes: data.nodes, edges: data.edges } });
      } else {
        throw new Error('Received invalid graph data from server');
      }

    } catch (err) {
      let errorMessage = 'Failed to fetch data';
      if (err instanceof Error) {
        errorMessage = err.message;
      }
      dispatch({ type: 'FETCH_ERROR', payload: errorMessage });
    }
  }, []);

  const value = { state, fetchData };

  return (
    <GraphContext.Provider value={value}>{children}</GraphContext.Provider>
  );
};

// 8. Create a custom hook for easy access
// eslint-disable-next-line react-refresh/only-export-components
export const useGraph = () => {
  const context = useContext(GraphContext);
  if (context === undefined) {
    throw new Error('useGraph must be used within a GraphProvider');
  }
  return context;
};