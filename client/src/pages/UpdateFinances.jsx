import axios from 'axios';
import Cookies from 'js-cookie';

import { useState, useEffect } from 'react';
import { jwtDecode } from 'jwt-decode';
import { useNavigate } from 'react-router-dom';

export default function UpdateFinances(){
    const navigate = useNavigate();

    const token = Cookies.get('token');
    const [authenticated, setAuthenticated] = useState(false);
    const [user, setUser] = useState({});
    const [userFinances, setUserFinances] = useState({});
    const [newIncome, setNewIncome] = useState(0);
    const [newBudget, setNewBudget] = useState('');
    const [method, setMethod] = useState('');

    useEffect(() => {
        if (!token){
            setAuthenticated(false);
            return;
        }

        setAuthenticated(true);
        const decoded = jwtDecode(token);
        if (!decoded.id) return;

        const fetchUserData = async () => {
            try {
                const user = await axios.get(`/api/user/${decoded.id}`);
                setUser(user.data);

                const finances = await axios.get(`/api/finances/${user.data.finances}`);
                setUserFinances(finances.data);
                setNewIncome(finances.data.netMonthlyIncome);
                setNewBudget(finances.data.budgetType);
            } catch (err) {
                console.error(err);
            }
        };

        fetchUserData();
    }, [token]);

    async function handleSubmit(e){
        e.preventDefault();

        try {
            const updatedUserFinances = await axios.put(`/api/finances/${userFinances._id}/user/${user.id}`, {
                newIncome: newIncome,
                newBudget: newBudget
            });
            if (!updatedUserFinances) return;

            navigate('/home');
            prompt('Finances updated successfully!');
        } catch (err) {
            console.error(err.message);
        }
    }

    return (
        <>
            {!authenticated ?
                <div>
                    <h2 style={{ textAlign: 'center', marginTop: '50px'}}>You need to be signed in to access this page.</h2>
                    <div style={{display: 'flex', justifyContent: 'center' }}>
                        <button className='contrast' style={{ margin: '20px', width: '10%'}} onClick={() => navigate('/')}>
                            Sign in
                        </button>
                    </div>
                </div>
            :
                <main className='container' style={{ border: '1.25px solid', padding: '25px'}}>
                    <form onSubmit={handleSubmit}>
                        <h3 style={{ textAlign: 'center' }}>Update your financial information</h3>
                        <p style={{ textAlign: 'center', fontSize: '16px' }}>leaving the fields blank will keep your current information.</p>
                        <label>Current Monthly Net Income: <u>${userFinances.netMonthlyIncome}</u> | * Will be updated to "${newIncome}" *</label>
                        <input 
                            name="newIncome"
                            type='number'
                            placeholder="Enter your net monthly income"
                            required='true'
                            onChange={(e) => setNewIncome(e.target.value)}
                        />
                        <label>Current Budget Type: <u>{userFinances.budgetType}</u> | * Will be updated to "{newBudget}" *</label>
                        <select 
                            name="budgeting-method" 
                            aria-label="Select your budgeting method..." 
                            required 
                            onChange={(e) => {setNewBudget(e.target.value); setMethod(e.target.value)}}
                        >
                            <option selected disabled value="">Select your new budgeting method...</option>
                            <option value="50/30/20">50/30/20 rule</option>
                            <option value="Reverse-Budgeting">Reverse budgeting</option>
                            <option value="Z-B-Budgeting">Zero-based budgeting</option>
                        </select>

                        {method === '50/30/20' ?
                            <small style={{ margin: '20px', marginBottom: '60px'}}>
                                <h6>50/30/20</h6>
                                <ul>
                                    <li>One of the best-known budgeting methods due to its simplicity.</li>
                                    <li>Uses a percentages-based approach to setting up your monthly spending budget.</li>
                                    <li>Recommends you put 50% of your net income towards essentials, 30% towards wants, and 20% towards savings.</li>
                                </ul>
                            </small>
                        : method === 'Reverse-Budgeting' ?
                            <small style={{ margin: '20px', marginBottom: '60px'}}>
                                <h6>Reverse Budgeting</h6>
                                <ul>
                                    <li>Known as the "pay yourself" method.</li>
                                    <li>Instead of paying money towards your spending categories (needs and wants), you put the focus on savings.</li>
                                    <li>Fairly low maintenance.</li>
                                </ul>
                            </small>
                        : method === 'Z-B-Budgeting' ? 
                            <small style={{ margin: '20px', marginBottom: '60px'}}>
                                <h6>Zero-Based Budgeting</h6>
                                <ul>
                                    <li>Aims to balance your budget in a way that every dollar of your monthly net income is accounted for, assigned, and spent.</li>
                                    <li>Takes more time to put together and could be difficult for individuals whose income and expenses vary from month to month.</li>
                                    <li>Can help you plan and visualize your spending in detail.</li>
                                </ul>
                            </small>
                        :
                            <></>
                        }
                        <div style={{ display: 'flex', justifyContent: 'space-between'}}>
                            <button onClick={() => navigate('/home')} type='submit' className='secondary' style={{ margin: '5px', height: '5%'}}>Go Back</button>
                            <button type='submit' className='primary' style={{ margin: '5px', height: '5%'}}>Update</button>
                        </div>

                    </form>
                </main>
            }
        </>
    )
}