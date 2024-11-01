import winston from 'winston';

const { createLogger, format, transports } = winston;

export const logger = createLogger({
    level: process.env.LOG_LEVEL || 'info',
    format: format.combine(
        format.timestamp(),
        format.json()
    ),
    transports: [
        new transports.File({ 
            filename: 'error.log', 
            level: 'error',
            handleExceptions: true
        }),
        new transports.File({ 
            filename: 'combined.log',
            handleExceptions: true
        })
    ],
    exitOnError: false
});

if (process.env.NODE_ENV !== 'production') {
    logger.add(new transports.Console({
        format: format.combine(
            format.colorize(),
            format.simple()
        )
    }));
} 