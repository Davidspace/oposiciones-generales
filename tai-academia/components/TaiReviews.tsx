export function TaiReviews({ whatsapp }: { whatsapp: string }) {
  return (
    <section className="lm-shell tai-reviews" id="opiniones" aria-labelledby="tai-reviews-title">
      <div>
        <p className="lm-eyebrow"><i aria-hidden="true" /> Opiniones verificadas</p>
        <h2 id="tai-reviews-title">Queremos que esta sección se gane.</h2>
      </div>
      <div className="tai-reviews-copy">
        <p>TAI es nuevo dentro de Academia LORMAN. Todavía no tenemos reseñas verificadas de este curso y no vamos a rellenar el hueco con frases genéricas.</p>
        <p><strong>No publicaremos una opinión sin comprobar</strong> que procede de una persona que haya usado el aula y sin pedirle permiso. Si quieres probar la muestra y contarnos qué mejorar, te leemos nosotros.</p>
        <a className="lm-btn lm-btn-outline" href={`https://wa.me/${whatsapp}?text=Hola%2C%20quiero%20probar%20la%20muestra%20de%20TAI%20y%20daros%20feedback.`}>Probar y dar feedback</a>
      </div>
    </section>
  );
}
