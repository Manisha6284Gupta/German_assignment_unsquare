import database, { generateObjectId } from '../config/db.js';
import ActivityLog from '../models/ActivityLog.js';
import seedDatabase from '../config/seed.js';

// @desc    Handle demo requests from SaaS landing page
// @route   POST /api/demo/request
// @access  Public
export const requestDemo = async (req, res) => {
  try {
    const { name, email, brokerageName, phone, city, monthlyVolume, teamSize } = req.body;

    if (!name || !email) {
      return res.status(400).json({
        success: false,
        message: 'Name and work email are required'
      });
    }

    const demoEntry = {
      _id: generateObjectId(),
      name,
      email,
      brokerageName: brokerageName || 'Independent Mortgage Brokerage',
      phone: phone || 'N/A',
      city: city || 'Munich',
      monthlyVolume: monthlyVolume || '€2M - €5M',
      teamSize: teamSize || '3-5 Advisors',
      requestedAt: new Date().toISOString(),
      status: 'SCHEDULED_FRANKFURT_SPECIALIST'
    };

    try {
      const coll = database.getCollection('demo_requests');
      await coll.create(demoEntry);
    } catch {
      // Ignore
    }

    await ActivityLog.logActivity(
      'DEMO_REQUEST',
      'DemoRequest',
      demoEntry._id,
      `Demo requested by ${name} (${brokerageName || 'Independent Brokerage'})`,
      name
    );

    res.status(201).json({
      success: true,
      message: 'Demo scheduled with German mortgage CRM specialist',
      data: demoEntry
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Trigger database auto-seeding on demand
// @route   POST /api/demo/seed
// @access  Public
export const triggerSeed = async (req, res) => {
  try {
    await seedDatabase();
    res.status(200).json({
      success: true,
      message: 'Database auto-seed executed successfully with default brokerages, personas, and deals.',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Auto-seed failed',
    });
  }
};

export default { requestDemo, triggerSeed };
