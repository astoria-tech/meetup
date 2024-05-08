export const camelCaseToWords = (keyString: string) => {
    const result = keyString.replace(/([A-Z])/g, ' $1');
    return result.charAt(0).toUpperCase() + result.slice(1);
};