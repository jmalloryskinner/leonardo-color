import chroma from 'chroma-js';
import { ColorScaleOptions } from '../types/validation.js';
import { logger } from './logger.js';

export function createColorScale(options: ColorScaleOptions): string[] {
    try {
        return chroma
            .scale(options.colorKeys)
            .mode(options.colorspace)
            .correctLightness(true)
            .colors(options.swatches);
    } catch (error) {
        logger.error('Failed to create color scale', { error, options });
        throw error;
    }
}

export function validateColor(color: string): boolean {
    return chroma.valid(color);
}

export function getColorContrast(color1: string, color2: string): number {
    return chroma.contrast(color1, color2);
} 