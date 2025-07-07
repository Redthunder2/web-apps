// Base site functionality
document.addEventListener('DOMContentLoaded', function() {
    // Add smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            document.querySelector(this.getAttribute('href')).scrollIntoView({
                behavior: 'smooth'
            });
        });
    });

    // Add loading states to buttons
    function addLoadingToButton(button) {
        const originalText = button.innerHTML;
        button.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Loading...';
        button.disabled = true;
        
        return function() {
            button.innerHTML = originalText;
            button.disabled = false;
        };
    }

    // Global loading function
    window.addLoadingToButton = addLoadingToButton;

    // Copy to clipboard functionality
    window.copyToClipboard = async function(text) {
        try {
            await navigator.clipboard.writeText(text);
            showNotification('Copied to clipboard!', 'success');
        } catch (err) {
            console.error('Failed to copy: ', err);
            showNotification('Failed to copy to clipboard', 'error');
        }
    };

    // Show notification function
    window.showNotification = function(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.innerHTML = `
            <div class="notification-content">
                <i class="fas fa-${type === 'success' ? 'check' : type === 'error' ? 'exclamation-triangle' : 'info'}"></i>
                <span>${message}</span>
            </div>
        `;
        
        // Add notification styles
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: rgba(255, 255, 255, 0.15);
            backdrop-filter: blur(15px);
            border: 1px solid rgba(255, 255, 255, 0.2);
            border-radius: 10px;
            padding: 1rem;
            color: white;
            z-index: 10000;
            transform: translateX(100%);
            transition: transform 0.3s ease;
            max-width: 300px;
        `;

        document.body.appendChild(notification);

        // Animate in
        setTimeout(() => {
            notification.style.transform = 'translateX(0)';
        }, 100);

        // Remove after 3 seconds
        setTimeout(() => {
            notification.style.transform = 'translateX(100%)';
            setTimeout(() => {
                document.body.removeChild(notification);
            }, 300);
        }, 3000);
    };
});