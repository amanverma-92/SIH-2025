// // // // import React from 'react';
// // // // import {
// // // //   View,
// // // //   Text,
// // // //   StyleSheet,
// // // //   TouchableOpacity,
// // // //   ScrollView,
// // // //   Dimensions,
// // // // } from 'react-native';
// // // // import LinearGradient from 'react-native-linear-gradient';

// // // // const { width } = Dimensions.get('window');

// // // // interface TouristIDScreenProps {
// // // //   navigation?: any; // TODO: Replace with proper navigation type
// // // // }

// // // // const TouristIDScreen: React.FC<TouristIDScreenProps> = ({ navigation }) => {
// // // //   const handleBack = () => {
// // // //     navigation?.goBack();
// // // //   };

// // // //   // Mock data - in real app, this would come from props or state
// // // //   const touristData = {
// // // //     name: 'John Doe',
// // // //     touristID: 'TST-2024-7A8B-9C2D-1E3F-4G5H6I7J8K9L',
// // // //     tripDates: 'Dec 15, 2024 - Dec 25, 2024',
// // // //     emergencyContact: '+1 (555) 123-4567',
// // // //   };

// // // //   return (
// // // //     <LinearGradient
// // // //       colors={['#1E3A8A', '#0D9488']}
// // // //       style={styles.container}
// // // //       start={{ x: 0, y: 0 }}
// // // //       end={{ x: 1, y: 1 }}
// // // //     >
// // // //       <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
// // // //         {/* Header */}
// // // //         <View style={styles.header}>
// // // //           <TouchableOpacity style={styles.backButton} onPress={handleBack}>
// // // //             <Text style={styles.backButtonText}>← Back</Text>
// // // //           </TouchableOpacity>
// // // //           <Text style={styles.headerTitle}>Tourist ID</Text>
// // // //           <View style={styles.placeholder} />
// // // //         </View>

// // // //         {/* ID Card */}
// // // //         <View style={styles.idCardContainer}>
// // // //           <View style={styles.idCard}>
// // // //             {/* Card Header */}
// // // //             <View style={styles.cardHeader}>
// // // //               <Text style={styles.cardTitle}>SMART TOURIST SAFETY</Text>
// // // //               <Text style={styles.cardSubtitle}>Official Tourist Identification</Text>
// // // //             </View>

// // // //             {/* Tourist Photo Placeholder */}
// // // //             <View style={styles.photoContainer}>
// // // //               <View style={styles.photoPlaceholder}>
// // // //                 <Text style={styles.photoText}>📷</Text>
// // // //               </View>
// // // //             </View>

// // // //             {/* Tourist Information */}
// // // //             <View style={styles.infoContainer}>
// // // //               <View style={styles.infoRow}>
// // // //                 <Text style={styles.infoLabel}>Name:</Text>
// // // //                 <Text style={styles.infoValue}>{touristData.name}</Text>
// // // //               </View>

// // // //               <View style={styles.infoRow}>
// // // //                 <Text style={styles.infoLabel}>Tourist ID:</Text>
// // // //                 <Text style={styles.infoValue}>{touristData.touristID}</Text>
// // // //               </View>

// // // //               <View style={styles.infoRow}>
// // // //                 <Text style={styles.infoLabel}>Trip Dates:</Text>
// // // //                 <Text style={styles.infoValue}>{touristData.tripDates}</Text>
// // // //               </View>

// // // //               <View style={styles.infoRow}>
// // // //                 <Text style={styles.infoLabel}>Emergency Contact:</Text>
// // // //                 <Text style={styles.infoValue}>{touristData.emergencyContact}</Text>
// // // //               </View>
// // // //             </View>

// // // //             {/* QR Code Placeholder */}
// // // //             <View style={styles.qrContainer}>
// // // //               <View style={styles.qrPlaceholder}>
// // // //                 <Text style={styles.qrText}>QR CODE</Text>
// // // //                 <Text style={styles.qrSubtext}>Scan for verification</Text>
// // // //               </View>
// // // //             </View>

// // // //             {/* Card Footer */}
// // // //             <View style={styles.cardFooter}>
// // // //               <Text style={styles.footerText}>
// // // //                 Valid for the duration of your trip
// // // //               </Text>
// // // //             </View>
// // // //           </View>
// // // //         </View>
// // // //       </ScrollView>
// // // //     </LinearGradient>
// // // //   );
// // // // };

// // // // const styles = StyleSheet.create({
// // // //   container: {
// // // //     flex: 1,
// // // //   },
// // // //   scrollView: {
// // // //     flex: 1,
// // // //   },
// // // //   header: {
// // // //     flexDirection: 'row',
// // // //     justifyContent: 'space-between',
// // // //     alignItems: 'center',
// // // //     paddingHorizontal: 20,
// // // //     paddingTop: 60,
// // // //     paddingBottom: 20,
// // // //   },
// // // //   backButton: {
// // // //     backgroundColor: 'rgba(255, 255, 255, 0.2)',
// // // //     borderRadius: 8,
// // // //     paddingVertical: 8,
// // // //     paddingHorizontal: 12,
// // // //     borderWidth: 1,
// // // //     borderColor: 'rgba(255, 255, 255, 0.3)',
// // // //   },
// // // //   backButtonText: {
// // // //     color: '#FFFFFF',
// // // //     fontSize: 14,
// // // //     fontWeight: '600',
// // // //   },
// // // //   headerTitle: {
// // // //     fontSize: 20,
// // // //     fontWeight: 'bold',
// // // //     color: '#FFFFFF',
// // // //     textShadowColor: 'rgba(0, 0, 0, 0.3)',
// // // //     textShadowOffset: { width: 1, height: 1 },
// // // //     textShadowRadius: 3,
// // // //   },
// // // //   placeholder: {
// // // //     width: 60, // Same width as back button for centering
// // // //   },
// // // //   idCardContainer: {
// // // //     paddingHorizontal: 20,
// // // //     paddingBottom: 40,
// // // //   },
// // // //   idCard: {
// // // //     backgroundColor: '#FFFFFF',
// // // //     borderRadius: 20,
// // // //     padding: 24,
// // // //     shadowColor: '#000',
// // // //     shadowOffset: {
// // // //       width: 0,
// // // //       height: 8,
// // // //     },
// // // //     shadowOpacity: 0.3,
// // // //     shadowRadius: 8,
// // // //     elevation: 12,
// // // //   },
// // // //   cardHeader: {
// // // //     alignItems: 'center',
// // // //     marginBottom: 20,
// // // //     borderBottomWidth: 2,
// // // //     borderBottomColor: '#0D9488',
// // // //     paddingBottom: 16,
// // // //   },
// // // //   cardTitle: {
// // // //     fontSize: 18,
// // // //     fontWeight: 'bold',
// // // //     color: '#1E3A8A',
// // // //     marginBottom: 4,
// // // //   },
// // // //   cardSubtitle: {
// // // //     fontSize: 12,
// // // //     color: '#6B7280',
// // // //     fontWeight: '500',
// // // //   },
// // // //   photoContainer: {
// // // //     alignItems: 'center',
// // // //     marginBottom: 20,
// // // //   },
// // // //   photoPlaceholder: {
// // // //     width: 80,
// // // //     height: 80,
// // // //     borderRadius: 40,
// // // //     backgroundColor: '#F3F4F6',
// // // //     justifyContent: 'center',
// // // //     alignItems: 'center',
// // // //     borderWidth: 2,
// // // //     borderColor: '#E5E7EB',
// // // //   },
// // // //   photoText: {
// // // //     fontSize: 32,
// // // //   },
// // // //   infoContainer: {
// // // //     marginBottom: 20,
// // // //   },
// // // //   infoRow: {
// // // //     flexDirection: 'row',
// // // //     marginBottom: 12,
// // // //     alignItems: 'flex-start',
// // // //   },
// // // //   infoLabel: {
// // // //     fontSize: 14,
// // // //     fontWeight: '600',
// // // //     color: '#374151',
// // // //     width: 120,
// // // //     flexShrink: 0,
// // // //   },
// // // //   infoValue: {
// // // //     fontSize: 14,
// // // //     color: '#1F2937',
// // // //     flex: 1,
// // // //     flexWrap: 'wrap',
// // // //   },
// // // //   qrContainer: {
// // // //     alignItems: 'center',
// // // //     marginBottom: 20,
// // // //     paddingVertical: 20,
// // // //     borderTopWidth: 1,
// // // //     borderTopColor: '#E5E7EB',
// // // //   },
// // // //   qrPlaceholder: {
// // // //     width: 120,
// // // //     height: 120,
// // // //     backgroundColor: '#F3F4F6',
// // // //     borderRadius: 12,
// // // //     justifyContent: 'center',
// // // //     alignItems: 'center',
// // // //     borderWidth: 2,
// // // //     borderColor: '#E5E7EB',
// // // //     borderStyle: 'dashed',
// // // //   },
// // // //   qrText: {
// // // //     fontSize: 12,
// // // //     fontWeight: 'bold',
// // // //     color: '#6B7280',
// // // //     marginBottom: 4,
// // // //   },
// // // //   qrSubtext: {
// // // //     fontSize: 10,
// // // //     color: '#9CA3AF',
// // // //   },
// // // //   cardFooter: {
// // // //     alignItems: 'center',
// // // //     borderTopWidth: 1,
// // // //     borderTopColor: '#E5E7EB',
// // // //     paddingTop: 16,
// // // //   },
// // // //   footerText: {
// // // //     fontSize: 12,
// // // //     color: '#6B7280',
// // // //     fontStyle: 'italic',
// // // //   },
// // // // });

// // // // export default TouristIDScreen;



// // // import React from 'react';
// // // import {
// // //   View,
// // //   Text,
// // //   StyleSheet,
// // //   TouchableOpacity,
// // //   ScrollView,
// // //   Dimensions,
// // // } from 'react-native';
// // // import LinearGradient from 'react-native-linear-gradient';
// // // import { colors } from '../Components/theme';

// // // const { width } = Dimensions.get('window');

// // // interface TouristIDScreenProps {
// // //   navigation?: any; // TODO: Replace with proper navigation type
// // // }

// // // const TouristIDScreen: React.FC<TouristIDScreenProps> = ({ navigation }) => {
// // //   const handleBack = () => {
// // //     navigation?.goBack();
// // //   };

// // //   const touristData = {
// // //     name: 'John Doe',
// // //     touristID: 'TST-2024-7A8B-9C2D-1E3F-4G5H6I7J8K9L',
// // //     tripDates: 'Dec 15, 2024 - Dec 25, 2024',
// // //     emergencyContact: '+1 (555) 123-4567',
// // //   };

// // //   return (
// // //     <LinearGradient
// // //       colors={[colors.primary,colors.primary]}
// // //       style={styles.container}
// // //       start={{ x: 0, y: 0 }}
// // //       end={{ x: 1, y: 1 }}
// // //     >
// // //       <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
// // //         {/* Header */}
// // //         <View style={styles.header}>
// // //           <TouchableOpacity style={styles.backButton} onPress={handleBack}>
// // //             <Text style={styles.backButtonText}>← Back</Text>
// // //           </TouchableOpacity>
// // //           <TouchableOpacity onPress={()=>{navigation.navigate('AuthorityScreen')}}>
// // //             <Text style={styles.backButtonText}>New Trip</Text>
// // //           </TouchableOpacity>
// // //           <Text style={styles.headerTitle}>Tourist ID</Text>
// // //           <View style={styles.placeholder} />
// // //         </View>

// // //         {/* ID Card */}
// // //         <View style={styles.idCardContainer}>
// // //           <View style={styles.idCard}>
// // //             {/* Card Header */}
// // //             <View style={styles.cardHeader}>
// // //               <Text style={styles.cardTitle}>SMART TOURIST SAFETY</Text>
// // //               <Text style={styles.cardSubtitle}>
// // //                 Official Tourist Identification
// // //               </Text>
// // //             </View>

// // //             {/* Tourist Photo */}
// // //             <View style={styles.photoContainer}>
// // //               <View style={styles.photoPlaceholder}>
// // //                 <Text style={styles.photoText}>📷</Text>
// // //               </View>
// // //             </View>

// // //             {/* Tourist Information */}
// // //             <View style={styles.infoContainer}>
// // //               <View style={styles.infoRow}>
// // //                 <Text style={styles.infoLabel}>Name:</Text>
// // //                 <Text style={styles.infoValue}>{touristData.name}</Text>
// // //               </View>
// // //               <View style={styles.infoRow}>
// // //                 <Text style={styles.infoLabel}>Tourist ID:</Text>
// // //                 <Text style={styles.infoValue}>{touristData.touristID}</Text>
// // //               </View>
// // //               <View style={styles.infoRow}>
// // //                 <Text style={styles.infoLabel}>Trip Dates:</Text>
// // //                 <Text style={styles.infoValue}>{touristData.tripDates}</Text>
// // //               </View>
// // //               <View style={styles.infoRow}>
// // //                 <Text style={styles.infoLabel}>Emergency Contact:</Text>
// // //                 <Text style={styles.infoValue}>{touristData.emergencyContact}</Text>
// // //               </View>
// // //             </View>

// // //             {/* QR Code Placeholder */}
// // //             <View style={styles.qrContainer}>
// // //               <View style={styles.qrPlaceholder}>
// // //                 <Text style={styles.qrText}>QR CODE</Text>
// // //                 <Text style={styles.qrSubtext}>Scan for verification</Text>
// // //               </View>
// // //             </View>

// // //             {/* Card Footer */}
// // //             <View style={styles.cardFooter}>
// // //               <Text style={styles.footerText}>
// // //                 Valid for the duration of your trip
// // //               </Text>
// // //             </View>
// // //           </View>
// // //         </View>
// // //       </ScrollView>
// // //     </LinearGradient>
// // //   );
// // // };

// // // const styles = StyleSheet.create({
// // //   container: { flex: 1 },
// // //   scrollView: { flex: 1 },
// // //   header: {
// // //     flexDirection: 'row',
// // //     justifyContent: 'space-between',
// // //     alignItems: 'center',
// // //     paddingHorizontal: 20,
// // //     paddingTop: 60,
// // //     paddingBottom: 20,
// // //   },
// // //   backButton: {
// // //     backgroundColor: 'rgba(255, 255, 255, 0.15)',
// // //     borderRadius: 10,
// // //     paddingVertical: 8,
// // //     paddingHorizontal: 12,
// // //     borderWidth: 1,
// // //     borderColor: 'rgba(255, 255, 255, 0.3)',
// // //   },
// // //   backButtonText: { color: '#FFFFFF', fontSize: 14, fontWeight: '600' },
// // //   headerTitle: {
// // //     fontSize: 20,
// // //     fontWeight: 'bold',
// // //     color: '#FFFFFF',
// // //     textShadowColor: 'rgba(0,0,0,0.3)',
// // //     textShadowOffset: { width: 1, height: 1 },
// // //     textShadowRadius: 3,
// // //   },
// // //   placeholder: { width: 60 },

// // //   idCardContainer: { paddingHorizontal: 20, paddingBottom: 40 },
// // //   idCard: {
// // //     backgroundColor: '#FFFFFF',
// // //     borderRadius: 20,
// // //     padding: 24,
// // //     shadowColor: '#000',
// // //     shadowOffset: { width: 0, height: 8 },
// // //     shadowOpacity: 0.2,
// // //     shadowRadius: 6,
// // //     elevation: 10,
// // //     borderWidth: 1,
// // //     borderColor: '#E0F2F1', // subtle teal border
// // //   },

// // //   cardHeader: {
// // //     alignItems: 'center',
// // //     marginBottom: 20,
// // //     borderBottomWidth: 2,
// // //     borderBottomColor: '#0D9488',
// // //     paddingBottom: 16,
// // //   },
// // //   cardTitle: { fontSize: 18, fontWeight: 'bold', color: '#1E3A8A', marginBottom: 4 },
// // //   cardSubtitle: { fontSize: 12, color: '#0D9488', fontWeight: '600' },

// // //   photoContainer: { alignItems: 'center', marginBottom: 20 },
// // //   photoPlaceholder: {
// // //     width: 90,
// // //     height: 90,
// // //     borderRadius: 45,
// // //     backgroundColor: '#E0F2F1', // light teal bg
// // //     justifyContent: 'center',
// // //     alignItems: 'center',
// // //     borderWidth: 2,
// // //     borderColor: '#0D9488',
// // //   },
// // //   photoText: { fontSize: 32 },

// // //   infoContainer: { marginBottom: 20 },
// // //   infoRow: { flexDirection: 'row', marginBottom: 12, alignItems: 'flex-start' },
// // //   infoLabel: {
// // //     fontSize: 14,
// // //     fontWeight: '600',
// // //     color: '#111827',
// // //     width: 120,
// // //     flexShrink: 0,
// // //   },
// // //   infoValue: { fontSize: 14, color: '#1F2937', flex: 1, flexWrap: 'wrap' },

// // //   qrContainer: {
// // //     alignItems: 'center',
// // //     marginBottom: 20,
// // //     paddingVertical: 20,
// // //     borderTopWidth: 1,
// // //     borderTopColor: '#E0E7FF',
// // //   },
// // //   qrPlaceholder: {
// // //     width: 120,
// // //     height: 120,
// // //     backgroundColor: '#F0F9FF', // light blue bg
// // //     borderRadius: 12,
// // //     justifyContent: 'center',
// // //     alignItems: 'center',
// // //     borderWidth: 2,
// // //     borderColor: '#3B82F6', // strong blue
// // //     borderStyle: 'dashed',
// // //   },
// // //   qrText: { fontSize: 12, fontWeight: 'bold', color: '#1E3A8A', marginBottom: 4 },
// // //   qrSubtext: { fontSize: 10, color: '#6B7280' },

// // //   cardFooter: {
// // //     alignItems: 'center',
// // //     borderTopWidth: 1,
// // //     borderTopColor: '#E0E7FF',
// // //     paddingTop: 16,
// // //   },
// // //   footerText: { fontSize: 12, color: '#0D9488', fontStyle: 'italic' },
// // // });

// // // export default TouristIDScreen;

// // import React, { useState } from 'react';
// // import {
// //   View,
// //   Text,
// //   StyleSheet,
// //   TouchableOpacity,
// //   ScrollView,
// //   Dimensions,
// // } from 'react-native';
// // import LinearGradient from 'react-native-linear-gradient';
// // import { colors } from '../Components/theme';
// // import QRCodeScanner from 'react-native-qrcode-scanner';
// // import { RNCamera } from 'react-native-camera';
// // import { Platform, PermissionsAndroid, Alert } from "react-native";
// // import { check, request, PERMISSIONS, RESULTS } from "react-native-permissions";

// // const { width } = Dimensions.get('window');

// // interface TouristIDScreenProps {
// //   navigation?: any; // TODO: Replace with proper navigation type
// // }

// // const requestCameraPermission = async () => {
// //   if (Platform.OS === "android") {
// //     const granted = await PermissionsAndroid.request(
// //       PermissionsAndroid.PERMISSIONS.CAMERA,
// //       {
// //         title: "Camera Permission",
// //         message: "We need access to your camera to scan QR codes.",
// //         buttonNeutral: "Ask Me Later",
// //         buttonNegative: "Cancel",
// //         buttonPositive: "OK",
// //       }
// //     );
// //     if (granted !== PermissionsAndroid.RESULTS.GRANTED) {
// //       Alert.alert("Permission Denied", "Camera access is required to scan QR codes.");
// //     }
// //   } else {
// //     const result = await request(PERMISSIONS.IOS.CAMERA);
// //     if (result !== RESULTS.GRANTED) {
// //       Alert.alert("Permission Denied", "Camera access is required to scan QR codes.");
// //     }
// //   }
// // };

// // const TouristIDScreen: React.FC<TouristIDScreenProps> = ({ navigation }) => {
// //   const [touristData, setTouristData] = useState<any | null>(null);
// //   const [scanning, setScanning] = useState(false);

// //   const handleBack = () => {
// //     navigation?.goBack();
// //   };

// //   const handleScan = async (e: any) => {
// //     const granted = await requestCameraPermission();

// //     if(granted){
// //     try {
// //       const qrUrl = e.data; // QR code contains backend URL or encoded JSON
// //       let data;

// //       if (qrUrl.startsWith('http')) {
// //         // If QR contains a URL -> fetch details
// //         const res = await fetch(qrUrl);
// //         data = await res.json();
// //       } else {
// //         // If QR contains raw JSON
// //         data = JSON.parse(qrUrl);
// //       }

// //       // Extract only tourist-relevant fields
// //       const cleanedData = {
// //         touristID: data.tourist_id,
// //         kycID: data.kyc_id,
// //         itinerary: data.itinerary,
// //         emergencyContact: data.emergency_contacts,
// //         validFrom: data.valid_from,
// //         validTo: data.valid_to,
// //         status: data.status,
// //       };

// //       setTouristData(cleanedData);
// //       setScanning(false);
// //     } catch (err) {
// //       console.error('QR Scan Error:', err);
// //       setScanning(false);
// //     }
// //   }
// //   };

// //   return (
// //     <LinearGradient
// //       colors={[colors.primary, colors.primary]}
// //       style={styles.container}
// //       start={{ x: 0, y: 0 }}
// //       end={{ x: 1, y: 1 }}
// //     >
// //       {scanning ? (
// //         <QRCodeScanner
// //           onRead={handleScan}
// //           flashMode={RNCamera.Constants.FlashMode.off}
// //           topContent={
// //             <Text style={{ color: '#fff', fontSize: 16, marginBottom: 20 }}>
// //               Scan the Tourist QR Code
// //             </Text>
// //           }
// //           bottomContent={
// //             <TouchableOpacity
// //               style={styles.backButton}
// //               onPress={() => setScanning(false)}
// //             >
// //               <Text style={styles.backButtonText}>Cancel</Text>
// //             </TouchableOpacity>
// //           }
// //         />
// //       ) : (
// //         <ScrollView
// //           style={styles.scrollView}
// //           showsVerticalScrollIndicator={false}
// //         >
// //           {/* Header */}
// //           <View style={styles.header}>
// //             <TouchableOpacity style={styles.backButton} onPress={handleBack}>
// //               <Text style={styles.backButtonText}>← Back</Text>
// //             </TouchableOpacity>
// //             <TouchableOpacity
// //               onPress={() => navigation?.navigate('AuthorityScreen')}
// //             >
// //               <Text style={styles.backButtonText}>New Trip</Text>
// //             </TouchableOpacity>
// //             <Text style={styles.headerTitle}>Tourist ID</Text>
// //             <TouchableOpacity
// //               style={styles.backButton}
// //               onPress={() => setScanning(true)}
// //             >
// //               <Text style={styles.backButtonText}>Scan QR</Text>
// //             </TouchableOpacity>
// //           </View>

// //           {/* ID Card */}
// //           {touristData ? (
// //             <View style={styles.idCardContainer}>
// //               <View style={styles.idCard}>
// //                 <View style={styles.cardHeader}>
// //                   <Text style={styles.cardTitle}>SMART TOURIST SAFETY</Text>
// //                   <Text style={styles.cardSubtitle}>
// //                     Official Tourist Identification
// //                   </Text>
// //                 </View>

// //                 <View style={styles.infoContainer}>
// //                   <View style={styles.infoRow}>
// //                     <Text style={styles.infoLabel}>Tourist ID:</Text>
// //                     <Text style={styles.infoValue}>
// //                       {touristData.touristID}
// //                     </Text>
// //                   </View>
// //                   <View style={styles.infoRow}>
// //                     <Text style={styles.infoLabel}>KYC ID:</Text>
// //                     <Text style={styles.infoValue}>{touristData.kycID}</Text>
// //                   </View>
// //                   <View style={styles.infoRow}>
// //                     <Text style={styles.infoLabel}>Itinerary:</Text>
// //                     <Text style={styles.infoValue}>{touristData.itinerary}</Text>
// //                   </View>
// //                   <View style={styles.infoRow}>
// //                     <Text style={styles.infoLabel}>Emergency Contact:</Text>
// //                     <Text style={styles.infoValue}>
// //                       {touristData.emergencyContact}
// //                     </Text>
// //                   </View>
// //                   <View style={styles.infoRow}>
// //                     <Text style={styles.infoLabel}>Valid From:</Text>
// //                     <Text style={styles.infoValue}>
// //                       {new Date(touristData.validFrom).toLocaleString()}
// //                     </Text>
// //                   </View>
// //                   <View style={styles.infoRow}>
// //                     <Text style={styles.infoLabel}>Valid To:</Text>
// //                     <Text style={styles.infoValue}>
// //                       {new Date(touristData.validTo).toLocaleString()}
// //                     </Text>
// //                   </View>
// //                   <View style={styles.infoRow}>
// //                     <Text style={styles.infoLabel}>Status:</Text>
// //                     <Text style={styles.infoValue}>
// //                       {touristData.status.toUpperCase()}
// //                     </Text>
// //                   </View>
// //                 </View>

// //                 <View style={styles.cardFooter}>
// //                   <Text style={styles.footerText}>
// //                     Valid for the duration of your trip
// //                   </Text>
// //                 </View>
// //               </View>
// //             </View>
// //           ) : (
// //             <Text
// //               style={{
// //                 textAlign: 'center',
// //                 color: '#fff',
// //                 marginTop: 50,
// //                 fontSize: 16,
// //               }}
// //             >
// //               No Tourist Data Loaded. Please Scan QR.
// //             </Text>
// //           )}
// //         </ScrollView>
// //       )}
// //     </LinearGradient>
// //   );
// // };

// // const styles = StyleSheet.create({
// //   container: { flex: 1 },
// //   scrollView: { flex: 1 },
// //   header: {
// //     flexDirection: 'row',
// //     justifyContent: 'space-between',
// //     alignItems: 'center',
// //     paddingHorizontal: 12,
// //     paddingTop: 60,
// //     paddingBottom: 20,
// //   },
// //   backButton: {
// //     backgroundColor: 'rgba(255, 255, 255, 0.15)',
// //     borderRadius: 10,
// //     paddingVertical: 8,
// //     paddingHorizontal: 12,
// //     borderWidth: 1,
// //     borderColor: 'rgba(255, 255, 255, 0.3)',
// //   },
// //   backButtonText: { color: '#FFFFFF', fontSize: 12, fontWeight: '600' },
// //   headerTitle: {
// //     fontSize: 20,
// //     fontWeight: 'bold',
// //     color: '#FFFFFF',
// //   },
// //   idCardContainer: { paddingHorizontal: 20, paddingBottom: 40 },
// //   idCard: {
// //     backgroundColor: '#FFFFFF',
// //     borderRadius: 20,
// //     padding: 24,
// //     shadowColor: '#000',
// //     shadowOffset: { width: 0, height: 8 },
// //     shadowOpacity: 0.2,
// //     shadowRadius: 6,
// //     elevation: 10,
// //     borderWidth: 1,
// //     borderColor: '#E0F2F1',
// //   },
// //   cardHeader: {
// //     alignItems: 'center',
// //     marginBottom: 20,
// //     borderBottomWidth: 2,
// //     borderBottomColor: '#0D9488',
// //     paddingBottom: 16,
// //   },
// //   cardTitle: { fontSize: 18, fontWeight: 'bold', color: '#1E3A8A' },
// //   cardSubtitle: { fontSize: 12, color: '#0D9488', fontWeight: '600' },
// //   infoContainer: { marginBottom: 20, marginTop: 10 },
// //   infoRow: { flexDirection: 'row', marginBottom: 12 },
// //   infoLabel: {
// //     fontSize: 14,
// //     fontWeight: '600',
// //     color: '#111827',
// //     width: 120,
// //   },
// //   infoValue: { fontSize: 14, color: '#1F2937', flex: 1, flexWrap: 'wrap' },
// //   cardFooter: {
// //     alignItems: 'center',
// //     borderTopWidth: 1,
// //     borderTopColor: '#E0E7FF',
// //     paddingTop: 16,
// //   },
// //   footerText: { fontSize: 12, color: '#0D9488', fontStyle: 'italic' },
// // });

// // export default TouristIDScreen;




