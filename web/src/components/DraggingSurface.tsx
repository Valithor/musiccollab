import React from 'react';
import { Droppable, DroppableProvided, DroppableStateSnapshot } from 'react-beautiful-dnd';
import DraggableSound from './DraggableSound';
import { Item } from './EditingRoom';

const grid = 8;

const getListStyle = (isDraggingOver: any) => ({
  background: isDraggingOver ? 'lightblue' : 'rgba(255, 0, 0, 0.2)',
  border: '2px solid black',
  padding: grid,
  height: 200,
  overflow: 'auto',
});

type DraggingSurfaceProps = {
  surfaceId: string;
  sounds: Item[];
};

function DraggingSurface( {surfaceId, sounds}: DraggingSurfaceProps ) {
  return (
    <div>
      <Droppable droppableId={surfaceId} direction="horizontal">
        {(provided: DroppableProvided, snapshot: DroppableStateSnapshot) => (
          <div
            ref={provided.innerRef}
            style={getListStyle(snapshot.isDraggingOver)}
            {...provided.droppableProps}
          >
            <DraggableSound sounds={sounds} />

            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </div>
  );
}




export default DraggingSurface;