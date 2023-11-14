import { Outlet, NavLink } from "react-router-dom";

export default function BaseTemplate() {
  return (
    <>
      <header className="navbar bg-base-100 text-2xl flex justify-between p-4 border-b">
        <a href="/listingAll" className="font-sans">
          powderful.io
        </a>
      </header>
      <br />
      <p>This navigating section for development use</p>
      <div>
        {/* <NavLink to="/guestRegistration">
          <button className="btn">Guest Registration</button>
        </NavLink> */}
        || Guest Section ||
        <NavLink to="/listingAll">
          <button className="btn">Listings</button>
        </NavLink>
        <NavLink to="/">
          <button className="btn">Guest Login</button>
        </NavLink>
        <NavLink to="/bookingRequest">
          <button className="btn">Booking Request</button>
        </NavLink>
        <NavLink to="/guestDashboard">
          <button className="btn">Guest Dashboard</button>
        </NavLink>
        <NavLink to="/messenger">
          <button className="btn">Messenger</button>
        </NavLink>
        <br></br>
        || Property Manager Section ||
        <NavLink to="/managerRegistration">
          <button className="btn">Create Property Manager</button>
        </NavLink>
        <NavLink to="/propertyListing">
          <button className="btn">Property Listings</button>
        </NavLink>
        <NavLink to="/createListing">
          <button className="btn">Create Listing</button>
        </NavLink>
      </div>
      <br />
      <div>
        <Outlet />
      </div>
      <footer></footer>
    </>
  );
}
