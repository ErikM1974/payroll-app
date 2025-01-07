import { PayPeriod } from '../types';
import { PayPeriodManager } from '../utils/payPeriodManager';
import { ScriptAPI } from '../services/scriptApi';

async function initializePayPeriods() {
  try {
    console.log('Creating periods for year 2025...');

    // Generate pay periods for 2025
    const periods = PayPeriodManager.generatePayPeriodsForYear(2025);

    // Find the current period
    const currentPeriod = PayPeriodManager.findCurrentPeriod(periods as PayPeriod[]);

    // Update is_current flag
    const updatedPeriods = periods.map(period => ({
      ...period,
      is_current: currentPeriod && 
        period.year === currentPeriod.year && 
        period.period_number === currentPeriod.period_number
    }));

    // Create each period
    for (const period of updatedPeriods) {
      try {
        await ScriptAPI.createPayPeriod(period);
      } catch (error) {
        console.error('Error creating pay period:', error);
        if (error.response) {
          console.error('Response data:', error.response.data);
        }
        throw error;
      }
    }

    console.log('Successfully initialized pay periods for 2025');
  } catch (error) {
    console.error('Error initializing pay periods:', error);
    throw error;
  }
}

initializePayPeriods().catch(error => {
  console.error('Failed to initialize pay periods:', error);
  process.exit(1);
});
