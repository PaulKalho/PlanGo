import React, { useState } from "react"
import { Input, Button } from "@material-tailwind/react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../axios";

function LoginForm() {
    const navigate = useNavigate();
    const initialFormData = Object.freeze({
        email:  '',
        password: '',
    });

    const[formData, updateFormData] = useState(initialFormData);

    const handleChange = (e) => {
        updateFormData({
            ...formData,
            [e.target.name]: e.target.value.trim(),
        })
    }

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log(formData);

        axiosInstance
            .post(`auth/jwt/create/`, {
                email: formData.email,
                password: formData.password,
            })
            .then((res) => {
                console.log(res.data);
                localStorage.setItem('access', res.data.access);
                localStorage.setItem('refresh', res.data.refresh);

                axiosInstance.defaults.headers['Authorization'] = 
                    'Bearer ' + localStorage.getItem('access');

                navigate('/dashboard');
            })
            .catch(err => {
                console.log(err);
            })
    }

    return(
        <div>
            <div>
                <form>
                    <div className="h-screen flex bg-gray-bg1">
                        <div className="w-full max-w-md m-auto bg-white rounded-lg border border-primaryBorder shadow-default py-10 px-16">
                            <h1 className="text-2xl font-medium text-primary mt-4 mb-12 text-center">Logge dich ein:</h1>
                            <div className="mb-4">
                                <Input onChange={handleChange} name="email" id="email" label="Username" />
                            </div>
                            <div className="mb-4">
                                <Input onChange={handleChange} name="password" id="password" type="password" label="Password" />
                            </div>
                            <Button type="submit" onClick={handleSubmit} className="w-full" variant="outlined">LogIn</Button>  
                        </div>
                    </div>
                </form>
            </div>
        </div>
        
    )
}

export default LoginForm