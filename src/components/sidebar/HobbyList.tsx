import { useState, useMemo } from 'react';
import { useGraph } from '../../context/GraphContext';

export const HobbyList = () => {
  const [filter, setFilter] = useState('');
  const { state } = useGraph();

  const allHobbies = useMemo(() => {
    const hobbySet = new Set<string>();
    state.nodes.forEach((node) => {
      node.data.hobbies.forEach((hobby) => {
        hobbySet.add(hobby);
      });
    });
    return Array.from(hobbySet).sort();
  }, [state.nodes]);

  const filteredHobbies = allHobbies.filter((hobby) =>
    hobby.toLowerCase().includes(filter.toLowerCase())
  );

  const onDragStart = (
    event: React.DragEvent<HTMLDivElement>,
    hobby: string
  ) => {
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
            draggable 
            onDragStart={(e) => onDragStart(e, hobby)}
          >
            {hobby}
          </div>
        ))}
      </div>
    </div>
  );
};