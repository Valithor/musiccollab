import { Text } from "@chakra-ui/react"
import { useRef, useState } from 'react'
import ControlPanel from './controls/ControlPanel'
import Slider from './slider/Slider'

interface SliderProps {
  song: string,
  name: string,
};

const MusicItem: React.FC<SliderProps> = ({ song, name }) => {
  const [percentage, setPercentage] = useState<number>(0)
  const [isPlaying, setIsPlaying] = useState<Boolean>(false)
  const [duration, setDuration] = useState<string>("0")
  const [currentTime, setCurrentTime] = useState<string>("0")

  const audioRef = useRef() as React.MutableRefObject<HTMLAudioElement>;

  const onChange = (e: any) => {
    const audio = audioRef.current
    audio!.currentTime = (audio!.duration / 100) * e.target.value
    setPercentage(e.target.value)
  }

  const play = () => {
    const audio = audioRef.current
    audio!.volume = 0.1

    if (!isPlaying) {
      setIsPlaying(true)
      audio!.play()
    }

    if (isPlaying) {
      setIsPlaying(false)
      audio!.pause()
    }
  }

  const getCurrDuration = (e: any) => {
    const percent = ((e.currentTarget.currentTime / e.currentTarget.duration) * 100).toFixed(2)
    const time = e.currentTarget.currentTime

    setPercentage(+percent)
    setCurrentTime(time.toFixed(2))
  }

  return (
    <div className='sound-container' onClick={play}>
      <Text fontSize="xs" color="white" align="center">{name}</Text>
      <Slider percentage={percentage} onChange={onChange} />
      <audio
        ref={audioRef}
        onTimeUpdate={getCurrDuration}
        onLoadedData={(e) => {
          setDuration(e.currentTarget.duration.toFixed(2))
        }}
        src={song}
      ></audio>
      <ControlPanel
        duration={duration}
        currentTime={currentTime}
      />
    </div>
  )
}

export default MusicItem;