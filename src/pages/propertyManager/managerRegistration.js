// ManagerRegistration component
import React, { useState, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { GlobalContext } from "../../provider/globalProvider.js";
import { useAuthGate } from "../../components/useAuthGate.js";
import axios from "axios";
import BACKEND_URL from "../../constants.js";

export default function ManagerRegistration() {
  const [name, setName] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [description, setDescription] = useState("");
  const [phone, setPhone] = useState("");

  const [alert, setAlert] = useState("");
  const [registrationForm, setRegistrationForm] = useState("")
  //const [propertyManagers, setPropertyManagers] = useState([]);

  const navigate = useNavigate();
  const { getAccessTokenSilently, user } = useAuthGate();
  const infoToPass = useContext(GlobalContext);

  // Function to fetch property managers
  // const fetchPropertyManagers = async () => {
  //   try {
  //     const token = await getAccessTokenSilently({
  //       authorizationParams: {
  //         audience: "https://api.powderful.xyz",
  //         scope: "read:current_user",
  //       },
  //     });
  //     const response = await axios.get(`${BACKEND_URL}/propertymanagers`, {
  //       headers: { Authorization: `Bearer ${token}` },
  //     });
  //     setPropertyManagers(response.data);
  //   } catch (error) {
  //     console.error("Error fetching property managers:", error);
  //   }
  // };

  useEffect(() => {
    const fullName = firstName + " " + lastName;
    setName(fullName);
    renderListingForm();
  },[firstName, lastName])

  useEffect(() => {
    renderListingForm();
  },[alert, email, description, phone])

  useEffect(() => {
    // fetchPropertyManagers();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (name && email && phone && description) {
      try {
        const token = await getAccessTokenSilently({
          authorizationParams: {
            audience: "https://api.powderful.xyz",
            scope: "read:current_user",
          },
        });
  
        // Call the backend API to create the property manager
        const response = await axios.post(
          `${BACKEND_URL}/propertymanagers`,
          { name, email, phone, description, user_sub: user.sub },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        //fetchPropertyManagers(); // Refresh the list of property managers
        navigate("/managerDashboard");
        
        // if (response.status === 201) {
        //   navigate("/propertylisting");
        // }
      } catch (error) {
        console.error("Error creating property manager:", error);
        // Handle errors (e.g., show an error message)
      }
    } else {
      setAlert(
        <p className="text-base font-bold text-gray-800 text-center">Please input all the fields before proceed.</p>
      )
    }
  };

  const renderListingForm = () => {
    setRegistrationForm (
      <>
        <form onSubmit={handleSubmit}>
          <div className="space-y-12">
            <div className="border-b border-gray-900/10 pb-12">
              <h2 className="text-base font-semibold leading-7 text-gray-900">
                Manager Profile
              </h2>
              <p className="mt-1 text-sm leading-6 text-gray-600">
                Please fill in the information to register as a property manager.
              </p>
  
              <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
                <div className="sm:col-span-3">
                  <label htmlFor="first-name" className="block text-sm font-medium leading-6 text-gray-900">
                    First name
                  </label>
                  <div className="mt-2">
                    <input
                      type="text"
                      name="first-name"
                      id="first-name"
                      autoComplete="given-name"
                      className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                    />
                  </div>
                </div>
  
                <div className="sm:col-span-3">
                  <label htmlFor="last-name" className="block text-sm font-medium leading-6 text-gray-900">
                    Last name
                  </label>
                  <div className="mt-2">
                    <input
                      type="text"
                      name="last-name"
                      id="last-name"
                      autoComplete="family-name"
                      className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                    />
                  </div>
                </div>
  
                <div className="sm:col-span-2">
                  <label htmlFor="email" className="block text-sm font-medium leading-6 text-gray-900">
                    Email address
                  </label>
                  <div className="mt-2">
                    <input
                      id="email"
                      name="email"
                      type="email"
                      autoComplete="email"
                      className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </div>
                </div>
  
                <div className="sm:col-span-2">
                  <label htmlFor="email" className="block text-sm font-medium leading-6 text-gray-900">
                    Contact Number
                  </label>
                  <div className="mt-2">
                    <input
                      id="phone"
                      name="phone"
                      type="number"
                      className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                    />
                  </div>
                </div>
  
                <div className="col-span-full">
                    <label
                      htmlFor="description"
                      className="block text-sm font-medium leading-6 text-gray-900"
                    >
                      Description
                    </label>
                    <div className="mt-2">
                      <textarea
                        id="description"
                        name="description"
                        rows={3}
                        className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                        placeholder="Write a few sentences to describe yourself"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                      />
                    </div>
                </div>
              </div>
            </div>
          </div>
  
          <div className="mt-6 flex items-center justify-end gap-x-6">
            <button
              type="button"
              className="text-sm font-semibold leading-6 text-gray-900"
              onClick={(e) => {
                e.preventDefault();
                navigate('/listingAll');
              }}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
            >
              Create Manager Profile
            </button>
          </div>
        </form>
      </>
    );
  }

  // const oldFormwithTable = () => {
  //   return (
  //   <div className="bg-white">
  //     <div className="mx-auto max-w-7xl sm:px-2 lg:px-8">
  //       <div className="mx-auto max-w-2xl px-4 lg:max-w-4xl lg:px-0">
  //         <h2 className="text-3xl font-bold mt-4 text-gray-900 sm:text-3xl">
  //           Register as a Property Manager
  //         </h2>
  //         <br />
  //         <h2 className="text-xl text-gray-700">
  //           Tell us a little more about yourself
  //         </h2>
  //         <form onSubmit={handleSubmit} className="mt-6 space-y-4">
  //           <input
  //             className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
  //             type="text"
  //             placeholder="Name"
  //             value={name}
  //             onChange={(e) => setName(e.target.value)}
  //           />
  //           <input
  //             className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
  //             type="email"
  //             placeholder="Email"
  //             value={email}
  //             onChange={(e) => setEmail(e.target.value)}
  //           />
  //           <input
  //             className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
  //             type="text"
  //             placeholder="Phone"
  //             value={phone}
  //             onChange={(e) => setPhone(e.target.value)}
  //           />
  //           <input
  //             className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
  //             type="text"
  //             placeholder="Description"
  //             value={description}
  //             onChange={(e) => setDescription(e.target.value)}
  //           />
  //           <button
  //             type="submit"
  //             className="inline-flex justify-center px-4 py-2 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-md shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
  //           >
  //             Create Manager Profile
  //           </button>
  //         </form>

  //         {/* Render property managers in a table */}
  //         <h2 className="text-3xl font-bold mt-8 text-gray-900">
  //           All Property Managers
  //         </h2>
  //         <div className="mt-4">
  //           <table className="min-w-full divide-y divide-gray-200">
  //             <thead>
  //               <tr>
  //                 <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
  //                   Name
  //                 </th>
  //                 <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
  //                   Email
  //                 </th>
  //                 <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
  //                   Phone
  //                 </th>
  //                 <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
  //                   Description
  //                 </th>
  //               </tr>
  //             </thead>
  //             <tbody className="bg-white divide-y divide-gray-200">
  //               {propertyManagers.map((manager) => (
  //                 <tr key={manager.id}>
  //                   <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
  //                     {manager.name}
  //                   </td>
  //                   <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
  //                     {manager.email}
  //                   </td>
  //                   <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
  //                     {manager.phone}
  //                   </td>
  //                   <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
  //                     {manager.description}
  //                   </td>
  //                 </tr>
  //               ))}
  //             </tbody>
  //           </table>
  //         </div>
  //       </div>
  //     </div>
  //   </div>
  //   )
  // }

  return (
    <>
      <header>
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold leading-tight tracking-tight text-gray-900">Create a manager profile to list your property</h1>
        </div>
      </header>
      <main className="mx-auto max-w-2xl px-4 sm:px-6 sm:py-12 lg:max-w-7xl lg:px-8 py-8">
        {registrationForm}
      </main>
      {alert}
    </>
  );
}
