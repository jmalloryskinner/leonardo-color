import fs from 'fs';
import path from 'path';
import { Brand } from '../types/brand.js';

export class ConfigLoader {
    private configPath: string;
    private environment: string;

    constructor(environment: string = 'development') {
        this.configPath = path.join(process.cwd(), 'config');
        this.environment = environment;
    }

    public loadBrandConfig(brandName: string): Brand {
        const configFile = path.join(this.configPath, this.environment, `${brandName}.json`);
        
        if (!fs.existsSync(configFile)) {
            throw new Error(`Configuration file not found for brand: ${brandName}`);
        }

        const config = JSON.parse(fs.readFileSync(configFile, 'utf-8'));
        return {
            name: brandName,
            config: config
        };
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
