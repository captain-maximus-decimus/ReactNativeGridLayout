import { View, Text, Image } from 'react-native'
import React from 'react'

const ClubItem = () => {
  return (
    <View
        style={{
            backgroundColor: '#121013',
            borderWidth: 1,
            borderBottomWidth: 2,
            borderColor: '#464053',
            borderRadius: 10,
            padding: 10,
            margin: 10,
            height: 178,
            width: "100%"
        }}
    >
        <Image
            source={{uri: "https://www.google.com/images/branding/googlelogo/1x/googlelogo_color_272x92dp.png"}}
            style={{
                width: "100%",
                height: 64
            }}
            resizeMode='contain'
        />
      <Text style={{color: "#fff", fontSize: 16, fontWeight: "regular"}}>BGMI REDEEM CODE GIVEAWAY 💎💎</Text>
    </View>
  )
}

export default ClubItem