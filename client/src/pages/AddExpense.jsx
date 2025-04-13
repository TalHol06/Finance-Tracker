import Cookies from 'js-cookie';
import axios from 'axios';

import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';

export default function AddExpense(){
    const navigate = useNavigate();

    const token = Cookies.get('token');
    const [authenticated, setAuthenticated] = useState(false);

    const [name, setName] = useState('');
    const [expenseCategory, setExpenseCategory] = useState('');
    const [description, setDescription] = useState('');
    const [cost, setCost] = useState(0);

    const [detailsActive, setActive] = useState(false);
    const [categories] = useState(['Housing', 'Transportation', 'Food', 'Utilities', 'Clothing', 'Medical/Healthcare', 'Insurance', 'Personal']);
    
    const [userFinances, setFinances] = useState({});
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

                const finances = await axios.get(`/api/finances/${user.data.finances}`);
                setFinances(finances.data);
            } catch (err) {
                console.error(err);
            }
        };

        fetchUserData();
    }, [token]);

    async function handleSubmit(e){
        e.preventDefault();

        try {
            await axios.post(`/api/expenses/finances/${userFinances._id}`,
                {
                    name: name,
                    category: expenseCategory,
                    description: description,
                    cost: cost
                }
            );
            navigate('/home_budget');
        } catch (err) {
            console.error(err);
        }
    }
    
    return (
        <>
            {!authenticated ?
                <div>
                    <h2 style={{ textAlign: 'center', marginTop: '50px'}}>You need to be authenticated to access this page.</h2>
                    <div style={{ display: 'flex', justifyContent: 'center' }}>
                        <button className="contrast" style={{ margin: '20px', width: '10%'}} onClick={() => navigate('/')}>
                            Sign in
                        </button>
                    </div>
                </div>
            :
                <main>
                    <form className='container' onSubmit={handleSubmit}>
                        <h4>Please fill out the fields below to add your expense.</h4>
                        <label>Name:</label>
                        <input
                            type="text" 
                            name="expenseName"
                            required
                            onChange={(e) => setName(e.target.value)}
                            placeholder='Enter the name of your expense'
                        />
                        <label>Category:</label>
                        {detailsActive ? 
                        <div onClick={() => setActive(false)}>
                            <select name="category" aria-label='Select the category for your expense...' required onChange={(e) => setExpenseCategory(e.target.value)} onClick={() => setActive(false)}>
                                <option selected disabled defaultValue=''>
                                    Select the category for your expense...
                                </option>
                                {categories.map((category, index) => (
                                    <option key={index} defaultValue={category}>
                                        {category}
                                    </option>
                                ))}
                            </select>
                            <label style={{ marginTop: '325px'}}>Description:</label>
                            <textarea 
                                type='text'
                                name='expenseDescription'
                                onChange={(e) => setDescription(e.target.value)}
                                placeholder='Enter the description of your expense (Optional)'
                            />
                        </div>
                        :
                        <div>
                            <select name="category" aria-label='Select the category for your expense...' required onChange={(e) => setExpenseCategory(e.target.value)} onClick={() => setActive(true)}>
                                <option selected disabled defaultValue=''>
                                    Select the category for your expense...
                                </option>
                                {categories.map((category, index) => (
                                    <option key={index} value={category}>
                                        {category}
                                    </option>
                                ))}
                            </select>
                            <label>Description:</label>
                            <textarea 
                                type='text'
                                name='expenseDescription'
                                onChange={(e) => setDescription(e.target.value)}
                                placeholder='Enter the description of your expense (Optional)'
                            />
                        </div>
                        }
                        <label>Cost:</label>
                        <input 
                            type='number'
                            name='expenseCost'
                            onChange={((e) => setCost(e.target.value))}
                            placeholder='Enter the cost of your expense'
                        />
                        <button type='submit' disabled={
                            name === '' || expenseCategory === '' || cost === 0 }>
                            Add Expense
                        </button>
                    </form>
                </main>
            }
        
        </>
    )
}