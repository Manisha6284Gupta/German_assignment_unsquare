import mongoose from 'mongoose';
import User from '../models/User.js';
import Brokerage from '../models/Brokerage.js';
import Deal from '../models/Deal.js';
import Document from '../models/Document.js';

export const seedDatabase = async () => {
  try {
    // If not connected to a live MongoDB Atlas instance, skip Mongoose query buffering
    if (mongoose.connection.readyState !== 1) {
      console.log('ℹ️ [LeadFlow Database Store]: Ready in resilient local memory mode.');
      return;
    }

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

    // 2. Seed Default Users & Advisors into MongoDB
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
      // 3 Bavaria FinOps Advisors
      {
        name: 'Laura Weimann',
        email: 'laura@bavaria-finops.de',
        passwordHash: 'Berlin#2026!',
        role: 'advisor',
        roleTitle: 'Senior Expat Mortgage Advisor',
        brokerageId: bavariaBrokerage._id,
        brokerageName: bavariaBrokerage.name,
        subdomain: 'bavaria-finops',
        avatar: '/frontend/assets/images/avatar_product_manager_1790659859501.jpg',
      },
      {
        name: 'Markus Eder',
        email: 'markus.eder@bavaria-finops.de',
        passwordHash: 'Bavaria#2026!',
        role: 'advisor',
        roleTitle: 'Commercial & Residential Broker',
        brokerageId: bavariaBrokerage._id,
        brokerageName: bavariaBrokerage.name,
        subdomain: 'bavaria-finops',
        avatar: '/frontend/assets/images/avatar_team_lead_1790659845812.jpg',
      },
      {
        name: 'Elena Rostova',
        email: 'elena.rostova@bavaria-finops.de',
        passwordHash: 'Bavaria#2026!',
        role: 'advisor',
        roleTitle: 'Relocation & EU Blue Card Specialist',
        brokerageId: bavariaBrokerage._id,
        brokerageName: bavariaBrokerage.name,
        subdomain: 'bavaria-finops',
        avatar: '/frontend/assets/images/avatar_product_manager_1790659859501.jpg',
      },
      // Borrower Client
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

    // 4. Seed initial documents into MongoDB Document collection
    const existingDocsCount = await Document.countDocuments();
    if (existingDocsCount === 0) {
      const initialVaultDocs = [
        {
          dealId: 'DEAL-8491',
          brokerageId: bavariaBrokerage._id,
          name: '3-Months Gehaltsabrechnung (Salary Slips)',
          category: 'Income & Employment',
          status: 'verified',
          isReady: true,
          ocrConfidence: 99.8,
          fileName: 'gehaltsabrechnungen_oct_dec_2025.pdf',
          fileSize: '2.4 MB',
          extractedDetails: 'DATEV OCR: €9,400.00 Net Income verified across Oct, Nov, Dec 2025',
          sha256Hash: 'a8f3b20c9103e87d12cf8841a01129bc782910fa'
        },
        {
          dealId: 'DEAL-8491',
          brokerageId: bavariaBrokerage._id,
          name: 'EU Blue Card Visa (Aufenthaltstitel)',
          category: 'Identity & Visa',
          status: 'verified',
          isReady: true,
          ocrConfidence: 99.5,
          fileName: 'eu_blue_card_visa_lindqvist.pdf',
          fileSize: '1.2 MB',
          extractedDetails: 'Valid § 18b Abs. 2 AufenthG (Permanent Employment Status in Bavaria)',
          sha256Hash: 'c74e89f02b3112d8a4590ef198a287bd04183812'
        },
        {
          dealId: 'DEAL-8491',
          brokerageId: bavariaBrokerage._id,
          name: 'Official SCHUFA Credit Certificate (Bonitätsauskunft)',
          category: 'Financial History',
          status: 'verified',
          isReady: true,
          ocrConfidence: 100.0,
          fileName: 'schufa_bonitaetsauskunft_2026.pdf',
          fileSize: '1.5 MB',
          extractedDetails: 'Schufa Score: 98.4% (Excellent Creditworthiness, 0 Negative Entries)',
          sha256Hash: 'e112d8a4590ef198a287bd04183812a8f3b20c91'
        },
        {
          dealId: 'DEAL-8491',
          brokerageId: bavariaBrokerage._id,
          name: 'Proof of Equity & Savings (Eigenkapitalnachweis)',
          category: 'Financial History',
          status: 'verified',
          isReady: true,
          ocrConfidence: 99.5,
          fileName: 'dkb_girokonto_equity_statement.pdf',
          fileSize: '5.6 MB',
          extractedDetails: 'Liquid Equity Verified: €180,000 in DKB Girokonto / Tagesgeld',
          sha256Hash: 'f4590ef198a287bd04183812a8f3b20c9103e87d'
        }
      ];

      for (const doc of initialVaultDocs) {
        await Document.create(doc);
      }
      console.log('📁 [Seed] Seeded initial verified documents into MongoDB Document collection');
    }
  } catch (error) {
    console.warn('⚠️ [Seed Note]: Could not complete auto-seed, database may be in offline fallback mode:', error.message);
  }
};

export default seedDatabase;
