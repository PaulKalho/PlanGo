import React, {useCallback, useState} from "react";
import axiosInstance from '../axios';
import { Input, Button } from "@material-tailwind/react";
import { useNavigate } from "react-router-dom";
import GoogleButton from 'react-google-button';

// Components 
import NavbarMain from "../components/main/NavbarMain";

const REACT_APP_GOOGLE_CLIENT_ID = "378499389242-03dbds4ggakfvgoc2afem2usp9pfdf34.apps.googleusercontent.com"
const REACT_APP_BASE_BACKEND_URL = "http://127.0.0.1:8000"

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



  const googleLogin = useCallback(() => {
    const googleAuthUrl = 'https://accounts.google.com/o/oauth2/v2/auth';
    const redirectUri = 'accounts/google/login/callback/';
    
    const scope = [
      'https://www.googleapis.com/auth/userinfo.email',
      'https://www.googleapis.com/auth/userinfo.profile'
    ].join(' ');
    
    const params = {
      response_type: 'code',
      client_id: REACT_APP_GOOGLE_CLIENT_ID,
      redirect_uri: `${REACT_APP_BASE_BACKEND_URL}/${redirectUri}`,
      prompt: 'select_account',
      access_type: 'offline',
      scope
    };
    
    const urlParams = new URLSearchParams(params).toString();
    
    window.location = `${googleAuthUrl}?${urlParams}`;
  }, []);
  

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
                <Button type="submit" onClick={handleSubmit} className="w-full mb-4" variant="outlined">LogIn</Button>  
                <GoogleButton type="button" onClick={googleLogin} className="w-full" variant="outlined">Weiter mit Google</GoogleButton>
            </div>
        </div>
    </form>
  </div>
  )
};

export default RegisterPage;
