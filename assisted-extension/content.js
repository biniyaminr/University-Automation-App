const FIELD_MAPPINGS = {
    city: /city|town|comune|città|place/i,
    zip: /zip|cap|postal|postcode|codice/i,
    address: /address|indirizzo|via|street|domicile/i,
    country: /country|nation|state/i,
    firstName: /first.*name|fname|given/i,
    lastName: /last.*name|lname|surname|family/i,
    phone: /phone|mobile|cell|telephone/i,
    designation: /designation/i
};

async function injectFile(inputElement, documentObj, delay = 0) {
    if (!documentObj || !documentObj.fileUrl) return;

    try {
        console.log("📥 Fetching file from Uploadthing:", documentObj.fileUrl);

        // Fetch the remote file from Uploadthing (utfs.io)
        const response = await fetch(documentObj.fileUrl);
        if (!response.ok) throw new Error(`Failed to fetch file: ${response.status} ${response.statusText}`);

        const blob = await response.blob();
        const fileName = documentObj.name ? documentObj.name + (blob.type.includes('pdf') ? '.pdf' : '') : 'document';
        const file = new File([blob], fileName, { type: blob.type || 'application/pdf' });

        const dataTransfer = new DataTransfer();
        dataTransfer.items.add(file);

        setTimeout(() => {
            try {
                inputElement.files = dataTransfer.files;
                inputElement.dispatchEvent(new Event('input', { bubbles: true }));
                inputElement.dispatchEvent(new Event('change', { bubbles: true }));

                inputElement.style.backgroundColor = '#e6ffed';
                inputElement.style.transition = 'background-color 0.3s ease';
                console.log("✅ File injected successfully:", fileName);
            } catch (err) { console.warn("Bypassed site error.", err); }
        }, delay);
    } catch (error) {
        console.error("🔥 INJECTION FAILED:", error);
    }
}

// -----------------------------------------------------------------------------
// Phase 1: The Scout - Extract Context Logic and Gather Labels
// -----------------------------------------------------------------------------
function getContextText(input) {
    let contextText = '';
    let current = input;
    for (let i = 0; i < 4; i++) {
        if (!current) break;

        // 1. Check the previous sibling (neighboring text container)
        let sibling = current.previousElementSibling;
        if (sibling && sibling.innerText && sibling.innerText.trim().length > 3) {
            contextText = sibling.innerText.replace(/\s+/g, ' ').trim().toLowerCase();
            break;
        }

        // 2. Fallback: Check if the parent itself contains the descriptive text
        if (current.parentElement) {
            let parentText = current.parentElement.innerText.replace(/choose file|no file chosen|browse/gi, '').trim();
            if (parentText.length > 5 && parentText.length < 150) {
                contextText = parentText.toLowerCase();
                break;
            }
        }

        current = current.parentElement;
    }
    return contextText;
}

// Scans all file inputs on the page and returns an array of unique label strings
async function gatherLabels() {
    const scrapedLabels = new Set();
    const inputs = document.querySelectorAll('input[type="file"]');

    inputs.forEach(input => {
        if (input.type === 'hidden' || input.disabled || input.readOnly || input.style.display === 'none' || !input.offsetParent) return;
        const text = getContextText(input);
        if (text) scrapedLabels.add(text);
    });

    return Array.from(scrapedLabels);
}

async function autoFillPage(profileData) {
    if (!profileData) return { success: false, filledCount: 0 };

    let filledCount = 0;
    let injectDelay = 0;

    // -----------------------------------------------------------------------------
    // Phase 2: The API Call - Ask AI for Document Mapping
    // -----------------------------------------------------------------------------
    console.log("🧠 Asking AI for dynamic mapping...");
    const docs = profileData.documents || [];
    let aiMapping = {};

    if (docs.length > 0) {
        const availableCategories = Array.from(new Set(docs.map(d => d.category || d.type)));
        const scrapedLabels = await gatherLabels();

        if (scrapedLabels.length > 0) {
            try {
                const mapRes = await fetch("http://localhost:3000/api/extension/ai-map", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ scrapedLabels, availableCategories })
                });

                if (mapRes.ok) {
                    const mapData = await mapRes.json();
                    if (mapData.success && mapData.mappedData) {
                        aiMapping = mapData.mappedData;

                        // FAILSAFE: If Gemini returned an array, flatten it
                        if (Array.isArray(aiMapping)) {
                            const flatMap = {};
                            aiMapping.forEach(item => {
                                // Extract key and value dynamically depending on how AI formatted it
                                const key = Object.keys(item)[0];
                                if (key) flatMap[key] = item[key];
                            });
                            aiMapping = flatMap;
                        }

                        console.log("🤖 AI Mapping Received:", aiMapping);
                    }
                } else {
                    console.warn("AI Mapping failed, falling back to manual mapping if any.");
                }
            } catch (err) {
                console.error("Failed to contact AI endpoint:", err);
            }
        }
    }


    // Map the database user object into our target keys
    // The User model has 'address' and 'citizenship'. The Education array has 'city' and 'country'.
    const edu = (profileData.educations && profileData.educations.length > 0) ? profileData.educations[0] : {};

    // Attempt to extract a ZIP code from the address string if the database doesn't have a dedicated zip field
    let extractedZip = profileData.zip || "";
    if (!extractedZip && profileData.address) {
        const zipMatch = profileData.address.match(/\b\d{4,5}\b/);
        if (zipMatch) extractedZip = zipMatch[0];
    }

    const dataToInject = {
        city: profileData.city || edu.city || "",
        zip: extractedZip,
        address: profileData.address || profileData.homeAddress || "",
        country: profileData.citizenship || profileData.country || edu.country || "",
        firstName: profileData.fullName ? profileData.fullName.split(" ")[0] : "",
        lastName: profileData.fullName ? profileData.fullName.split(" ").slice(1).join(" ") : "",
        phone: profileData.phone || "",
        designation: "VIA"
    };

    const inputs = document.querySelectorAll('input[type="text"], input[type="tel"], input[type="file"], input:not([type]), textarea, select');

    inputs.forEach(input => {
        if (input.type === 'hidden' || input.disabled || input.readOnly || input.style.display === 'none' || !input.offsetParent) return;

        const identifier = `${input.id} ${input.name} ${input.placeholder} ${input.getAttribute('aria-label') || ''}`.toLowerCase();

        // -----------------------------------------------------------------------------
        // Phase 3: The Actor - Inject Documents Using AI Mapping
        // -----------------------------------------------------------------------------
        if (input.type === 'file') {
            let docToInject = null;
            let matchedCategory = 'NONE';

            const contextText = getContextText(input);
            console.log("5. Content: Scanning input. Found text ->", contextText);

            if (contextText && aiMapping[contextText]) {
                const aiTargetCategory = aiMapping[contextText];
                matchedCategory = aiTargetCategory;
                // Find the first document in the user's vault that matches the AI's category decision
                docToInject = docs.find(d =>
                    (d.category && d.category.toLowerCase() === aiTargetCategory.toLowerCase()) ||
                    (d.type && d.type.toLowerCase() === aiTargetCategory.toLowerCase())
                );
            }

            console.log("Found Match: ", matchedCategory, "for text: ", contextText);
            console.log("6. Content: Matched Document ->", docToInject ? docToInject.name : "NONE");

            if (!docToInject) {
                console.log("⏭️ Skipping input: No matching document.");
                return; // Skip filling for this file input
            }

            if (docToInject.fileUrl) {
                injectFile(input, docToInject, injectDelay);
                injectDelay += 800; // Add 800ms delay for the next file
                filledCount++;
            } else {
                console.warn("⚠️ Document matched but has no fileUrl (Uploadthing URL missing):", docToInject.name);
            }
            return; // Skip normal text filling for this file input
        }

        for (const [key, regex] of Object.entries(FIELD_MAPPINGS)) {
            if (regex.test(identifier) && dataToInject[key]) {
                if (input.tagName.toLowerCase() === 'select') {
                    let optionFound = false;
                    for (let opt of input.options) {
                        if (opt.value.toUpperCase() === dataToInject[key].toUpperCase() ||
                            opt.text.toUpperCase() === dataToInject[key].toUpperCase()) {
                            input.value = opt.value;
                            optionFound = true;
                            break;
                        }
                    }
                    if (!optionFound) {
                        // fallback to partial match
                        for (let opt of input.options) {
                            if (opt.value.toUpperCase().includes(dataToInject[key].toUpperCase()) ||
                                opt.text.toUpperCase().includes(dataToInject[key].toUpperCase())) {
                                input.value = opt.value;
                                optionFound = true;
                                break;
                            }
                        }
                    }
                    if (!optionFound) continue; // Skip to next mapping if option isn't available
                } else {
                    // Inject data
                    input.value = dataToInject[key];
                }

                filledCount++;

                // Trigger React/Vue events naturally (Muffled with try/catch)
                try {
                    input.dispatchEvent(new Event('input', { bubbles: true }));
                    input.dispatchEvent(new Event('change', { bubbles: true }));
                } catch (err) { console.warn("Muffled text field error."); }

                // Visual Feedback: Soft green background as requested
                input.style.backgroundColor = '#e6ffed';
                input.style.transition = 'background-color 0.3s ease';

                break; // Only fill a field once
            }
        }
    });

    return { success: true, filledCount };
}

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === "autofill" && request.data) {
        console.log("4. Content: Message received!", request.data);
        console.log("AssistedApp Extension Received Data:", {
            keysFound: Object.keys(request.data),
            docsCount: request.data.documents?.length || 0
        });

        // Handle async autoFillPage
        autoFillPage(request.data).then(result => {
            sendResponse(result);
        }).catch(err => {
            console.error("Autofill failed:", err);
            sendResponse({ success: false, error: err.message });
        });
    }
    return true; // Keep message channel open for async sendResponse
});
