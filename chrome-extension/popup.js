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

            showStatus(`Connected! Loaded profile for ${cachedProfile.fullName || cachedProfile.firstName}`);

            // Update UI State
            connectBtn.textContent = "Database Connected";
            connectBtn.classList.remove("bg-neutral-800", "hover:bg-neutral-700");
            connectBtn.classList.add("bg-green-600/20", "text-green-500", "border-green-500/30", "pointer-events-none");

            // Reveal Actions
            document.getElementById('fillBtn').classList.remove('hidden');

            // -------------------------------------------------------------
            // CLICK-TO-COPY SIDEBAR LOGIC
            // -------------------------------------------------------------
            const profileDataContainer = document.getElementById('profileDataContainer');
            const profileDataElement = document.getElementById('profileData');

            if (profileDataContainer && profileDataElement) {
                profileDataContainer.classList.remove('hidden');
                profileDataContainer.classList.add('flex');

                // Define the fields we want to show
                const fieldsToShow = [
                    { key: 'firstName', label: 'First Name' },
                    { key: 'lastName', label: 'Last Name' },
                    { key: 'email', label: 'Email' },
                    { key: 'phone', label: 'Phone' },
                    { key: 'dob', label: 'Date of Birth (DOB)' },
                    { key: 'gender', label: 'Gender' },
                    { key: 'citizenship', label: 'Nationality' },
                    { key: 'passportNumber', label: 'Passport' }
                ];

                profileDataElement.innerHTML = ''; // Clear previous

                fieldsToShow.forEach(field => {
                    let val = cachedProfile[field.key];
                    if (!val && field.key === 'citizenship') val = cachedProfile.country;

                    if (val) {
                        const valStr = String(val);
                        // Truncate long values for UI
                        const displayVal = valStr.length > 20 ? valStr.substring(0, 20) + '...' : valStr;

                        const row = document.createElement('div');
                        row.className = "flex items-center justify-between bg-neutral-900 rounded-md p-2 border border-neutral-800";
                        row.innerHTML = `
                            <div class="flex flex-col overflow-hidden">
                                <span class="text-[10px] text-neutral-500 uppercase font-semibold">${field.label}</span>
                                <span class="text-sm text-neutral-300 truncate">${displayVal}</span>
                            </div>
                            <button class="copy-btn shrink-0 bg-neutral-800 hover:bg-neutral-700 text-neutral-300 text-xs px-2 py-1 rounded transition-colors" data-value="${valStr.replace(/"/g, '&quot;')}">
                                Copy
                            </button>
                        `;
                        profileDataElement.appendChild(row);
                    }
                });

                // Attach Clipboard Events
                document.querySelectorAll('.copy-btn').forEach(btn => {
                    btn.addEventListener('click', (e) => {
                        const valueToCopy = e.target.getAttribute('data-value');
                        navigator.clipboard.writeText(valueToCopy).then(() => {
                            const originalText = e.target.textContent;
                            e.target.textContent = "Copied! ✓";
                            e.target.classList.add('copy-success');

                            setTimeout(() => {
                                e.target.textContent = originalText;
                                e.target.classList.remove('copy-success');
                            }, 1500);
                        }).catch(err => {
                            console.error('Failed to copy: ', err);
                            showStatus("Clipboard permission denied.", true);
                        });
                    });
                });
            }

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
