import Peer from 'simple-peer';

export interface SignalData {
  type: string;
  sdp?: string;
  candidate?: RTCIceCandidate;
}

export interface PeerConnection {
  peer: Peer.Instance;
  stream?: MediaStream;
}

export interface ChatMessage {
  sender: string;
  text: string;
  time: string;
  isUser: boolean;
}

export class WebRTCService {
  private peers: Map<string, PeerConnection> = new Map();
  private localStream: MediaStream | null = null;
  private roomId: string | null = null;
  private peerId: string | null = null;
  private pollInterval: NodeJS.Timeout | null = null;
  private userName: string = "User";
  
  // Callbacks
  private onPeerConnected: ((peerId: string, stream: MediaStream) => void) | null = null;
  private onPeerDisconnected: ((peerId: string) => void) | null = null;
  private onChatMessageReceived: ((message: ChatMessage) => void) | null = null;
  
  constructor(userName: string = "User") {
    // Generate a random peer ID for this client
    this.peerId = Math.random().toString(36).substring(2, 15);
    this.userName = userName;
  }
  
  public async initialize(roomId: string, videoElement: HTMLVideoElement): Promise<MediaStream> {
    this.roomId = roomId;
    
    // Get user media
    try {
      this.localStream = await navigator.mediaDevices.getUserMedia({ 
        video: true, 
        audio: true 
      });
      
      // Attach local stream to video element
      videoElement.srcObject = this.localStream;
      
      // Join the room
      await this.joinRoom();
      
      // Start polling for signals
      this.startPolling();
      
      return this.localStream;
    } catch (error) {
      console.error('Error initializing WebRTC:', error);
      throw error;
    }
  }
  
  public async joinRoom(): Promise<string[]> {
    try {
      const response = await fetch('/api/signaling', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          roomId: this.roomId,
          peerId: this.peerId,
          type: 'join',
        }),
      });
      
      const data = await response.json();
      if (!data.success) {
        throw new Error(data.error || 'Failed to join room');
      }
      
      // Connect to existing peers
      data.peers.forEach((remotePeerId: string) => {
        this.connectToPeer(remotePeerId, true);
      });
      
      return data.peers;
    } catch (error) {
      console.error('Error joining room:', error);
      throw error;
    }
  }
  
  public connectToPeer(remotePeerId: string, isInitiator: boolean): void {
    if (!this.localStream) {
      console.error('Local stream not initialized');
      return;
    }
    
    // Create a new peer connection
    const peer = new Peer({
      initiator: isInitiator,
      trickle: true,
      stream: this.localStream,
    });
    
    // Set up event handlers
    peer.on('signal', (data: any) => {
      this.sendSignal(remotePeerId, isInitiator ? 'offer' : 'answer', data);
    });
    
    peer.on('connect', () => {
      console.log('Peer connected:', remotePeerId);
      
      // Send a welcome message
      this.sendChatToPeer(peer, {
        sender: this.userName,
        text: `Hello from ${this.userName}!`,
        time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        isUser: true
      });
    });
    
    peer.on('data', (data: Uint8Array) => {
      try {
        // Convert the binary data to string
        const messageString = new TextDecoder().decode(data);
        const message = JSON.parse(messageString) as ChatMessage;
        
        // Mark as not from this user
        message.isUser = false;
        
        console.log('Received message:', message);
        
        // Notify the UI
        if (this.onChatMessageReceived) {
          this.onChatMessageReceived(message);
        }
      } catch (error) {
        console.error('Error parsing chat message:', error);
      }
    });
    
    peer.on('stream', (stream: MediaStream) => {
      console.log('Received stream from peer:', remotePeerId);
      // Store the stream
      if (this.peers.has(remotePeerId)) {
        const peerConn = this.peers.get(remotePeerId)!;
        peerConn.stream = stream;
        this.peers.set(remotePeerId, peerConn);
      }
      
      // Notify the UI
      if (this.onPeerConnected) {
        this.onPeerConnected(remotePeerId, stream);
      }
    });
    
    peer.on('close', () => {
      console.log('Peer connection closed:', remotePeerId);
      this.peers.delete(remotePeerId);
      
      if (this.onPeerDisconnected) {
        this.onPeerDisconnected(remotePeerId);
      }
    });
    
    peer.on('error', (err: Error) => {
      console.error('Peer error:', err);
      this.peers.delete(remotePeerId);
      
      if (this.onPeerDisconnected) {
        this.onPeerDisconnected(remotePeerId);
      }
    });
    
    // Store the peer
    this.peers.set(remotePeerId, { peer });
  }
  
  public handleSignal(fromPeerId: string, type: string, signal: any): void {
    // Get or create peer connection
    if (!this.peers.has(fromPeerId)) {
      this.connectToPeer(fromPeerId, false);
    }
    
    const peerConn = this.peers.get(fromPeerId);
    if (peerConn) {
      peerConn.peer.signal(signal);
    }
  }
  
  private async sendSignal(targetPeerId: string, type: string, payload: any): Promise<void> {
    try {
      await fetch('/api/signaling', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          roomId: this.roomId,
          peerId: this.peerId,
          target: targetPeerId,
          type,
          payload,
        }),
      });
    } catch (error) {
      console.error('Error sending signal:', error);
    }
  }
  
  private async pollSignals(): Promise<void> {
    try {
      const response = await fetch('/api/signaling', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          roomId: this.roomId,
          peerId: this.peerId,
          type: 'poll',
        }),
      });
      
      const data = await response.json();
      if (data.success && data.signals) {
        // Process any received signals
        data.signals.forEach((signal: any) => {
          this.handleSignal(signal.from, signal.type, signal.payload);
        });
      }
    } catch (error) {
      console.error('Error polling signals:', error);
    }
  }
  
  private startPolling(): void {
    this.pollInterval = setInterval(() => {
      this.pollSignals();
    }, 1000); // Poll every second
  }
  
  // New method to send a chat message to all peers
  public sendChatMessage(message: string): void {
    if (!message.trim()) return;
    
    const chatMessage: ChatMessage = {
      sender: this.userName,
      text: message,
      time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      isUser: true
    };
    
    // Send to all connected peers
    this.peers.forEach(({ peer }) => {
      this.sendChatToPeer(peer, chatMessage);
    });
    
    // Also notify our own UI
    if (this.onChatMessageReceived) {
      this.onChatMessageReceived(chatMessage);
    }
  }
  
  // Helper method to send a chat message to a specific peer
  private sendChatToPeer(peer: Peer.Instance, message: ChatMessage): void {
    try {
      // Convert message object to string and then to binary data
      const messageString = JSON.stringify(message);
      const messageData = new TextEncoder().encode(messageString);
      
      // Send over the data channel
      peer.send(messageData);
    } catch (error) {
      console.error('Error sending chat message to peer:', error);
    }
  }
  
  public toggleAudio(enabled: boolean): void {
    if (this.localStream) {
      this.localStream.getAudioTracks().forEach(track => {
        track.enabled = enabled;
      });
    }
  }
  
  public toggleVideo(enabled: boolean): void {
    if (this.localStream) {
      this.localStream.getVideoTracks().forEach(track => {
        track.enabled = enabled;
      });
    }
  }
  
  public async shareScreen(enable: boolean): Promise<MediaStream | null> {
    if (!this.localStream) return null;
    
    if (enable) {
      try {
        const screenStream = await navigator.mediaDevices.getDisplayMedia({ video: true });
        
        // Replace video track in local stream
        const videoTrack = screenStream.getVideoTracks()[0];
        const oldVideoTracks = this.localStream.getVideoTracks();
        
        if (oldVideoTracks.length > 0) {
          this.localStream.removeTrack(oldVideoTracks[0]);
        }
        
        this.localStream.addTrack(videoTrack);
        
        // Replace video track in all peer connections
        this.peers.forEach((conn) => {
          oldVideoTracks.forEach(track => {
            conn.peer.replaceTrack(track, videoTrack, this.localStream!);
          });
        });
        
        // Set up handler for when user stops sharing screen
        videoTrack.onended = async () => {
          await this.shareScreen(false);
        };
        
        return screenStream;
      } catch (error) {
        console.error('Error sharing screen:', error);
        return null;
      }
    } else {
      // Switch back to camera
      try {
        const cameraStream = await navigator.mediaDevices.getUserMedia({ video: true });
        const videoTrack = cameraStream.getVideoTracks()[0];
        const oldVideoTracks = this.localStream.getVideoTracks();
        
        if (oldVideoTracks.length > 0) {
          this.localStream.removeTrack(oldVideoTracks[0]);
          
          // Stop the old tracks
          oldVideoTracks.forEach(track => track.stop());
        }
        
        this.localStream.addTrack(videoTrack);
        
        // Replace video track in all peer connections
        this.peers.forEach((conn) => {
          oldVideoTracks.forEach(track => {
            conn.peer.replaceTrack(track, videoTrack, this.localStream!);
          });
        });
        
        return cameraStream;
      } catch (error) {
        console.error('Error switching to camera:', error);
        return null;
      }
    }
  }
  
  public setOnPeerConnected(callback: (peerId: string, stream: MediaStream) => void): void {
    this.onPeerConnected = callback;
  }
  
  public setOnPeerDisconnected(callback: (peerId: string) => void): void {
    this.onPeerDisconnected = callback;
  }
  
  public setOnChatMessageReceived(callback: (message: ChatMessage) => void): void {
    this.onChatMessageReceived = callback;
  }
  
  public setUserName(userName: string): void {
    this.userName = userName;
  }
  
  public getRemoteStreams(): Map<string, MediaStream> {
    const streams = new Map<string, MediaStream>();
    this.peers.forEach((conn, peerId) => {
      if (conn.stream) {
        streams.set(peerId, conn.stream);
      }
    });
    return streams;
  }
  
  public async leaveRoom(): Promise<void> {
    // Stop polling
    if (this.pollInterval) {
      clearInterval(this.pollInterval);
    }
    
    // Close all peer connections
    this.peers.forEach((conn) => {
      conn.peer.destroy();
    });
    
    // Clear the peers map
    this.peers.clear();
    
    // Stop local stream tracks
    if (this.localStream) {
      this.localStream.getTracks().forEach(track => track.stop());
      this.localStream = null;
    }
    
    // Signal that we're leaving the room
    if (this.roomId && this.peerId) {
      try {
        await fetch('/api/signaling', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            roomId: this.roomId,
            peerId: this.peerId,
            type: 'leave',
          }),
        });
      } catch (error) {
        console.error('Error leaving room:', error);
      }
    }
  }
} 