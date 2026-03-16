export class AnalyticsSystem {
    public track(eventName: string, payload?: unknown): void {
        console.log(`[Analytics] ${eventName}`, payload || "");
    }
}
