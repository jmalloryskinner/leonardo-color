import fs from 'fs';
import path from 'path';
import { Brand } from '../types/brand.js';
import { BrandConfig } from '../types/theme.js';

export class ConfigError extends Error {
    constructor(message: string, public code: string) {
        super(message);
        this.name = 'ConfigError';
    }
}

export class ConfigLoader {
    private configPath: string;
    private environment: string;

    constructor(environment: string = 'development') {
        this.configPath = path.join(process.cwd(), 'config');
        this.environment = environment;
    }

    public loadBrandConfig(brandName: string): Brand {
        const configFile = path.join(this.configPath, this.environment, `${brandName}.json`);
        
        try {
            if (!fs.existsSync(configFile)) {
                throw new ConfigError(
                    `Configuration file not found for brand: ${brandName}`,
                    'BRAND_CONFIG_NOT_FOUND'
                );
            }

            const configContent = fs.readFileSync(configFile, 'utf-8');
            const parsedConfig = JSON.parse(configContent) as unknown;
            
            if (!this.isValidBrandConfig(parsedConfig)) {
                throw new ConfigError(
                    `Invalid configuration format for brand: ${brandName}`,
                    'INVALID_BRAND_CONFIG'
                );
            }

            return {
                name: brandName,
                config: parsedConfig
            };
        } catch (error: unknown) {
            if (error instanceof ConfigError) throw error;
            throw new ConfigError(
                `Failed to load brand config: ${error instanceof Error ? error.message : 'Unknown error'}`,
                'CONFIG_LOAD_ERROR'
            );
        }
    }

    private isValidBrandConfig(config: unknown): config is BrandConfig {
        if (!config || typeof config !== 'object') return false;
        
        const typedConfig = config as Record<string, unknown>;
        
        const hasValidColors = Array.isArray(typedConfig.colors) && 
            typedConfig.colors.every(color => this.isValidColorConfig(color));

        const hasValidBackground = typedConfig.backgroundColor && 
            this.isValidColorConfig(typedConfig.backgroundColor);

        return Boolean(hasValidColors && hasValidBackground);
    }

    private isValidColorConfig(color: unknown): boolean {
        if (!color || typeof color !== 'object') return false;
        
        const typedColor = color as Record<string, unknown>;
        
        return (
            typeof typedColor.name === 'string' &&
            Array.isArray(typedColor.colorKeys) &&
            Array.isArray(typedColor.ratios) &&
            typedColor.colorKeys.every(key => typeof key === 'string') &&
            typedColor.ratios.every(ratio => typeof ratio === 'number')
        );
    }

    public loadAllBrands(): Brand[] {
        const envPath = path.join(this.configPath, this.environment);
        
        if (!fs.existsSync(envPath)) {
            throw new Error(`No configurations found for environment: ${this.environment}`);
        }

        const files = fs.readdirSync(envPath)
            .filter(file => file.endsWith('.json'));

        return files.map(file => {
            const brandName = path.basename(file, '.json');
            return this.loadBrandConfig(brandName);
        });
    }
}
