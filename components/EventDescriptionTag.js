import React from 'react'
import { View, Text, StyleSheet } from 'react-native'

const EventDescriptionTag = ({ text, randomColor = false, first = false }) => {

    let randomNum = Math.floor(Math.random() * 6)
    let bg = ["#F4F3FF", "#EFF8FF", "#FDF2FA", "#FEF6EE", "#ECFDF3", "#FEF3F2"]
    let border = ["#D9D6FE", "#B2DDFF", "#FCCEEE", "#F9DBAF", "#ABEFC6", "#FECDCA"]
    let txt = ["#5925DC", "#175CD3", "#C11574", "#B93815", "#067647", "#B42318"]

    const styles = StyleSheet.create({
        container: {
            backgroundColor: bg[randomNum],
            borderColor: border[randomNum] 
        },
        text:{
            color: txt[randomNum]
        },
        defaultContainer:{
            borderColor: "rgb(209, 213, 219)"
        }
    });
    
    return (
        <View style={randomColor ? styles.container : styles.defaultContainer} className={"w-fit px-2 py-0.5 border-0.5 rounded-full " + (first ? "mr-1" : "ml-1")}>
            <Text style={randomColor && styles.text} className="text-gray-500 font-medium">{text}</Text>
        </View>
    )
}

export default EventDescriptionTag