import { useEffect, useState } from "react";
import { StyleSheet, View } from "react-native";
import { FlatList, Pressable } from "react-native-gesture-handler";

export const Example = () => {
    useEffect(() => {
        console.log([] == ![]);
        console.log(Number([1]) == "");
    })
    const [boxData, setBoxData] = useState([{ id: 1, boxColor: 'green' }, { id: 2, boxColor: 'pink' }, { id: 3, boxColor: 'yellow' }]);
    const onPressBox = (clickedIndex) => {
        setBoxData(prevData => {
            // Create a copy
            const newData = [...prevData];
            console.log('the step 1......', newData);

            // Get all current colors
            const currentColors = newData.map(box => box.boxColor);
            console.log('the step 2......', currentColors);

            // Rotate the colors array starting from clicked index
            const rotatedColors = [];

            // Add colors after clicked index first
            for (let i = clickedIndex + 1; i < currentColors.length; i++) {
                rotatedColors.push(currentColors[i]);
            }
            console.log('the step 3......', rotatedColors);

            // Add the clicked color
            rotatedColors.push(currentColors[clickedIndex]);
            console.log('the step 4......', rotatedColors);

            // Add remaining colors from start
            for (let i = 0; i < clickedIndex; i++) {
                rotatedColors.push(currentColors[i]);
            }
            console.log('the step 5......', rotatedColors);

            // Apply rotated colors to boxes
            for (let i = 0; i < newData.length; i++) {
                newData[i].boxColor = rotatedColors[i];
            }
            console.log('the step 6......', rotatedColors);
            console.log('the step 6 pt 2......', newData);

            return newData;
        });
    }
    return (
        <FlatList
            data={boxData}
            contentContainerStyle={{ alignItems: 'center', justifyContent: 'center', alignSelf: 'center', marginTop: 150 }}
            renderItem={({ item, index }) => {
                return (
                    <Pressable
                        style={[styles.box, { backgroundColor: item.boxColor }]}
                        onPress={() => onPressBox(index)} />
                );
            }}
        />
    );
}
const styles = StyleSheet.create({
    box: {
        height: 85,
        width: 85,
        borderRadius: 8,
        margin: 8
    }
})