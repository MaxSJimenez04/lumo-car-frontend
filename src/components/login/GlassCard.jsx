export default function GlassCard({
    title,
    subtitle,
    children
}) {
    return (
        <div className="glass-card">

            <div className="card-header">
                <h2>{title}</h2>
                <p>{subtitle}</p>
            </div>

            {children}

        </div>
    );
}