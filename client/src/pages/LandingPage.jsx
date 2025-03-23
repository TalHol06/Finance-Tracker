import '@picocss/pico/css/pico.min.css';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

export default function App() {
    const navigate = useNavigate();

    const [passSmall, setPassSmall] = useState('Password must be at least 8 characters long.');
    const [invalidPass, setInvalidPass] = useState(null);
    const [password, setPass] = useState('');
    const [passTouched, setPassTouched] = useState(false);

    const [emailSmall, setEmailSmall] = useState('');
    const [email, setEmail] = useState('');
    const [invalidEmail, setInvalidEmail] = useState(null);
    const [emailTouched, setEmailTouched] = useState(false);

    const [loggingIn, setLoggingIn] = useState(true);

    useEffect(() => {
        if (passTouched){
            if (password.length >= 8){
                setPassSmall('✅ All Good!');
                setInvalidPass(false);
            } else{
                setPassSmall('❌ Password must be at least 8 characters long.');
                setInvalidPass(true);
            }
        }
    }, [password, passTouched])

    useEffect(() => {
        if (emailTouched){
            if (/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(email)){
                setEmailSmall('✅ All Good!');
                setInvalidEmail(false);
            } else{
                setEmailSmall('❌ Please enter a valid email.');
                setInvalidEmail(true);
            }
        }
    }, [email, emailTouched])

    async function handleSubmit(e){
        e.preventDefault();

        if (email === '' || password === ''){
            return;
        }

        if (loggingIn){ 
            axios.post('/api/user/login', {
                email: email,
                password: password
            })
            .then((response) => {
                console.log(response);
                navigate('/home');
            })
            .catch((err) => {
                console.error(err);
            });
        } else{ 
            axios.post('/api/user', {
                email: email,
                password: password
            })
            .then((response) => {
                console.log(response);
                navigate('/questions');
            })
            .catch((err) => {
                console.error(err);
            });
        }

    }

    return (
        <main id='main' className="container"
            style={{ 
                display: 'flex', justifyContent: 'space-between', padding: '10%',
                
            }}
        >
            <div className="container" style={{ border: '1.25px solid', borderRight: 'none', padding: '3%', width: '100%', }}>
                <h2 style={{ textAlign: 'center' }}>Welcome to Finance Tracker!</h2>
                <p style={{ textAlign: 'center' }}>An easy way to track your finances.</p>
            </div>

            <aside style={{ border: '1.25px solid', padding: '3%', width: '100%' }}>
                {loggingIn ? <h2>Sign In</h2> : <h2>Sign Up</h2>}
                <form onSubmit={handleSubmit}>
                    <label>Email:</label>
                    <input 
                        type="email" 
                        placeholder='Email' 
                        name='email' 
                        required
                        onChange={(e) => setEmail(e.target.value)}
                        onFocus={() => setEmailTouched(true)}
                        aria-invalid={invalidEmail}
                    />
                    <small>{emailSmall}</small>

                    <label>Password:</label>
                    <input 
                        type="password" 
                        placeholder="Password" 
                        name="pass" 
                        required
                        onChange={(e) => setPass(e.target.value)}
                        onFocus={() => setPassTouched(true)}
                        aria-invalid={invalidPass}
                    />
                    <small>{passSmall}</small>

                    {loggingIn ? <button className='primary' type='submit'>Login</button> : <button className='primary' type='submit'>Sign Up</button>}
                    {loggingIn ? <p style={{ textAlign: 'center', cursor: 'pointer' }}>Don't have an account? <a onClick={() => setLoggingIn(false)}>Sign Up!</a></p> : <p style={{ textAlign: 'center', cursor: 'pointer' }}>Already have an account? <a onClick={() => setLoggingIn(true)}>Login!</a></p>}
                </form>
            </aside>
        </main>
    );
}
