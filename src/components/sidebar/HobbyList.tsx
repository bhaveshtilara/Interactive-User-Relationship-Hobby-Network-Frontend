import { useState, useMemo } from 'react';
import { useGraph } from '../../context/GraphContext';

export const HobbyList = () => {
  const [filter, setFilter] = useState('');
  const { state } = useGraph();

  // 1. Get all unique hobbies from all nodes
  const allHobbies = useMemo(() => {
    const hobbySet = new Set<string>();
    state.nodes.forEach((node) => {
      node.data.hobbies.forEach((hobby) => {
        hobbySet.add(hobby);
      });
    });
    return Array.from(hobbySet).sort();
  }, [state.nodes]);

  // 2. Filter hobbies based on search input
  const filteredHobbies = allHobbies.filter((hobby) =>
    hobby.toLowerCase().includes(filter.toLowerCase())
  );

  // 3. This function is called when you start dragging a hobby
  const onDragStart = (
    event: React.DragEvent<HTMLDivElement>,
    hobby: string
  ) => {
    // We store the hobby name in the drag event
    event.dataTransfer.setData('application/x-hobby', hobby);
    event.dataTransfer.effectAllowed = 'move';
  };

  return (
    <div className="hobby-list">
      <h3>All Hobbies</h3>
      <input
        type="text"
        placeholder="Search hobbies..."
        value={filter}
        onChange={(e) => setFilter(e.target.value)}
        style={{ width: '90%', padding: '8px 10px' }}
        className="form-group"
      />
      <div className="hobby-items">
        {filteredHobbies.map((hobby) => (
          <div
            key={hobby}
            className="hobby-item"
            draggable // This makes it draggable
            onDragStart={(e) => onDragStart(e, hobby)} // This sets the data
          >
            {hobby}
          </div>
        ))}
      </div>
    </div>
  );
};