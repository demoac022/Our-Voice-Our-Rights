'use client';

import { motion } from 'framer-motion';
import Navigation from '@/components/Navigation';
import { useLocale } from '@/context/LocaleContext';

interface ContentType {
  title: string;
  subtitle: string;
  description: string;
  keyPoints: string[];
}

interface ContentMap {
  en: ContentType;
  hi: ContentType;
}

const content: ContentMap = {
  en: {
    title: 'About MGNREGA',
    subtitle: 'Understanding Your Rights',
    description: `The Mahatma Gandhi National Rural Employment Guarantee Act 2005 (MGNREGA) is an Indian labour law and social security measure that aims to guarantee the 'right to work'. It aims to enhance livelihood security in rural areas by providing at least 100 days of wage employment in a financial year to every household whose adult members volunteer to do unskilled manual work.`,
    keyPoints: [
      'Legal right to work',
      'Minimum 100 days of guaranteed employment',
      'Equal wages for men and women',
      'Unemployment allowance if work is not provided',
      'Work within 5 km radius of village',
    ],
  },
  hi: {
    title: 'एमजीएनआरईजीए के बारे में',
    subtitle: 'अपने अधिकारों को समझें',
    description: `महात्मा गांधी राष्ट्रीय ग्रामीण रोजगार गारंटी अधिनियम 2005 (मनरेगा) एक भारतीय श्रम कानून और सामाजिक सुरक्षा उपाय है जो 'काम के अधिकार' की गारंटी देने का लक्ष्य रखता है। इसका उद्देश्य ग्रामीण क्षेत्रों में आजीविका सुरक्षा को बढ़ाना है, जिसमें प्रत्येक परिवार के वयस्क सदस्यों को एक वित्तीय वर्ष में कम से कम 100 दिनों का मजदूरी रोजगार प्रदान किया जाता है।`,
    keyPoints: [
      'काम का कानूनी अधिकार',
      'न्यूनतम 100 दिन का गारंटी रोजगार',
      'पुरुषों और महिलाओं के लिए समान मजदूरी',
      'काम नहीं मिलने पर बेरोजगारी भत्ता',
      'गांव से 5 किलोमीटर के दायरे में काम',
    ],
  },
} as const;

export default function About() {
  const { locale, setLocale } = useLocale();
  const currentContent = content[locale];

  return (
    <div className="min-h-screen bg-white">
      <Navigation locale={locale} onLocaleChange={setLocale} />
      <div className="py-24 sm:py-32">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-2xl lg:text-center">
            <motion.h2
              className="text-base font-semibold leading-7 text-indigo-600"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              {currentContent.subtitle}
            </motion.h2>
            <motion.p
              className="mt-2 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              {currentContent.title}
            </motion.p>
            <motion.p
              className="mt-6 text-lg leading-8 text-gray-600"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              {currentContent.description}
            </motion.p>
          </div>
          <div className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-none">
            <dl className="grid max-w-xl grid-cols-1 gap-x-8 gap-y-16 lg:max-w-none lg:grid-cols-3">
              {currentContent.keyPoints.map((point, index) => (
                <motion.div
                  key={index}
                  className="flex flex-col"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.6 + index * 0.1 }}
                >
                  <dt className="flex items-center gap-x-3 text-base font-semibold leading-7 text-gray-900">
                    <div className="h-5 w-5 flex-none rounded-lg bg-indigo-600 text-white flex items-center justify-center">
                      {index + 1}
                    </div>
                    {point}
                  </dt>
                </motion.div>
              ))}
            </dl>
          </div>
        </div>
      </div>
    </div>
  );
}