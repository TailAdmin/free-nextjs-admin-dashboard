
import mysql from 'mysql2';

const pool = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: 'MindYourBusiness',
    database: 'fursadashs1',
}).promise()

// export default async function getUsers() {
//   const [rows] = await pool.query("SELECT * FROM seekers UNION SELECT * FROM providers")
//   return rows
// }
export async function postUser(fname,lname,age, email, phone, city, linkedinurl,title ,bio, password) {
  const [result] = await pool.query("INSERT INTO users (fname,lname,age, email, phone, city, linkedinurl,title ,bio, password) VALUES (?, ?, ?, ?, ?,?, ?,?,?,?)", [fname,lname,age, email, phone, city, linkedinurl,title ,bio, password]);
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
export async function updateUser(userName,fname,lname,age, email, phone, city, linkedinurl,title ,bio, password) {
  const [result] = await pool.query("UPDATE users SET  fname=?, lname=?, age= ?, email=?, phone=?, city=?, linkedinurl=?, title=?, bio=?, password=?  WHERE userid=?", [fname,lname,age, email, phone, city, linkedinurl,title ,bio, password, userName]);
  return result;
}

 export async function postJoblisting(companyid, role, title,city,country,created_at, salary,application_deadline,type, description,experience_level) {
  const [result] = await pool.query("INSERT INTO joblisting (companyid, role, title,city,country,created_at, salary,application_deadline,type, description,experience_level) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)", [companyid, role, title,city,country,created_at, salary,application_deadline,type, description,experience_level]);
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
 export async function updateJoblisting(joblistName, companyid, role, title, city, country, created_at, salary, application_deadline, type, description, experience_level) {
  // Convert the provided string to a Date object
  const createdAtDate = new Date(created_at);
  
  // Format the Date object as a MySQL-compatible datetime string
  const formattedCreatedAt = createdAtDate.toISOString().slice(0, 19).replace('T', ' ');

  // Use the formatted datetime string in the SQL query
  const [result] = await pool.query("UPDATE joblisting SET companyid=?, role=?, title=?, city=?, country=?, created_at=?, salary=?, application_deadline=?, type=?, description=?, experience_level=? WHERE jobid=?", [companyid, role, title, city, country, formattedCreatedAt, salary, application_deadline, type, description, experience_level, joblistName]);
  
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
export async function postCompany(companyName, industry, description, city, country, remote, hrEmail, hrPhone, websiteLink, logo_url) {
  // Convert 'True' and 'False' strings to boolean values
  const remoteValue = remote === 'True' ? 1 : 0;
  
  const [result] = await pool.query("INSERT INTO company (company_name, industry, description, city, country, remote, hr_email, hr_phone, website_link, logo_url) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)", [companyName, industry, description, city, country, remoteValue, hrEmail, hrPhone, websiteLink, logo_url]);
  return result;
}

export async function getCompanies() {
  const [rows] = await pool.query("SELECT * FROM company");
  return rows;
}

export async function deleteCompany(companyId) {
  const [result] = await pool.query("DELETE FROM company WHERE companyid = ?", [companyId]);
  return result;
}

export async function updateCompany(companyId, companyName, industry, description, city, country, remote, hrEmail, hrPhone, websiteLink, logo_url) {
  const [result] = await pool.query("UPDATE company SET company_name=?, industry=?, description=?, city=?, country=?, remote=?, hr_email=?, hr_phone=?, website_link=? , logo_url= ? WHERE companyid=?", [companyName, industry, description, city, country, remote, hrEmail, hrPhone, websiteLink, logo_url, companyId]);
  return result;
}


export async function getUserByEmail(email) {
  const [result] = await pool.query('SELECT * FROM users WHERE email = ?', [email]);
  return result[0]; // Assuming there's only one user with a given email
}
// const users = await getUsers();
const users = await getUsers();
// const offers = await getOffers();
 const joblisting= await getJoblisting();
// const locations = await getLocations();
