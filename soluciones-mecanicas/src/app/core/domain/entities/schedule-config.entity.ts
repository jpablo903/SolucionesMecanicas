/**
 * Specific Block - for blocking specific hours on specific dates
 */
export interface SpecificBlock {
    date: string;
    hours: string[];
}

/**
 * Schedule Config Entity - Domain model for schedule configuration
 */
export interface ScheduleConfig {
    id?: string;
    blockedDays: string[];      // ISO date strings 'YYYY-MM-DD'
    blockedHours: string[];     // '07:00', '08:00', etc. (Global)
    specificBlocks: SpecificBlock[]; // Specific date exceptions
}
