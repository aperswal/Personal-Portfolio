import dynamic from 'next/dynamic'

export const withNoSSR = (Component: any) =>
  dynamic(() => Promise.resolve(Component), {
    ssr: false,
  }) 