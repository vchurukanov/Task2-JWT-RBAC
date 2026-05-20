const bcrypt = require("bcryptjs");

async function generateHashes() {
  const adminPassword = "admin123";
  const userPassword = "user123";

  const adminHash = await bcrypt.hash(adminPassword, 10);
  const userHash = await bcrypt.hash(userPassword, 10);

  console.log("ADMIN_PASSWORD_HASH=");
  console.log(adminHash);

  console.log("\nUSER_PASSWORD_HASH=");
  console.log(userHash);
}

generateHashes();