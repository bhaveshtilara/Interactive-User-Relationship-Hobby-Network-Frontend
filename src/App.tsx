import './App.css';
import GraphCanvas from './components/graph/GraphCanvas';
import { Sidebar } from './components/sidebar/Sidebar';

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