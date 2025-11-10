import './App.css';
import GraphCanvas from './components/graph/GraphCanvas';
// 1. Remove UserForm, import Sidebar
import { Sidebar } from './components/sidebar/Sidebar';
// 2. We can remove useGraph, it's handled in the Sidebar
// import { useGraph } from './context/GraphContext'; 

function App() {

  return (
    <div className="app-container">
      <Sidebar />

      <main className="main-content">
        <GraphCanvas />
      </main>
    </div>
  );
}

export default App;