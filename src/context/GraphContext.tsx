import {
  createContext,
  useContext,
  useReducer,
  useCallback,
  type ReactNode,
} from 'react';
import type { GraphNode, GraphEdge, UserInput } from '../types';
import { getGraphData, createUser as apiCreateUser, linkUsers as apiLinkUsers, deleteUser as apiDeleteUser, updateUser as apiUpdateUser,} from '../services/api';
import toast from 'react-hot-toast';

interface GraphState {
  nodes: GraphNode[];
  edges: GraphEdge[];
  isLoading: boolean;
  isMutating: boolean; 
  error: string | null;
  selectedNodeId: string | null;
}

type GraphAction =
  | { type: 'FETCH_START' }
  | { type: 'FETCH_SUCCESS'; payload: { nodes: GraphNode[]; edges: GraphEdge[] } }
  | { type: 'FETCH_ERROR'; payload: string }
  | { type: 'MUTATION_START' } 
  | { type: 'MUTATION_END' }
  | { type: 'SELECT_NODE'; payload: string | null };

interface GraphContextType {
  state: GraphState;
  fetchData: () => Promise<void>;
  createUser: (userData: UserInput) => Promise<void>;
  linkUsers: (sourceId: string, targetId: string) => Promise<void>;
  selectNode: (nodeId: string | null) => void;
  deleteUser: (userId: string) => Promise<void>;
  updateUser: (userId: string, userData: Partial<UserInput>) => Promise<void>;
}

const GraphContext = createContext<GraphContextType | undefined>(undefined);

const initialState: GraphState = {
  nodes: [],
  edges: [],
  isLoading: true,
  isMutating: false,
  error: null,
  selectedNodeId: null,
};

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
      toast.error(msg); 
    }
  }, []);

  const createUser = async (userData: UserInput) => {
    dispatch({ type: 'MUTATION_START' });
    try {
      await toast.promise(
        apiCreateUser(userData),
        {
          loading: 'Creating user...',
          success: (newUser) => `User "${newUser.username}" created!`,
          error: 'Failed to create user.',
        }
      );
      await fetchData();
    } catch (err) {
      console.error(err);
    } finally {
      dispatch({ type: 'MUTATION_END' });
    }
  };
  
  const deleteUser = async (userId: string) => {
    dispatch({ type: 'MUTATION_START' });
    try {
      await toast.promise(
        apiDeleteUser(userId), 
        {
          loading: 'Deleting user...',
          success: 'User deleted!',
          error: (err) =>
            err.response?.data?.detail || 'Failed to delete user.',
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
  

  const linkUsers = async (sourceId: string, targetId: string) => {
    dispatch({ type: 'MUTATION_START' });
    try {
      await toast.promise(
        apiLinkUsers(sourceId, targetId), 
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
      apiUpdateUser(userId, userData), 
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

  const value = { state, fetchData, createUser, linkUsers, selectNode, deleteUser, updateUser };

  return (
    <GraphContext.Provider value={value}>{children}</GraphContext.Provider>
  );
};

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