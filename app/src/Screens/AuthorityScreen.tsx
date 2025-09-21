// import React, { useState, useRef } from "react";
// import {
//   View,
//   Text,
//   TextInput,
//   TouchableOpacity,
//   FlatList,
//   StyleSheet,
//   Dimensions,
//   ActivityIndicator
// } from "react-native";
// import LinearGradient from "react-native-linear-gradient";
// import QRCode from "react-native-qrcode-svg";

// const { width } = Dimensions.get("window");

// const steps = [
//   { key: "kyc", title: "Tourist KYC" },
//   { key: "trip", title: "Trip Details" },
//   { key: "emergency", title: "Emergency Contact" },
// ];



//   const AuthorityNewTripScreen = () => {
//   const [loading, setLoading] = useState(false);
//   const [qrData, setQrData] = useState<any>(null);
//   const flatListRef = useRef<FlatList>(null);
//   const [currentStep, setCurrentStep] = useState(0);
//   const [formData, setFormData] = useState({
//   tourist_id: "",
//   kyc_id: "",
//   itinerary: "",
//   emergency_contacts: "",
//   valid_to: "",
//   public_address: "",
// });


//   const handleSubmit = async () => {
//     try {
//       setLoading(true);
      
//       // Prepare payload
//       const payload = {
//         tourist_id: formData.tourist_id,
//         kyc_id: formData.kyc_id,
//         itinerary: formData.itinerary,
//         emergency_contacts: formData.emergency_contacts,
//         valid_to: formData.valid_to, // Ensure it's ISO string if backend expects
//         public_address: formData.public_address,
//       };

//       // Call blockchain issue route
//       const res = await fetch("http://127.0.0.1:8000/issue", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify(payload),
//       });

//       if (!res.ok) {
//         throw new Error("Failed to issue Digital ID");
//       }

//       const response = await res.json();

//       // Save response for QR generation
//       setQrData(response);

//     } catch (err) {
//       console.error(err);
//       // alert("Error issuing digital ID");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const nextStep = () => {
//     if (currentStep < steps.length - 1) {
//       flatListRef.current?.scrollToIndex({ index: currentStep + 1 });
//       setCurrentStep(currentStep + 1);
//     }
//   };

//   const prevStep = () => {
//     if (currentStep > 0) {
//       flatListRef.current?.scrollToIndex({ index: currentStep - 1 });
//       setCurrentStep(currentStep - 1);
//     }
//   };

//   const renderStep = ({ item }: any) => {
//     if (item.key === "kyc") {
//       return (
//         <View style={styles.step}>
//           <Text style={styles.title}>{item.title}</Text>
//           <TextInput style={styles.input} placeholder="Aadhaar Number" placeholderTextColor="#888" />
//           <TextInput style={styles.input} placeholder="Passport Number" placeholderTextColor="#888" />
//           <TextInput style={styles.input} placeholder="Full Name" value={formData.fullName} placeholderTextColor="#888" />
//           <TextInput style={styles.input} placeholder="Nationality" placeholderTextColor="#888" />
//         </View>
//       );
//     }
//     if (item.key === "trip") {
//       return (
//         <View style={styles.step}>
//           <Text style={styles.title}>{item.title}</Text>
//           <TextInput style={styles.input} placeholder="Start Date" placeholderTextColor="#888"/>
//           <TextInput style={styles.input} placeholder="End Date" placeholderTextColor="#888"/>
//           <TextInput style={styles.input} placeholder="Destination" placeholderTextColor="#888" />
//         </View>
//       );
//     }
//     if (item.key === "emergency") {
//       return (
//         <View style={styles.step}>
//           <Text style={styles.title}>{item.title}</Text>
//           <TextInput style={styles.input} placeholder="Emergency Contact Name" placeholderTextColor="#888" />
//           <TextInput style={styles.input} placeholder="Emergency Contact Phone" placeholderTextColor="#888"/>
//           <TouchableOpacity style={styles.button}>
//             <Text style={styles.buttonText}>Generate Tourist ID</Text>
//           </TouchableOpacity>
//         </View>
//       );
//     }
//     return null;
//   };

//   return (
//     <View style={styles.container}>
//       {/* Header */}
//       <LinearGradient colors={["#2563EB", "#3B82F6"]} style={styles.header}>
//         <Text style={styles.headerTitle}>SafeTrip</Text>
//         <Text style={styles.headerSubtitle}>Authority Dashboard</Text>
//       </LinearGradient>

//       {/* Progress Indicator */}
//       <View style={styles.progressContainer}>
//         <Text style={styles.progressText}>
//           Step {currentStep + 1} of {steps.length}
//         </Text>
//         <View style={styles.dotsContainer}>
//           {steps.map((_, index) => (
//             <View
//               key={index}
//               style={[
//                 styles.dot,
//                 currentStep === index && styles.activeDot,
//               ]}
//             />
//           ))}
//         </View>
//       </View>

//       {/* Steps */}
//       <FlatList
//         ref={flatListRef}
//         data={steps}
//         renderItem={renderStep}
//         keyExtractor={(item) => item.key}
//         horizontal
//         pagingEnabled
//         showsHorizontalScrollIndicator={false}
//         scrollEnabled={false} // disable manual scroll
//       />

//       {/* Navigation */}
//       <View style={styles.nav}>
//         {currentStep > 0 && (
//           <TouchableOpacity style={styles.navBtn} onPress={prevStep}>
//             <Text style={styles.navText}>Back</Text>
//           </TouchableOpacity>
//         )}
//         {currentStep < steps.length - 1 && (
//           <TouchableOpacity style={styles.navBtn} onPress={nextStep}>
//             <Text style={styles.navText}>Next</Text>
//           </TouchableOpacity>
//         )}
//       </View>

//       <View> 
//         {qrData ? (
//         <>
//           <Text style={styles.title}>Your Digital ID QR</Text>
//           <QRCode
//             value={JSON.stringify(qrData)} // store full response
//             size={250}
//           />
//         </>
//       ) : (
//         <>
//           {loading ? (
//             <ActivityIndicator size="large" color="#000" />
//           ) : (
//             <TouchableOpacity style={styles.button} onPress={handleSubmit}>
//               <Text style={styles.buttonText}>Submit & Generate QR</Text>
//             </TouchableOpacity>
//           )}
//         </>
//       )}
//       </View>
//     </View>
//   );
// };

// export default AuthorityNewTripScreen;

// const styles = StyleSheet.create({
//   container: { flex: 1, backgroundColor: "#F9FAFB" },

//   header: {
//     paddingTop: 100,
//     paddingBottom: 30,
//     borderBottomLeftRadius: 30,
//     borderBottomRightRadius: 30,
//     alignItems: "center",
//   },
//   headerTitle: { fontSize: 24, fontWeight: "700", color: "#fff" },
//   headerSubtitle: { fontSize: 16, fontWeight: "400", color: "#E0F2FE" },

//   progressContainer: {
//     alignItems: "center",
//     marginVertical: 15,
//   },
//   progressText: { fontSize: 14, color: "#1E293B", marginBottom: 8 },
//   dotsContainer: { flexDirection: "row" },
//   dot: {
//     width: 10,
//     height: 10,
//     borderRadius: 5,
//     backgroundColor: "#CBD5E1",
//     marginHorizontal: 4,
//   },
//   activeDot: { backgroundColor: "#2563EB" },

//   step: {
//     width,
//     padding: 20,
//     justifyContent: "center",
//   },
//   title: {
//     fontSize: 20,
//     fontWeight: "600",
//     marginBottom: 20,
//     color: "#1E293B",
//   },
//   input: {
//     borderWidth: 1,
//     borderColor: "#CBD5E1",
//     padding: 12,
//     borderRadius: 10,
//     marginBottom: 12,
//     backgroundColor: "#fff",
//   },
//   button: {
//     backgroundColor: "#2563EB",
//     padding: 15,
//     borderRadius: 10,
//     alignItems: "center",
//     marginTop: 20,
//   },
//   buttonText: { color: "#fff", fontWeight: "600" },

//   nav: {
//     flexDirection: "row",
//     justifyContent: "space-between",
//     padding: 20,
//   },
//   navBtn: {
//     backgroundColor: "#E0F2FE",
//     paddingVertical: 10,
//     paddingHorizontal: 20,
//     borderRadius: 8,
//   },
//   navText: { color: "#2563EB", fontWeight: "600" },
// });


import React, { useState, useRef } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  Dimensions,
  ActivityIndicator,
} from "react-native";
import LinearGradient from "react-native-linear-gradient";
import QRCode from "react-native-qrcode-svg";

const { width } = Dimensions.get("window");

const steps = [
  { key: "kyc", title: "Tourist KYC" },
  { key: "trip", title: "Trip Details" },
  { key: "emergency", title: "Emergency Contact" },
];

const AuthorityNewTripScreen = () => {
  const [loading, setLoading] = useState(false);
  const [qrData, setQrData] = useState<any>(null);
  const flatListRef = useRef<FlatList>(null);
  const [currentStep, setCurrentStep] = useState(0);

  // Central form state
  const [formData, setFormData] = useState({
    tourist_id: "",
    kyc_id: "",
    full_name: "",
    nationality: "",
    start_date: "",
    end_date: "",
    itinerary: "",
    emergency_name: "",
    emergency_contacts: "",
    valid_to: "",
    public_address: "",
  });

  const handleSubmit = async () => {
    try {
      setLoading(true);

      const payload = {
        tourist_id: formData.tourist_id,
        kyc_id: formData.kyc_id,
        itinerary: formData.itinerary,
        emergency_contacts: formData.emergency_contacts,
        valid_to: formData.valid_to || new Date().toISOString(),
        public_address: formData.public_address || "",
      };

      const res = await fetch("http://192.168.1.7:8000/api/digital-id/issue", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error("Failed to issue Digital ID");

      const response = await res.json();
      setQrData(response);
    } catch (err) {
      console.error(err);
      // alert("Error issuing digital ID");
    } finally {
      setLoading(false);
    }
  };

  const nextStep = () => {
    if (currentStep < steps.length - 1) {
      flatListRef.current?.scrollToIndex({ index: currentStep + 1 });
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      flatListRef.current?.scrollToIndex({ index: currentStep - 1 });
      setCurrentStep(currentStep - 1);
    }
  };

  const renderStep = ({ item }: any) => {
    if (item.key === "kyc") {
      return (
        <View style={styles.step}>
          <Text style={styles.title}>{item.title}</Text>
          <TextInput
            style={styles.input}
            placeholder="Aadhaar Number"
            placeholderTextColor="#888"
            value={formData.kyc_id}
            onChangeText={(text) => setFormData({ ...formData, kyc_id: text })}
          />
          <TextInput
            style={styles.input}
            placeholder="Passport Number"
            placeholderTextColor="#888"
            value={formData.tourist_id}
            onChangeText={(text) => setFormData({ ...formData, tourist_id: text })}
          />
          <TextInput
            style={styles.input}
            placeholder="Full Name"
            placeholderTextColor="#888"
            value={formData.full_name}
            onChangeText={(text) => setFormData({ ...formData, full_name: text })}
          />
          <TextInput
            style={styles.input}
            placeholder="Nationality"
            placeholderTextColor="#888"
            value={formData.nationality}
            onChangeText={(text) => setFormData({ ...formData, nationality: text })}
          />
        </View>
      );
    }
    if (item.key === "trip") {
      return (
        <View style={styles.step}>
          <Text style={styles.title}>{item.title}</Text>
          <TextInput
            style={styles.input}
            placeholder="Start Date (YYYY-MM-DD)"
            placeholderTextColor="#888"
            value={formData.start_date}
            onChangeText={(text) => setFormData({ ...formData, start_date: text })}
          />
          <TextInput
            style={styles.input}
            placeholder="End Date (YYYY-MM-DD)"
            placeholderTextColor="#888"
            value={formData.end_date}
            onChangeText={(text) => setFormData({ ...formData, end_date: text })}
          />
          <TextInput
            style={styles.input}
            placeholder="Destination / Itinerary"
            placeholderTextColor="#888"
            value={formData.itinerary}
            onChangeText={(text) => setFormData({ ...formData, itinerary: text })}
          />
        </View>
      );
    }
    if (item.key === "emergency") {
      return (
        <View style={styles.step}>
          <Text style={styles.title}>{item.title}</Text>
          <TextInput
            style={styles.input}
            placeholder="Emergency Contact Name"
            placeholderTextColor="#888"
            value={formData.emergency_name}
            onChangeText={(text) => setFormData({ ...formData, emergency_name: text })}
          />
          <TextInput
            style={styles.input}
            placeholder="Emergency Contact Phone"
            placeholderTextColor="#888"
            value={formData.emergency_contacts}
            onChangeText={(text) =>
              setFormData({ ...formData, emergency_contacts: text })
            }
          />
        </View>
      );
    }
    return null;
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <LinearGradient colors={["#2563EB", "#3B82F6"]} style={styles.header}>
        <Text style={styles.headerTitle}>SafeTrip</Text>
        <Text style={styles.headerSubtitle}>Authority Dashboard</Text>
      </LinearGradient>

      {/* Progress Indicator */}
      <View style={styles.progressContainer}>
        <Text style={styles.progressText}>
          Step {currentStep + 1} of {steps.length}
        </Text>
        <View style={styles.dotsContainer}>
          {steps.map((_, index) => (
            <View
              key={index}
              style={[styles.dot, currentStep === index && styles.activeDot]}
            />
          ))}
        </View>
      </View>

      {/* Steps */}
      <FlatList
        ref={flatListRef}
        data={steps}
        renderItem={renderStep}
        keyExtractor={(item) => item.key}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        scrollEnabled={false}
      />

      {/* Navigation */}
      <View style={styles.nav}>
        {currentStep > 0 && (
          <TouchableOpacity style={styles.navBtn} onPress={prevStep}>
            <Text style={styles.navText}>Back</Text>
          </TouchableOpacity>
        )}
        {currentStep < steps.length - 1 && (
          <TouchableOpacity style={styles.navBtn} onPress={nextStep}>
            <Text style={styles.navText}>Next</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Submit + QR only on last step */}
      {currentStep === steps.length - 1 && (
        <View style={{ alignItems: "center", marginBottom: 30 }}>
          {qrData ? (
            <>
              <Text style={styles.title}>Your Digital ID QR</Text>
              <QRCode value={JSON.stringify(qrData)} size={250} />
            </>
          ) : loading ? (
            <ActivityIndicator size="large" color="#000" />
          ) : (
            <TouchableOpacity style={styles.button} onPress={handleSubmit}>
              <Text style={styles.buttonText}>Submit & Generate QR</Text>
            </TouchableOpacity>
          )}
        </View>
      )}
    </View>
  );
};

export default AuthorityNewTripScreen;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F9FAFB" },

  header: {
    paddingTop: 100,
    paddingBottom: 30,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    alignItems: "center",
  },
  headerTitle: { fontSize: 24, fontWeight: "700", color: "#fff" },
  headerSubtitle: { fontSize: 16, fontWeight: "400", color: "#E0F2FE" },

  progressContainer: { alignItems: "center", marginVertical: 15 },
  progressText: { fontSize: 14, color: "#1E293B", marginBottom: 8 },
  dotsContainer: { flexDirection: "row" },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: "#CBD5E1",
    marginHorizontal: 4,
  },
  activeDot: { backgroundColor: "#2563EB" },

  step: {
    width,
    padding: 20,
    justifyContent: "center",
  },
  title: {
    fontSize: 20,
    fontWeight: "600",
    marginBottom: 20,
    color: "#1E293B",
  },
  input: {
    borderWidth: 1,
    borderColor: "#CBD5E1",
    padding: 12,
    borderRadius: 10,
    marginBottom: 12,
    backgroundColor: "#fff",
  },
  button: {
    backgroundColor: "#2563EB",
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 20,
  },
  buttonText: { color: "#fff", fontWeight: "600" },

  nav: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 20,
  },
  navBtn: {
    backgroundColor: "#E0F2FE",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  navText: { color: "#2563EB", fontWeight: "600" },
});
