import User from '../models/User.js';
import Brokerage from '../models/Brokerage.js';
import Deal from '../models/Deal.js';

export const seedDatabase = async () => {
  try {
    // 1. Seed or find default German Brokerages
    let bavariaBrokerage = await Brokerage.findOne({ subdomain: 'bavaria-finops' });
    if (!bavariaBrokerage) {
      bavariaBrokerage = await Brokerage.create({
        name: 'Bavaria FinOps Partners GmbH',
        subdomain: 'bavaria-finops',
        city: 'Munich',
        bafinLicense: '§ 34i GewO (D-W-155-MUC-92)',
        annualVolume: '€65M+',
        activeBrokers: 8,
      });
      console.log('🏢 [Seed] Seeded Bavaria FinOps Partners brokerage');
    }

    let berlinBrokerage = await Brokerage.findOne({ subdomain: 'berlin-expats' });
    if (!berlinBrokerage) {
      berlinBrokerage = await Brokerage.create({
        name: 'Berlin Expat Lending Group GmbH',
        subdomain: 'berlin-expats',
        city: 'Berlin',
        bafinLicense: '§ 34i GewO (D-W-110-BER-44)',
        annualVolume: '€48M+',
        activeBrokers: 6,
      });
      console.log('🏢 [Seed] Seeded Berlin Expat Lending Group brokerage');
    }

    // 2. Seed the 4 Pre-Seeded Default Role Personas
    const defaultUsers = [
      {
        name: 'SaaS Infrastructure Admin',
        email: 'admin@leadflowcrm.de',
        passwordHash: 'SuperAdmin#2026!',
        role: 'platform_admin',
        roleTitle: 'Platform SuperAdmin (LeadFlow Core)',
        brokerageName: 'LeadFlow Global Infrastructure',
        subdomain: 'platform-master',
        avatar: '/frontend/assets/images/avatar_mern_developer_1790659832213.jpg',
      },
      {
        name: 'Maximilian Bauer',
        email: 'maximilian@bavaria-finops.de',
        passwordHash: 'Bavaria#2026!',
        role: 'brokerage_admin',
        roleTitle: 'Managing Partner & § 34i Licensee',
        brokerageId: bavariaBrokerage._id,
        brokerageName: bavariaBrokerage.name,
        subdomain: bavariaBrokerage.subdomain,
        avatar: '/frontend/assets/images/avatar_team_lead_1790659845812.jpg',
      },
      {
        name: 'Laura Weimann',
        email: 'laura@berlin-expats.de',
        passwordHash: 'Berlin#2026!',
        role: 'advisor',
        roleTitle: 'Senior Mortgage Advisor',
        brokerageId: berlinBrokerage._id,
        brokerageName: berlinBrokerage.name,
        subdomain: berlinBrokerage.subdomain,
        avatar: '/frontend/assets/images/avatar_product_manager_1790659859501.jpg',
      },
      {
        name: 'Alexander & Maya Lindqvist',
        email: 'alexander.lindqvist@gmail.com',
        passwordHash: 'Client#8491!',
        role: 'client',
        roleTitle: 'Borrower (Munich Home Purchase)',
        dealId: 'DEAL-8491',
        brokerageId: bavariaBrokerage._id,
        brokerageName: bavariaBrokerage.name,
        subdomain: bavariaBrokerage.subdomain,
        avatar: '/frontend/assets/images/avatar_team_lead_1790659845812.jpg',
      },
    ];

    for (const userData of defaultUsers) {
      const exists = await User.findOne({ email: userData.email });
      if (!exists) {
        await User.create(userData);
        console.log(`👤 [Seed] Seeded ${userData.role} user: ${userData.email}`);
      }
    }

    // 3. Seed Default Pipeline Deals
    const dealCount = await Deal.countDocuments();
    if (dealCount === 0) {
      const initialDeals = [
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
          priority: 'high',
          brokerageId: bavariaBrokerage._id,
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
          priority: 'urgent',
          brokerageId: berlinBrokerage._id,
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
          priority: 'urgent',
          brokerageId: bavariaBrokerage._id,
        },
      ];

      for (const d of initialDeals) {
        await Deal.create(d);
      }
      console.log('📊 [Seed] Seeded initial mortgage deals into MongoDB');
    }
  } catch (error) {
    console.warn('⚠️ [Seed Note]: Could not complete auto-seed, database may be in offline fallback mode:', error.message);
  }
};

export default seedDatabase;
