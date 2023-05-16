export default function ({ children, className, onClick, type }) {
    return <button type={type} className={`border-2 p-2 rounded-xl ${className ? className: ''}`} onClick={onClick}>{children}</button>
}