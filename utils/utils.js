export function sanitizeString(input) {
    // Remove HTML tags
    const sanitizedString = input.replace(/<[^>]*>/g, '');
    
    // Remove special characters
    const cleanString = sanitizedString.replace(/[^\w\s]/gi, '');
    
    return cleanString;
}