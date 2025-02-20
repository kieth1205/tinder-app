import React from 'react'
import { TextInputProps } from '@/components/Themed'
import { TextInput as DefaultTextInput } from 'react-native'

export const TextInput = ({ style, ...props }: TextInputProps) => {
  return (
    <DefaultTextInput
      style={{
        backgroundColor: 'rgba(255,255,255,0.1)',
        padding: 16,
        borderRadius: 8,
        color: 'white',
        fontSize: 16,
        ...style as any
      }}
      {...props}
    />
  )
}
