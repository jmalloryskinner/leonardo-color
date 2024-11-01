import { InterpolationMode } from 'chroma-js';

export interface ColorValidationResult {
    isValid: boolean;
    errors: string[];
}

export interface ColorScaleOptions {
    swatches: number;
    colorKeys: string[];
    colorspace: InterpolationMode;
    smooth: boolean;
}

export interface ColorScaleOutput {
    [colorName: string]: {
        [step: string]: {
            light: {
                $value: string;
                $type: string;
                $description: string;
            };
            dark: {
                $value: string;
                $type: string;
                $description: string;
            };
        };
    };
} 