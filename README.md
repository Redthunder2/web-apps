# VideoChat - Modern Video & Chat Web App

A beautiful, modern video calling and chat application built with ASP.NET Core, featuring stunning glass morphism design and real-time communication.

## ✨ Features

- **HD Video Calling** - Crystal clear peer-to-peer video calls using WebRTC
- **Real-time Chat** - Instant messaging with SignalR
- **Screen Sharing** - Share your screen during calls
- **Glass Morphism UI** - Modern, beautiful interface with glass morphism effects
- **Responsive Design** - Works perfectly on desktop and mobile devices
- **Room-based System** - Create or join rooms using unique IDs
- **Audio/Video Controls** - Easy toggle for camera and microphone
- **Connection Status** - Real-time connection monitoring
- **User Management** - See who's connected to your room

## 🚀 Technologies Used

- **Backend**: ASP.NET Core 8.0
- **Real-time Communication**: SignalR
- **Video Calling**: WebRTC
- **Frontend**: HTML5, CSS3, JavaScript
- **Styling**: Glass Morphism, Gradient Animations
- **Icons**: Font Awesome
- **Fonts**: Google Fonts (Poppins)

## 🛠️ Getting Started

### Prerequisites

- .NET 8.0 SDK or later
- A modern web browser (Chrome, Firefox, Safari, Edge)
- Camera and microphone (for video calls)

### Installation & Running

1. **Clone or navigate to the project directory**
   ```bash
   cd /workspace
   ```

2. **Restore dependencies**
   ```bash
   dotnet restore
   ```

3. **Build the application**
   ```bash
   dotnet build
   ```

4. **Run the application**
   ```bash
   dotnet run
   ```

5. **Open your browser**
   Navigate to `https://localhost:5001` or `http://localhost:5000`

## 🎯 How to Use

### Starting a Video Call

1. **Enter Your Name**: Type your display name on the home page
2. **Create or Join Room**: 
   - Click "Create Room" to generate a new room
   - Or enter an existing Room ID and click "Join Room"
3. **Allow Camera/Microphone**: Grant permissions when prompted
4. **Share Room ID**: Copy and share the room ID with others to join your call

### During a Call

- **Toggle Video**: Click the video icon to turn your camera on/off
- **Toggle Audio**: Click the microphone icon to mute/unmute
- **Share Screen**: Click the desktop icon to share your screen
- **Chat**: Use the chat panel to send messages
- **Leave Call**: Click the red phone icon to leave

## 🎨 Design Features

- **Glass Morphism Effects**: Translucent elements with backdrop blur
- **Animated Gradients**: Dynamic color-shifting backgrounds
- **Floating Shapes**: Subtle animated background elements
- **Smooth Transitions**: Butter-smooth animations and hover effects
- **Modern Typography**: Clean, readable fonts
- **Responsive Layout**: Adapts to all screen sizes

## 🏗️ Architecture

```
VideoChat/
├── Controllers/           # MVC Controllers
│   └── HomeController.cs
├── Hubs/                 # SignalR Hubs
│   └── ChatHub.cs
├── Models/               # Data Models
│   └── ErrorViewModel.cs
├── Views/                # Razor Views
│   ├── Home/
│   │   ├── Index.cshtml
│   │   └── Room.cshtml
│   └── Shared/
│       ├── _Layout.cshtml
│       ├── _ViewImports.cshtml
│       └── _ViewStart.cshtml
├── wwwroot/              # Static Files
│   ├── css/
│   │   └── site.css
│   └── js/
│       ├── site.js
│       ├── home.js
│       └── room.js
├── Program.cs            # Application Entry Point
└── VideoChat.csproj      # Project File
```

## 🔧 Configuration

The application uses WebRTC STUN servers for NAT traversal:
- `stun:stun.l.google.com:19302`
- `stun:stun1.l.google.com:19302`

For production deployment, you may want to add TURN servers for better connectivity.

## 🌐 Browser Support

- ✅ Chrome 60+
- ✅ Firefox 60+
- ✅ Safari 11+
- ✅ Edge 79+

## 🔒 Security Notes

- The application uses HTTPS for secure communication
- WebRTC provides peer-to-peer encryption
- No video/audio data is stored on the server
- Room IDs are randomly generated for privacy

## 🚀 Deployment

For production deployment:

1. Configure HTTPS certificates
2. Set up TURN servers for better connectivity
3. Configure appropriate CORS policies
4. Set production-appropriate logging levels

## 🤝 Contributing

Feel free to submit issues, feature requests, or pull requests to improve this application.

## 📝 License

This project is open source and available under the MIT License.