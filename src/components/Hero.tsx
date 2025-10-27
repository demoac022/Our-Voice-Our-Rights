'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';

interface HeroProps {
  locale: 'en' | 'hi';
}

const content = {
  en: {
    title: 'Know Your MGNREGA Performance',
    subtitle: 'Easy access to your district\'s employment guarantee program data',
    description: 'Select your district to see how the Mahatma Gandhi National Rural Employment Guarantee Act is performing in your area.',
    cta: 'Detect My Location'
  },
  hi: {
    title: 'अपने मनरेगा प्रदर्शन को जानें',
    subtitle: 'अपने जिले के रोजगार गारंटी कार्यक्रम का डेटा आसानी से देखें',
    description: 'अपने क्षेत्र में महात्मा गांधी राष्ट्रीय ग्रामीण रोजगार गारंटी अधिनियम का प्रदर्शन देखने के लिए अपना जिला चुनें।',
    cta: 'मेरा स्थान पता करें'
  }
};

export default function Hero({ locale }: HeroProps) {
  const text = content[locale];

  return (
    <div className="relative isolate overflow-hidden bg-gradient-to-b from-primary-100 to-white">
      <svg
        className="absolute inset-0 -z-10 h-full w-full stroke-primary-200 [mask-image:radial-gradient(100%_100%_at_top_right,white,transparent)]"
        aria-hidden="true"
      >
        <defs>
          <pattern
            id="83fd4e5a-9d52-42fc-97b6-718e5d7ee527"
            width={200}
            height={200}
            x="50%"
            y={-1}
            patternUnits="userSpaceOnUse"
          >
            <path d="M100 200V.5M.5 .5H200" fill="none" />
          </pattern>
        </defs>
        <svg x="50%" y={-1} className="overflow-visible fill-primary-50">
          <path
            d="M-100.5 0h201v201h-201Z M699.5 0h201v201h-201Z"
            strokeWidth={0}
          />
        </svg>
        <rect width="100%" height="100%" strokeWidth={0} fill="url(#83fd4e5a-9d52-42fc-97b6-718e5d7ee527)" />
      </svg>
      
      <div className="mx-auto max-w-7xl px-6 pb-24 pt-10 sm:pb-32 lg:flex lg:px-8 lg:py-40">
        <motion.div 
          className="mx-auto max-w-2xl flex-shrink-0 lg:mx-0 lg:max-w-xl lg:pt-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <div className="mt-24 sm:mt-32 lg:mt-16">
            <a href="#" className="inline-flex space-x-6">
              <span className="rounded-full bg-primary-600/10 px-3 py-1 text-sm font-semibold leading-6 text-primary-600 ring-1 ring-inset ring-primary-600/10">
                {locale === 'en' ? 'Latest Updates' : 'नवीनतम अपडेट'}
              </span>
            </a>
          </div>
          <h1 className="mt-10 text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl">
            {text.title}
          </h1>
          <p className="mt-6 text-lg leading-8 text-gray-600">
            {text.description}
          </p>
          <div className="mt-10 flex items-center gap-x-6">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="rounded-md bg-primary-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-primary-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-600"
            >
              {text.cta}
            </motion.button>
          </div>
        </motion.div>
        
        <motion.div 
          className="mx-auto mt-16 flex max-w-2xl sm:mt-24 lg:ml-10 lg:mr-0 lg:mt-0 lg:max-w-none lg:flex-none xl:ml-32"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <div className="max-w-3xl flex-none sm:max-w-5xl lg:max-w-none">
            <Image
              src="/hero-image.jpg"
              alt="MGNREGA workers"
              width={800} // Reduced from 1216px
              height={450} // 16:9 aspect ratio (800 * 9/16)
              className="w-full max-w-[800px] rounded-md bg-white/5 shadow-2xl ring-1 ring-white/10 object-cover"
              priority // Load this image immediately as it's above the fold
            />
          </div>
        </motion.div>
      </div>
    </div>
  );
}