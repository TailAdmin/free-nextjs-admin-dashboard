
import mysql from 'mysql2';

const pool = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: 'MindYourBusiness',
    database: 'fursadashs',
}).promise()

// export default async function getUsers() {
//   const [rows] = await pool.query("SELECT * FROM seekers UNION SELECT * FROM providers")
//   return rows
// }
export async function postUser(fname,lname, email, phone, status,type) {
  const [result] = await pool.query("INSERT INTO users (fname, lname, email, phone, status, type) VALUES (?, ?, ?, ?, ?,?)", [fname, lname, email, phone, status, type]);
  return result;
}
export async function getUsers() {
  const [rows] = await pool.query("SELECT * FROM users");
  return rows;
}
export async function deleteUser(userName) {
  const [result] = await pool.query("DELETE FROM users WHERE userid = ?", [userName]);
  return result;
}
export async function updateUser(userName,fname,lname, email, phone, status,type) {
  const [result] = await pool.query("UPDATE users SET  fname=?, lname=?, email=?, phone=?, status=?, type=?  WHERE userid=?", [fname, lname, email, phone, status, type, userName]);
  return result;
}

 export async function postJoblisting(providerid, position, labels,company,location,creationdate, status, nbreapplicants) {
  const [result] = await pool.query("INSERT INTO joblisting (providerid, position, labels,company,location,creationdate, status, nbreapplicants) VALUES (?, ?, ?, ?, ?,?,?,?)", [providerid, position, labels,company,location,creationdate, status, nbreapplicants]);
  return result;
 }
 export async function getJoblisting() {
   const [rows] = await pool.query("SELECT * FROM joblisting");
   return rows;
 }
 export async function deleteJoblisting(seekerName) {
   const [result] = await pool.query("DELETE FROM joblisting WHERE jobid = ?", [seekerName]);
   return result;
 }
 export async function updateJoblisting(seekerName, position, labels, company,creationdate, status, nbreapplicants) {
   const [result] = await pool.query("UPDATE joblisting SET  position=?, labels=?, company=?, creationdate=?, status=?, nbreapplicants=? WHERE jobid=?", [ position, labels,company,creationdate, status, nbreapplicants, seekerName]);
  return result;
 }

// export async function getOffers() {
//   const [rows] = await pool.query("SELECT * FROM offers");
//   return rows;
// }
// export async function deleteOffer(offerName) {
//   const [result] = await pool.query("DELETE FROM offers WHERE name = ?", [offerName]);
//   return result;
// }
// export async function updateOffer(offerName, creationDate, category, status) {
//   const [result] = await pool.query("UPDATE offers SET  creationDate=?, category=?, status=?  WHERE name=?", [ creationDate,category,status, offerName]);
//   return result;
// }
// export async function postOffer(name, creationDate, category, status) {
//   const [result] = await pool.query("INSERT INTO offers (name, creationDate, category, status) VALUES (?, ?, ?, ?)", [name, creationDate,category, status]);
//   return result;
// }
// export async function getLocations() {
//   const [rows] = await pool.query("SELECT * FROM locations");
//   return rows;
// }
// export async function deleteLocation(locationName) {
//   const [result] = await pool.query("DELETE FROM locations WHERE idl = ?", [locationName]);
//   return result;
// }
// export async function updateLocation(locationName, position, location, company, matches) {
//   const [result] = await pool.query("UPDATE locations SET  position=?, location=?, company=?, matches=?  WHERE idl=?", [ position, location, company, matches, locationName]);
//   return result;
// }
// export async function postLocation(position, location, company, matches) {
//   const [result] = await pool.query("INSERT INTO locations ( position, location, company, matches) VALUES (?, ?, ?, ?)", [position, location, company, matches]);
//   return result;
// }
// const users = await getUsers();
const users = await getUsers();
// const offers = await getOffers();
 const joblisting= await getJoblisting();
// const locations = await getLocations();
