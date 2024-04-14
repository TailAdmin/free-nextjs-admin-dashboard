import cors from 'cors';
import express from 'express';
// import getUsers from './db.mjs'
import { getUsers } from './db.mjs';
import { deleteUser } from './db.mjs';
import { updateUser } from './db.mjs';
import { postUser } from './db.mjs';
import { getJoblisting } from './db.mjs';
import { deleteJoblisting } from './db.mjs';
import { updateJoblisting } from './db.mjs';
import { postJoblisting } from './db.mjs';
// import { getOffers } from './db.mjs';
// import { deleteOffer } from './db.mjs';
// import { updateOffer } from './db.mjs';
// import { postOffer } from './db.mjs';
import { getUserByEmail } from './db.mjs';
import { getApplication } from './db.mjs';
import { deleteApplication } from './db.mjs';
 import { updateApplication } from './db.mjs';
 import { getApp } from './db.mjs';
import { postApplication } from './db.mjs';
import { updateCompany } from './db.mjs';
import { getCompanies } from './db.mjs';
import { postCompany } from './db.mjs';
import { deleteCompany } from './db.mjs';
const app = express();

app.use(cors());
app.use(express.json());

// app.get('/users', async (req, res) => {
//     const users = await getUsers();
//     res.json(users);
// });

app.get('/users', async (req, res) => {
  const users = await getUsers();
  res.json(users);
});

app.delete('/users/:userid', async (req, res) => {
  const providerName = req.params.userid;
  try {
    // Call the deleteProvider function to delete the provider by name
    await deleteUser(providerName);
    res.status(204).send(); // Successfully deleted, send a 204 No Content status
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.put('/users/:userid', async (req, res) => {
  const providerName = req.params.userid;
  const fname  = req.body.fname;
  const lname  = req.body.lname;
  const age  = req.body.age;
  const email  = req.body.email;
  const phone  = req.body.phone;
  const city = req.body.city;
  const linkedinurl  = req.body.linkedinurl;
  const title  = req.body.title;
  const bio  = req.body.bio;
  const password  = req.body.password;
  try {
    
    await updateUser(providerName, fname,lname,age, email, phone, city, linkedinurl,title ,bio, password);

    res.status(200).json({ message: 'User updated successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});
app.post('/users', async (req, res) => {
  const { fname,lname,age, email, phone, city, linkedinurl,title ,bio, password } = req.body;
  try {
    // Call the postProvider function to add a new provider
    await postUser(fname,lname,age, email, phone, city, linkedinurl,title ,bio, password);
    res.status(201).json({ message: 'user added successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});
//seekers table

 app.get('/joblisting', async (req, res) => {
   const joblisting = await getJoblisting();
   res.json(joblisting);
 });

app.delete('/joblisting/:jobid', async (req, res) => {
  const seekerName = req.params.jobid;
  try {
    
    await deleteJoblisting(seekerName);
    res.status(204).send(); // Successfully deleted, send a 204 No Content status
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

 app.put('/joblisting/:jobid', async (req, res) => {
   const seekerName = req.params.jobid;
   const companyid  = req.body.companyid;
   const role = req.body.role;
   const title = req.body.title;
   const city = req.body.city;
   const country = req.body.country;
   const created_at = req.body.created_at;
   const salary = req.body.salary;
   const application_deadline = req.body.application_deadline;
   const type = req.body.type;
   const description = req.body.description;
   const experience_level = req.body.experience_level;
   try {
    
     await updateJoblisting(seekerName, companyid, role, title,city,country,created_at, salary,application_deadline,type, description,experience_level);

     res.status(200).json({ message: 'Job offer updated successfully' });
  } catch (error) {
     console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
   }
 });
 app.post('/joblisting', async (req, res) => {
  const { companyid, role, title, city, country, salary, type, description, experience_level } = req.body;
  // Assuming created_at and application_deadline are provided as strings in the format 'YYYY-MM-DD'
  const created_at = new Date().toISOString().slice(0, 10); // Current date in ISO format
  const application_deadline = req.body.application_deadline; // Assuming it's already in the correct format
  
  try {
    // Call the postJoblisting function to add a new job listing
    await postJoblisting(companyid, role, title, city, country, created_at, salary, application_deadline, type, description, experience_level);
    res.status(201).json({ message: 'Job offer added successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});


// //offers table
// app.get('/offers', async (req, res) => {
//   const offers = await getOffers();
//   res.json(offers);
// });
// app.delete('/offers/:name', async (req, res) => {
//   const offerName = req.params.name;
//   try {
//     // Call the deleteProvider function to delete the provider by name
//     await deleteOffer(offerName);
//     res.status(204).send(); // Successfully deleted, send a 204 No Content status
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ error: 'Internal Server Error' });
//   }
// });
// app.put('/offers/:name', async (req, res) => {
//   const offerName = req.params.name;
//   const category  = req.body.category;
//   const creationDate  = req.body.creationDate;
//   const status = req.body.status;
//   try {
    
//     await updateOffer(offerName, creationDate,category, status);

//     res.status(200).json({ message: 'Offer updated successfully' });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ error: 'Internal Server Error' });
//   }
// });
// app.post('/offers', async (req, res) => {
//   const { name, creationDate, category, status } = req.body;
//   try {
//     // Call the postProvider function to add a new provider
//     await postOffer(name, creationDate, category, status);
//     res.status(201).json({ message: 'offer added successfully' });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ error: 'Internal Server Error' });
//   }
// });
// //locations table
app.get('/application', async (req, res) => {
  const application = await getApp();
  res.json(application);
});
app.get('/application/summary', async (req, res) => {
  const application = await getApplication();
  res.json(application);
});
app.delete('/application/:applicationID', async (req, res) => {
  const locationName = req.params.applicationID;
  try {
    // Call the deleteProvider function to delete the provider by name
    await deleteApplication(locationName);
    res.status(204).send(); // Successfully deleted, send a 204 No Content status
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});
app.put('/application/:applicationID', async (req, res) => {
  const locationName = req.params.applicationID;
  const status  = req.body.status;
  
  try {
    
    await updateApplication(locationName, status);

    res.status(200).json({ message: 'application updated successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});
app.post('/application', async (req, res) => {
  const { userid,jobid,status } = req.body;
  try {
    // Call the postProvider function to add a new provider
    await postApplication(userid,jobid,status);
    res.status(201).json({ message: 'application added successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await getUserByEmail(email);

    if (!user) {
      res.status(401).json({ message: 'Invalid credentials' });
      return;
    }

    // Check if the provided password matches the stored password
    if (password === user.password) {
      res.status(200).json({ message: 'Logged in successfully' });
    } else {
      res.status(401).json({ message: 'Invalid credentials' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});
app.post('/company', async (req, res) => {
  const { companyName, industry, description, city, country, remote, hrEmail, hrPhone, websiteLink } = req.body;
  try {
    await postCompany(companyName, industry, description, city, country, remote, hrEmail, hrPhone, websiteLink);
    res.status(201).json({ message: 'Company added successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.get('/company', async (req, res) => {
  try {
    const companies = await getCompanies();
    res.json(companies);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.delete('/company/:companyId', async (req, res) => {
  const companyId = req.params.companyId;
  try {
    await deleteCompany(companyId);
    res.status(204).send(); // Successfully deleted, send a 204 No Content status
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.put('/company/:companyId', async (req, res) => {
  const companyId = req.params.companyId;
  const { companyName, industry, description, city, country, remote, hrEmail, hrPhone, websiteLink } = req.body;
  try {
    await updateCompany(companyId, companyName, industry, description, city, country, remote, hrEmail, hrPhone, websiteLink);
    res.status(200).json({ message: 'Company updated successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Start the server
app.listen(8000, () => {
  console.log('Server is running on http://localhost:8000');
});