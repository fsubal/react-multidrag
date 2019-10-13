import { createGlobalStyle } from 'styled-components'
import { useEffect, useState } from 'react'
import Selection from '@simonwep/selection-js'

export const GlobalStyle = createGlobalStyle`
  .selection {
    background: rgba(0, 0, 255, 0.1);
    border-radius: 0.1em;
    border: 0.05em solid rgba(0, 0, 255, 0.2);
  }
`

export default function useSelection(
  selectables: string[],
  boundaries: string[],
  onChange: (addedIds: string[], removedId: string[]) => void
) {
  const [selecting, setSelecting] = useState(false)

  useEffect(() => {
    const selection = Selection.create({
      class: 'selection',
      selectables,
      boundaries
    })

    const onStart = () => setSelecting(true)

    const onMove = ({ changed }: Selection.SelectionEvent) => {
      const { added, removed } = changed

      onChange(
        added.map(el => (el as HTMLElement).dataset.layerId!),
        removed.map(el => (el as HTMLElement).dataset.layerId!)
      )
    }

    const onStop = ({ inst }: Selection.SelectionEvent) => {
      inst.keepSelection()
      setTimeout(() => {
        setSelecting(false)
      }, 0)
    }

    selection.on('start', onStart)
    selection.on('move', onMove)
    selection.on('stop', onStop)

    return () => {
      selection.off('start', onStart)
      selection.off('move', onMove)
      selection.off('stop', onStop)
    }
  }, [])

  return selecting
}
