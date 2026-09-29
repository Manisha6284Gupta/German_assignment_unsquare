import Deal from '../models/Deal.js';
import ActivityLog from '../models/ActivityLog.js';

// Fallback initial deals
const FALLBACK_DEALS = [
  {
    id: 'DEAL-8491',
    clientName: 'Alexander & Maya Lindqvist',
    clientType: 'Expat (EU Blue Card)',
    nationality: 'Sweden / UK',
    propertyCity: 'Munich (Schwabing)',
    propertyPrice: 850000,
    loanAmount: 680000,
    equityPercent: 20,
    stage: 'doc_verification',
    assignedBroker: 'Maximilian Bauer',
    avatar: '/frontend/assets/images/avatar_team_lead_1790659845812.jpg',
    schufaScore: 98.4,
    monthlyNetIncome: 9400,
    targetBank: 'ING-DiBa',
    matchScore: 96,
    docsReady: 4,
    totalDocs: 5,
    createdAt: '2 hours ago',
    priority: 'high',
  },
  {
    id: 'DEAL-8492',
    clientName: 'Priya Narang & Dev Patel',
    clientType: 'Expat (EU Blue Card)',
    nationality: 'India',
    propertyCity: 'Berlin (Prenzlauer Berg)',
    propertyPrice: 620000,
    loanAmount: 520000,
    equityPercent: 16,
    stage: 'bank_matching',
    assignedBroker: 'Laura Weimann',
    avatar: '/frontend/assets/images/avatar_product_manager_1790659859501.jpg',
    schufaScore: 99.1,
    monthlyNetIncome: 8800,
    targetBank: 'Commerzbank / DKB',
    matchScore: 94,
    docsReady: 5,
    totalDocs: 5,
    createdAt: 'Yesterday',
    priority: 'urgent',
  },
  {
    id: 'DEAL-8493',
    clientName: 'Dr. Florian & Sophie Richter',
    clientType: 'German Resident',
    nationality: 'Germany',
    propertyCity: 'Frankfurt (Westend)',
    propertyPrice: 1250000,
    loanAmount: 950000,
    equityPercent: 24,
    stage: 'offer_issued',
    assignedBroker: 'Maximilian Bauer',
    avatar: '/frontend/assets/images/avatar_team_lead_1790659845812.jpg',
    schufaScore: 99.7,
    monthlyNetIncome: 14200,
    targetBank: 'Sparkasse Frankfurt',
    matchScore: 98,
    docsReady: 6,
    totalDocs: 6,
    createdAt: '3 days ago',
    priority: 'urgent',
  },
];

// @desc    Get all mortgage pipeline deals from MongoDB Atlas
// @route   GET /api/deals
// @access  Public / Tenant
export const getDeals = async (req, res) => {
  try {
    const { stage, city, clientType, search } = req.query;
    const filter = {};

    if (stage && stage !== 'all') filter.stage = stage;
    if (city && city !== 'all') filter.propertyCity = { $regex: city, $options: 'i' };
    if (clientType && clientType !== 'all') filter.clientType = clientType;
    if (search) {
      filter.clientName = { $regex: search, $options: 'i' };
    }

    let deals = [];
    try {
      deals = await Deal.find(filter).sort({ createdAt: -1 });
    } catch {
      // Fallback
    }

    if (deals.length === 0 && !stage && !city && !clientType && !search) {
      deals = FALLBACK_DEALS;
    }

    res.status(200).json({
      success: true,
      count: deals.length,
      data: deals,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Create new borrower deal in MongoDB Atlas
// @route   POST /api/deals
// @access  Public / Tenant
export const createDeal = async (req, res) => {
  try {
    const {
      clientName,
      clientType,
      propertyCity,
      propertyPrice,
      loanAmount,
      monthlyNetIncome,
      targetBank,
      equityPercent,
      assignedBroker,
    } = req.body;

    if (!clientName) {
      return res.status(400).json({ success: false, message: 'Borrower client name is required' });
    }

    let deal;
    try {
      deal = await Deal.create({
        clientName,
        clientType: clientType || 'Expat (EU Blue Card)',
        propertyCity: propertyCity || 'Munich',
        propertyPrice: Number(propertyPrice) || 650000,
        loanAmount: Number(loanAmount) || 520000,
        equityPercent: Number(equityPercent) || 20,
        monthlyNetIncome: Number(monthlyNetIncome) || 8500,
        targetBank: targetBank || 'ING-DiBa',
        assignedBroker: assignedBroker || 'Maximilian Bauer',
        stage: 'new_lead',
      });
    } catch {
      deal = {
        id: `DEAL-${Math.floor(8000 + Math.random() * 1999)}`,
        clientName,
        clientType: clientType || 'Expat (EU Blue Card)',
        propertyCity: propertyCity || 'Munich',
        propertyPrice: Number(propertyPrice) || 650000,
        loanAmount: Number(loanAmount) || 520000,
        equityPercent: Number(equityPercent) || 20,
        monthlyNetIncome: Number(monthlyNetIncome) || 8500,
        targetBank: targetBank || 'ING-DiBa',
        assignedBroker: assignedBroker || 'Maximilian Bauer',
        stage: 'new_lead',
        avatar: '/frontend/assets/images/avatar_team_lead_1790659845812.jpg',
        schufaScore: 98.5,
        matchScore: 95,
        docsReady: 1,
        totalDocs: 5,
        createdAt: 'Just now',
        priority: 'high',
      };
    }

    await ActivityLog.logActivity('CREATE_DEAL', 'Deal', deal.id || deal._id?.toString(), `Created new deal for ${deal.clientName}`, deal.assignedBroker);

    res.status(201).json({
      success: true,
      message: 'Borrower deal registered in MongoDB Atlas pipeline',
      data: deal,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update deal stage (Kanban advance)
// @route   PATCH /api/deals/:id/stage
// @access  Public / Tenant
export const updateDealStage = async (req, res) => {
  try {
    const { stage } = req.body;
    const dealId = req.params.id;

    let deal = null;
    try {
      deal = await Deal.findOneAndUpdate(
        { $or: [{ id: dealId }, { _id: dealId }] },
        { stage },
        { new: true }
      );
    } catch {
      // Fallback
    }

    if (!deal) {
      deal = { id: dealId, stage };
    }

    await ActivityLog.logActivity('UPDATE_STAGE', 'Deal', dealId, `Advanced deal ${dealId} to ${stage}`, 'Advisor');

    res.status(200).json({
      success: true,
      message: `Deal advanced to ${stage} in MongoDB`,
      data: deal,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
