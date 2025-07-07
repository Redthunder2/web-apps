using Microsoft.AspNetCore.SignalR;

namespace VideoChat.Hubs
{
    public class ChatHub : Hub
    {
        public async Task SendMessage(string user, string message)
        {
            await Clients.All.SendAsync("ReceiveMessage", user, message);
        }

        public async Task JoinRoom(string roomId, string userName)
        {
            await Groups.AddToGroupAsync(Context.ConnectionId, roomId);
            await Clients.Group(roomId).SendAsync("UserJoined", userName);
        }

        public async Task LeaveRoom(string roomId, string userName)
        {
            await Groups.RemoveFromGroupAsync(Context.ConnectionId, roomId);
            await Clients.Group(roomId).SendAsync("UserLeft", userName);
        }

        public async Task SendRoomMessage(string roomId, string user, string message)
        {
            await Clients.Group(roomId).SendAsync("ReceiveRoomMessage", user, message);
        }

        // WebRTC signaling methods
        public async Task SendOffer(string roomId, object offer)
        {
            await Clients.OthersInGroup(roomId).SendAsync("ReceiveOffer", offer);
        }

        public async Task SendAnswer(string roomId, object answer)
        {
            await Clients.OthersInGroup(roomId).SendAsync("ReceiveAnswer", answer);
        }

        public async Task SendIceCandidate(string roomId, object candidate)
        {
            await Clients.OthersInGroup(roomId).SendAsync("ReceiveIceCandidate", candidate);
        }

        public override async Task OnDisconnectedAsync(Exception? exception)
        {
            await base.OnDisconnectedAsync(exception);
        }
    }
}