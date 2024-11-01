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
            const config = JSON.parse(configContent);
            
            if (!this.isValidBrandConfig(config)) {
                throw new ConfigError(
                    `Invalid configuration format for brand: ${brandName}`,
                    'INVALID_BRAND_CONFIG'
                );
            }

            return {
                name: brandName,
                config: config
            };
        } catch (error: unknown) {
            if (error instanceof ConfigError) throw error;
            throw new ConfigError(
                `Failed to load brand config: ${error instanceof Error ? error.message : 'Unknown error'}`,
                'CONFIG_LOAD_ERROR'
            );
        }
    }

    private isValidBrandConfig(config: any): config is BrandConfig {
        return (
            config &&
            Array.isArray(config.colors) &&
            config.backgroundColor &&
            typeof config.backgroundColor === 'object'
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
