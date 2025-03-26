import React from 'react'
import { Text, TextInputProps, View } from '@/components/Themed'
import { TextInput as DefaultTextInput } from 'react-native'

export const TextInput = ({ style, error, ...props }: TextInputProps) => {
  return (
    <View style={{
      backgroundColor: "transparent",
    }}>
      <DefaultTextInput
        style={{
          backgroundColor: 'rgba(255,255,255,0.1)',
          padding: 16,
          borderRadius: 8,
          color: 'white',
          fontSize: 16,
          overflow: 'hidden',
          ...style as any
        }}
        {...props}
      />

      {error && (
        <Text style={{ color: '#ee4d2d', fontSize: 12, marginTop: 4 }}>{error}</Text>
      )}
    </View>
  )
}
