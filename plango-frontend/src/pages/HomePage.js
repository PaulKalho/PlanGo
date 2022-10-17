import React from "react";
import LoginForm from "../components/LoginForm"
import NavbarMain from "../components/main/NavbarMain"

function HomePage() {
    return (
      <div className="w-full p-0 m-0">
        <NavbarMain />
        <LoginForm></LoginForm>
      </div>
    );
  }
  
  export default HomePage;
  