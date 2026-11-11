export const formatLabel = (text: string) => {
    return text.toLowerCase().replace(/_/g,'').replace(/\b\w/g, (char) => char.toUpperCase())
}