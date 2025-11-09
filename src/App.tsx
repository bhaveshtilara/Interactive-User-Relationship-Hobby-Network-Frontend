import './App.css';
// 1. Import the new component
import GraphCanvas from './components/graph/GraphCanvas';

function App() {
  return (
    <div className="app-container">
      {/* 1. Sidebar */}
      <aside className="sidebar">
        <h2>Controls</h2>
        <hr />
      </aside>

      {/* 2. Main Graph Area */}
      <main className="main-content">
        <GraphCanvas />
      </main>
    </div>
  );
}

export default App;