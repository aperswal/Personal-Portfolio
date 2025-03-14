import dynamic from 'next/dynamic'
import React from 'react'

export const withNoSSR = (Component: any) =>
  dynamic(() => Promise.resolve(Component).catch((err: Error) => {
    console.error('Error loading component with withNoSSR:', err);
    // Return a fallback component
    return () => React.createElement('div', {
      style: {
        padding: '20px',
        margin: '20px',
        backgroundColor: 'black',
        color: 'rgb(34, 197, 94)',
        border: '1px solid rgb(34, 197, 94)',
        borderRadius: '5px',
        fontFamily: 'monospace'
      }
    }, 'Component failed to load. Please refresh the page.');
  }), {
    ssr: false,
    loading: () => React.createElement('div', {
      style: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100px',
        backgroundColor: 'black',
        color: 'rgb(34, 197, 94)',
        fontFamily: 'monospace'
      }
    }, 'Loading component...')
  }) 