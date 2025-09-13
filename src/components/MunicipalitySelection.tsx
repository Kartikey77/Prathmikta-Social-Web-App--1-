import { useState } from "react";
import { useLanguage } from "./LanguageContext";
import { Button } from "./ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { MapPin, Search } from "lucide-react";
import { motion } from "motion/react";
import newLogo from "figma:asset/9940763ec6e94539b7990ea60669055c752ce3f7.png";

interface Municipality {
  id: string;
  name: string;
  state: string;
  district: string;
  population: string;
  area: string;
}

interface MunicipalitySelectionProps {
  onSelectMunicipality: (municipality: Municipality) => void;
}

const municipalities: Municipality[] = [
  {
    id: "ranchi",
    name: "Ranchi",
    state: "Jharkhand",
    district: "Ranchi",
    population: "11,26,741",
    area: "652.06 km²"
  },
  {
    id: "dhanbad",
    name: "Dhanbad",
    state: "Jharkhand", 
    district: "Dhanbad",
    population: "12,06,804",
    area: "204.8 km²"
  },
  {
    id: "jamshedpur",
    name: "Jamshedpur",
    state: "Jharkhand",
    district: "East Singhbhum",
    population: "13,38,779",
    area: "224 km²"
  },
  {
    id: "bokaro",
    name: "Bokaro Steel City",
    state: "Jharkhand",
    district: "Bokaro",
    population: "5,11,167",
    area: "183 km²"
  },
  {
    id: "deoghar",
    name: "Deoghar",
    state: "Jharkhand",
    district: "Deoghar", 
    population: "2,04,187",
    area: "54.8 km²"
  },
  {
    id: "hazaribagh",
    name: "Hazaribagh",
    state: "Jharkhand",
    district: "Hazaribagh",
    population: "1,53,596",
    area: "42.8 km²"
  }
];

export function MunicipalitySelection({ onSelectMunicipality }: MunicipalitySelectionProps) {
  const { t } = useLanguage();
  const [selectedState, setSelectedState] = useState<string>("");
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [selectedMunicipality, setSelectedMunicipality] = useState<Municipality | null>(null);

  const filteredMunicipalities = municipalities.filter(municipality => {
    const matchesState = !selectedState || municipality.state === selectedState;
    const matchesSearch = !searchTerm || 
      municipality.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      municipality.district.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesState && matchesSearch;
  });

  const handleConfirmSelection = () => {
    if (selectedMunicipality) {
      onSelectMunicipality(selectedMunicipality);
    }
  };

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Indian Flag Pattern Background */}
      <div className="fixed inset-0 opacity-5 pointer-events-none">
        <div className="h-1/3 bg-gradient-to-r from-orange-400 to-orange-500"></div>
        <div className="h-1/3 bg-white"></div>
        <div className="h-1/3 bg-gradient-to-r from-green-600 to-green-700"></div>
        <motion.div
          className="absolute inset-0 flex items-center justify-center"
          animate={{ rotate: 360 }}
          transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
        >
          <div className="w-24 h-24 border-2 border-blue-800/20 rounded-full flex items-center justify-center">
            <div className="w-4 h-4 bg-blue-800/20 rounded-full"></div>
          </div>
        </motion.div>
      </div>

      <div className="relative z-10 min-h-screen bg-gradient-to-br from-orange-50/80 via-white/90 to-green-50/80 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-8 max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-8"
          >
            <div className="flex items-center justify-center mb-4">
              <img 
                src={newLogo} 
                alt="Prathmikta Logo" 
                className="h-16 w-16 mr-3 object-contain" 
              />
              <h1 className="text-3xl font-bold bg-gradient-to-r from-orange-600 via-blue-800 to-green-600 bg-clip-text text-transparent">
                अपनी नगर निगम चुनें
              </h1>
            </div>
            <p className="text-muted-foreground">
              अपने स्थानीय नगर निगम को चुनकर नागरिक सेवाओं का लाभ उठाएं
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <Card className="bg-white/95 backdrop-blur-sm border-orange-200 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center text-orange-800">
                  <MapPin className="h-5 w-5 mr-2" />
                  स्थान खोजें
                </CardTitle>
                <CardDescription>
                  राज्य और शहर के नाम से खोजें
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>राज्य चुनें</Label>
                    <Select onValueChange={setSelectedState}>
                      <SelectTrigger className="bg-input-background border-orange-200">
                        <SelectValue placeholder="राज्य चुनें" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Jharkhand">Jharkhand (झारखंड)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>शहर खोजें</Label>
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        placeholder="शहर का नाम लिखें"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10 bg-input-background border-orange-200"
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <Label>उपलब्ध नगर निगम</Label>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-96 overflow-y-auto">
                    {filteredMunicipalities.map((municipality) => (
                      <motion.div
                        key={municipality.id}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <Card 
                          className={`cursor-pointer transition-all duration-200 ${
                            selectedMunicipality?.id === municipality.id
                              ? 'border-orange-500 bg-orange-50 shadow-md'
                              : 'border-gray-200 bg-white hover:border-orange-300 hover:shadow-sm'
                          }`}
                          onClick={() => setSelectedMunicipality(municipality)}
                        >
                          <CardContent className="p-4">
                            <h3 className="font-semibold text-gray-900">{municipality.name}</h3>
                            <p className="text-sm text-muted-foreground">
                              {municipality.district}, {municipality.state}
                            </p>
                            <div className="flex justify-between text-xs text-muted-foreground mt-2">
                              <span>जनसंख्या: {municipality.population}</span>
                              <span>क्षेत्रफल: {municipality.area}</span>
                            </div>
                          </CardContent>
                        </Card>
                      </motion.div>
                    ))}
                  </div>
                </div>

                {selectedMunicipality && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-4 bg-gradient-to-r from-orange-50 to-green-50 rounded-lg border border-orange-200"
                  >
                    <h4 className="font-semibold text-orange-800 mb-2">
                      चयनित नगर निगम
                    </h4>
                    <p className="text-gray-700">
                      <strong>{selectedMunicipality.name}</strong>, {selectedMunicipality.district}, {selectedMunicipality.state}
                    </p>
                    <div className="flex justify-between text-sm text-muted-foreground mt-1">
                      <span>जनसंख्या: {selectedMunicipality.population}</span>
                      <span>क्षेत्रफल: {selectedMunicipality.area}</span>
                    </div>
                  </motion.div>
                )}

                <div className="flex justify-center">
                  <Button
                    onClick={handleConfirmSelection}
                    disabled={!selectedMunicipality}
                    className="w-full md:w-auto px-8 py-2 bg-gradient-to-r from-orange-600 to-orange-700 hover:from-orange-700 hover:to-orange-800 text-white"
                  >
                    चयन की पुष्टि करें
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  );
}