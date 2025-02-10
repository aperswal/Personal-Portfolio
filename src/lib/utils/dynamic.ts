import dynamic from 'next/dynamic'
import { ComponentType } from 'react'

export const withNoSSR = <T extends {}>(Component: ComponentType<T>) =>
  dynamic(() => Promise.resolve(Component), {
    ssr: false,
  }) 