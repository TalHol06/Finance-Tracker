import Cookies from 'js-cookie';
import axios from 'axios';

import { jwtDecode } from 'jwt-decode';
import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'; 

export default function HomeBudget(){
  const navigate = useNavigate();

  const token = Cookies.get('token');
  const [userId, setUserId] = useState('');
  const [authenticated, setAuthenticated] = useState(false);

  useEffect(() => {
    if (!token){
      setAuthenticated(false);
      return;
    }

      setAuthenticated(true);
      const decoded = jwtDecode(token);
      setUserId(decoded.id);
  }, [token]);

  const [userFinances, setFinances] = useState({});
  const [expenses, setExpenses] = useState([]);

  useEffect(() => {
    if (!userId) return;

    const fetchUserData = async () => {
      try {
        const user = await axios.get(`/api/user/${userId}`);
        console.log(user.data);

        const finances = await axios.get(`/api/finances/${user.data.finances}`);
        setFinances(finances.data);

        const expenses = await axios.get(`/api/expenses/finances/${finances.data._id}`);
        setExpenses(expenses.data);
      } catch (err) {
        console.error(err);
      }
    }

    fetchUserData();
  }, [userId]);

  console.log(userFinances);

  return (
    <>
      {!authenticated ?
        <div>
          <h2 style={{ textAlign: 'center',marginTop: '50px' }}>You need to be signed in to access this page.</h2>
          <div style={{ display: 'flex', justifyContent: 'center'}}>
              <button className='contrast' style={{ margin: '20px', width: '10%'}} onClick={() => navigate('/')}>Sign In</button>
          </div>
        </div>
      :
        <div className="grid" style={{ margin: '40px'}}>
          <aside className='container' style={{ border: '1.25px solid', height: '100%', padding: '20px'}}>
            <h2>Finance Tracker</h2>
            <nav>
              <ul>
                <li><a href="#" onClick={() => navigate('/home')}>Dashboard</a></li>
                <li><a href="#">Budgets</a></li>
                <li><a href="#">Settings</a></li>
              </ul>
            </nav>
          </aside>

          <main className='container' style={{ border: '1.25px solid', padding: '25px'}}>
            <header>
              <h1>Current Budgeting Information:</h1>
            </header>

            <section style={{ border: '1.25px solid', padding: '35px', display: 'flex', justifyContent: 'space-between'}}>
              <div style={{ borderRight: '1.25px solid', paddingRight: '40px'}}>
                <h5 style={{ textAlign: 'center' }}>Net Monthly Income:</h5>
                <h6 style={{ textAlign: 'center' }}>${userFinances.netMonthlyIncome}</h6>
              </div>
              <div style={{ borderRight: '1.25px solid', paddingRight: '40px'}}>
                <h5 style={{ textAlign: 'center' }}>Current Budget Type:</h5>
                <h6 style={{ textAlign: 'center' }}>{userFinances.budgetType}</h6>
              </div>
              <button className='contrast' onClick={() => navigate('/update_finances')}>Edit</button>
            </section>

            <div style={{ border: '1.25px solid', padding: '25px', height: '500px', overflowY: 'auto'}}>
              <h3 style={{ marginBottom: '30px'}}>Expenses:</h3>
              {expenses.map((expense) => (
                <div key={expense._id} style={{ border: '1.25px solid', padding: '15px', margin: '10px',}}>
                  <h5>{expense.name}: ${expense.cost}</h5>
                  <h6>{expense.category}</h6>
                  <p>{expense.description}</p>
                  <div style={{ display: 'flex', justifyContent: 'center', margin: '0'}}>
                    <button className='primary' style={{ margin: '10px', width: '15%'}}>Edit</button>
                    <button className='secondary' style={{ margin: '10px', width: '15%'}}>Delete</button>
                  </div>
                </div> 
              ))}
            </div>
          </main>
        </div>
      }
    </>
  )
}