const metrics = [
    { value: "R$ 850M+", label: "Em terrenos negociados" },
    { value: "320+", label: "Investidores atendidos" },
    { value: "650 m²", label: "Metragem mínima por ativo" },
    { value: "16 anos", label: "De mercado e curadoria" },
];

export default function Metrics() {
    return (
        <section className="metrics" aria-label="Indicadores da Eucalipto Imobiliária e Construtora">
            <div className="metrics-inner">
                {metrics.map((m) => (
                    <div className="metric" key={m.label}>
                        <span className="metric-value">{m.value}</span>
                        <span className="metric-label">{m.label}</span>
                    </div>
                ))}
            </div>
        </section>
    );
}
