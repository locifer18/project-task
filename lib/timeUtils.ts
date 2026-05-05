/**
 * Utility functions for time conversion and formatting
 */

/**
 * Convert any time string or Date to IST (Indian Standard Time)
 * @param dateTime - Date object, ISO string, or time string
 * @returns Formatted time string in IST (12-hour format with AM/PM)
 */
export const convertToIST = (dateTime: string | Date): string => {
    try {
        const date = new Date(dateTime);
        return date.toLocaleTimeString('en-IN', {
            hour: '2-digit',
            minute: '2-digit',
            hour12: true,
            timeZone: 'Asia/Kolkata'
        });
    } catch (error) {
        console.error('Error converting to IST:', error);
        return dateTime.toString();
    }
};

/**
 * Format time string to IST 12-hour format
 * @param timeString - Time string in various formats
 * @returns Formatted time string in 12-hour format
 */
export const formatTimeToIST = (timeString: string): string => {
    if (!timeString || timeString === '-') return timeString;
    
    try {
        // Clean up the input string first
        let cleanTime = timeString.trim();
        
        // Handle malformed strings like "2:02 pm AM" or "7:03 pm AM"
        if (cleanTime.includes('pm AM') || cleanTime.includes('PM AM')) {
            cleanTime = cleanTime.replace(/pm AM|PM AM/gi, 'PM');
        }
        if (cleanTime.includes('am PM') || cleanTime.includes('AM PM')) {
            cleanTime = cleanTime.replace(/am PM|AM PM/gi, 'AM');
        }
        
        // If it's already in proper 12-hour format, return it
        if (/^\d{1,2}:\d{2}\s?(AM|PM)$/i.test(cleanTime)) {
            return cleanTime.toUpperCase();
        }
        
        // Extract just the time part (remove any extra text)
        const timeMatch = cleanTime.match(/\d{1,2}:\d{2}/);
        if (!timeMatch) {
            return timeString; // Return original if no valid time found
        }
        
        const [hours, minutes] = timeMatch[0].split(':');
        const hour24 = parseInt(hours);
        
        // Convert to 12-hour format
        let hour12;
        let ampm;
        
        if (hour24 === 0) {
            hour12 = 12;
            ampm = 'AM';
        } else if (hour24 < 12) {
            hour12 = hour24;
            ampm = 'AM';
        } else if (hour24 === 12) {
            hour12 = 12;
            ampm = 'PM';
        } else {
            hour12 = hour24 - 12;
            ampm = 'PM';
        }
        
        return `${hour12}:${minutes} ${ampm}`;
    } catch (error) {
        console.error('Error formatting time:', error, 'Input:', timeString);
        return timeString; // Return original if parsing fails
    }
};

/**
 * Get current IST time
 * @returns Current time in IST format
 */
export const getCurrentIST = (): string => {
    return new Date().toLocaleTimeString('en-IN', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: true,
        timeZone: 'Asia/Kolkata'
    });
};

/**
 * Convert UTC timestamp to IST
 * @param utcTimestamp - UTC timestamp
 * @returns IST formatted time string
 */
export const utcToIST = (utcTimestamp: number): string => {
    return new Date(utcTimestamp).toLocaleTimeString('en-IN', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: true,
        timeZone: 'Asia/Kolkata'
    });
};

/**
 * Format work time duration
 * @param hours - Number of hours worked
 * @returns Formatted duration string
 */
export const formatWorkTime = (hours: number): string => {
    if (hours < 1) {
        const minutes = Math.round(hours * 60);
        return `${minutes} min`;
    }
    return `${hours.toFixed(1)} hrs`;
};