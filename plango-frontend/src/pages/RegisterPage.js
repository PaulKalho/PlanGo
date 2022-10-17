import React, {useState} from "react";
import axiosInstance from '../axios';
import { Input, Button } from "@material-tailwind/react";
import { useNavigate } from "react-router-dom";

// Components 
import NavbarMain from "../components/main/NavbarMain";

function RegisterPage() {
  const navigate = useNavigate();
  const initialFormData = Object.freeze({
    email: '',
    username: '',
    password: ''
  })

  const [formData, updateFormData] = useState(initialFormData);

  const handleChange = (e) => {
    updateFormData({
      ...formData,
      //Trim whitespace
      [e.target.name]: e.target.value.trim(),
    })
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(formData);

    axiosInstance
      .post(`user/register/`, {
        email: formData.email,
        user_name: formData.username,
        password: formData.password,

      })
      .then((res) => {
        navigate("/");
        console.log(res);
        console.log(res.data);
      })
  }

  return (
  <div>
    <NavbarMain />
    <form>
        <div className="h-screen flex bg-gray-bg1">
            <div className="w-full max-w-md m-auto bg-white rounded-lg border border-primaryBorder shadow-default py-10 px-16">
                <h1 className="text-2xl font-medium text-primary mt-4 mb-12 text-center">Registriere dich hier:</h1>
                <div className="mb-4">
                    <Input onChange={handleChange} id="email" name="email" type="email" label="E-Mail *" />
                </div>
                <div className="mb-4">
                    <Input onChange={handleChange} id="username" name="username" label="Username * " />
                </div>
                <div className="mb-4">
                    <Input onChange={handleChange} id="password" name="password" type="password" label="Password *" />
                </div>
                <Button type="submit" onClick={handleSubmit} className="w-full" variant="outlined">LogIn</Button>  
            </div>
        </div>
    </form>
  </div>
  )
};

export default RegisterPage;
