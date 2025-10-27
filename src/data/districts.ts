export interface District {
  id: string;
  name: string;
  state: string;
  nameHi?: string;
  stateHi?: string;
}

export interface StateDistricts {
  [state: string]: District[];
}

export const DISTRICTS: District[] = [
  // Andhra Pradesh
  { id: "1", name: "Anantapur", state: "Andhra Pradesh", nameHi: "अनंतपुर", stateHi: "आंध्र प्रदेश" },
  { id: "2", name: "Chittoor", state: "Andhra Pradesh", nameHi: "चित्तूर", stateHi: "आंध्र प्रदेश" },
  { id: "3", name: "East Godavari", state: "Andhra Pradesh", nameHi: "पूर्वी गोदावरी", stateHi: "आंध्र प्रदेश" },
  { id: "4", name: "Guntur", state: "Andhra Pradesh", nameHi: "गुंटूर", stateHi: "आंध्र प्रदेश" },
  { id: "5", name: "Krishna", state: "Andhra Pradesh", nameHi: "कृष्णा", stateHi: "आंध्र प्रदेश" },
  
  // Karnataka
  { id: "6", name: "Bengaluru Urban", state: "Karnataka", nameHi: "बेंगलुरु शहरी", stateHi: "कर्नाटक" },
  { id: "7", name: "Mysuru", state: "Karnataka", nameHi: "मैसूरु", stateHi: "कर्नाटक" },
  { id: "8", name: "Mangaluru", state: "Karnataka", nameHi: "मंगलुरु", stateHi: "कर्नाटक" },
  
  // Kerala
  { id: "9", name: "Thiruvananthapuram", state: "Kerala", nameHi: "तिरुवनंतपुरम", stateHi: "केरल" },
  { id: "10", name: "Kochi", state: "Kerala", nameHi: "कोच्चि", stateHi: "केरल" },
  { id: "11", name: "Kozhikode", state: "Kerala", nameHi: "कोझीकोड", stateHi: "केरल" },
  
  // Tamil Nadu
  { id: "12", name: "Chennai", state: "Tamil Nadu", nameHi: "चेन्नई", stateHi: "तमिलनाडु" },
  { id: "13", name: "Coimbatore", state: "Tamil Nadu", nameHi: "कोयंबटूर", stateHi: "तमिलनाडु" },
  { id: "14", name: "Madurai", state: "Tamil Nadu", nameHi: "मदुरै", stateHi: "तमिलनाडु" },
  
  // Maharashtra
  { id: "15", name: "Mumbai City", state: "Maharashtra", nameHi: "मुंबई शहर", stateHi: "महाराष्ट्र" },
  { id: "16", name: "Pune", state: "Maharashtra", nameHi: "पुणे", stateHi: "महाराष्ट्र" },
  { id: "17", name: "Nagpur", state: "Maharashtra", nameHi: "नागपुर", stateHi: "महाराष्ट्र" },
  
  // Gujarat
  { id: "18", name: "Ahmedabad", state: "Gujarat", nameHi: "अहमदाबाद", stateHi: "गुजरात" },
  { id: "19", name: "Surat", state: "Gujarat", nameHi: "सूरत", stateHi: "गुजरात" },
  { id: "20", name: "Vadodara", state: "Gujarat", nameHi: "वडोदरा", stateHi: "गुजरात" },
  
  // Rajasthan
  { id: "21", name: "Jaipur", state: "Rajasthan", nameHi: "जयपुर", stateHi: "राजस्थान" },
  { id: "22", name: "Jodhpur", state: "Rajasthan", nameHi: "जोधपुर", stateHi: "राजस्थान" },
  { id: "23", name: "Udaipur", state: "Rajasthan", nameHi: "उदयपुर", stateHi: "राजस्थान" },
  
  // Uttar Pradesh
  { id: "24", name: "Lucknow", state: "Uttar Pradesh", nameHi: "लखनऊ", stateHi: "उत्तर प्रदेश" },
  { id: "25", name: "Kanpur", state: "Uttar Pradesh", nameHi: "कानपुर", stateHi: "उत्तर प्रदेश" },
  { id: "26", name: "Varanasi", state: "Uttar Pradesh", nameHi: "वाराणसी", stateHi: "उत्तर प्रदेश" },
  
  // Bihar
  { id: "27", name: "Patna", state: "Bihar", nameHi: "पटना", stateHi: "बिहार" },
  { id: "28", name: "Gaya", state: "Bihar", nameHi: "गया", stateHi: "बिहार" },
  { id: "29", name: "Muzaffarpur", state: "Bihar", nameHi: "मुजफ्फरपुर", stateHi: "बिहार" },
  
  // West Bengal
  { id: "30", name: "Kolkata", state: "West Bengal", nameHi: "कोलकाता", stateHi: "पश्चिम बंगाल" },
  { id: "31", name: "Howrah", state: "West Bengal", nameHi: "हावड़ा", stateHi: "पश्चिम बंगाल" },
  { id: "32", name: "Siliguri", state: "West Bengal", nameHi: "सिलीगुड़ी", stateHi: "पश्चिम बंगाल" }
];

// Helper function to group districts by state
export const getDistrictsByState = (): StateDistricts => {
  const stateDistricts: StateDistricts = {};
  
  DISTRICTS.forEach(district => {
    if (!stateDistricts[district.state]) {
      stateDistricts[district.state] = [];
    }
    stateDistricts[district.state].push(district);
  });
  
  // Sort states alphabetically
  return Object.keys(stateDistricts)
    .sort()
    .reduce((sorted: StateDistricts, state) => {
      sorted[state] = stateDistricts[state].sort((a, b) => a.name.localeCompare(b.name));
      return sorted;
    }, {});
};

// Helper function to search districts
export const searchDistricts = (query: string): District[] => {
  const searchTerm = query.toLowerCase();
  return DISTRICTS.filter(district => 
    district.name.toLowerCase().includes(searchTerm) ||
    district.state.toLowerCase().includes(searchTerm) ||
    district.nameHi?.toLowerCase().includes(searchTerm) ||
    district.stateHi?.toLowerCase().includes(searchTerm)
  );
};