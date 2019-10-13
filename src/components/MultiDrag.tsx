import immer from 'immer'
import sortBy from 'lodash/sortBy'
import React, { useReducer, useEffect, useRef } from 'react'
import Snap from '../svg'

interface Layer {
  id: string
  x: number
  y: number
  z: number
  color: string
}

interface State {
  selected: Record<Layer['id'], boolean>
  layers: Layer[]
}

const initialState: State = {
  selected: {},
  layers: [
    { id: '1', x: 10, y: 10, z: 0, color: 'cyan' },
    { id: '2', x: 100, y: 100, z: 1, color: 'orange' },
    { id: '3', x: 120, y: 120, z: 2, color: 'green' }
  ]
}

const action = <T extends string, P>(type: T, payload: P) => ({ type, payload })

const unreduceable = (unknownAction: never) => void unknownAction

type KnownLayerActions = ReturnType<
  typeof LayerActions[keyof typeof LayerActions]
>

const LayerActions = {
  selected: (id: Layer['id']) => action('layer/selected', { id }),
  moved: (dx: number, dy: number) => action('layer/moved', { dx, dy })
}

const reducer = (currentState = initialState, action: KnownLayerActions) =>
  immer(currentState, state => {
    switch (action.type) {
      case 'layer/selected': {
        const { id } = action.payload
        state.selected[id] = !state.selected[id]
        break
      }

      case 'layer/moved': {
        const { dx, dy } = action.payload
        state.layers.forEach(layer => {
          if (!state.selected[layer.id]) {
            return
          }

          layer.x += dx
          layer.y += dy
        })
        break
      }

      default: {
        unreduceable(action)
      }
    }
  })

export default function MultiDrag() {
  const [state, dispatch] = useReducer(reducer, initialState)

  const onSelect = (id: Layer['id']) => {
    dispatch(LayerActions.selected(id))
  }

  const onMove = (dx: number, dy: number) => {
    console.log(dx, dy)
    dispatch(LayerActions.moved(dx, dy))
  }

  return (
    <svg
      viewBox="0 0 500 500"
      width="500"
      height="500"
      style={{ background: '#eee' }}
    >
      {sortBy(state.layers, l => l.z).map(layer => (
        <Layer
          key={layer.id}
          layer={layer}
          onSelect={onSelect}
          selected={!!state.selected[layer.id]}
          onMove={onMove}
        />
      ))}
    </svg>
  )
}

function Layer({
  layer,
  selected,
  onSelect,
  onMove
}: {
  layer: Layer
  selected?: boolean
  onSelect(id: Layer['id']): void
  onMove(dx: number, dy: number, x: number, y: number, event: MouseEvent): void
}) {
  const ref = useRef<SVGRectElement | null>(null)
  useEffect(() => {
    const snap = Snap(ref.current!)
    snap.drag(onMove, console.log, console.log)
  }, [])

  const onClick = () => {
    onSelect(layer.id)
  }

  return (
    <rect
      ref={ref}
      fillOpacity={selected ? 1 : 0.5}
      fill={layer.color}
      width="80"
      height="40"
      x={layer.x}
      y={layer.y}
      onClick={onClick}
    ></rect>
  )
}
