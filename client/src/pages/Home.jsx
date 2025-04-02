import Cookies from 'js-cookie';
import axios from 'axios';

import { jwtDecode } from 'jwt-decode';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';

let total = 0;
let totalHousingCost = 0;
let totalTransportationCost = 0;
let totalFoodCost = 0;
let totalUtilitiesCost = 0;
let totalClothingCost = 0;
let totalMedicalCost = 0;
let totalInsuranceCost = 0;
let totalPersonalCost = 0;
let totalSavingsCost = 0;

const incomeData = [
    { name: "Needs", value: 50 },
    { name: "Wants", value: 30 },
    { name: "Savings", value: 20 }
];
const incomeCOLORS = ["#007bff", "#ff9800", "#28a745"];

export default function Home(){
    const navigate = useNavigate();
    
    const token = Cookies.get('token');

    const [user, setUser] = useState({});
    const [userFinances, setFinances] = useState({});
    const [expenses, setExpenses] = useState([]);

    const [totalExpenseCost, setTotal] = useState(0);

    const [housingCost, setHValue] = useState(0);
    const [transportationCost, setTValue] = useState(0);
    const [foodCost, setFValue] = useState(0);
    const [utilitiesCost, setUValue] = useState(0);
    const [clothingCost, setCValue] = useState(0);
    const [medicalCost, setMValue] = useState(0);
    const [insuranceCost, setIValue] = useState(0);
    const [personalCost, setPValue] = useState(0);
    const [savingsCost, setSValue] = useState(0);

    useEffect(() => {
      for (let i = 0; i < expenses.length; i = i + 1){
        total += expenses[i].cost;

        if (expenses[i].category === 'Housing') totalHousingCost += expenses[i].cost; else
        if (expenses[i].category === 'Transportation') totalTransportationCost += expenses[i].cost; else
        if (expenses[i].category === 'Food') totalFoodCost += expenses[i].cost; else
        if (expenses[i].category === 'Utilities') totalUtilitiesCost += expenses[i].cost; else
        if (expenses[i].category === 'Clothing') totalClothingCost += expenses[i].cost; else
        if (expenses[i].category === 'Medical/Healthcare') totalMedicalCost += expenses[i].cost; else
        if (expenses[i].category === 'Insurance') totalInsuranceCost += expenses[i].cost; else
        if (expenses[i].category === 'Personal') totalPersonalCost += expenses[i].cost; else
        if (expenses[i].category === 'Savings') totalSavingsCost += expenses[i].cost;
      }
      setTotal(total);
      setHValue(totalHousingCost);
      setTValue(totalTransportationCost);
      setFValue(totalFoodCost);
      setUValue(totalUtilitiesCost);
      setCValue(totalClothingCost);
      setMValue(totalMedicalCost);
      setIValue(totalInsuranceCost);
      setPValue(totalPersonalCost);
      setSValue(totalSavingsCost);

    }, [expenses])
    
    const spendingData = [
      { name: "Housing", value: Math.round((housingCost / total) * 100) },
      { name: "Transportation", value: Math.round((transportationCost / total) * 100) },
      { name: "Food", value: Math.round((foodCost / total) * 100) },
      { name: "Utilities", value: Math.round((utilitiesCost / total) * 100) },
      { name: "Clothing", value: Math.round((clothingCost / total) * 100) },
      { name: "Medical/Healthcare", value: Math.round((medicalCost / total) * 100) },
      { name: "Insurance", value: Math.round((insuranceCost / total) * 100) },
      { name: "Personal", value: Math.round((personalCost / total) * 100) },
    ]
    const spendingCOLORS = ["#A16207", "#F97316", "#DC2626", "#FACC15", "#9333EA", "#14B8A6", "#166534", "#EC4899"];

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
            
            return axios.get(`/api/expenses/finances/${response.data._id}`);
        })
        .then((response) => {
            setExpenses(response.data);
        })
        .catch((err) => {
            console.error(err);
        })
    }, [userId]);

    return (
      <div className="grid" style={{ margin: '40px'}}>
        {/* Sidebar Navigation */}
        <aside className="container" style={{ border: '1.25px solid', height: '40%', padding: '20px'}}>
          <h2>Finance Tracker</h2>
          <nav>
            <ul>
              <li><a href="#">Dashboard</a></li>
              <li><a href="#" onClick={() => navigate('/home_budget')}>Budgets</a></li>
              <li><a href="#">Settings</a></li>
            </ul>
          </nav>
        </aside>

        {/* Main Content */}
        <main className="container" style={{ border: '1.25px solid', padding: '25px'}}>
          {/* Header */}
          <header>
            <h1>Dashboard</h1>
          </header>

          {/* Balance Overview */}
          <section className="grid">
            <article>
              <h6 style={{ textAlign: 'center' }}>Monthly Net Total Income:</h6>
              <h4 style={{ textAlign: 'center' }}>${userFinances.netMonthlyIncome}</h4>
              <hr/>
              <ResponsiveContainer width='100%' height={250}>
                  <PieChart>
                      <Pie data={incomeData} dataKey="value" cx="50%" cy='50%' outerRadius={90} fill="#8884d8" label>
                          {incomeData.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={incomeCOLORS[index % incomeCOLORS.length]} />
                          ))}
                      </Pie>
                      <Tooltip />
                  </PieChart>
              </ResponsiveContainer>
            </article>
            <article>
              <h6 style={{ textAlign: 'center' }}>Monthly Budget:</h6>
              {userFinances.budgetType} | Needs: 50% - Wants: 30% - Savings: 20%
              <hr/>
              <h4 style={{ color: incomeCOLORS[0]}}>Needs: ${userFinances.netMonthlyIncome * 0.5}</h4>
              <h4 style={{ color: incomeCOLORS[1] }}>Wants: ${userFinances.netMonthlyIncome * 0.3}</h4>
              <h4 style={{ color: incomeCOLORS[2]}}>Savings: ${userFinances.netMonthlyIncome * 0.2}</h4>
            </article>
          </section>

          {/* Charts and Transactions */}
          <section className="grid">
            <article>
              <h6>Spending Categories:</h6>
              <ResponsiveContainer width='100%' height={250}>
                <PieChart>
                  <Pie data={spendingData} dataKey="value" cx="50%" cy="50%" outerRadius={90} fill='#8884d8' label>
                      {spendingData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={spendingCOLORS[index % spendingCOLORS.length]} />
                      ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </article>
            <article>
              <h6 style={{ textAlign: 'center' }}>List of expenses:</h6>
              {totalExpenseCost > userFinances.netMonthlyIncome * 0.8 ?
                <h4 data-tooltip="Cost of your expenses over your budget. Status: ❌" style={{ color: 'red', textAlign: 'center', border: 'none' }}>{totalExpenseCost} / {userFinances.netMonthlyIncome * 0.8}</h4>
              :
                <h4 data-tooltip="Cost of your expenses over your budget. Status: ✅" style={{ color: 'green', textAlign: 'center', border: 'none' }}>{totalExpenseCost} / {userFinances.netMonthlyIncome * 0.8}</h4>
              }
              <hr/>
              <p style={{ color: '#A16207' }}>Housing: ${housingCost}</p>
              <p style={{ color: '#F97316' }}>Transportation: ${transportationCost}</p>
              <p style={{ color: '#DC2626' }}>Food: ${foodCost}</p>
              <p style={{ color: '#FACC15' }}>Utilities: ${utilitiesCost}</p>
              <p style={{ color: '#9333EA' }}>Clothing: ${clothingCost}</p>
              <p style={{ color: '#14B8A6' }}>Medical: ${medicalCost}</p>
              <p style={{ color: '#166534' }}>Insurance: ${insuranceCost}</p>
              <p style={{ color: '#EC4899' }}>Personal: ${personalCost}</p>
            </article>
          </section>
        </main>
      </div>
    )
}