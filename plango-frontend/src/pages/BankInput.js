import React, {useState, useEffect} from "react"
import axiosInstance from "../axios";
import AsyncSelect from 'react-select';
import { Button, Alert  } from "@material-tailwind/react";


function BankInput ({page, setPage, setLink}) {

  const [options, setOptions] = useState([""]);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState([]);
  useEffect(() => {

    const fetchData = async () => {
      const arr = [];
      try {
        setLoading(true)
        await axiosInstance.get("api/bank/").then((res) => {
          let result = res.data;

          result.map((bank) => {
            arr.push({value: bank.id, label: bank.name})
          })
          
          setOptions(arr)
        });
      } catch(err) {
        setErrors(err)
        setLoading(false)
      }
      setLoading(false)
      
    }
    

    // isAuthBank()
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
    }

    // console.log(payload)

    axiosInstance
        .post (`api/bank/link/`, payload)
        .then((res) => {
            setPage(page + 1);
            setLink(res.data)
            window.location.replace(res.data)
            console.log(res.data);
        })
        .catch(err => {
            setErrors(err);
            console.log(err);
        })
}

  return (
      <div className="grid h-screen w-full place-items-center">
        <div className="w-1/3 flex flex-col gap-4 border-2 rounded-lg py-14 px-4">
            <h1>Suchen Sie sich eine Bank aus</h1>
            {errors.length > 0 ? <Alert color="red">{errors}</Alert> : <div></div>}
            <AsyncSelect options={options} isLoading={loading} onChange={handleChange} />
            <Button type="submit" onClick={handleSubmit}>Weiter</Button>
        </div>
      </div>
  )
};

export default BankInput;
