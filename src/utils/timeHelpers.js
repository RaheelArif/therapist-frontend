// utils/timeHelpers.js

/**
 * Parses a time range string (e.g., "9-5" or "10-4") into start and end times
 * @param {string} timeRange - Time range in format "start-end" (e.g., "9-5")
 * @returns {{ start: string, end: string }} Object containing formatted start and end times
 */
export const parseTimeRange = (timeRange) => {
    // Handle empty or invalid input
    if (!timeRange || !timeRange.includes('-')) {
      return { start: '09:00', end: '17:00' }; // Default 9-5
    }
  
    const [startHour, endHour] = timeRange.split('-');
  
    // Format start time
    const formattedStart = startHour.padStart(2, '0') + ':00';
    
    // Format end time
    const formattedEnd = endHour.padStart(2, '0') + ':00';
  
    return {
      start: formattedStart,
      end: formattedEnd
    };
  };
  
  /**
   * Checks if a given time is within a time range
   * @param {Date} time - The time to check
   * @param {string} timeRange - Time range in format "start-end" (e.g., "9-5")
   * @returns {boolean} True if time is within range
   */
  export const isTimeInRange = (time, timeRange) => {
    const { start, end } = parseTimeRange(timeRange);
    
    const [startHour] = start.split(':');
    const [endHour] = end.split(':');
    
    const hour = time.getHours();
    
    return hour >= parseInt(startHour) && hour < parseInt(endHour);
  };
  
  /**
   * Example usage:
   * const { start, end } = parseTimeRange("9-5")
   * console.log(start) // "09:00"
   * console.log(end)   // "17:00"
   * 
   * const time = new Date('2024-12-18T10:30:00')
   * console.log(isTimeInRange(time, "9-5")) // true
   */