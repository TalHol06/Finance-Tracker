import Cookies from 'js-cookie';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Home(){
    const navigate = useNavigate();
    
    const token = Cookies.get('token');

    const [user, setUser] = useState({});
    const [userFinances, setFinances] = useState({});
    const [expenses, setExpenses] = useState([])
    
    useEffect(() => {
        if (!token){
            navigate('/error', { state: { from: location.pathname } });
        }
    }, [token, navigate]);

    const decoded = jwtDecode(token);
    const userId = decoded.id;
    useEffect(() => {
        // Gets the user and sets the response to the user object
        axios.get(`/api/user/${userId}`)
            .then((response) => {
                setUser(response.data);

                // Gets the user's finances and sets the response to the finances object
                return axios.get(`api/finances/${response.data.finances}`);
        })
        .then((response) => {
            setFinances(response.data);
            setExpenses(response.data.expenses);
        })
        .catch((err) => {
            console.error(err);
        })
    }, [userId]);

    return (
        <>
            <main className="container-fluid" style={{ display: 'flex', justifyContent: 'space-between'}}>
                <div className="container" style={{ border: "1.15px solid", width: '50%'}}>
                    {!expenses ? (
                        <h3>Loading...</h3>
                    ) : expenses.length === 0 ? (
                        <h3> No Expenses Listed</h3>
                    ) : (
                        <>
                            <h3>All of your expenses:</h3>
                            <h4>Category: All</h4>
                        </>
                    )}
                </div>
                <div>
                    <div className='container'>
                        a
                    </div>
                    <div className="container">
                        s
                    </div>
                </div>

            </main>
        </>
    )
}