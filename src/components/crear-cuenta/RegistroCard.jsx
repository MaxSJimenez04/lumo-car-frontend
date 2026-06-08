export default function RegistroCard({
    title,
    subtitle,
    children
}) {
    return (
        <div className="registro-card">

            <div className="card-header">
                <h2>{title}</h2>
                <p>{subtitle}</p>
            </div>

            {children}

        </div>
    );
}