import {
  createContext,
  useContext,
  useReducer,
  useCallback,
  type ReactNode,
} from 'react';
import type { GraphNode, GraphEdge, UserInput } from '../types';
// 1. Import the API functions we need
import { getGraphData, createUser as apiCreateUser, linkUsers as apiLinkUsers, deleteUser as apiDeleteUser, updateUser as apiUpdateUser,} from '../services/api';
// 2. Import toast for notifications
import toast from 'react-hot-toast';

// 1. Define the shape of our state
interface GraphState {
  nodes: GraphNode[];
  edges: GraphEdge[];
  isLoading: boolean;
  isMutating: boolean; // For loading spinners on forms
  error: string | null;
  selectedNodeId: string | null;
}

// 2. Define the actions our reducer can handle
type GraphAction =
  | { type: 'FETCH_START' }
  | { type: 'FETCH_SUCCESS'; payload: { nodes: GraphNode[]; edges: GraphEdge[] } }
  | { type: 'FETCH_ERROR'; payload: string }
  | { type: 'MUTATION_START' } // For create/update/delete
  | { type: 'MUTATION_END' }
  | { type: 'SELECT_NODE'; payload: string | null };

// 3. Define the context value
interface GraphContextType {
  state: GraphState;
  fetchData: () => Promise<void>;
  // 3. Add our new createUser function
  createUser: (userData: UserInput) => Promise<void>;
  linkUsers: (sourceId: string, targetId: string) => Promise<void>;
  selectNode: (nodeId: string | null) => void;
  deleteUser: (userId: string) => Promise<void>;
  updateUser: (userId: string, userData: Partial<UserInput>) => Promise<void>;
}

// 4. Create the Context
const GraphContext = createContext<GraphContextType | undefined>(undefined);

// 5. Define the initial state (add isMutating)
const initialState: GraphState = {
  nodes: [],
  edges: [],
  isLoading: true,
  isMutating: false,
  error: null,
  selectedNodeId: null,
};

// 6. Create the Reducer function (add mutation cases)
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
    case 'MUTATION_START':
      return { ...state, isMutating: true };
    case 'MUTATION_END':
      return { ...state, isMutating: false };
    case 'SELECT_NODE':
      return { ...state, selectedNodeId: action.payload };
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

  // Function to fetch data (no changes)
  const fetchData = useCallback(async () => {
    dispatch({ type: 'FETCH_START' });
    try {
      const data = await getGraphData();
      if (data && Array.isArray(data.nodes) && Array.isArray(data.edges)) {
        const layoutedNodes = getLayoutedNodes(data.nodes);
        dispatch({ type: 'FETCH_SUCCESS', 
        payload: { nodes: layoutedNodes, edges: data.edges },
        });
      } else {
        throw new Error('Received invalid graph data');
      }
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Failed to fetch data';
      dispatch({ type: 'FETCH_ERROR', payload: msg });
      toast.error(msg); // Show error toast
    }
  }, []);

  const createUser = async (userData: UserInput) => {
    dispatch({ type: 'MUTATION_START' });
    try {
      // We wrap the API call in a toast.promise
      await toast.promise(
        apiCreateUser(userData), // The function to run
        {
          loading: 'Creating user...',
          success: (newUser) => `User "${newUser.username}" created!`,
          error: 'Failed to create user.',
        }
      );
      // On success, refresh the graph
      await fetchData();
    } catch (err) {
      console.error(err);
      // Toast already handled the error message
    } finally {
      dispatch({ type: 'MUTATION_END' });
    }
  };
  
  const deleteUser = async (userId: string) => {
    dispatch({ type: 'MUTATION_START' });
    try {
      await toast.promise(
        apiDeleteUser(userId), // The function to run
        {
          loading: 'Deleting user...',
          success: 'User deleted!',
          error: (err) =>
            err.response?.data?.detail || 'Failed to delete user.',
        }
      );
      // On success, refresh the graph and deselect node
      await fetchData();
      dispatch({ type: 'SELECT_NODE', payload: null });
    } catch (err) {
      console.error(err);
      // Toast already handled the error message
    } finally {
      dispatch({ type: 'MUTATION_END' });
    }
  };
  

  const linkUsers = async (sourceId: string, targetId: string) => {
    dispatch({ type: 'MUTATION_START' });
    try {
      await toast.promise(
        apiLinkUsers(sourceId, targetId), // The function to run
        {
          loading: 'Creating friendship...',
          success: 'Friendship created!',
        error: (err) => {
        if (err.response?.data?.detail && Array.isArray(err.response.data.detail)) {
            return err.response.data.detail[0].msg || 'Validation failed';
        }
        return err.response?.data?.detail || 'Failed to create friendship.';
        },
        }
      );
      await fetchData();
    } catch (err) {
      console.error(err);
    } finally {
      dispatch({ type: 'MUTATION_END' });
    }
  };
const updateUser = async (
  userId: string,
  userData: Partial<UserInput>
) => {
  dispatch({ type: 'MUTATION_START' });
  try {
    await toast.promise(
      apiUpdateUser(userId, userData), // API call
      {
        loading: 'Updating user...',
        success: 'User updated!',
        error: (err) =>
          err.response?.data?.detail || 'Failed to update user.',
      }
    );
    await fetchData();
    dispatch({ type: 'SELECT_NODE', payload: null });

  } catch (err) {
    console.error(err);
  } finally {
    dispatch({ type: 'MUTATION_END' });
  }
};

  const selectNode = (nodeId: string | null) => {
    dispatch({ type: 'SELECT_NODE', payload: nodeId });
  };

  // 5. Update the context value
  const value = { state, fetchData, createUser, linkUsers, selectNode, deleteUser, updateUser };

  return (
    <GraphContext.Provider value={value}>{children}</GraphContext.Provider>
  );
};

// 8. Create a custom hook for easy access (no changes)
// eslint-disable-next-line react-refresh/only-export-components
export const useGraph = () => {
  const context = useContext(GraphContext);
  if (context === undefined) {
    throw new Error('useGraph must be used within a GraphProvider');
  }
  return context;
};

const getLayoutedNodes = (nodes: GraphNode[]): GraphNode[] => {
  const nodesPerRow = 5;
  const xOffset = 250;
  const yOffset = 150;

  return nodes.map((node, index) => {
    return {
      ...node,
      position: {
        x: (index % nodesPerRow) * xOffset,
        y: Math.floor(index / nodesPerRow) * yOffset,
      },
    };
  });
};