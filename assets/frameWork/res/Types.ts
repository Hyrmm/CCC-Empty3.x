export const ResLoadTaskState = {
    Pending: "Pending",
    Loading: "Loading",
    Completed: "Completed",
    Failed: "Failed",
} as const;

declare global {
    type ResLoadTaskState = typeof ResLoadTaskState[keyof typeof ResLoadTaskState];
}