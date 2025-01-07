import { PayPeriod } from '../types';

export class PayPeriodManager {
  /**
   * Generate pay periods for a given year
   * @param year The year to generate pay periods for
   * @returns Array of PayPeriod objects (without PK_IDs)
   */
  static generatePayPeriodsForYear(year: number): Omit<PayPeriod, 'PK_ID'>[] {
    const periods: Omit<PayPeriod, 'PK_ID'>[] = [];
    
    // Get the first day of the year
    const startOfYear = new Date(year, 0, 1);
    
    // Find the first Friday (assuming pay periods end on Friday)
    let currentDate = new Date(startOfYear);
    while (currentDate.getDay() !== 5) { // 5 is Friday
      currentDate.setDate(currentDate.getDate() + 1);
    }
    
    // Generate 26 bi-weekly periods
    for (let periodNum = 1; periodNum <= 26; periodNum++) {
      // Period end date is the current Friday
      const endDate = new Date(currentDate);
      
      // Period start date is two weeks before the end date, plus one day
      const startDate = new Date(currentDate);
      startDate.setDate(startDate.getDate() - 13); // 14 days - 1 to not overlap
      
      periods.push({
        period_number: periodNum,
        year,
        start_date: startDate.toISOString().split('T')[0],
        end_date: endDate.toISOString().split('T')[0],
        status: 'open', // Initialize as open
        is_current: false // Initialize as false, we'll update current period later
      });
      
      // Move to next period end date (two weeks later)
      currentDate.setDate(currentDate.getDate() + 14);
    }
    
    return periods;
  }

  /**
   * Find the current pay period based on today's date
   * @param periods Array of all pay periods
   * @returns The current pay period, or undefined if not found
   */
  static findCurrentPeriod(periods: PayPeriod[]): PayPeriod | undefined {
    const today = new Date();
    const todayStr = today.toISOString().split('T')[0];
    
    return periods.find(period => {
      const startDate = new Date(period.start_date);
      const endDate = new Date(period.end_date);
      const checkDate = new Date(todayStr);
      
      return checkDate >= startDate && checkDate <= endDate;
    });
  }

  /**
   * Update period statuses based on current date
   * @param periods Array of all pay periods
   * @returns Updated periods with correct statuses
   */
  static updatePeriodStatuses(periods: PayPeriod[]): PayPeriod[] {
    const today = new Date();
    const todayStr = today.toISOString().split('T')[0];
    
    return periods.map(period => {
      const endDate = new Date(period.end_date);
      const startDate = new Date(period.start_date);
      const checkDate = new Date(todayStr);
      
      // Set status based on date
      let status: PayPeriod['status'] = 'open'; // Default to open
      let is_current = false;
      
      if (checkDate < startDate) {
        status = 'open';
      } else if (checkDate >= startDate && checkDate <= endDate) {
        status = 'open';
        is_current = true;
      } else if (checkDate > endDate) {
        const twoWeeksAfterEnd = new Date(endDate);
        twoWeeksAfterEnd.setDate(twoWeeksAfterEnd.getDate() + 14);
        
        if (checkDate <= twoWeeksAfterEnd) {
          status = 'processing';
        } else {
          status = 'closed';
        }
      }
      
      return {
        ...period,
        status,
        is_current
      };
    });
  }

  /**
   * Get the next pay period after a given period
   * @param currentPeriod The current pay period
   * @param allPeriods Array of all pay periods
   * @returns The next pay period, or undefined if not found
   */
  static getNextPeriod(currentPeriod: PayPeriod, allPeriods: PayPeriod[]): PayPeriod | undefined {
    // Sort periods by year and period number
    const sortedPeriods = [...allPeriods].sort((a, b) => {
      if (a.year !== b.year) return a.year - b.year;
      return a.period_number - b.period_number;
    });
    
    const currentIndex = sortedPeriods.findIndex(p => 
      p.year === currentPeriod.year && p.period_number === currentPeriod.period_number
    );
    
    if (currentIndex === -1 || currentIndex === sortedPeriods.length - 1) return undefined;
    return sortedPeriods[currentIndex + 1];
  }

  /**
   * Format a pay period for display
   * @param period The pay period to format
   * @returns Formatted string representation of the pay period
   */
  static formatPeriodDisplay(period: PayPeriod): string {
    return `Period ${period.period_number} (${period.start_date} - ${period.end_date})`;
  }

  /**
   * Validate a pay period's required fields
   * @param period The pay period to validate
   * @returns True if valid, throws error if invalid
   */
  static validatePeriod(period: Omit<PayPeriod, 'PK_ID'>): boolean {
    if (!period.period_number || period.period_number < 1 || period.period_number > 26) {
      throw new Error('Period number must be between 1 and 26');
    }
    if (!period.year) {
      throw new Error('Year is required');
    }
    if (!period.start_date) {
      throw new Error('Start date is required');
    }
    if (!period.end_date) {
      throw new Error('End date is required');
    }
    if (!period.status) {
      throw new Error('Status is required');
    }
    return true;
  }
}
