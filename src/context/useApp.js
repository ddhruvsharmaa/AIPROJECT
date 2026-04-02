import { useContext } from 'react'
import AppContext from './_ctx.js'

export default function useApp() {
  return useContext(AppContext)
}
