import { Link } from 'react-router'
import './method-introduction.scss'

export type MethodIntroductionData = {
  title: string
  category: string
  description: string
  background: string
  history: string
  procedure: readonly string[]
  formula?: string
  image?: string
  imageAlt?: string
  calculatorPath: string
}

type Props = { method: MethodIntroductionData }

export default function MethodIntroduction({ method }: Props) {
  return (
    <article className="method-introduction">
      <header className="method-introduction__header">
        <div>
          <span className="method-introduction__eyebrow">{method.category}</span>
          <h1>{method.title}<span className="punto">.</span></h1>
        </div>
        <Link className="method-introduction__action" to={method.calculatorPath}>
          Ir al método <span aria-hidden="true">→</span>
        </Link>
      </header>

      <div className="method-introduction__layout">
        <div className="method-introduction__content">
          <section aria-labelledby="method-about">
            <h2 id="method-about">¿Qué es este método?</h2>
            <p className="method-introduction__lead">{method.description}</p>
            <p>{method.background}</p>
          </section>

          <section aria-labelledby="method-history">
            <h2 id="method-history">Breve historia</h2>
            <p>{method.history}</p>
          </section>

          <section aria-labelledby="method-process">
            <h2 id="method-process">¿Cómo funciona?</h2>
            <ol>
              {method.procedure.map((step) => <li key={step}>{step}</li>)}
            </ol>
            {method.formula && <p className="method-introduction__formula">{method.formula}</p>}
          </section>
        </div>

        {method.image && (
          <figure className="method-introduction__visual">
            <img src={method.image} alt={method.imageAlt ?? ''} />
            <figcaption>{method.imageAlt ?? 'Ilustración del método'}</figcaption>
          </figure>
        )}
      </div>
    </article>
  )
}
