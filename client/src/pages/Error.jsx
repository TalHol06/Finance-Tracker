import { useLocation, useNavigate } from "react-router-dom";

export default function ErrorPage() {
    // const location = useLocation();
    // const from = location.state?.from || "/";
    const navigate = useNavigate();

    return (
        <div className="container">
            <h1>Oops!</h1>
            <p>Something went wrong.</p>
            <h4>Authentication is required to access that page.</h4>

            <div style={{ display: 'flex', justifyContent: 'center'}}>
                <button style={{ width: '35%', marginTop: '25px'}} onClick={() => navigate('/')}>Sign In</button>
            </div>
        </div>
    );
}