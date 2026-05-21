import { Maximize, Mic, MicOff, PhoneOff, Video, VideoOff } from 'lucide-react'

export default function CallControls({ muted, cameraOff, onMute, onCamera, onEnd, video = true }) {
  return (
    <div className="absolute bottom-5 left-1/2 z-10 flex -translate-x-1/2 items-center gap-3 rounded-lg border border-white/10 bg-slate-950/80 p-3 backdrop-blur-xl">
      <button className="icon-btn" title="Mute microphone" onClick={onMute}>{muted ? <MicOff size={20} /> : <Mic size={20} />}</button>
      {video && <button className="icon-btn" title="Toggle camera" onClick={onCamera}>{cameraOff ? <VideoOff size={20} /> : <Video size={20} />}</button>}
      <button className="icon-btn" title="Fullscreen" onClick={() => document.documentElement.requestFullscreen?.()}><Maximize size={20} /></button>
      <button className="grid h-11 w-11 place-items-center rounded-lg bg-rose-500 text-white" title="End call" onClick={onEnd}><PhoneOff size={20} /></button>
    </div>
  )
}
