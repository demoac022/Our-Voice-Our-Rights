'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckIcon, MapPinIcon } from '@heroicons/react/24/outline';
import { Combobox } from '@headlessui/react';
import { District, getDistrictsByState, searchDistricts } from '@/data/districts';

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
    orText: 'or',
    selectState: 'Select State'
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
    orText: 'या',
    selectState: 'राज्य चुनें'
  }
};

export default function DistrictSelector({ locale, onDistrictSelect }: DistrictSelectorProps) {
  const [query, setQuery] = useState('');
  const [selectedState, setSelectedState] = useState<string>('');
  const [selectedDistrict, setSelectedDistrict] = useState<District | null>(null);
  const [districts, setDistricts] = useState<{ [state: string]: District[] }>({});
  const [isDetectingLocation, setIsDetectingLocation] = useState(false);
  const text = content[locale];

  useEffect(() => {
    const groupedDistricts = getDistrictsByState();
    setDistricts(groupedDistricts);
  }, []);

  const filteredDistricts = query === ''
    ? (selectedState ? districts[selectedState] || [] : [])
    : searchDistricts(query);

  const handleStateChange = (state: string) => {
    setSelectedState(state);
    setQuery('');
  };

  const handleDistrictSelect = (district: District | null) => {
    setSelectedDistrict(district);
    onDistrictSelect(district);
  };

  const handleDetectLocation = () => {
    setIsDetectingLocation(true);
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          try {
            const response = await fetch(
              `https://nominatim.openstreetmap.org/reverse?format=json&lat=${position.coords.latitude}&lon=${position.coords.longitude}&zoom=8`
            );
            const data = await response.json();
            
            // Try to match the district from the address
            const address = data.address;
            const possibleDistrict = searchDistricts(address.city || address.county || address.state_district || '')[0];
            
            if (possibleDistrict) {
              handleDistrictSelect(possibleDistrict);
            }
          } catch (error) {
            console.error('Error getting location details:', error);
          } finally {
            setIsDetectingLocation(false);
          }
        },
        (error) => {
          console.error('Error getting location:', error);
          setIsDetectingLocation(false);
        }
      );
    }
  };

  return (
    <div className="w-full max-w-md mx-auto">
      <Combobox value={selectedDistrict} onChange={handleDistrictSelect} nullable>
        <div className="relative">
          <div className="space-y-4">
            {/* State selector */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {text.stateLabel}
              </label>
              <select
                value={selectedState}
                onChange={(e) => handleStateChange(e.target.value)}
                className="w-full rounded-md border border-gray-300 bg-white py-2 pl-3 pr-10 shadow-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
              >
                <option value="">{text.selectState}</option>
                {Object.keys(districts).sort().map((state) => (
                  <option key={state} value={state}>
                    {locale === 'hi' ? districts[state][0].stateHi : state}
                  </option>
                ))}
              </select>
            </div>

            <div className="relative">
              <Combobox.Input
                className="w-full rounded-md border border-gray-300 bg-white py-2 pl-3 pr-10 shadow-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
                onChange={(event) => setQuery(event.target.value)}
                placeholder={text.searchPlaceholder}
                displayValue={(district: District | null) => 
                  district ? (locale === 'hi' ? district.nameHi || district.name : district.name) : ''
                }
              />
              <Combobox.Button className="absolute inset-y-0 right-0 flex items-center rounded-r-md px-2 focus:outline-none">
                <MapPinIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
              </Combobox.Button>
            </div>
          </div>

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
                  className={({ active }) =>
                    `relative cursor-default select-none py-2 pl-3 pr-9 ${
                      active ? 'bg-primary-600 text-white' : 'text-gray-900'
                    }`
                  }
                >
                  {({ active, selected }) => (
                    <>
                      <div className="flex items-center">
                        <span className={`block truncate ${selected ? 'font-semibold' : ''}`}>
                          {locale === 'hi' ? district.nameHi : district.name}
                        </span>
                        <span
                          className={`ml-2 truncate text-sm ${
                            active ? 'text-primary-200' : 'text-gray-500'
                          }`}
                        >
                          {locale === 'hi' ? district.stateHi : district.state}
                        </span>
                      </div>

                      {selected && (
                        <span
                          className={`absolute inset-y-0 right-0 flex items-center pr-4 ${
                            active ? 'text-white' : 'text-primary-600'
                          }`}
                        >
                          <CheckIcon className="h-5 w-5" aria-hidden="true" />
                        </span>
                      )}
                    </>
                  )}
                </Combobox.Option>
              ))
            )}
          </Combobox.Options>
        </div>
      </Combobox>

      <div className="mt-4">
        <button
          type="button"
          onClick={handleDetectLocation}
          disabled={isDetectingLocation}
          className="w-full flex items-center justify-center px-4 py-2 border border-transparent text-base font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50"
        >
          {isDetectingLocation ? (
            <>
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              {text.detecting}
            </>
          ) : (
            text.detectLocation
          )}
        </button>
      </div>
    </div>
  );
}