import { StyleSheet, Text, View } from "react-native";
import { Image } from "expo-image";


export default function Index() {
  return (
    <View
      style={styles.container}
    >
      <Text style={styles.title}>Edit app/index.tsx to edit this screen.</Text>
      <Image />
    </View>

  );
}

const styles = StyleSheet.create({
  container:{
    flex: 1,
    justifyContent: "center",
    alignItems: "center"
  },

  title:{
    color: "blue"
  }
})

