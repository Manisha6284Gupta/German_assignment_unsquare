/**
 * Debugging Middleware to log incoming user creation / invitation requests
 */
export const logUserIngestionRequest = (req, res, next) => {
  const timestamp = new Date().toISOString();
  const requester = req.user ? `${req.user.name || 'Admin'} (${req.user.role || 'unknown'})` : 'Unauthenticated / Token Bearer';
  
  // Safe payload copy (masking password)
  const safePayload = { ...req.body };
  if (safePayload.password) {
    safePayload.password = '******** [HIDDEN]';
  }

  console.log('\n📥 ========================================================');
  console.log(`🚀 [HTTP INCOMING REQUEST] ${req.method} ${req.originalUrl}`);
  console.log(`⏰ Timestamp: ${timestamp}`);
  console.log(`👤 Requester: ${requester}`);
  console.log(`🌐 IP Address: ${req.ip || req.socket.remoteAddress}`);
  console.log('📦 Ingestion Payload:');
  console.log(JSON.stringify(safePayload, null, 2));
  console.log('========================================================\n');

  next();
};

export default logUserIngestionRequest;
