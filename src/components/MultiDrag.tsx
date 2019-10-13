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
  layers: Layer[]
}

const initialState = {
  layers: [
    { id: '1', x: 10, y: 10, z: 0, color: 'cyan' },
    { id: '2', x: 100, y: 100, z: 1, color: 'orange' },
    { id: '3', x: 200, y: 200, z: 2, color: 'green' }
  ]
}

function reducer(state = initialState, action) {
  return initialState
}

export default function MultiDrag() {
  const [state, dispatch] = useReducer(reducer, initialState)

  return (
    <svg
      viewBox="0 0 500 500"
      width="500"
      height="500"
      style={{ background: '#eee' }}
    >
      {sortBy(state.layers, l => -l.z).map(layer => (
        <Layer key={layer.id} layer={layer} />
      ))}
    </svg>
  )
}

function Layer({ layer }: { layer: Layer }) {
  return (
    <rect
      fill={layer.color}
      width="80"
      height="40"
      x={layer.x}
      y={layer.y}
    ></rect>
  )
}
