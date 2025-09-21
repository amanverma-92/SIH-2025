// import React from 'react';
// import {
//   View,
//   Text,
//   StyleSheet,
//   TouchableOpacity,
//   Dimensions,
// } from 'react-native';
// import LinearGradient from 'react-native-linear-gradient';

// const { width, height } = Dimensions.get('window');

// interface WelcomeScreenProps {
//   navigation?: any; // TODO: Replace with proper navigation type
// }

// const WelcomeScreen: React.FC<WelcomeScreenProps> = ({ navigation }) => {
//   const handleLogin = () => {
//     navigation?.navigate('LoginScreen');
//   };

//   const handleRegister = () => {
//     navigation?.navigate('RegisterScreen');
//   };

//   return (
//     <LinearGradient
//       colors={['#1E3A8A', '#0D9488']} // Blue to Teal gradient
//       style={styles.container}
//       start={{ x: 0, y: 0 }}
//       end={{ x: 1, y: 1 }}
//     >
//       <View style={styles.content}>
//         {/* Logo Placeholder */}
//         <View style={styles.logoContainer}>
//           <View style={styles.logoPlaceholder}>
//             <Text style={styles.logoText}>🏛️</Text>
//           </View>
//         </View>

//         {/* Main Content */}
//         <View style={styles.textContainer}>
//           <Text style={styles.title}>Smart Tourist Safety</Text>
//           <Text style={styles.subtitle}>
//             Travel Safe with AI, Blockchain & Geo-fencing
//           </Text>
//         </View>

//         {/* Buttons */}
//         <View style={styles.buttonContainer}>
//           <TouchableOpacity style={styles.button} onPress={handleLogin}>
//             <Text style={styles.buttonText}>Login</Text>
//           </TouchableOpacity>
          
//           <TouchableOpacity style={styles.button} onPress={handleRegister}>
//             <Text style={styles.buttonText}>Register</Text>
//           </TouchableOpacity>
//         </View>
//       </View>
//     </LinearGradient>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//   },
//   content: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//     paddingHorizontal: 20,
//   },
//   logoContainer: {
//     position: 'absolute',
//     top: height * 0.1,
//     alignItems: 'center',
//   },
//   logoPlaceholder: {
//     width: 80,
//     height: 80,
//     borderRadius: 40,
//     backgroundColor: 'rgba(255, 255, 255, 0.2)',
//     justifyContent: 'center',
//     alignItems: 'center',
//     borderWidth: 2,
//     borderColor: 'rgba(255, 255, 255, 0.3)',
//   },
//   logoText: {
//     fontSize: 40,
//   },
//   textContainer: {
//     alignItems: 'center',
//     marginBottom: 60,
//   },
//   title: {
//     fontSize: 32,
//     fontWeight: 'bold',
//     color: '#FFFFFF',
//     textAlign: 'center',
//     marginBottom: 16,
//     textShadowColor: 'rgba(0, 0, 0, 0.3)',
//     textShadowOffset: { width: 1, height: 1 },
//     textShadowRadius: 3,
//   },
//   subtitle: {
//     fontSize: 16,
//     color: '#FFFFFF',
//     textAlign: 'center',
//     opacity: 0.9,
//     lineHeight: 24,
//     paddingHorizontal: 20,
//   },
//   buttonContainer: {
//     width: '100%',
//     gap: 16,
//   },
//   button: {
//     backgroundColor: '#0D9488', // Teal background
//     paddingVertical: 16,
//     paddingHorizontal: 32,
//     borderRadius: 25,
//     alignItems: 'center',
//     shadowColor: '#000',
//     shadowOffset: {
//       width: 0,
//       height: 2,
//     },
//     shadowOpacity: 0.25,
//     shadowRadius: 3.84,
//     elevation: 5,
//   },
//   buttonText: {
//     color: '#FFFFFF',
//     fontSize: 18,
//     fontWeight: '600',
//   },
// });

// export default WelcomeScreen;


import React, { useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  FlatList,
  Animated,
  Image
} from "react-native";
import LinearGradient from 'react-native-linear-gradient';


const { width, height } = Dimensions.get("window");

const features = [
  {
    id: "1",
    title: "Blockchain Tracking",
    description: "Ensure transparency and security with blockchain-backed tourist tracking.",
    image: require('../assets/blockchain.png')
  },
  {
    id: "2",
    title: "AI Anomaly Detection",
    description: "Detect unusual activities in real time using advanced AI.",
    image: require('../assets/ai.png')
  },
  {
    id: "3",
    title: "Police Web Portal",
    description: "24×7 police access for instant monitoring and response.",
    image: require('../assets/police.png')
  },
  {
    id: "4",
    title: "Surveillance",
    description: "Continuous monitoring through integrated surveillance systems.",
    image: require('../assets/surveillance.jpeg')
  },
];

const WelcomeScreen = ({navigation}:any) => {
  const scrollX = useRef(new Animated.Value(0)).current;

  return (
    <View style={styles.container}>
      {/* Gradient/Header */}
      
      <View style={styles.header}>
        <Text style={styles.title}>SafeTrip</Text>
        <Text style = {styles.subtitle}>Travel Safe with AI, Blockchain & Geo-fencing</Text>
      </View>

      {/* Carousel Section with inward rounded corners */}
      <View style={styles.content}>
        <Animated.FlatList
          data={features}
          keyExtractor={(item) => item.id}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          onScroll={Animated.event(
            [{ nativeEvent: { contentOffset: { x: scrollX } } }],
            { useNativeDriver: false }
          )}
          renderItem={({ item }) => (
            <View style={[styles.featureContainer, { width }]}>
              <Image source={item.image} style={styles.featureImage} />
              <Text style={styles.featureTitle}>{item.title}</Text>
              <Text style={styles.featureDesc}>{item.description}</Text>
            </View>
          )}
        />

        {/* Pagination Dots */}
        <View style={styles.pagination}>
          {features.map((_, i) => {
            const inputRange = [(i - 1) * width, i * width, (i + 1) * width];
            const dotWidth = scrollX.interpolate({
              inputRange,
              outputRange: [8, 20, 8],
              extrapolate: "clamp",
            });

            return (
              <Animated.View
                key={i}
                style={[styles.dot, { width: dotWidth }]}
              />
            );
          })}
        </View>

        {/* Button */}
        <TouchableOpacity style={styles.button} onPress={() => navigation.navigate("LoginScreen")}>
          <Text style={styles.buttonText}>Get Started</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};
export default WelcomeScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#133becff", // gradient can be applied here
  },
  header: {
    height: "40%",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  title: {
    color: "white",
    fontSize: 28,
    fontWeight: "bold",
  },
  subtitle:{
    color: "#ffffffff",
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "center",
    marginTop: 10
  },
  featureImage: {
    width: 150,
    height: 150,
    resizeMode: "contain",
    marginBottom: 20,
  },
  content: {
    flex: 1,
    backgroundColor: "white",
    borderTopLeftRadius: 40,
    borderTopRightRadius: 40,
    paddingTop: 40,
    alignItems: "center",
    marginTop: -35,
  },
  featureContainer: {
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 30,
  },
  featureTitle: {
    fontSize: 22,
    fontWeight: "700",
    marginBottom: 10,
    color: "#333",
    textAlign: "center",
  },
  featureDesc: {
    fontSize: 15,
    color: "#666",
    textAlign: "center",
    lineHeight: 22,
  },
  pagination: {
    flexDirection: "row",
    marginTop: 20,
    marginBottom: 30,
  },
  dot: {
    height: 8,
    borderRadius: 4,
    backgroundColor: "#4B6EF6",
    marginHorizontal: 4,
  },
  button: {
    backgroundColor: "#133becff",
    paddingVertical: 14,
    paddingHorizontal: 80,
    borderRadius: 12,
    marginBottom: 20,
  },
  buttonText: {
    color: "white",
    fontWeight: "600",
    fontSize: 16,
  },
});
