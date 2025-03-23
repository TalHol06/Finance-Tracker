import Cookies from 'js-cookie';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function checkAuthentication(){
    const navigate = useNavigate();
    const token = Cookies.get('token');

    useEffect(() => {
        if (!token){
            navigate('/error');
        }
    }, [token, navigate]);
}