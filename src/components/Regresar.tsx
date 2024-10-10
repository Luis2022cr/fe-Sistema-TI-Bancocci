import { IoArrowUndoOutline } from "react-icons/io5";
import { useNavigate } from "react-router-dom";

const BotonRegresar = () => {
    const navigate = useNavigate();

    return (
            <button
                onClick={() => navigate(-1)}
                className="flex items-center mt-6 mb-4 ml-2 text-xl text-blue-500 hover:underline"
            >
                <IoArrowUndoOutline />
                Regresar
            </button>
    );
};

export default BotonRegresar;
