import React, {useState, useEffect} from "react"
import axiosInstance from "../axios";
import AsyncSelect from 'react-select';
import { Button } from "@material-tailwind/react";
import NavbarMain from "../components/main/NavbarMain";


function BankInput ({page, setPage, setLink}) {

  const [options, setOptions] = useState([""]);
  const [loading, setLoading] = useState(false);
  
  useEffect(() => {
    const fetchData = async () => {
      const arr = [];
      try {
        setLoading(true)
        await axiosInstance.get("api/bank/").then((res) => {
          let result = res.data.banks;

          result.map((bank) => {
            arr.push({value: bank.id, label: bank.name})
          })
          
          setOptions(arr)
        });
      } catch(errorMessage) {
        setLoading(false)
      }
      setLoading(false)
      
    }

    fetchData()
  }, []);

  // Handle Submit

  const initialFormData = Object.freeze({
    institution_id: '',
  });

  const[selected, setSelected] = useState(initialFormData);

  const handleChange = (e) => {
      setSelected({
          institution_id: e.value
      })
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(selected);

    let payload = {
      "institution_id": selected.institution_id,
      "user": "tester"
    }

    // console.log(payload)

    axiosInstance
        .post (`api/bank/link/`, payload)
        .then((res) => {
            setPage(page + 1);
            setLink(res.data.credentials)
            window.location.replace(res.data.credentials)
            console.log(res.data);
        })
        .catch(err => {
            console.log(err);
        })
}

  return (
      <div className="grid h-screen w-full place-items-center">
        <div className="w-1/3 flex flex-col gap-4 border-2 rounded-lg py-14 px-4">
            <h1>Suchen Sie sich eine Bank aus</h1>
            <AsyncSelect options={options} isLoading={loading} onChange={handleChange} />
            <Button type="submit" onClick={handleSubmit}>Weiter</Button>
        </div>
      </div>
  )
};

export default BankInput;
