import React from 'react'
import ReactDOM from 'react-dom'
import MultiDrag from './components/MultiDrag'
import { GlobalStyle } from './components/useSelection'

document.addEventListener('DOMContentLoaded', () => {
  ReactDOM.render(
    <>
      <MultiDrag />
      <GlobalStyle />
    </>,
    document.querySelector('#app')
  )
})
