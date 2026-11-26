import type { ReactNode } from 'react'
import './editor-matriz.scss'

interface EditorMatrizProps {
  size: number
  renderCell: (row: number, column: number) => ReactNode
  renderVector?: (row: number) => ReactNode
  vectorLabel?: string
}

export function EditorMatriz({ size, renderCell, renderVector, vectorLabel = 'Vector b' }: EditorMatrizProps) {
  const indices = Array.from({ length: size }, (_, index) => index)

  return (
    <div className="editor-matriz" role="region" aria-label="Editor de matriz" tabIndex={0}>
      <div className="editor-matriz__layout">
        <div className="editor-matriz__group">
          <span className="editor-matriz__label">Matriz A</span>
          <div className="editor-matriz__brackets" style={{ gridTemplateColumns: `repeat(${size}, max-content)` }}>
            {indices.map((row) => (
              <div className="editor-matriz__row" key={row}>
                {indices.map((column) => <div key={column}>{renderCell(row, column)}</div>)}
              </div>
            ))}
          </div>
        </div>
        {renderVector && (
          <div className="editor-matriz__group">
            <span className="editor-matriz__label">{vectorLabel}</span>
            <div className="editor-matriz__brackets">
              {indices.map((row) => <div key={row}>{renderVector(row)}</div>)}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

interface CeldaMatrizProps {
  label: string
  value: string
  onValueChange: (value: string) => void
  negative?: boolean
  onToggleSign?: () => void
}

export function CeldaMatriz({ label, value, onValueChange, negative, onToggleSign }: CeldaMatrizProps) {
  const displayedValue = negative ? `-${value}` : value
  const isNegative = /^[-−]/.test(displayedValue.trimStart())

  function updateValue(nextValue: string) {
    if (!/^[+−-]?(?:\d*(?:[.,]\d*)?)(?:e[+-]?\d*)?$/i.test(nextValue)) return

    if (!onToggleSign) {
      onValueChange(nextValue)
      return
    }

    if (/^[-−]/.test(nextValue) !== Boolean(negative)) onToggleSign()
    onValueChange(nextValue.replace(/^[-+−]/, ''))
  }

  function toggleSign() {
    if (onToggleSign) {
      onToggleSign()
      return
    }

    const text = value.trim()
    onValueChange(/^[-−]/.test(text) ? text.slice(1) : `-${text.replace(/^\+/, '')}`)
  }

  return (
    <div className="editor-matriz__cell" data-negative={isNegative}>
      <input
        aria-label={label}
        type="text"
        inputMode="decimal"
        placeholder="0"
        value={displayedValue}
        title={displayedValue || undefined}
        onChange={(event) => updateValue(event.target.value)}
      />
      <button
        type="button"
        aria-label={`Cambiar signo: ${label}`}
        aria-pressed={isNegative}
        onClick={toggleSign}
      >
        ±
      </button>
    </div>
  )
}
