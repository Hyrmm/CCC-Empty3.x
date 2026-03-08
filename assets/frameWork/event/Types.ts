interface FrameworkEventMap {
    "fw:init": void;
    "fw:ready": void;
    "fw:error": { error: Error };
}

declare global {
    interface EventMap extends FrameworkEventMap { }
}

export { };