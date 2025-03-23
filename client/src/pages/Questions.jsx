import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Cookies from 'js-cookie';
import { jwtDecode } from 'jwt-decode';

export default function Questions(){
    const navigate = useNavigate();

    const token = Cookies.get('token');

    useEffect(() => {
        if (!token){
            navigate('/error', { state: { from: location.pathname } });
        }
    }, [token, navigate]);

    let userId = null;
    if (token){
        try {
            const decoded = jwtDecode(token);
            userId = decoded.id;
        } catch (err) {
            console.error('Invalid token', err);
            navigate('error');
        }
    }


    const [progress, setProgress] = useState(0);
    const [view, setView] = useState(false);

    const [income, setIncome] = useState(0);
    const [invalid, setInvalid] = useState(null);
    const [inputTouched, setTouched] = useState(false);

    const [method, setMethod] = useState('');

    function handleSubmit(e){
        e.preventDefault();

        if (income <= 0) return;

        setProgress(50);
    }

    async function methodSubmit(e){
        e.preventDefault();

        if (method === '') return;

        axios.post(`/api/finances/${userId}`, {
            netMonthlyIncome: income,
            budgetType: method
        })
        .then((response) => {
            console.log(response);
            setProgress(100);
            navigate('/home');
        })
        .catch((err) => {
            console.error(err);
        });
    }

    useEffect(() => {
        if (inputTouched){
            if (income > 0){
                setInvalid(false);
            } else{
                setInvalid(true);
            }
        }
    }, [income, inputTouched]);

    useEffect
    
    return (
        <>
            <main className="container" style={{ height: '100%', display: 'flex', justifyContent: 'center'}}>
                {progress === 0 ?
                    <form onSubmit={handleSubmit} style={{ width: '50%', marginTop: '5%', padding: '5%', border: '1.25px solid', borderRadius: '8px'}}>
                        <h4 style={{ textAlign: 'center'}}>Please enter your net monthly income.</h4>
                        <progress value={progress} max={100} style={{ width: '50%', marginLeft: '25%'}}/>
                        <label style={{ marginTop: '10%' }}>
                            Net Monthly Income:
                        </label>
                        <input 
                            type="number"
                            name="netIncome"
                            required="true"
                            placeholder="Net monthly income"
                            aria-invalid={invalid}
                            onChange={(e) => setIncome(e.target.value)}
                            onFocus={() => setTouched(true)}
                        />
                        {invalid === true ? <small>❌ Net income is required.</small>: <p></p>}
                        <button type="submit" style={{ marginTop: '5%'}}>Next</button>
                    </form>
                : progress === 50 ?
                    <form onSubmit={methodSubmit} style={{ width: '50%', marginTop: '5%', padding: '5%', border: '1.25px solid', borderRadius: '8px'}}>
                        <h4 style={{ textAlign: 'center'}}>Please choose the budgeting method you want to use.</h4>
                        <progress value={progress} max={100} style={{ width: '50%', marginLeft: '25%'}}/>
                        <select 
                            name="budgeting-method" 
                            aria-label="Select your budgeting method..." 
                            required 
                            onChange={(e) => setMethod(e.target.value)}
                        >
                            <option selected disabled value="">Select your budgeting method...</option>
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
                                <h6 role="button" onClick={() => setView((prev) => !prev)} style={{ width: '80%', marginLeft: '8%' }}>View Basic steps:</h6>
                                {view ?
                                    <ul>
                                        <li>figure out your monthly net income.</li>
                                        <li>Identify and list all your monthly expenses, including your savings.</li>
                                        <li>Categorize those expenses, so you can set a target budget for each.</li>
                                        <li>Subtract your total expenses and savings from net income.</li>
                                    </ul>
                                :
                                    <p></p> 
                                }
                            </small>
                        : <></>
                        }

                        <button type="submit">Next</button>
                    </form>
                :
                    <div>
                        <h1>Redirecting to home page...</h1>
                    </div>
                }
            </main>
        </>
    )
}