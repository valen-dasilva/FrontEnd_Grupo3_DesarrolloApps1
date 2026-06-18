import { View } from "react-native";
import { styles } from "../BottomNavBar/BottomNavBar.styles";


export default function EmptyState(icon: string, title: string, description: string) {
    return(
        <View style={styles.container}>
            <Image source={icon} style={styles.icon} />
            <Text style={styles.title}>{title}</Text>
            <Text style={styles.description}>{description}</Text>
        </View>
    )
}