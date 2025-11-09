import './App.css';
import GraphCanvas from './components/graph/GraphCanvas';
import { UserForm } from './components/ui/UserForm';
import { useGraph } from './context/GraphContext'; // <-- 1. Import the hook

function App() {
  // 2. Get the real function and loading state from context
  const { createUser, state } = useGraph();

  return (
    <div className="app-container">
      <aside className="sidebar">
        <h2>Controls</h2>

        {/* 3. Pass the real function and state to the form */}
        <UserForm onSubmit={createUser} isSubmitting={state.isMutating} />

        <hr style={{ margin: '20px 0' }} />
      </aside>

      <main className="main-content">
        <GraphCanvas />
      </main>
    </div>
  );
}

export default App;