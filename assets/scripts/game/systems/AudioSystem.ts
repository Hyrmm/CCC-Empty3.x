import { PlayerSaveData } from "../types/GameTypes";

export class AudioSystem {
    private musicEnabled = true;
    private soundEnabled = true;

    public applySettings(saveData: PlayerSaveData): void {
        this.musicEnabled = saveData.settings.music;
        this.soundEnabled = saveData.settings.sound;
    }

    public setMusicEnabled(enabled: boolean): void {
        this.musicEnabled = enabled;
    }

    public setSoundEnabled(enabled: boolean): void {
        this.soundEnabled = enabled;
    }

    public get snapshot(): { music: boolean; sound: boolean } {
        return {
            music: this.musicEnabled,
            sound: this.soundEnabled,
        };
    }
}
