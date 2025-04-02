import { useState, useEffect } from 'react';
import { faAngleUp, faAngleDown } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';


export default function AddExpense(){
    const [name, setName] = useState('');
    const [category, setCategory] = useState('');
    const [description, setDescription] = useState('');
    const [cost, setCost] = useState(0);

    const [detailsActive, setActive] = useState(false);
    
    return (
        <main>
            <form className='container'>
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
                <details onClick={() => setActive((prev) => !prev)}>
                    <summary>
                        Select the category for your expense {!detailsActive ? <FontAwesomeIcon icon={faAngleUp} /> : <FontAwesomeIcon icon={faAngleDown} />}
                    </summary>
                    <ul>
                        <li>
                            <button>Housing</button>
                        </li>
                        <li>
                            <button>Transportation</button>
                        </li>
                        <li>
                            <button>Food</button>
                        </li>
                        <li>
                            <button>Utilities</button>
                        </li>
                        <li>
                            <button>Clothing</button>
                        </li>
                        <li>
                            <button>Medical/Healthcare</button>
                        </li>
                        <li>
                            <button>Insurance</button>
                        </li>
                        <li>
                            <button>Personal</button>
                        </li>
                        <li>
                            <button>Savings</button>
                        </li>
                    </ul>
                </details>
            </form>
        </main>
    )
}

let totalTransportationCost = 0;
let totalFoodCost = 0;
let totalUtilitiesCost = 0;
let totalClothingCost = 0;
let totalMedicalCost = 0;
let totalInsuranceCost = 0;
let totalPersonalCost = 0;
let totalSavingsCost = 0;