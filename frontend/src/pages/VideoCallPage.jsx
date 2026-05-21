import { useEffect, useMemo, useRef, useState } from 'react'
import { useLocation, useNavigate, useParams } from 'react-router-dom'
import { getSocket } from '../sockets/socketClient'
import { WebRTCManager } from '../webrtc/webrtcManager'
import CallControls from '../components/call/CallControls'

export default function VideoCallPage({ audioOnly = false }) {
  const { userId } = useParams()
  const location = useLocation()
  const navigate = useNavigate()
  const socket = useMemo(() => getSocket(), [])
  const localRef = useRef(null)
  const remoteRef = useRef(null)
  const managerRef = useRef(null)
  const [muted, setMuted] = useState(false)
  const [cameraOff, setCameraOff] = useState(audioOnly)
  const [quality, setQuality] = useState({ score: 5 })
  const incomingCall = location.state?.incomingCall

  useEffect(() => {
    let mounted = true

    async function boot(callId) {
      if (!mounted) return null
      const manager = new WebRTCManager({ socket, remoteUserId: userId, callId, type: audioOnly ? 'audio' : 'video', onRemoteStream: (stream) => { if (remoteRef.current) remoteRef.current.srcObject = stream }, onQuality: setQuality })
      managerRef.current = manager
      localRef.current.srcObject = await manager.init()
      return manager
    }

    if (incomingCall) {
      boot(incomingCall.callId)
      socket.on('offer', ({ sdp }) => managerRef.current?.handleOffer(sdp))
    } else {
      socket.emit('call-user', { to: userId, type: audioOnly ? 'audio' : 'video' }, async ({ call }) => {
        await boot(call._id)
      })
      socket.on('accept-call', async () => managerRef.current?.createOffer())
      socket.on('answer', ({ sdp }) => managerRef.current?.handleAnswer(sdp))
    }

    socket.on('ice-candidate', ({ candidate }) => managerRef.current?.addIceCandidate(candidate))
    socket.on('end-call', () => navigate('/calls'))
    return () => {
      mounted = false
      managerRef.current?.close()
      socket.off('offer')
      socket.off('accept-call')
      socket.off('answer')
      socket.off('ice-candidate')
      socket.off('end-call')
    }
  }, [audioOnly, incomingCall, navigate, socket, userId])

  function endCall() {
    socket.emit('end-call', { to: userId, callId: managerRef.current?.callId, networkQuality: quality })
    managerRef.current?.close()
    navigate('/calls')
  }

  return (
    <div className="relative h-[calc(100vh-8rem)] overflow-hidden rounded-lg bg-black">
      <video ref={remoteRef} autoPlay playsInline className="h-full w-full object-cover" />
      <video ref={localRef} autoPlay muted playsInline className="absolute right-4 top-4 h-32 w-24 rounded-lg border border-white/20 object-cover shadow-xl md:h-44 md:w-64" />
      <div className="absolute left-4 top-4 rounded-lg bg-slate-950/70 px-3 py-2 text-sm backdrop-blur">Network score {quality.score || 5}/5</div>
      <CallControls
        muted={muted}
        cameraOff={cameraOff}
        video={!audioOnly}
        onMute={() => { managerRef.current?.toggleAudio(muted); setMuted(!muted) }}
        onCamera={() => { managerRef.current?.toggleVideo(cameraOff); setCameraOff(!cameraOff) }}
        onEnd={endCall}
      />
    </div>
  )
}
