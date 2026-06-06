import cron from 'node-cron';
import Product from './models/Product.js';

const DAILY_INCREMENT = 5;
const OVERFLOW_LIMIT = 1000;
const RESET_VALUE = 25;

function startDailyStockRefill() {
  cron.schedule('0 0 * * *', async () => {
    console.log('[Cron] Running daily stock refill...');

    try {
      const result = await Product.updateMany(
        {},
        [
          {
            $set: {
              stock: {
                $cond: {
                  if: { $gt: ['$stock', OVERFLOW_LIMIT] },
                  then: RESET_VALUE,
                  else: {
                    $cond: {
                      if: { $gt: [{ $add: ['$stock', DAILY_INCREMENT] }, OVERFLOW_LIMIT] },
                      then: RESET_VALUE,
                      else: { $add: ['$stock', DAILY_INCREMENT] },
                    },
                  },
                },
              },
            },
          },
        ]
      );

      console.log(`[Cron] Stock refill complete. ${result.modifiedCount} products updated.`);
    } catch (err) {
      console.error('[Cron] Stock refill failed:', err.message);
    }
  });

  console.log('[Cron] Daily stock refill scheduled (midnight).');
}

export default startDailyStockRefill;
