const cron = require('node-cron')
const Slider = require('../models/Slider')

const startSliderCron = () => {
  // Runs every day at midnight
  cron.schedule('0 0 * * *', async () => {
    try {
      const now = new Date()
      const result = await Slider.deleteMany({
        expiresAt: { $lte: now, $ne: null }
      })
      console.log(`Cron job ran — deleted ${result.deletedCount} expired sliders`)
    } catch (err) {
      console.error('Cron job error:', err.message)
    }
  })
  console.log('Slider cron job started')
}

module.exports = startSliderCron