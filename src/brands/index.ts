import { Brand } from '../types/brand.js';
import { ConfigLoader } from '../utils/configLoader.js';

const loader = new ConfigLoader();

export function getBrand(name: string): Brand | undefined {
    return loader.loadBrandConfig(name);
}

export function getAllBrands(): Brand[] {
    return loader.loadAllBrands();
}
