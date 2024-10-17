export default function secondToMinutes(seconds: number): string {
    const min = zeroLeft((seconds / 60) % 60);
    const sec = zeroLeft((seconds % 60) % 60);
    return `${min}:${sec}`
}

const zeroLeft = (n: number) => Math.floor(n).toString().padStart(2, '0');
