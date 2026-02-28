document.addEventListener('DOMContentLoaded', () => {
    const fillBtn = document.getElementById('fillBtn');
    const connectBtn = document.getElementById('connectBtn');
    const statusDiv = document.getElementById('status');

    let cachedProfile = null;

    function showStatus(msg, isError = false) {
        statusDiv.textContent = msg;
        statusDiv.style.display = 'block';
        statusDiv.className = `text-xs text-center mt-2 ${isError ? 'text-red-400' : 'text-neutral-500'}`;
    }

    connectBtn.addEventListener('click', async () => {
        showStatus("Connecting to AssistedApp backend...");
        try {
            // In a real production app, this would use a secure token/auth mechanism.
            // For this local prototype, we fetch directly from our local API route.
            const response = await fetch('http://localhost:3000/api/profile');

            if (!response.ok) {
                throw new Error(`Server returned ${response.status}`);
            }

            const data = await response.json();

            // The Next.js API returns the user object directly, not wrapped in { user: ... }
            if (!data || data.message === 'No user profile found' || !data.id) {
                throw new Error("No Master Profile found in the database. Please create one on the dashboard.");
            }

            cachedProfile = data;

            showStatus(`Connected! Loaded profile for ${cachedProfile.fullName}`);
            connectBtn.textContent = "Database Connected";
            connectBtn.classList.remove("bg-neutral-800", "hover:bg-neutral-700");
            connectBtn.classList.add("bg-green-600/20", "text-green-500", "border-green-500/30", "pointer-events-none");

        } catch (error) {
            showStatus(`Connection Error: ${error.message}`, true);
            console.error(error);
        }
    });

    fillBtn.addEventListener('click', () => {
        if (!cachedProfile) {
            showStatus("Please 'Connect to AssistedApp' first to load your profile.", true);
            return;
        }

        showStatus("Sending live profile data to page...");

        // Query the active tab and send the full LIVE profile to the content script
        chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
            if (!tabs[0]) {
                showStatus("Error: No active tab found.", true);
                return;
            }

            chrome.tabs.sendMessage(tabs[0].id, {
                action: "fill_form",
                profileData: cachedProfile
            }, (response) => {
                if (chrome.runtime.lastError) {
                    showStatus("Error connecting to page script. Reload page & try again.", true);
                    console.error(chrome.runtime.lastError.message);
                } else if (response && response.success) {
                    showStatus(`Success! Instantly filled ${response.fieldsFilled} fields.`);
                }
            });
        });
    });
});
