import { Flex } from '@chakra-ui/layout';
import React from 'react';
import { Draggable, DraggableProvided, DraggableStateSnapshot } from 'react-beautiful-dnd';
import { Item } from './EditingRoom';
import MusicItem from './musicItem/MusicItem';

const grid = 8;

const getItemStyle = (_isDragging: boolean, draggableStyle: any) => ({
  userSelect: 'none',
  padding: grid * 2,

  ...draggableStyle,
});
type DraggableSoundProps = {
  sounds: Item[];
};

const DraggableSound = ({sounds}:DraggableSoundProps) => {
    return (
        <Flex>
            {sounds?.map((item: Item, index: number) => (
                <Draggable key={item.id} draggableId={item.id} index={index}>
                  {(provided:DraggableProvided, snapshot:DraggableStateSnapshot) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                      style={getItemStyle(
                        snapshot.isDragging,
                        provided.draggableProps.style
                      )}
                    >
                      <MusicItem song={item.content} name={item.content.substring(22, item.content.length-4)}/>
                    </div>
                  )}
                </Draggable>
            ))}
        </Flex>
    );
};

export default DraggableSound;