import { performance } from 'perf_hooks';
import { logger } from './logger.js';

export function benchmark<T>(name: string, fn: () => T): T {
    const start = performance.now();
    const result = fn();
    const end = performance.now();
    
    logger.info(`Performance: ${name}`, {
        duration: `${Math.round(end - start)}ms`
    });
    
    return result;
}

export async function benchmarkAsync<T>(name: string, fn: () => Promise<T>): Promise<T> {
    const start = performance.now();
    const result = await fn();
    const end = performance.now();
    
    logger.info(`Performance: ${name}`, {
        duration: `${Math.round(end - start)}ms`
    });
    
    return result;
} 