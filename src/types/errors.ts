export class ColorGenerationError extends Error {
    constructor(message: string, public color: string) {
        super(`Failed to generate color ${color}: ${message}`);
        this.name = 'ColorGenerationError';
    }
}

export class ContrastRatioError extends Error {
    constructor(message: string, public ratio: number) {
        super(`Invalid contrast ratio ${ratio}: ${message}`);
        this.name = 'ContrastRatioError';
    }
} 