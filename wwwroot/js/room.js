let connection;
let localStream;
let remoteStream;
let peerConnection;
let userName;
let roomId;
let isVideoEnabled = true;
let isAudioEnabled = true;

// WebRTC configuration
const rtcConfig = {
    iceServers: [
        { urls: 'stun:stun.l.google.com:19302' },
        { urls: 'stun:stun1.l.google.com:19302' }
    ]
};

document.addEventListener('DOMContentLoaded', async function() {
    // Get room ID and user name
    roomId = window.roomId;
    userName = sessionStorage.getItem('userName') || 'Anonymous';
    
    // Update UI
    document.getElementById('roomIdDisplay').textContent = roomId;
    
    // Initialize SignalR connection
    await initializeSignalR();
    
    // Initialize media devices
    await initializeMedia();
    
    // Setup event listeners
    setupEventListeners();
    
    // Join the room
    await joinRoom();
});

// Initialize SignalR connection
async function initializeSignalR() {
    connection = new signalR.HubConnectionBuilder()
        .withUrl("/chatHub")
        .build();

    // Chat message received
    connection.on("ReceiveRoomMessage", function (user, message) {
        addMessageToChat(user, message);
    });

    // User joined
    connection.on("UserJoined", function (user) {
        addSystemMessage(`${user} joined the room`);
        updateUserCount();
    });

    // User left
    connection.on("UserLeft", function (user) {
        addSystemMessage(`${user} left the room`);
        updateUserCount();
    });

    // WebRTC signaling
    connection.on("ReceiveOffer", async function (offer) {
        await handleReceiveOffer(offer);
    });

    connection.on("ReceiveAnswer", async function (answer) {
        await handleReceiveAnswer(answer);
    });

    connection.on("ReceiveIceCandidate", function (candidate) {
        handleReceiveIceCandidate(candidate);
    });

    // Start connection
    try {
        await connection.start();
        updateConnectionStatus('Connected');
        console.log("SignalR Connected");
    } catch (err) {
        console.error("SignalR Connection Error: ", err);
        updateConnectionStatus('Disconnected');
    }
}

// Initialize media devices
async function initializeMedia() {
    try {
        localStream = await navigator.mediaDevices.getUserMedia({
            video: { width: 1280, height: 720 },
            audio: {
                echoCancellation: true,
                noiseSuppression: true,
                autoGainControl: true
            }
        });
        
        const localVideo = document.getElementById('localVideo');
        localVideo.srcObject = localStream;
        
        // Initialize peer connection
        initializePeerConnection();
        
    } catch (error) {
        console.error('Error accessing media devices:', error);
        showNotification('Error accessing camera/microphone', 'error');
    }
}

// Initialize peer connection
function initializePeerConnection() {
    peerConnection = new RTCPeerConnection(rtcConfig);
    
    // Add local stream to peer connection
    localStream.getTracks().forEach(track => {
        peerConnection.addTrack(track, localStream);
    });
    
    // Handle remote stream
    peerConnection.ontrack = (event) => {
        remoteStream = event.streams[0];
        const remoteVideo = document.getElementById('remoteVideo');
        remoteVideo.srcObject = remoteStream;
        
        // Show remote video container
        document.getElementById('remoteVideoContainer').style.display = 'block';
        
        updateUserCount();
    };
    
    // Handle ICE candidates
    peerConnection.onicecandidate = (event) => {
        if (event.candidate) {
            connection.invoke("SendIceCandidate", roomId, event.candidate);
        }
    };
    
    // Handle connection state changes
    peerConnection.onconnectionstatechange = () => {
        console.log('Connection state:', peerConnection.connectionState);
        updateConnectionStatus(peerConnection.connectionState);
    };
}

// Setup event listeners
function setupEventListeners() {
    // Chat functionality
    const messageInput = document.getElementById('messageInput');
    const sendButton = document.getElementById('sendMessage');
    
    sendButton.addEventListener('click', sendMessage);
    messageInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            sendMessage();
        }
    });
    
    // Video controls
    document.getElementById('toggleVideo').addEventListener('click', toggleVideo);
    document.getElementById('toggleAudio').addEventListener('click', toggleAudio);
    document.getElementById('shareScreen').addEventListener('click', shareScreen);
    document.getElementById('leaveCall').addEventListener('click', leaveCall);
    
    // Copy room ID
    document.querySelector('.copy-room-id').addEventListener('click', function() {
        copyToClipboard(roomId);
    });
    
    // Handle page visibility changes
    document.addEventListener('visibilitychange', function() {
        if (document.hidden) {
            // Page is hidden
        } else {
            // Page is visible
            updateUserCount();
        }
    });
    
    // Handle beforeunload
    window.addEventListener('beforeunload', function() {
        leaveRoom();
    });
}

// Join room
async function joinRoom() {
    try {
        await connection.invoke("JoinRoom", roomId, userName);
        
        // Create and send offer for video call
        const offer = await peerConnection.createOffer();
        await peerConnection.setLocalDescription(offer);
        await connection.invoke("SendOffer", roomId, offer);
        
    } catch (error) {
        console.error('Error joining room:', error);
    }
}

// Leave room
async function leaveRoom() {
    try {
        if (connection) {
            await connection.invoke("LeaveRoom", roomId, userName);
        }
        
        // Clean up media
        if (localStream) {
            localStream.getTracks().forEach(track => track.stop());
        }
        
        if (peerConnection) {
            peerConnection.close();
        }
        
    } catch (error) {
        console.error('Error leaving room:', error);
    }
}

// Chat functions
function sendMessage() {
    const messageInput = document.getElementById('messageInput');
    const message = messageInput.value.trim();
    
    if (message) {
        connection.invoke("SendRoomMessage", roomId, userName, message);
        messageInput.value = '';
    }
}

function addMessageToChat(user, message) {
    const chatMessages = document.getElementById('chatMessages');
    const messageElement = document.createElement('div');
    messageElement.className = 'message';
    
    const timestamp = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    
    messageElement.innerHTML = `
        <div class="message-header">${user} • ${timestamp}</div>
        <div class="message-content">${escapeHtml(message)}</div>
    `;
    
    chatMessages.appendChild(messageElement);
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

function addSystemMessage(message) {
    const chatMessages = document.getElementById('chatMessages');
    const messageElement = document.createElement('div');
    messageElement.className = 'message system-message';
    
    const timestamp = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    
    messageElement.innerHTML = `
        <div class="message-header">System • ${timestamp}</div>
        <div class="message-content" style="background: rgba(79, 172, 254, 0.2); border-left-color: #4facfe;">
            <i class="fas fa-info-circle"></i> ${message}
        </div>
    `;
    
    chatMessages.appendChild(messageElement);
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

// Video control functions
function toggleVideo() {
    isVideoEnabled = !isVideoEnabled;
    const videoTrack = localStream.getVideoTracks()[0];
    
    if (videoTrack) {
        videoTrack.enabled = isVideoEnabled;
    }
    
    const button = document.getElementById('toggleVideo');
    const icon = button.querySelector('i');
    
    if (isVideoEnabled) {
        icon.className = 'fas fa-video';
        button.style.background = 'rgba(255, 255, 255, 0.15)';
    } else {
        icon.className = 'fas fa-video-slash';
        button.style.background = 'rgba(245, 87, 108, 0.5)';
    }
}

function toggleAudio() {
    isAudioEnabled = !isAudioEnabled;
    const audioTrack = localStream.getAudioTracks()[0];
    
    if (audioTrack) {
        audioTrack.enabled = isAudioEnabled;
    }
    
    const button = document.getElementById('toggleAudio');
    const icon = button.querySelector('i');
    
    if (isAudioEnabled) {
        icon.className = 'fas fa-microphone';
        button.style.background = 'rgba(255, 255, 255, 0.15)';
    } else {
        icon.className = 'fas fa-microphone-slash';
        button.style.background = 'rgba(245, 87, 108, 0.5)';
    }
}

async function shareScreen() {
    try {
        const screenStream = await navigator.mediaDevices.getDisplayMedia({
            video: true,
            audio: true
        });
        
        // Replace video track
        const videoTrack = screenStream.getVideoTracks()[0];
        const sender = peerConnection.getSenders().find(s => 
            s.track && s.track.kind === 'video'
        );
        
        if (sender) {
            await sender.replaceTrack(videoTrack);
        }
        
        // Update local video
        document.getElementById('localVideo').srcObject = screenStream;
        
        // Handle screen share end
        videoTrack.onended = async () => {
            const videoTrack = localStream.getVideoTracks()[0];
            await sender.replaceTrack(videoTrack);
            document.getElementById('localVideo').srcObject = localStream;
        };
        
        showNotification('Screen sharing started', 'success');
        
    } catch (error) {
        console.error('Error sharing screen:', error);
        showNotification('Error sharing screen', 'error');
    }
}

function leaveCall() {
    if (confirm('Are you sure you want to leave the call?')) {
        window.location.href = '/';
    }
}

// WebRTC signaling handlers
async function handleReceiveOffer(offer) {
    try {
        await peerConnection.setRemoteDescription(offer);
        const answer = await peerConnection.createAnswer();
        await peerConnection.setLocalDescription(answer);
        await connection.invoke("SendAnswer", roomId, answer);
    } catch (error) {
        console.error('Error handling offer:', error);
    }
}

async function handleReceiveAnswer(answer) {
    try {
        await peerConnection.setRemoteDescription(answer);
    } catch (error) {
        console.error('Error handling answer:', error);
    }
}

async function handleReceiveIceCandidate(candidate) {
    try {
        await peerConnection.addIceCandidate(candidate);
    } catch (error) {
        console.error('Error handling ICE candidate:', error);
    }
}

// Utility functions
function updateUserCount() {
    const userCountElement = document.getElementById('userCount');
    const remoteVideoContainer = document.getElementById('remoteVideoContainer');
    
    if (remoteVideoContainer.style.display === 'block') {
        userCountElement.textContent = '2';
    } else {
        userCountElement.textContent = '1';
    }
}

function updateConnectionStatus(status) {
    const statusElement = document.getElementById('connectionStatus');
    statusElement.textContent = status;
    
    // Update status color
    switch(status.toLowerCase()) {
        case 'connected':
            statusElement.style.color = '#4ade80';
            break;
        case 'connecting':
            statusElement.style.color = '#fbbf24';
            break;
        case 'disconnected':
        case 'failed':
            statusElement.style.color = '#f87171';
            break;
        default:
            statusElement.style.color = '#ffffff';
    }
}

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}