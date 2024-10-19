type ButtonProps = {
    active?: boolean;
    className?: string;
    children?: React.ReactNode;
};

function Button({active = false, className = "", children}: ButtonProps) {
    return (
        <button className={`btn-text ${className} ${active ? "" : ""}`}>
            {children}
        </button>
    );
}

export default Button;
