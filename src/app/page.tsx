'use client';

import { useState } from 'react';
import Navigation from '@/components/Navigation';
import Hero from '@/components/Hero';
import DistrictSelector from '@/components/DistrictSelector';
import PerformanceMetrics from '@/components/PerformanceMetrics';
import { useLocale } from '@/context/LocaleContext';

interface District {
  id: string;
  name: string;
  state: string;
  nameHi?: string;
  stateHi?: string;
}

interface Metric {
  label: string;
  value: number;
  unit: string;
  trend: 'up' | 'down' | 'stable';
  comparison?: string;
}

export default function Home() {
  const { locale, setLocale } = useLocale();
  const [selectedDistrict, setSelectedDistrict] = useState<District | null>(null);
  const [metrics, setMetrics] = useState<Metric[]>([]);
  const [loading, setLoading] = useState(false);

  const handleDistrictSelect = async (district: District | null) => {
    // Handle clearing selection
    if (!district) {
      setSelectedDistrict(null);
      setMetrics([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    setSelectedDistrict(district);

    try {
      const response = await fetch(`/api/district/${district.id}`);
      if (!response.ok) {
        throw new Error('Failed to fetch district data');
      }
      
      const data = await response.json();
      const { performance_data } = data;

      // Helper function to determine trend
      const getTrend = (current: number, threshold: number): 'up' | 'down' | 'stable' => {
        if (current > threshold) return 'up';
        if (current < threshold) return 'down';
        return 'stable';
      };
      
      // Transform API data into metrics
      const newMetrics: Metric[] = [
        {
          label: locale === 'en' ? 'Total Workers' : 'कुल श्रमिक',
          value: performance_data.total_workers,
          unit: locale === 'en' ? 'people' : 'लोग',
          trend: getTrend(performance_data.total_workers, performance_data.total_workers * 0.8), // Compare with 80% threshold
          comparison: locale === 'en' ? 'Current active workers' : 'वर्तमान सक्रिय श्रमिक'
        },
        {
          label: locale === 'en' ? 'Active Workers' : 'सक्रिय श्रमिक',
          value: performance_data.active_workers,
          unit: locale === 'en' ? 'people' : 'लोग',
          trend: getTrend(performance_data.active_workers, performance_data.total_workers * 0.5),
          comparison: locale === 'en' ? 
            `${Math.round((performance_data.active_workers / performance_data.total_workers) * 100)}% of total workers` : 
            `कुल श्रमिकों का ${Math.round((performance_data.active_workers / performance_data.total_workers) * 100)}%`
        },
        {
          label: locale === 'en' ? 'Work Days Generated' : 'उत्पन्न कार्य दिवस',
          value: performance_data.work_days_generated,
          unit: locale === 'en' ? 'days' : 'दिन',
          trend: getTrend(performance_data.work_days_generated, 50000), // Example threshold
          comparison: locale === 'en' ? 'Total work days this period' : 'इस अवधि में कुल कार्य दिवस'
        },
        {
          label: locale === 'en' ? 'Wages Paid' : 'भुगतान की गई मजदूरी',
          value: performance_data.wages_paid,
          unit: '₹',
          trend: getTrend(performance_data.wages_paid, 2000000), // Example threshold of 20 lakhs
          comparison: locale === 'en' ? 'Total wages disbursed' : 'कुल वितरित मजदूरी'
        }
      ];
      
      setMetrics(newMetrics);
    } catch (error) {
      console.error('Error fetching metrics:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation locale={locale} onLocaleChange={setLocale} />
      
      <main>
        <Hero locale={locale} />
        
        <section className="py-16 px-4 sm:px-6 lg:px-8">
          <DistrictSelector
            locale={locale}
            onDistrictSelect={handleDistrictSelect}
          />
        </section>

        {(selectedDistrict || loading) && (
          <section className="py-16 px-4 sm:px-6 lg:px-8 bg-white">
            <div className="max-w-7xl mx-auto">
              <PerformanceMetrics
                districtId={selectedDistrict?.id}
                metrics={metrics}
                loading={loading}
              />
            </div>
          </section>
        )}
      </main>

      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div>
              <h3 className="text-lg font-semibold mb-4">
                {locale === 'en' ? 'About MGNREGA' : 'मनरेगा के बारे में'}
              </h3>
              <p className="text-gray-400">
                {locale === 'en' 
                  ? 'The Mahatma Gandhi National Rural Employment Guarantee Act aims to enhance livelihood security in rural areas.'
                  : 'महात्मा गांधी राष्ट्रीय ग्रामीण रोजगार गारंटी अधिनियम का उद्देश्य ग्रामीण क्षेत्रों में आजीविका सुरक्षा को बढ़ाना है।'
                }
              </p>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold mb-4">
                {locale === 'en' ? 'Quick Links' : 'त्वरित लिंक्स'}
              </h3>
              <ul className="space-y-2">
                <li>
                  <a href="#" className="text-gray-400 hover:text-white transition-colors">
                    {locale === 'en' ? 'Home' : 'होम'}
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-400 hover:text-white transition-colors">
                    {locale === 'en' ? 'About' : 'परिचय'}
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-400 hover:text-white transition-colors">
                    {locale === 'en' ? 'Contact' : 'संपर्क'}
                  </a>
                </li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold mb-4">
                {locale === 'en' ? 'Resources' : 'संसाधन'}
              </h3>
              <ul className="space-y-2">
                <li>
                  <a href="#" className="text-gray-400 hover:text-white transition-colors">
                    {locale === 'en' ? 'Official Website' : 'आधिकारिक वेबसाइट'}
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-400 hover:text-white transition-colors">
                    {locale === 'en' ? 'Guidelines' : 'दिशानिर्देश'}
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-400 hover:text-white transition-colors">
                    {locale === 'en' ? 'FAQs' : 'सामान्य प्रश्न'}
                  </a>
                </li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold mb-4">
                {locale === 'en' ? 'Contact Us' : 'संपर्क करें'}
              </h3>
              <ul className="space-y-2">
                <li className="text-gray-400">
                  {locale === 'en' ? 'Email: support@ourvoice.org' : 'ईमेल: support@ourvoice.org'}
                </li>
                <li className="text-gray-400">
                  {locale === 'en' ? 'Phone: 1800-XXX-XXXX' : 'फोन: 1800-XXX-XXXX'}
                </li>
              </ul>
            </div>
          </div>
          
          <div className="mt-8 pt-8 border-t border-gray-800 text-center text-gray-400">
            <p>
              {locale === 'en' 
                ? '© 2025 Our Voice, Our Rights. All rights reserved.'
                : '© 2025 हमारी आवाज़, हमारा अधिकार। सर्वाधिकार सुरक्षित।'
              }
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}