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
// import { getLocations } from './db.mjs';
// import { deleteLocation } from './db.mjs';
// import { updateLocation } from './db.mjs';
// import { postLocation } from './db.mjs';
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
  const email  = req.body.email;
  const phone  = req.body.phone;
  const status = req.body.status;
  const type  = req.body.type;
  try {
    
    await updateUser(providerName, fname,lname,email,phone, status, type);

    res.status(200).json({ message: 'User updated successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});
app.post('/users', async (req, res) => {
  const { fname, lname, email, phone, status, type } = req.body;
  try {
    // Call the postProvider function to add a new provider
    await postUser(fname, lname, email, phone, status, type);
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
   const position  = req.body.position;
   const labels = req.body.labels;
   const company = req.body.company;
   const location = req.body.location;
   const creationdate = req.body.creationdate;
   const status = req.body.status;
   const nbreapplicants = req.body.nbreapplicants;
   const description = req.body.description;
   try {
    
     await updateJoblisting(seekerName,  position, labels,company, location, creationdate, status, nbreapplicants, description);

     res.status(200).json({ message: 'Job offer updated successfully' });
  } catch (error) {
     console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
   }
 });
 app.post('/joblisting', async (req, res) => {
const { providerid, position, labels,company,location,creationdate, status, nbreapplicants, description } = req.body;
try {
 // Call the postProvider function to add a new provider
 await postJoblisting(providerid, position, labels,company,location,creationdate, status, nbreapplicants, description);
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
// app.get('/locations', async (req, res) => {
//   const locations = await getLocations();
//   res.json(locations);
// });
// app.delete('/locations/:idl', async (req, res) => {
//   const locationName = req.params.idl;
//   try {
//     // Call the deleteProvider function to delete the provider by name
//     await deleteLocation(locationName);
//     res.status(204).send(); // Successfully deleted, send a 204 No Content status
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ error: 'Internal Server Error' });
//   }
// });
// app.put('/locations/:idl', async (req, res) => {
//   const locationName = req.params.idl;
//   const position  = req.body.position;
//   const location  = req.body.location;
//   const company = req.body.company;
//   const matches = req.body.matches;
//   try {
    
//     await updateLocation(locationName, position,location, company, matches);

//     res.status(200).json({ message: 'location updated successfully' });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ error: 'Internal Server Error' });
//   }
// });
// app.post('/locations', async (req, res) => {
//   const { position, location, company, matches } = req.body;
//   try {
//     // Call the postProvider function to add a new provider
//     await postLocation(position, location, company, matches);
//     res.status(201).json({ message: 'offer added successfully' });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ error: 'Internal Server Error' });
//   }
// });
// Start the server
app.listen(8000, () => {
  console.log('Server is running on http://localhost:8000');
});