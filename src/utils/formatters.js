// Format numbers with commas or convert to KB notation
export function formatNumber(num) {
    if (!num && num !== 0) return "0";

    const number = Math.abs(num);

    if (number >= 1000) {
        const kb = number / 1000;
        if (kb >= 1000) {
            // If over 1MB, show as MB
            return (kb / 1000).toFixed(2) + " MB";
        }
        return kb.toFixed(2) + " KB";
    }

    // Add comma separators for thousands
    return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

// Calculate XPs grouped by event path
export function calculateXpByPath(xps) {
    const xpByPath = {};

    xps.forEach(xp => {
        const path = xp.event?.path || "Unknown";
        if (!xpByPath[path]) {
            xpByPath[path] = 0;
        }
        xpByPath[path] += xp.amount;
    });

    // Sort by amount in descending order
    const sorted = Object.entries(xpByPath)
        .sort((a, b) => b[1] - a[1])
        .map(([path, amount]) => ({
            path,
            amount,
            formatted: formatNumber(amount)
        }));

    return sorted;
}

// Get path display name (last part of path for readability)
export function getPathName(fullPath) {
    if (!fullPath) return "Unknown";
    const parts = fullPath.split("/").filter(p => p);
    return parts[parts.length - 1] || fullPath;
}
