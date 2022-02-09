import { useState, useEffect } from 'react';
import fetch from 'isomorphic-fetch';

const useUserBackend = () => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const getUser = async () => {
      const user = await fetch(`${process.env.BACKEND_ROUTE}/user/`, { mode: 'no-cors' })
        .then(() => {
          setUser(user);
          setIsLoading(false);
        })
        .catch(function () {
          console.log('error');

          setError(error);
        });
    };
    try {
      getUser();
    } catch (error) {
      setError(error);
    }
  }, []);

  return { user, error, isLoading };
};

export default useUserBackend;
