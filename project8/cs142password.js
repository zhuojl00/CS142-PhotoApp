const { createHash, randomBytes } = require("crypto");

const SECRET_KEY = "zuilede";

/*
 * Return a salted and hashed password entry from a
 * clear text password.
 * @param {string} clearTextPassword
 * @return {object} passwordEntry
 * where passwordEntry is an object with two string
 * properties:
 *      salt - The salt used for the password.
 *      hash - The sha1 hash of the password and salt
 */
function makePasswordEntry(clearTextPassword) {
  let salt = randomBytes(8);
  salt = salt.toString("hex");

  const hash = createHash("sha1", "zuilede");
  let hashed_pwd = hash.update(salt + clearTextPassword).digest("hex");
  return { salt: salt, hash: hashed_pwd };
}

/*
 * Return true if the specified clear text password
 * and salt generates the specified hash.
 * @param {string} hash
 * @param {string} salt
 * @param {string} clearTextPassword
 * @return {boolean}
 */
function doesPasswordMatch(hash, salt, clearTextPassword) {
  let entered_password = salt + clearTextPassword;
  const hash_obj = createHash("sha1", "zuilede");
  const entered_pwd_hash = hash_obj.update(entered_password).digest("hex");

  console.log("ajdsilfjsa", hash, entered_pwd_hash);
  return hash === entered_pwd_hash;
}

module.exports = { makePasswordEntry, doesPasswordMatch };
