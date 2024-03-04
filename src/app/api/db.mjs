
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

 export async function postJoblisting(providerid, position, labels,company,location,creationdate, status, nbreapplicants, description) {
  const [result] = await pool.query("INSERT INTO joblisting (providerid, position, labels,company,location,creationdate, status, nbreapplicants, description) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)", [providerid, position, labels,company,location,creationdate, status, nbreapplicants, description]);
  return result;
 }
 export async function getJoblisting() {
   const [rows] = await pool.query("SELECT * FROM joblisting");
   return rows;
 }
 export async function deleteJoblisting(joblistName) {
   const [result] = await pool.query("DELETE FROM joblisting WHERE jobid = ?", [joblistName]);
   return result;
 }
 export async function updateJoblisting(joblistName, position, labels, company, location, creationdate, status, nbreapplicants, description) {
   const [result] = await pool.query("UPDATE joblisting SET  position=?, labels=?, company=?, location=?, creationdate=?, status=?, nbreapplicants=?, description=? WHERE jobid=?", [ position, labels,company,location, creationdate, status, nbreapplicants, description, joblistName]);
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
export async function getApp() {
     const [rows] = await pool.query("SELECT * FROM application");
     return rows;
   }
export async function getApplication() {
  try {
    const [rows] = await pool.query("SELECT userid, GROUP_CONCAT(jobid) AS job_application_id FROM application GROUP BY userid");
    const formattedRows = rows.map(row => ({
      userid: row.userid,
      jobid: row.job_application_id ? row.job_application_id.split(',').map(Number) : []
    }));
    return formattedRows;
  } catch (error) {
    console.error('Error in getApplicationSummary:', error);
    throw error;
  }
}
export async function deleteApplication(locationName) {
  const [result] = await pool.query("DELETE FROM application WHERE applicationID = ?", [locationName]);
  return result;
}
export async function updateApplication(locationName, status) {
  const [result] = await pool.query("UPDATE application SET  status=?  WHERE applicationID=?", [ status, locationName]);
  return result;
}
export async function postApplication(userid,jobid,status) {
  const [result] = await pool.query("INSERT INTO application ( userid,jobid,status) VALUES (?, ?, ?)", [userid,jobid,status]);
  return result;
}
// const users = await getUsers();
const users = await getUsers();
// const offers = await getOffers();
 const joblisting= await getJoblisting();
// const locations = await getLocations();
