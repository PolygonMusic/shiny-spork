import AudioPlayer from 'react-h5-audio-player';
import 'react-h5-audio-player/lib/styles.css';
import Player from '../image/play.svg'



const MusicFooter = (props) => {

  return (
    <div className="flex justify-between items-center bg-blueish p-4 w-full border-t-4 border-purple sticky bottom-0 z-50" >
      <AudioPlayer
          src={props.data}
          volume={0.5}
        //   customIcons={{
        //     play: Player
        //   }}
          // Try other props!
        />
    </div>
  );
}

export default MusicFooter;