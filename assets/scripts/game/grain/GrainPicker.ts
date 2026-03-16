export class GrainPicker {
    public resolveGrainId(hitIdentifier: string | number | null | undefined): number | null {
        if (typeof hitIdentifier === "number") return hitIdentifier;
        if (typeof hitIdentifier !== "string") return null;

        const parsed = Number(hitIdentifier);
        return Number.isFinite(parsed) ? parsed : null;
    }
}
