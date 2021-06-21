import React from 'react'

interface SliderProps {
  duration: string,
  currentTime: string,
};

const ControlPanel: React.FC<SliderProps> =({ duration, currentTime})=> {
  function secondsToHms(seconds: string) {
    if (!seconds) return '00m 00s';

    let duration: number = seconds as unknown as number;
    let hours = (duration/ 3600).toFixed()+"";
    duration = duration % 3600;

    let min = (duration/ 60).toFixed() + "";
    duration = duration % 60;

    let sec = duration.toFixed()+"";

    if (parseInt(sec) < 10) {
      sec = `0${sec}`
    }
    if (parseInt(min) < 10) {
      min = `0${min}`
    }

    if (parseInt(hours + "", 10) > 0) {
      return `${parseInt(hours+ "", 10)}h ${min}m ${sec}s`
    } else if (min == '0') {
      return `00m ${sec}s`
    } else {
      return `${min}m ${sec}s`
    }
  }

  return (
    <div className='control-panel'>
      <div className='timer'>{secondsToHms(currentTime)}</div>
      <div className='timer'>{secondsToHms(duration)}</div>
    </div>
  )
}
export default ControlPanel