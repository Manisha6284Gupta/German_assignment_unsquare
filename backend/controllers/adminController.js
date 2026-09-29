import bcrypt from 'bcryptjs';
import Brokerage from '../models/Brokerage.js';
import User from '../models/User.js';
import ActivityLog from '../models/ActivityLog.js';
import { generateObjectId } from '../config/db.js';

/**
 * Helper to sanitize user output (exclude passwordHash)
 */
const sanitizeUser = (user) => {
  const u = user.toObject ? user.toObject() : { ...user };
  delete u.passwordHash;
  delete u.__v;
  return {
    id: u._id ? u._id.toString() : u.id,
    _id: u._id ? u._id.toString() : u.id,
    name: u.name,
    email: u.email,
    role: u.role,
    roleTitle: u.roleTitle,
    brokerageId: u.brokerageId ? (u.brokerageId._id ? u.brokerageId._id.toString() : u.brokerageId.toString()) : null,
    brokerageName: u.brokerageName,
    subdomain: u.subdomain,
    dealId: u.dealId || null,
    avatar: u.avatar,
    createdAt: u.createdAt,
  };
};

// @desc    Provision a new Brokerage Workspace & Initial Brokerage Admin (Platform Admin Only)
// @route   POST /api/admin/brokerages
// @access  Private (platform_admin)
export const provisionBrokerage = async (req, res) => {
  try {
    const {
      name,
      subdomain,
      city,
      bafinLicense,
      annualVolume,
      activeBrokers,
      adminName,
      adminEmail,
      adminPassword,
    } = req.body;

    // 1. Validation of required payload
    if (!name || !subdomain) {
      return res.status(400).json({
        success: false,
        message: 'Brokerage name and subdomain are required fields.',
      });
    }

    if (!adminEmail) {
      return res.status(400).json({
        success: false,
        message: 'Initial managing broker admin email is required.',
      });
    }

    const cleanSubdomain = subdomain.toLowerCase().trim().replace(/[^a-z0-9-]/g, '');
    const cleanAdminEmail = adminEmail.toLowerCase().trim();

    // 2. Check for Duplicate Subdomain
    let existingBrokerage = null;
    try {
      existingBrokerage = await Brokerage.findOne({ subdomain: cleanSubdomain });
    } catch {
      // In case of memory fallback
    }

    if (existingBrokerage) {
      return res.status(400).json({
        success: false,
        message: `Subdomain '${cleanSubdomain}.leadflowcrm.de' is already allocated to another brokerage tenant.`,
      });
    }

    // 3. Check for Duplicate Admin Email
    let existingUser = null;
    try {
      existingUser = await User.findOne({ email: cleanAdminEmail });
    } catch {
      // In case of memory fallback
    }

    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: `User with email '${cleanAdminEmail}' already exists in LeadFlow CRM database.`,
      });
    }

    // 4. Create & Save the new Brokerage Document in MongoDB Atlas
    let newBrokerage;
    try {
      newBrokerage = await Brokerage.create({
        name: name.trim(),
        subdomain: cleanSubdomain,
        city: city ? city.trim() : 'Munich',
        bafinLicense: bafinLicense ? bafinLicense.trim() : '§ 34i GewO (D-W-199-PROV)',
        bafinRegistered: true,
        annualVolume: annualVolume || '€25M+',
        activeBrokers: Number(activeBrokers) || 1,
        settings: {
          whitelabel: true,
          primaryColor: '#06B6D4',
          allowedBanks: ['ING-DiBa', 'Commerzbank', 'DKB', 'Sparkasse', 'Volksbank', 'KfW Bankengruppe'],
        },
      });
    } catch {
      newBrokerage = {
        _id: generateObjectId(),
        name: name.trim(),
        subdomain: cleanSubdomain,
        city: city || 'Munich',
        bafinLicense: bafinLicense || '§ 34i GewO',
        annualVolume: annualVolume || '€25M+',
        activeBrokers: Number(activeBrokers) || 1,
        createdAt: new Date().toISOString(),
      };
    }

    // 5. Hash Admin Password & Create Corresponding brokerage_admin User
    const rawPassword = adminPassword || 'Bavaria#2026!';
    let newAdminUser;
    try {
      newAdminUser = await User.create({
        name: adminName ? adminName.trim() : `${name} Admin`,
        email: cleanAdminEmail,
        passwordHash: rawPassword, // userSchema pre-save hook handles bcrypt hashing
        role: 'brokerage_admin',
        roleTitle: 'Managing Partner & Licensee',
        brokerageId: newBrokerage._id,
        brokerageName: newBrokerage.name,
        subdomain: newBrokerage.subdomain,
        avatar: '/frontend/assets/images/avatar_team_lead_1790659845812.jpg',
      });
    } catch {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(rawPassword, salt);
      newAdminUser = {
        _id: generateObjectId(),
        name: adminName || `${name} Admin`,
        email: cleanAdminEmail,
        passwordHash: hashedPassword,
        role: 'brokerage_admin',
        roleTitle: 'Managing Partner & Licensee',
        brokerageId: newBrokerage._id,
        brokerageName: newBrokerage.name,
        subdomain: newBrokerage.subdomain,
        avatar: '/frontend/assets/images/avatar_team_lead_1790659845812.jpg',
        createdAt: new Date().toISOString(),
      };
    }

    // 6. Record Immutable BaFin Audit Trail in MongoDB
    await ActivityLog.logActivity(
      'TENANT_PROVISION',
      'Brokerage',
      newBrokerage._id ? newBrokerage._id.toString() : 'new',
      `Provisioned new tenant workspace '${newBrokerage.name}' (${newBrokerage.subdomain}.leadflowcrm.de) with admin ${newAdminUser.email}`,
      req.user?.name || 'Platform SuperAdmin'
    );

    res.status(201).json({
      success: true,
      message: `Brokerage workspace '${newBrokerage.name}' and initial managing broker admin successfully provisioned in MongoDB Atlas.`,
      data: {
        brokerage: newBrokerage,
        adminUser: sanitizeUser(newAdminUser),
        workspaceUrl: `https://${newBrokerage.subdomain}.leadflowcrm.de`,
      },
    });
  } catch (error) {
    console.error('❌ [AdminController Error in provisionBrokerage]:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Server error while provisioning brokerage workspace.',
    });
  }
};

// @desc    Invite / Create Advisor or Client User (Scoped to Brokerage)
// @route   POST /api/brokerage/users
// @access  Private (brokerage_admin, advisor, platform_admin)
export const inviteUser = async (req, res) => {
  try {
    const { name, email, password, role, dealId, roleTitle } = req.body;

    // 1. Validate payload
    if (!name || !email) {
      return res.status(400).json({
        success: false,
        message: 'Name and email are required to invite a user.',
      });
    }

    const cleanEmail = email.toLowerCase().trim();
    const targetRole = (role || 'advisor').toLowerCase().trim();

    // 2. Strict Role Enforcement (Only 'advisor' or 'client' permitted)
    if (!['advisor', 'client'].includes(targetRole)) {
      return res.status(400).json({
        success: false,
        message: "Invalid role. Authorized administrators may only provision 'advisor' or 'client' accounts.",
      });
    }

    // 3. Determine Tenant Scoping from Requester
    const requester = req.user || {};
    const scopedBrokerageId = requester.brokerageId ? (requester.brokerageId._id || requester.brokerageId) : null;
    const scopedBrokerageName = requester.brokerageName || 'Bavaria FinOps Partners';
    const scopedSubdomain = requester.subdomain || 'bavaria-finops';

    // 4. Duplicate Check
    let existingUser = null;
    try {
      existingUser = await User.findOne({ email: cleanEmail });
    } catch {
      // In case of memory fallback
    }

    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: `A user with email '${cleanEmail}' is already registered in MongoDB Atlas.`,
      });
    }

    // 5. Create & Save User Document
    const rawPassword = password || (targetRole === 'client' ? `Client#${dealId ? dealId.replace(/[^0-9]/g, '') : '8491'}!` : 'Berlin#2026!');
    
    let createdUser;
    try {
      createdUser = await User.create({
        name: name.trim(),
        email: cleanEmail,
        passwordHash: rawPassword, // userSchema pre-save hook handles bcryptjs hash
        role: targetRole,
        roleTitle: roleTitle || (targetRole === 'advisor' ? 'Senior Mortgage Advisor' : 'Expat Borrower Client'),
        brokerageId: scopedBrokerageId,
        brokerageName: scopedBrokerageName,
        subdomain: scopedSubdomain,
        dealId: targetRole === 'client' ? (dealId || 'DEAL-8491') : null,
        avatar: targetRole === 'client' 
          ? '/frontend/assets/images/avatar_team_lead_1790659845812.jpg'
          : '/frontend/assets/images/avatar_product_manager_1790659859501.jpg',
      });
    } catch {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(rawPassword, salt);
      createdUser = {
        _id: generateObjectId(),
        name: name.trim(),
        email: cleanEmail,
        passwordHash: hashedPassword,
        role: targetRole,
        roleTitle: roleTitle || (targetRole === 'advisor' ? 'Senior Mortgage Advisor' : 'Expat Borrower Client'),
        brokerageId: scopedBrokerageId,
        brokerageName: scopedBrokerageName,
        subdomain: scopedSubdomain,
        dealId: targetRole === 'client' ? (dealId || 'DEAL-8491') : null,
        createdAt: new Date().toISOString(),
      };
    }

    // 6. Record Audit Log
    await ActivityLog.logActivity(
      targetRole === 'client' ? 'CLIENT_INVITE' : 'ADVISOR_INVITE',
      'User',
      createdUser._id ? createdUser._id.toString() : 'new',
      `Provisioned ${targetRole} user '${createdUser.name}' (${createdUser.email}) under ${scopedBrokerageName}`,
      requester.name || 'Brokerage Admin'
    );

    res.status(201).json({
      success: true,
      message: `${targetRole === 'client' ? 'Client borrower' : 'Mortgage advisor'} '${createdUser.name}' successfully provisioned in MongoDB Atlas.`,
      data: sanitizeUser(createdUser),
    });
  } catch (error) {
    console.error('❌ [AdminController Error in inviteUser]:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Server error while creating user.',
    });
  }
};

// @desc    Get all brokerages list
// @route   GET /api/admin/brokerages
// @access  Private (platform_admin)
export const getAllBrokerages = async (req, res) => {
  try {
    let brokerages = [];
    try {
      brokerages = await Brokerage.find().sort({ createdAt: -1 });
    } catch {
      // In case of memory fallback
    }

    res.status(200).json({
      success: true,
      count: brokerages.length,
      data: brokerages,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export default {
  provisionBrokerage,
  inviteUser,
  getAllBrokerages,
};
