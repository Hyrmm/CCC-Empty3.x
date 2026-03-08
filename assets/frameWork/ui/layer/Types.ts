export const LayerType = {
    Default: "Default",
    Toast: "Toast",
    System: "System",
} as const;

declare global {
    interface LayerTypeMap {
        Default: "Default";
        Toast: "Toast";
        System: "System";
    }
    type LayerType = LayerTypeMap[keyof LayerTypeMap];
}
