import { Link } from 'react-router'
import { MathJax } from 'better-react-mathjax'
import './method-introduction.scss'

export type MethodIntroductionData = {
  title: string
  category: string
  description: string
  background: string
  history: string | readonly string[]
  historyReference?: { label: string; url: string }
  procedure: readonly string[]
  formulaLatex: string
  image?: string
  imageAlt?: string
  calculatorPath: string
}

type Props = { method: MethodIntroductionData }

export default function MethodIntroduction({ method }: Props) {
  return (
    <article className="method-introduction" key={method.calculatorPath}>
      <header className="method-introduction__header">
        <h1>{method.title}<span className="punto">.</span></h1>
        <Link className="method-introduction__action" to={method.calculatorPath}>
          Abrir calculadora <span aria-hidden="true">→</span>
        </Link>
      </header>

      <div className="method-introduction__summary">
        <span className="method-introduction__category">{method.category}</span>
        <p><MathJax inline>{method.description}</MathJax></p>
      </div>

      <div className="method-introduction__layout">
        <div className="method-introduction__content">
          <section aria-labelledby="method-process">
            <h2 id="method-process">¿Cómo funciona?</h2>
            <p><MathJax inline>{method.background}</MathJax></p>
            <div className="method-introduction__formula">
              <MathJax>{String.raw`\[${method.formulaLatex}\]`}</MathJax>
            </div>
            <ol>
              {method.procedure.map((step) => <li key={step}><MathJax inline>{step}</MathJax></li>)}
            </ol>
          </section>
        </div>

        <section className="method-introduction__history" aria-labelledby="method-history">
          {method.image && (
            <figure className="method-introduction__visual">
              <img src={method.image} alt={method.imageAlt ?? ''} />
            </figure>
          )}
          <h2 id="method-history">Historia del método</h2>
          {(typeof method.history === 'string' ? [method.history] : method.history).map((paragraph) => (
            <p key={paragraph}>{paragraph}</p>
          ))}
          {method.historyReference && (
            <p><a href={method.historyReference.url}>{method.historyReference.label}</a></p>
          )}
        </section>
      </div>
    </article>
  )
}
