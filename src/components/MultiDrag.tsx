import immer from 'immer'
import sortBy from 'lodash/sortBy'
import React, { useReducer } from 'react'

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
    { id: '3', x: 200, y: 200, z: 2, color: 'green' }
  ]
}

const action = <T extends string, P>(type: T, payload: P) => ({ type, payload })

const LayerActions = {
  selected: (id: Layer['id']) => action('selected', { id })
}

const unreduceable = (unknownAction: never) => void unknownAction

type KnownLayerActions = ReturnType<
  typeof LayerActions[keyof typeof LayerActions]
>

const reducer = (currentState = initialState, action: KnownLayerActions) =>
  immer(currentState, state => {
    switch (action.type) {
      case 'selected': {
        const { id } = action.payload
        state.selected[id] = !state.selected[id]
        break
      }

      default: {
        unreduceable(action.type)
      }
    }
  })

export default function MultiDrag() {
  const [state, dispatch] = useReducer(reducer, initialState)

  const onSelect = (id: Layer['id']) => {
    dispatch(LayerActions.selected(id))
  }

  return (
    <svg
      viewBox="0 0 500 500"
      width="500"
      height="500"
      style={{ background: '#eee' }}
    >
      {sortBy(state.layers, l => -l.z).map(layer => (
        <Layer
          key={layer.id}
          layer={layer}
          onSelect={onSelect}
          selected={!!state.selected[layer.id]}
        />
      ))}
    </svg>
  )
}

function Layer({
  layer,
  selected,
  onSelect
}: {
  layer: Layer
  selected?: boolean
  onSelect(id: Layer['id']): void
}) {
  const onClick = () => {
    onSelect(layer.id)
  }

  return (
    <rect
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
