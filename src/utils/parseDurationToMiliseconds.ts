export function parseDurationToMiliseconds(input: string): number {
    if (!input) {
        throw new Error("Invalid duration");
    }

    const match = input
        .trim()
        .toLowerCase()
        .match(/^(\d+(?:\.\d+)?)([smhdwy])?$/);
    if (!match) {
        throw new Error("Invalid duration format");
    }

    const value = parseFloat(match[1]);
    const unit = match[2] || "s";

    const multipliers: Record<string, number> = {
        s: 1,
        m: 60,
        h: 3600,
        d: 86400,
        w: 604800,
        y: 31536000,
    };

    const multiplier = multipliers[unit];
    return Math.floor(value * multiplier * 1000);
}
