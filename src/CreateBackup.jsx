import React, {useEffect, useState } from 'react';
import axios from 'axios';

const BACKUP_URL="http://127.0.0.1:8000/api/create-backup/";

const CreateBackup = () => {
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [token, setToken] = useState("");

  useEffect(() => {
    const accessToken = localStorage.getItem('accessToken');
    if(accessToken) setToken(JSON.parse(accessToken))
  }, []);


  
  const postBackup = async () => {
      if(!token) return;
      setLoading(true);
      const data = 
      {
          "vm": 1,
          "size": 20
          
      }
      
      try {
          const response = await axios.post(BACKUP_URL, data, {
          headers: {
              Authorization: `Bearer ${token}`,
          },
          });

          if(response.data.success){
            setSuccess(response.data.message);
            setTimeout(() => setSuccess(""), 5000);
          }else{
            setError(response.data.message);
            setTimeout(() => setError(""), 5000);
          }

      } catch (error) {
          setError('Error fetching virtual machines.');
          setTimeout(() => setError(""), 5000);
          console.error(error);
      } finally {
          setLoading(false);
      }
  };

   

  if (loading) return <p>Loading...</p>;
  if (error) return <p className="text-red-500">{error}</p>;
  if (success) return <p className="text-green-500">{success}</p>;

  return (
    <div>
      <h2 className="text-3xl font-bold">Create Backup</h2>
      <p className="mt-4 text-lg">Here you can create backups for your virtual machines...</p>
      <button className="text-blue-500" onClick={postBackup}>Backup</button>
    </div>
  );
};

export default CreateBackup;
