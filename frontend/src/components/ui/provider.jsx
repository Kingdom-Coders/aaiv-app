'use client'

import { ChakraProvider, defaultSystem } from '@chakra-ui/react'

export function ThemeProvider(props) {
  return (
    <ChakraProvider value={defaultSystem}>
      {props.children}
    </ChakraProvider>
  )
}
