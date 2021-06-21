import React, { useState, useEffect } from 'react'
import _uniqueId from 'lodash/uniqueId';
import { DragDropContext, DraggableLocation } from 'react-beautiful-dnd'
import DraggingSurface from './DraggingSurface'
import { SoundsQuery, useUpdateTrackMutation } from '../generated/graphql';
import { makeDNDArray } from '../utils/makeArray';

export interface Item {
  id: string;
  content: string;
}

const reorder = (list: Item[], startIndex: number, endIndex: number): Item[] => {
  const result = Array.from(list)
  const [removed] = result.splice(startIndex, 1)
  result.splice(endIndex, 0, removed)

  return result
}

const move = (source: Item[], destination: Item[], droppableSource: DraggableLocation, droppableDestination: DraggableLocation) => {
  const check = droppableSource.droppableId != "lib"
  const sourceClone: Item[] = [...source]
  const destClone: Item[] = [...destination];
  const { id, content } = source[droppableSource.index]
  if (check)
    sourceClone.splice(droppableSource.index, 1)
  if (droppableDestination.droppableId != "lib")
    destClone.splice(droppableDestination.index, 0, { id: check ? id : `${_uniqueId()}`, content: content })

  const result: any = {};
  result[droppableSource.droppableId] = sourceClone
  result[droppableDestination.droppableId] = destClone

  return result
}

interface EditingRoomProps {
  soundsData: SoundsQuery,
  id: number,
  preloadSounds: any[],
}



const EditingRoom: React.FC<EditingRoomProps> = ({ soundsData, id, preloadSounds }) => {
  const library = makeDNDArray(soundsData.sounds.length, soundsData.sounds.sounds, 0)
  preloadSounds = preloadSounds.map(({ track }: any) => track)[0];
  const track1 = preloadSounds ? makeDNDArray(preloadSounds.length, preloadSounds, 0, true) : []
  const [, updateTrack] = useUpdateTrackMutation();
  const [sounds, setSounds] = useState<any>({ track1 })

  useEffect(() => {
    setSounds({ track1 })
  }, [preloadSounds]);


  const onDragEnd = (result: any) => {
    const { source, destination } = result
    const { droppableId: sourceDroppable, index: sourceItem } = source
    const { droppableId: destinationDroppable, index: destinationItem } = destination
    if (!destination) {
      return
    }
    if (sourceDroppable === destinationDroppable) {
      if (sourceDroppable === "lib")
        return;
      const items = reorder(
        sounds[sourceDroppable],
        sourceItem,
        destinationItem
      )
      const track = items.map(({ content }: any) => content);
      updateTrack({ roomId: id, trackId: 1, track });
      // socket!.emit("message", { track: { items }, trackId: { sourceDroppable }, roomId: id })
    } else {
      const result = move(
        sourceDroppable === "lib" ? library : sounds[sourceDroppable],
        destinationDroppable === "lib" ? library : sounds[destinationDroppable],
        source,
        destination
      )
      const track = result[destinationDroppable != "lib" ? destinationDroppable : sourceDroppable].map(({ content }: any) => content);
      const updateObj = {
        roomId: id,
        trackId: 1,
        track
      };
      updateTrack(updateObj);
    }
  }

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <DraggingSurface surfaceId={"lib"} sounds={library} />
      <DraggingSurface surfaceId={"track1"} sounds={sounds.track1.length > 0 ? sounds.track1 : null} />
    </DragDropContext>
  )

}

export default EditingRoom