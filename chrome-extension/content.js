// Patterns to match against input names, ids, or labels
const FIELD_PATTERNS = {
    lastName: /last.*name|lname|family.*name|surname/i,
    firstName: /first.*name|fname|given.*name|\bname\b/i,
    fullName: /full.*name/i,
    email: /email|e-mail/i,
    phone: /phone|mobile|tel/i,
    dob: /dob|birth.*date|date.*of.*birth/i,
    address: /address|street|line.*1/i,
    city: /city|town/i,
    country: /country|nation/i,
    gpa: /gpa|grade.*point/i,
};

function autoFillForm(profileData) {
    let filledCount = 0;

    // Intelligently split the full name into first and last name so it maps to dual-field forms
    if (profileData.fullName && !profileData.firstName) {
        const parts = profileData.fullName.trim().split(/\s+/);
        profileData.firstName = parts[0];
        profileData.lastName = parts.length > 1 ? parts.slice(1).join(" ") : parts[0];
    }

    // Find all inputs on the page
    const inputs = document.querySelectorAll('input[type="text"], input[type="email"], input[type="tel"], input[type="date"], input:not([type]), textarea');

    inputs.forEach(input => {
        // Skip hidden or disabled inputs
        if (input.type === 'hidden' || input.disabled || input.readOnly) return;

        const id = input.id || "";
        const name = input.name || "";
        const placeholder = input.placeholder || "";

        // Also check any associated label text for this input to increase match rate
        let labelText = "";
        if (id) {
            const label = document.querySelector(`label[for="${id}"]`);
            if (label) labelText = label.innerText || label.textContent;
        }
        // Also check if the input is wrapped inside a label
        const parentLabel = input.closest('label');
        if (parentLabel) {
            labelText += " " + (parentLabel.innerText || parentLabel.textContent);
        }

        const combinedAttr = `${id} ${name} ${placeholder} ${labelText}`;

        // Check which pattern it matches
        for (const [key, pattern] of Object.entries(FIELD_PATTERNS)) {
            if (pattern.test(combinedAttr)) {

                let valueToInject = profileData[key];

                // Format Date of Birth if that's the field we are injecting
                if (key === 'dob' && valueToInject) {
                    try {
                        const dateObj = new Date(valueToInject);
                        // Determine if the field prefers DD/MM/YYYY format based on placeholder
                        if (placeholder && placeholder.toLowerCase().includes('dd/mm/yyyy')) {
                            const day = String(dateObj.getDate()).padStart(2, '0');
                            const month = String(dateObj.getMonth() + 1).padStart(2, '0');
                            const year = dateObj.getFullYear();
                            valueToInject = `${day}/${month}/${year}`;
                        } else {
                            // Return standard YYYY-MM-DD for native date inputs
                            valueToInject = dateObj.toISOString().split('T')[0];
                        }
                    } catch (e) {
                        console.error("Date formatting error", e);
                    }
                }

                // Handle nested specific data if it's GPA (from educations array)
                if (!valueToInject && key === 'gpa' && profileData.educations && profileData.educations.length > 0) {
                    valueToInject = profileData.educations[0].gpa;
                }

                if (valueToInject) {
                    input.value = valueToInject;
                    // Trigger React/Vue onChange events if any
                    input.dispatchEvent(new Event('input', { bubbles: true }));
                    input.dispatchEvent(new Event('change', { bubbles: true }));

                    // Add a slight visual indicator to the filled field
                    input.style.boxShadow = "0 0 0 2px rgba(124, 58, 237, 0.5)";

                    filledCount++;
                    break;
                }
            }
        }
    });

    return filledCount;
}

// Listen for messages from the popup
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === "fill_form") {
        console.log("AssistedApp: Fill command received with live data:", request.profileData);
        const count = autoFillForm(request.profileData);
        sendResponse({ success: true, fieldsFilled: count });
    }
});
