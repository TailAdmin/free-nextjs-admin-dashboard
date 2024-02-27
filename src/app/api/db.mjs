
import mysql from 'mysql2';

const pool = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: 'MindYourBusiness',
    database: 'fursadash',
}).promise()

export default async function getUsers() {
  const [rows] = await pool.query("SELECT * FROM users")
  return rows
}
export async function postProvider(name, email, phone, status) {
  const [result] = await pool.query("INSERT INTO providers (name, email, phone, status) VALUES (?, ?, ?, ?)", [name, email, phone, status]);
  return result;
}
export async function getProviders() {
  const [rows] = await pool.query("SELECT * FROM providers");
  return rows;
}
export async function deleteProvider(providerName) {
  const [result] = await pool.query("DELETE FROM providers WHERE name = ?", [providerName]);
  return result;
}
export async function updateProvider(providerName, email, phone, status) {
  const [result] = await pool.query("UPDATE providers SET  email=?, phone=?, status=?  WHERE name=?", [ email, phone,status, providerName]);
  return result;
}

export async function postSeeker(name, email, phone, status) {
  const [result] = await pool.query("INSERT INTO seekers (name, email, phone, status) VALUES (?, ?, ?, ?)", [name, email, phone, status]);
  return result;
}
export async function getSeekers() {
  const [rows] = await pool.query("SELECT * FROM seekers");
  return rows;
}
export async function deleteSeeker(seekerName) {
  const [result] = await pool.query("DELETE FROM seekers WHERE name = ?", [seekerName]);
  return result;
}
export async function updateSeeker(seekerName, email, phone, status) {
  const [result] = await pool.query("UPDATE seekers SET  email=?, phone=?, status=?  WHERE name=?", [ email, phone,status, seekerName]);
  return result;
}

export async function getOffers() {
  const [rows] = await pool.query("SELECT * FROM offers");
  return rows;
}
export async function deleteOffer(offerName) {
  const [result] = await pool.query("DELETE FROM offers WHERE name = ?", [offerName]);
  return result;
}
export async function updateOffer(offerName, creationDate, category, status) {
  const [result] = await pool.query("UPDATE offers SET  creationDate=?, category=?, status=?  WHERE name=?", [ creationDate,category,status, offerName]);
  return result;
}
export async function postOffer(name, creationDate, category, status) {
  const [result] = await pool.query("INSERT INTO offers (name, creationDate, category, status) VALUES (?, ?, ?, ?)", [name, creationDate,category, status]);
  return result;
}
const users = await getUsers();
const providers = await getProviders();
const offers = await getOffers();
const seekers= await getSeekers();
