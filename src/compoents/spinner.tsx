import { useSpinnerContext } from "../context/spinnerContext";
import '../styling/spinner.css';

const Spinner = () => {
    const isSpinnerActive = useSpinnerContext().isActive;
    const spinnerText = useSpinnerContext().spinnerText;

    return (
        <>
            {isSpinnerActive && (
                <div className="spinner-overlay">
                    <div className="spinner" />
                    <h2>{spinnerText}</h2>
                </div>
            )}
        </>
    );
};

export default Spinner;
