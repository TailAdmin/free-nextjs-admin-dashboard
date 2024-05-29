

// This is a page component that fetches data from the server and renders it.
// It uses the fetch API to make a request to the /api/users endpoint and then renders the data in a list.
// The getUsers function makes a request to the /api/users endpoint and returns the response data.
// The data is then rendered in a list using the map function.

// This is not a client-side rendered page, those are marked with 'use client'
// This is a server-side rendered page, as it fetches data directly from the db
// Server-side rendering is useful for pages that need to fetch data from the db before rendering, as it allows the data to be available when the page is first loaded.
// They can be asynchronous

import GetUsers from "lib/GetUsers"

export default async function UsersPage() {

  const data = await GetUsers()

  return (
    <div>
      <h1>Users</h1>
      <ul>
        {data.map((user) => (
          <li key={user.id}>
            {user.name} - {user.email}
          </li>
        ))}
      </ul>
    </div>
  )
}