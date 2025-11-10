import { useMemo, useState } from 'react';
import { useGraph } from '../../context/GraphContext';
import { UserForm, type FormValues } from '../ui/UserForm';
import type { UserInput } from '../../types';
import { HobbyList } from './HobbyList';

export const Sidebar = () => {
  const [isEditing, setIsEditing] = useState(false);
  const { state, createUser, selectNode, deleteUser, updateUser } = useGraph();
  const { selectedNodeId, nodes, isMutating } = state;

  const selectedNode = useMemo(() => {
    return nodes.find((node) => node.id === selectedNodeId);
  }, [selectedNodeId, nodes]);

  // --- Handlers ---
  const handleCreateUser = async (data: UserInput) => {
    await createUser(data);
  };

  const handleDelete = () => {
    if (!selectedNode) return;
    if (
      window.confirm(
        `Are you sure you want to delete ${selectedNode.data.label}?`
      )
    ) {
      deleteUser(selectedNode.id);
    }
  };

  const handleUpdateUser = async (data: UserInput) => {
    if (!selectedNode) return;
    await updateUser(selectedNode.id, data);
    setIsEditing(false); // Go back to "details" view
  };

  const handleBack = () => {
    selectNode(null);
    setIsEditing(false);
  };

  // --- Default Values for Edit Form ---
  const defaultFormValues: FormValues | undefined = useMemo(() => {
    if (!selectedNode) return undefined;
    return {
      username: selectedNode.data.label,
      age: selectedNode.data.age,
      hobbies: selectedNode.data.hobbies.join(', '),
    };
  }, [selectedNode]); // Memoize this to prevent re-renders

  return (
    <aside className="sidebar">
      <h2>Controls</h2>

      {/* --- 1. CREATE FORM --- */}
      {!selectedNode && (
        <UserForm
          onSubmit={handleCreateUser}
          isSubmitting={isMutating}
          mode="create"
        />
      )}

      {/* --- 2. SELECTED NODE PANEL --- */}
      {selectedNode && (
        <div className="selected-node-panel">
          {!isEditing ? (
            <>
              {/* --- 2a. DETAILS VIEW --- */}
              <h3>{selectedNode.data.label}</h3>
              <p>Age: {selectedNode.data.age}</p>
              <p>Score: {selectedNode.data.popularityScore}</p>
              <p>Hobbies: {selectedNode.data.hobbies.join(', ') || 'None'}</p>
              <button
                className="form-button"
                style={{ background: '#ffc107' }}
                onClick={() => setIsEditing(true)} // This is the button
              >
                Edit User
              </button>
              <button
                className="form-button"
                style={{ background: '#dc3545', marginTop: '10px' }}
                onClick={handleDelete}
                disabled={isMutating}
              >
                {isMutating ? 'Deleting...' : 'Delete User'}
              </button>
              <button
                className="form-button"
                style={{ background: '#6c757d', marginTop: '10px' }}
                onClick={handleBack}
              >
                Back to Create
              </button>
            </>
          ) : (
            <>
              {/* --- 2b. EDIT VIEW --- */}
              <UserForm
                onSubmit={handleUpdateUser}
                isSubmitting={isMutating}
                mode="edit"
                defaultValues={defaultFormValues}
              />
              <button
                className="form-button"
                style={{ background: '#6c757d', marginTop: '10px' }}
                onClick={() => setIsEditing(false)} // Cancel button
              >
                Cancel
              </button>
            </>
          )}
        </div>
      )}

      <hr style={{ margin: '20px 0' }} />
      {/* Hobby List will go here */}
      <HobbyList />
    </aside>
  );
};