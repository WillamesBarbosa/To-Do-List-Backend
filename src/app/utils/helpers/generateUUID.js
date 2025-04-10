const { randomUUID } = require("crypto");

function generateUUID() {
  return randomUUID();
}

module.exports = generateUUID;
