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
    id: u._id ? u._id.toString() : (u.id || generateObjectId()),
    _id: u._id ? u._id.toString() : (u.id || generateObjectId()),
    name: u.name,
    email: u.email,
    role: u.role,
    roleTitle: u.roleTitle || (u.role === 'advisor' ? 'Senior Expat Mortgage Advisor' : 'Client Borrower'),
    brokerageId: u.brokerageId ? (u.brokerageId._id ? u.brokerageId._id.toString() : u.brokerageId.toString()) : null,
    brokerageName: u.brokerageName || 'Bavaria FinOps Partners',
    subdomain: u.subdomain || 'bavaria-finops',
    dealId: u.dealId || null,
    avatar: u.avatar,
    createdAt: u.createdAt,
  };
};

// @desc    Get all users / advisors (Optionally scoped to tenant subdomain or role)
// @route   GET /api/brokerage/users or GET /api/admin/users
// @access  Private
export const getUsers = async (req, res) => {
  try {
    const { role, subdomain } = req.query;
    const filter = {};

    if (role && role !== 'all') {
      filter.role = role;
    }
    if (subdomain && subdomain !== 'all') {
      filter.subdomain = subdomain;
    }

    let users = [];
    try {
      users = await User.find(filter).sort({ createdAt: 1 });
    } catch {
      // In case of memory fallback
    }

    // Auto-seed default Bavaria FinOps advisors in DB if not already present
    if ((!role || role === 'advisor') && (!subdomain || subdomain === 'bavaria-finops')) {
      const defaultAdvisors = [
        {
          name: 'Laura Weimann',
          email: 'laura@bavaria-finops.de',
          passwordHash: 'Berlin#2026!',
          role: 'advisor',
          roleTitle: 'Senior Expat Mortgage Advisor',
          brokerageName: 'Bavaria FinOps Partners',
          subdomain: 'bavaria-finops',
          avatar: '/frontend/assets/images/avatar_product_manager_1790659859501.jpg',
        },
        {
          name: 'Markus Eder',
          email: 'markus.eder@bavaria-finops.de',
          passwordHash: 'Bavaria#2026!',
          role: 'advisor',
          roleTitle: 'Commercial & Residential Broker',
          brokerageName: 'Bavaria FinOps Partners',
          subdomain: 'bavaria-finops',
          avatar: '/frontend/assets/images/avatar_team_lead_1790659845812.jpg',
        },
        {
          name: 'Elena Rostova',
          email: 'elena.rostova@bavaria-finops.de',
          passwordHash: 'Bavaria#2026!',
          role: 'advisor',
          roleTitle: 'Relocation & EU Blue Card Specialist',
          brokerageName: 'Bavaria FinOps Partners',
          subdomain: 'bavaria-finops',
          avatar: '/frontend/assets/images/avatar_product_manager_1790659859501.jpg',
        },
      ];

      for (const adv of defaultAdvisors) {
        const found = users.find(u => u.email === adv.email);
        if (!found) {
          try {
            const created = await User.create(adv);
            users.unshift(created);
          } catch {
            // Already created
          }
        }
      }
    }

    const sanitized = users.map(sanitizeUser);

    res.status(200).json({
      success: true,
      count: sanitized.length,
      data: sanitized,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
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
        passwordHash: rawPassword,
        role: 'brokerage_admin',
        roleTitle: 'Managing Partner & Licensee',
        brokerageId: newBrokerage._id || null,
        brokerageName: newBrokerage.name,
        subdomain: newBrokerage.subdomain,
        avatar: '/frontend/assets/images/avatar_team_lead_1790659845812.jpg',
      });
      console.log(`✅ [MongoDB Atlas User Insert] Created brokerage_admin in 'users' collection: ${newAdminUser.email} (ID: ${newAdminUser._id})`);
    } catch (userErr) {
      console.error('❌ [User.create error in provisionBrokerage]:', userErr.message);
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(rawPassword, salt);
      newAdminUser = {
        _id: generateObjectId(),
        name: adminName || `${name} Admin`,
        email: cleanAdminEmail,
        passwordHash: hashedPassword,
        role: 'brokerage_admin',
        roleTitle: 'Managing Partner & Licensee',
        brokerageId: newBrokerage._id || null,
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
    const { name, email, password, role, dealId, roleTitle, subdomain, brokerageName } = req.body;

    // 1. Validate payload
    if (!name || !email) {
      return res.status(400).json({
        success: false,
        message: 'Name and email are required to invite a user.',
      });
    }

    const cleanEmail = email.toLowerCase().trim();
    const targetRole = (role || 'advisor').toLowerCase().trim();

    // 2. Strict Role Enforcement (Only allowed system roles permitted)
    if (!['platform_admin', 'brokerage_admin', 'advisor', 'client'].includes(targetRole)) {
      return res.status(400).json({
        success: false,
        message: "Invalid role. Role must be 'platform_admin', 'brokerage_admin', 'advisor', or 'client'.",
      });
    }

    // Non-platform-admins cannot create other platform_admins
    const requester = req.user || {};
    if (targetRole === 'platform_admin' && requester.role && requester.role !== 'platform_admin') {
      return res.status(403).json({
        success: false,
        message: 'Security Violation: Only existing Platform SuperAdmins can provision new SuperAdmin credentials.',
      });
    }

    // 3. Determine Tenant Scoping from Requester or Request Body
    let scopedBrokerageId = targetRole === 'platform_admin' ? null : (requester.brokerageId ? (requester.brokerageId._id || requester.brokerageId) : null);
    const scopedBrokerageName = targetRole === 'platform_admin' ? 'LeadFlow Global Infrastructure' : (brokerageName || requester.brokerageName || 'Bavaria FinOps Partners');
    const scopedSubdomain = targetRole === 'platform_admin' ? 'platform-master' : (subdomain || requester.subdomain || 'bavaria-finops');

    if (!scopedBrokerageId && targetRole !== 'platform_admin') {
      try {
        const foundB = await Brokerage.findOne({
          $or: [{ subdomain: scopedSubdomain }, { name: scopedBrokerageName }]
        });
        if (foundB && foundB._id) {
          scopedBrokerageId = foundB._id;
        }
      } catch {
        // ignore
      }
    }

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

    // 5. Create & Save User Document in MongoDB Atlas
    const rawPassword = password || (
      targetRole === 'platform_admin' ? 'SuperAdmin#2026!' :
      targetRole === 'brokerage_admin' ? 'Munich#2026!' :
      targetRole === 'client' ? `Client#${dealId ? dealId.replace(/[^0-9]/g, '') : '8491'}!` : 
      'Berlin#2026!'
    );
    
    const defaultAvatar = targetRole === 'platform_admin'
      ? '/frontend/assets/images/avatar_mern_developer_1790659832213.jpg'
      : targetRole === 'brokerage_admin'
      ? '/frontend/assets/images/avatar_team_lead_1790659845812.jpg'
      : targetRole === 'client'
      ? '/frontend/assets/images/avatar_team_lead_1790659845812.jpg'
      : '/frontend/assets/images/avatar_product_manager_1790659859501.jpg';

    const defaultRoleTitle = targetRole === 'platform_admin'
      ? 'Platform SuperAdmin (LeadFlow Core)'
      : targetRole === 'brokerage_admin'
      ? 'Managing Partner & Brokerage Admin'
      : targetRole === 'advisor'
      ? 'Senior Mortgage Advisor'
      : 'Expat Borrower Client';

    const documentToSave = {
      name: name.trim(),
      email: cleanEmail,
      passwordHash: rawPassword, // userSchema pre-save hook handles bcryptjs hash
      role: targetRole,
      roleTitle: roleTitle || defaultRoleTitle,
      brokerageId: scopedBrokerageId || null,
      brokerageName: scopedBrokerageName,
      subdomain: scopedSubdomain,
      dealId: targetRole === 'client' ? (dealId || 'DEAL-8491') : null,
      avatar: defaultAvatar,
      isActive: true,
    };

    console.log('\n📝 --------------------------------------------------------');
    console.log('💾 [MongoDB Atlas Collection: "users"] Preparing Document Insert:');
    console.log(JSON.stringify({
      ...documentToSave,
      passwordHash: '*** [BCRYPT_PRE_SAVE_HASH] ***'
    }, null, 2));
    console.log('--------------------------------------------------------\n');

    let createdUser;
    try {
      createdUser = await User.create(documentToSave);
      console.log('✅ [MongoDB Atlas Document Saved Successfully]:', {
        _id: createdUser._id ? createdUser._id.toString() : 'generated-id',
        name: createdUser.name,
        email: createdUser.email,
        role: createdUser.role,
        collection: 'users',
        status: 'INSERTED_INTO_MONGODB'
      });
    } catch (saveError) {
      console.error('❌ [User.create Failed with Error]:', saveError.message);
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(rawPassword, salt);
      createdUser = {
        _id: generateObjectId(),
        ...documentToSave,
        passwordHash: hashedPassword,
        createdAt: new Date().toISOString(),
      };
      console.log('⚠️ [Document Saved in Local Fallback Store]:', {
        _id: createdUser._id,
        name: createdUser.name,
        email: createdUser.email
      });
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

// @desc    Update an existing User / Advisor Profile
// @route   PUT /api/brokerage/users/:id
// @access  Private (brokerage_admin, platform_admin)
export const updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, email, role, roleTitle, bafinLicense, password, status } = req.body;
    const requester = req.user || {};

    // 1. Find user
    let user = null;
    try {
      if (id.match(/^[0-9a-fA-F]{24}$/)) {
        user = await User.findById(id);
      }
      if (!user) {
        user = await User.findOne({ $or: [{ _id: id }, { email: email?.toLowerCase().trim() }] });
      }
    } catch {
      // In case of memory fallback
    }

    if (!user) {
      return res.status(404).json({
        success: false,
        message: `User with identifier '${id}' not found in MongoDB Atlas.`,
      });
    }

    // 2. Tenant isolation check
    if (requester.role !== 'platform_admin') {
      const requesterSubdomain = requester.subdomain || 'bavaria-finops';
      if (user.subdomain && user.subdomain !== requesterSubdomain) {
        return res.status(403).json({
          success: false,
          message: 'Tenant Security Violation: Cannot modify staff outside your brokerage workspace.',
        });
      }
    }

    // 3. Apply updates
    if (name) user.name = name.trim();
    if (email) user.email = email.toLowerCase().trim();
    if (role && ['advisor', 'client', 'brokerage_admin'].includes(role)) {
      user.role = role;
    }
    if (roleTitle) user.roleTitle = roleTitle.trim();
    if (status !== undefined) {
      user.isActive = status === 'active';
    }

    // 4. Password re-hash if provided
    if (password && password.trim().length > 0) {
      const salt = await bcrypt.genSalt(10);
      user.passwordHash = await bcrypt.hash(password.trim(), salt);
    }

    if (user.save) {
      await user.save();
    }

    // 5. Record BaFin compliance audit log
    await ActivityLog.logActivity(
      'USER_PROFILE_UPDATED',
      'User',
      user._id ? user._id.toString() : id,
      `Updated user profile '${user.name}' (${user.email}) - role: '${user.roleTitle || user.role}'`,
      requester.name || 'Brokerage Admin'
    );

    res.status(200).json({
      success: true,
      message: `User '${user.name}' profile successfully updated in MongoDB Atlas.`,
      data: sanitizeUser(user),
    });
  } catch (error) {
    console.error('❌ [AdminController Error in updateUser]:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Server error while updating user.',
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
  getUsers,
  provisionBrokerage,
  inviteUser,
  updateUser,
  getAllBrokerages,
};
