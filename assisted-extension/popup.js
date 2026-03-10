document.addEventListener('DOMContentLoaded', () => {
    const fillBtn = document.getElementById('fillBtn');

    fillBtn.addEventListener('click', async () => {
        try {
            console.log("1. Popup: Button clicked, fetching data...");
            // Fetch real DB profile from Next.js local server, completely bypassing browser network cache
            const response = await fetch('https://university-automation-app.vercel.app/api/extension/profile', { cache: 'no-store' });
            if (!response.ok) throw new Error("Failed to fetch profile");
            const profileData = await response.json();

            console.log("2. Popup: Data received from server:", profileData);

            chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
                if (tabs[0]) {
                    console.log("3. Popup: Sending message to content.js...");
                    // Send the entire profileData object directly; do not filter it so that large Base64 document buffers are preserved
                    chrome.tabs.sendMessage(tabs[0].id, {
                        action: "autofill",
                        data: profileData
                    }, (response) => {
                        if (chrome.runtime.lastError) {
                            console.error("Connection error:", chrome.runtime.lastError.message);
                            return;
                        }
                        if (response && response.success) {
                            const statusIndicator = document.getElementById('statusIndicator');
                            statusIndicator.innerHTML = `
                                <span class="w-2 h-2 rounded-full bg-emerald-400"></span>
                                ${response.filledCount}/7 Fields Matched
                            `;
                        }
                    });
                }
            });
        } catch (error) {
            console.error(error);
            alert("Ensure the Vercel app is running!");
        }
    });
});
