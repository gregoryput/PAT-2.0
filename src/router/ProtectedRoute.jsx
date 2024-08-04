import {useEffect} from "react";
import { useNavigate } from "react-router-dom";


const ProtectedRoute = ({ children, roles }) => {
    const rol = localStorage.getItem("Rol");
    // const userRol = getRolesByToken(token);

    const navigate = useNavigate();
    
    useEffect(() => {
        if (!(roles.includes(rol))) {
            return navigate('/Login');
        }
    }, [])
    
    return children;
};

export default ProtectedRoute;