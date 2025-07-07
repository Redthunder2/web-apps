document.addEventListener('DOMContentLoaded', function() {
    const userNameInput = document.getElementById('userName');
    const roomIdInput = document.getElementById('roomId');
    const createRoomBtn = document.getElementById('createRoom');
    const joinRoomBtn = document.getElementById('joinRoom');

    // Generate random room ID
    function generateRoomId() {
        return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
    }

    // Validate inputs
    function validateInputs() {
        const userName = userNameInput.value.trim();
        
        if (!userName) {
            showNotification('Please enter your name', 'error');
            userNameInput.focus();
            return false;
        }

        if (userName.length < 2) {
            showNotification('Name must be at least 2 characters', 'error');
            userNameInput.focus();
            return false;
        }

        return true;
    }

    // Create room functionality
    createRoomBtn.addEventListener('click', function() {
        if (!validateInputs()) return;

        const removeLoading = addLoadingToButton(this);
        
        setTimeout(() => {
            const userName = userNameInput.value.trim();
            const roomId = generateRoomId();
            
            // Store user name in session storage
            sessionStorage.setItem('userName', userName);
            
            // Redirect to room
            window.location.href = `/Home/Room/${roomId}`;
            
            removeLoading();
        }, 1000);
    });

    // Join room functionality
    joinRoomBtn.addEventListener('click', function() {
        if (!validateInputs()) return;

        const roomId = roomIdInput.value.trim();
        
        if (!roomId) {
            showNotification('Please enter a room ID', 'error');
            roomIdInput.focus();
            return;
        }

        const removeLoading = addLoadingToButton(this);
        
        setTimeout(() => {
            const userName = userNameInput.value.trim();
            
            // Store user name in session storage
            sessionStorage.setItem('userName', userName);
            
            // Redirect to room
            window.location.href = `/Home/Room/${roomId}`;
            
            removeLoading();
        }, 1000);
    });

    // Enter key support
    userNameInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            roomIdInput.focus();
        }
    });

    roomIdInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            if (roomIdInput.value.trim()) {
                joinRoomBtn.click();
            } else {
                createRoomBtn.click();
            }
        }
    });

    // Auto-focus on name input
    userNameInput.focus();

    // Load saved username if available
    const savedUserName = sessionStorage.getItem('userName');
    if (savedUserName) {
        userNameInput.value = savedUserName;
    }
});