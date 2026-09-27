// Vercel serverless function for daily reminder cron
const { sendEmailReminders } = require('../../services/reminderCron');

module.exports = async (req, res) => {
  try {
    const result = await sendEmailReminders();
    res.status(200).json(result);
  } catch (error) {
    console.error('[Vercel Cron] Error executing reminder:', error);
    res.status(500).json({ error: error.message });
  }
};
