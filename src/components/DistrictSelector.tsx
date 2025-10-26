'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckIcon, MapPinIcon } from '@heroicons/react/24/outline';
import { Combobox } from '@headlessui/react';

interface District {
  id: string;
  name: string;
  state: string;
  nameHi?: string;
  stateHi?: string;
}

interface DistrictSelectorProps {
  locale: 'en' | 'hi';
  onDistrictSelect: (district: District | null) => void;
}

const content = {
  en: {
    title: 'Select Your District',
    subtitle: 'Choose your district to see MGNREGA performance',
    searchPlaceholder: 'Type your district name...',
    stateLabel: 'State',
    districtLabel: 'District',
    detectLocation: 'Detect my location',
    noResults: 'No districts found',
    detecting: 'Detecting your location...',
  },
  hi: {
    title: 'अपना जिला चुनें',
    subtitle: 'मनरेगा प्रदर्शन देखने के लिए अपना जिला चुनें',
    searchPlaceholder: 'अपने जिले का नाम टाइप करें...',
    stateLabel: 'राज्य',
    districtLabel: 'जिला',
    detectLocation: 'मेरा स्थान पता करें',
    noResults: 'कोई जिला नहीं मिला',
    detecting: 'आपका स्थान पता लगा रहे हैं...',
  },
};

// Sample data - replace with actual data from API
const sampleDistricts: District[] = [
  { id: '1', name: 'Bangalore Rural', nameHi: 'बैंगलोर रूरल', state: 'Karnataka', stateHi: 'कर्नाटक' },
  { id: '2', name: 'Mysore', nameHi: 'मैसूर', state: 'Karnataka', stateHi: 'कर्नाटक' },
  { id: '3', name: 'Varanasi', nameHi: 'वाराणसी', state: 'Uttar Pradesh', stateHi: 'उत्तर प्रदेश' },
  { id: '4', name: 'Patna', nameHi: 'पटना', state: 'Bihar', stateHi: 'बिहार' },
  { id: '5', name: 'Jaipur', nameHi: 'जयपुर', state: 'Rajasthan', stateHi: 'राजस्थान' },
  { id: '6', name: 'Pune', nameHi: 'पुणे', state: 'Maharashtra', stateHi: 'महाराष्ट्र' },
  { id: '7', name: 'Ahmedabad', nameHi: 'अहमदाबाद', state: 'Gujarat', stateHi: 'गुजरात' },
  { id: '8', name: 'Chennai', nameHi: 'चेन्नई', state: 'Tamil Nadu', stateHi: 'तमिलनाडु' },
  { id: '9', name: 'Hyderabad', nameHi: 'हैदराबाद', state: 'Telangana', stateHi: 'तेलंगाना' },
  { id: '10', name: 'Bhopal', nameHi: 'भोपाल', state: 'Madhya Pradesh', stateHi: 'मध्य प्रदेश' }
];

export default function DistrictSelector({ locale, onDistrictSelect }: DistrictSelectorProps) {
  const [query, setQuery] = useState('');
  const [selectedDistrict, setSelectedDistrict] = useState<District | null>(null);
  const [detecting, setDetecting] = useState(false);
  const text = content[locale];

  const filteredDistricts = query === ''
    ? sampleDistricts
    : sampleDistricts.filter((district) => {
        const searchName = locale === 'en' ? district.name : district.nameHi || district.name;
        const searchState = locale === 'en' ? district.state : district.stateHi || district.state;
        return (
          searchName.toLowerCase().includes(query.toLowerCase()) ||
          searchState.toLowerCase().includes(query.toLowerCase())
        );
      });

  const handleLocationDetection = () => {
    setDetecting(true);
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          try {
            // Here you would make an API call to get district based on coordinates
            // For now, we'll simulate it with a timeout
            await new Promise(resolve => setTimeout(resolve, 1500));
            const mockDistrict = sampleDistricts[0];
            setSelectedDistrict(mockDistrict);
            onDistrictSelect(mockDistrict);
          } catch (error) {
            console.error('Error detecting location:', error);
            alert(locale === 'hi' ? 'स्थान का पता लगाने में त्रुटि। कृपया मैन्युअल रूप से अपना जिला चुनें।' : 'Error detecting location. Please select your district manually.');
          } finally {
            setDetecting(false);
          }
        },
        (error) => {
          console.error('Geolocation error:', error.message || 'Permission denied');
          alert(locale === 'hi' ? 'स्थान तक पहुंच की अनुमति नहीं है। कृपया मैन्युअल रूप से अपना जिला चुनें।' : 'Location access not permitted. Please select your district manually.');
          setDetecting(false);
        },
        {
          enableHighAccuracy: true,
          timeout: 5000,
          maximumAge: 0
        }
      );
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-2xl mx-auto p-6 bg-white rounded-xl shadow-lg"
    >
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">{text.title}</h2>
        <p className="text-gray-600">{text.subtitle}</p>
      </div>

      <div className="relative mt-4">
        <Combobox value={selectedDistrict} onChange={(district: District | null) => {
          setSelectedDistrict(district);
          onDistrictSelect(district);
        }}>
          <div className="relative">
            <Combobox.Input
              className="w-full rounded-lg border-gray-300 py-3 pl-4 pr-10 text-gray-900 shadow-sm focus:border-primary-500 focus:ring-primary-500"
              placeholder={text.searchPlaceholder}
              onChange={(event: React.ChangeEvent<HTMLInputElement>) => setQuery(event.target.value)}
              displayValue={(district: District | null) => 
                locale === 'en' 
                  ? `${district?.name || ''}${district ? `, ${district.state}` : ''}` 
                  : `${district?.nameHi || district?.name || ''}${district ? `, ${district.stateHi || district.state}` : ''}`
              }
            />
            <Combobox.Button className="absolute inset-y-0 right-0 flex items-center pr-2">
              <MapPinIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
            </Combobox.Button>
          </div>

          <AnimatePresence>
            <Combobox.Options className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
              {filteredDistricts.length === 0 && query !== '' ? (
                <div className="relative cursor-default select-none px-4 py-2 text-gray-700">
                  {text.noResults}
                </div>
              ) : (
                filteredDistricts.map((district) => (
                  <Combobox.Option
                    key={district.id}
                    value={district}
                    className={({ active }: { active: boolean }) =>
                      `relative cursor-default select-none py-2 pl-10 pr-4 ${
                        active ? 'bg-primary-100 text-primary-900' : 'text-gray-900'
                      }`
                    }
                  >
                    {({ selected, active }: { selected: boolean; active: boolean }) => (
                      <>
                        <span className={`block truncate ${selected ? 'font-medium' : 'font-normal'}`}>
                          {locale === 'en' 
                            ? `${district.name}, ${district.state}`
                            : `${district.nameHi || district.name}, ${district.stateHi || district.state}`
                          }
                        </span>
                        {selected ? (
                          <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-primary-600">
                            <CheckIcon className="h-5 w-5" aria-hidden="true" />
                          </span>
                        ) : null}
                      </>
                    )}
                  </Combobox.Option>
                ))
              )}
            </Combobox.Options>
          </AnimatePresence>
        </Combobox>
      </div>

      <div className="mt-6 text-center">
        <button
          onClick={handleLocationDetection}
          disabled={detecting}
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {detecting ? (
            <>
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              {text.detecting}
            </>
          ) : (
            <>
              <MapPinIcon className="-ml-1 mr-2 h-5 w-5" aria-hidden="true" />
              {text.detectLocation}
            </>
          )}
        </button>
      </div>
    </motion.div>
  );
}