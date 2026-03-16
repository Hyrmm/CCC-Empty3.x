export function compareIntegerString(left: string, right: string): number {
    const normalizedLeft = normalizeIntegerString(left);
    const normalizedRight = normalizeIntegerString(right);

    if (normalizedLeft.length !== normalizedRight.length) {
        return normalizedLeft.length > normalizedRight.length ? 1 : -1;
    }

    if (normalizedLeft === normalizedRight) return 0;
    return normalizedLeft > normalizedRight ? 1 : -1;
}

export function addIntegerString(baseValue: string, delta: number): string {
    const normalizedBase = normalizeIntegerString(baseValue);
    let carry = delta;
    let index = normalizedBase.length - 1;
    let result = "";

    while (index >= 0 || carry > 0) {
        const digit = index >= 0 ? Number(normalizedBase[index]) : 0;
        const nextValue = digit + (carry % 10);
        result = String(nextValue % 10) + result;
        carry = Math.floor(carry / 10) + Math.floor(nextValue / 10);
        index -= 1;
    }

    while (index >= 0) {
        result = normalizedBase[index] + result;
        index -= 1;
    }

    return normalizeIntegerString(result);
}

function normalizeIntegerString(value: string): string {
    const normalized = String(value || "0").replace(/^0+/, "");
    return normalized.length ? normalized : "0";
}
