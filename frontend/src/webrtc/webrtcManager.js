export class WebRTCManager {
  constructor({ socket, remoteUserId, callId, type = 'video', onRemoteStream, onQuality }) {
    this.socket = socket
    this.remoteUserId = remoteUserId
    this.callId = callId
    this.type = type
    this.onRemoteStream = onRemoteStream
    this.onQuality = onQuality
    this.localStream = null
    this.peer = null
    this.qualityTimer = null
  }

  async init() {
    const iceServers = [{ urls: 'stun:stun.l.google.com:19302' }]
    this.peer = new RTCPeerConnection({ iceServers })
    this.localStream = await navigator.mediaDevices.getUserMedia({ audio: true, video: this.type === 'video' })
    this.localStream.getTracks().forEach((track) => this.peer.addTrack(track, this.localStream))
    this.peer.ontrack = (event) => this.onRemoteStream?.(event.streams[0])
    this.peer.onicecandidate = (event) => {
      if (event.candidate) {
        this.socket.emit('ice-candidate', { to: this.remoteUserId, callId: this.callId, candidate: event.candidate })
      }
    }
    this.peer.onconnectionstatechange = () => {
      if (this.peer.connectionState === 'failed') this.peer.restartIce()
    }
    this.startQualityMonitor()
    return this.localStream
  }

  async createOffer() {
    const offer = await this.peer.createOffer({ iceRestart: true })
    await this.peer.setLocalDescription(offer)
    this.socket.emit('offer', { to: this.remoteUserId, callId: this.callId, sdp: offer })
  }

  async handleOffer(sdp) {
    await this.peer.setRemoteDescription(new RTCSessionDescription(sdp))
    const answer = await this.peer.createAnswer()
    await this.peer.setLocalDescription(answer)
    this.socket.emit('answer', { to: this.remoteUserId, callId: this.callId, sdp: answer })
  }

  async handleAnswer(sdp) {
    await this.peer.setRemoteDescription(new RTCSessionDescription(sdp))
  }

  async addIceCandidate(candidate) {
    if (candidate) await this.peer.addIceCandidate(new RTCIceCandidate(candidate))
  }

  toggleAudio(enabled) {
    this.localStream?.getAudioTracks().forEach((track) => { track.enabled = enabled })
  }

  toggleVideo(enabled) {
    this.localStream?.getVideoTracks().forEach((track) => { track.enabled = enabled })
  }

  startQualityMonitor() {
    this.qualityTimer = setInterval(async () => {
      if (!this.peer) return
      const stats = await this.peer.getStats()
      let packetsLost = 0
      let rtt = 0
      stats.forEach((report) => {
        if (report.type === 'inbound-rtp') packetsLost += report.packetsLost || 0
        if (report.type === 'candidate-pair' && report.currentRoundTripTime) rtt = report.currentRoundTripTime
      })
      this.onQuality?.({ packetsLost, rtt, score: Math.max(1, 5 - Math.ceil(rtt * 10) - Math.min(3, packetsLost)) })
    }, 5000)
  }

  close() {
    clearInterval(this.qualityTimer)
    this.localStream?.getTracks().forEach((track) => track.stop())
    this.peer?.close()
  }
}
