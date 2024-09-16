export default function getStartOfMonth(date: Date = new Date()) {
    return new Date(date.getFullYear(), date.getMonth(), 1)
}
