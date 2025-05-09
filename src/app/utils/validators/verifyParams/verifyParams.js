function verifyParams(requiredFields = {}) {
    if(Object.keys(requiredFields).length === 0) return { valid: false, message: { error:'Any parameter send.'} };
    for (const [key, value] of Object.entries(requiredFields)) {
      if (!value) {
        return {
          valid: false,
          message: { error: `${key.charAt(0).toUpperCase() + key.slice(1)} is required.` }
        };
      }
    }
  
    return { valid: true };
  }
  
  module.exports = verifyParams;
  