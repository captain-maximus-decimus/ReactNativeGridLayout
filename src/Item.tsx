import { View, Text } from 'react-native'
import React from 'react'
import {WithGridLayout} from './GridLayoutHOC'

const Item = () => {
  return (
    <View>
      <Text>Suraj Yadav</Text>
    </View>
  )
}

export default WithGridLayout(Item)