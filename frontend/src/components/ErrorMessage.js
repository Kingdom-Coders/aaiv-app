const ErrorMessage = ({ children }) => {
    return (
        <p style={{ color: "red", fontSize: "12px", fontWeight: "bold" }}>
            {children}
        </p>
    );
};

export default ErrorMessage;