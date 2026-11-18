/**
 * Centralized SEO metadata for all CybLight pages and locales.
 * All meta descriptions are strictly kept between 50 and 155 characters
 * to comply with Google and Bing limits (Bing hard limit is 25-160 chars).
 */

export const PAGE_METADATA = {
  'index.html': {
    ru: {
      title: 'CybLight — Платформа автоматизации Smart Home и IoT Cloud',
      description: 'CybLight — SaaS-платформа для автоматизации умного дома, E2EE синхронизации IoT-датчиков, управления контроллерами и аналитики телеметрии.',
      ogTitle: 'CybLight — Платформа автоматизации Smart Home и IoT Cloud',
      ogDescription: 'Облачная SaaS-платформа для автоматизации умного дома, синхронизации IoT-устройств и мониторинга телеметрии.',
      keywords: 'CybLight, умный дом, smart home hub, IoT cloud, автоматизация, E2EE синхронизация, облачный хаб, SaaS, ESP32, STM32, API',
    },
    uk: {
      title: 'CybLight — Платформа автоматизації Smart Home та IoT Cloud',
      description: 'CybLight — SaaS-платформа для автоматизації розумного дому, E2EE синхронізації IoT-датчиків, керування контролерами та аналітики телеметрії.',
      ogTitle: 'CybLight — Платформа автоматизації Smart Home та IoT Cloud',
      ogDescription: 'Хмарна SaaS-платформа для автоматизації розумного дому, синхронізації IoT-пристроїв та моніторингу телеметрії.',
      keywords: 'CybLight, розумний дім, smart home hub, IoT cloud, автоматизація, E2EE синхронізація, хмарний хаб, SaaS, ESP32, STM32, API',
    },
    en: {
      title: 'CybLight — Smart Home Automation & IoT Cloud Platform',
      description: 'CybLight is an IoT & smart home SaaS platform for E2EE device synchronization, microcontroller automation, and real-time telemetry analytics.',
      ogTitle: 'CybLight — Smart Home & IoT Cloud Platform',
      ogDescription: 'Cloud SaaS platform for smart home automation, secure IoT device synchronization, and real-time telemetry monitoring.',
      keywords: 'CybLight, smart home, smart home hub, IoT cloud, automation, E2EE synchronization, cloud hub, SaaS, ESP32, STM32, API',
    },
  },
  'smarthomehub/index.html': {
    ru: {
      title: 'CybLight — Smart Home Hub',
      description: 'Smart Home Hub — платформа для управления умным домом, сценариев автоматизации, интеграции датчиков ESP32/STM32 и сквозной E2EE синхронизации.',
      ogTitle: 'CybLight — Smart Home Hub',
      ogDescription: 'Централизованное управление умным домом, датчиками и микроконтроллерами с E2EE синхронизацией и сценариями автоматизации.',
    },
    uk: {
      title: 'CybLight — Smart Home Hub',
      description: 'Smart Home Hub — платформа для керування розумним домом, сценаріїв автоматизації, інтеграції датчиків ESP32/STM32 та E2EE синхронізації.',
      ogTitle: 'CybLight — Smart Home Hub',
      ogDescription: 'Централізоване керування розумним домом, датчиками та мікроконтролерами з E2EE синхронізацією та автоматизацією.',
    },
    en: {
      title: 'CybLight — Smart Home Hub',
      description: 'Smart Home Hub is a local IoT platform for centralized home automation, ESP32/STM32 sensor integration, and secure E2EE synchronization.',
      ogTitle: 'CybLight — Smart Home Hub',
      ogDescription: 'Centralized smart home automation, sensor integration, and microcontroller control with secure E2EE synchronization.',
    },
  },
  'contacts/index.html': {
    ru: {
      title: 'CybLight — Контакты',
      description: 'Контакты CybLight: электронная почта, Telegram, YouTube и GitHub для вопросов по умному дому, IoT, микроконтроллерам и сотрудничеству.',
      ogTitle: 'CybLight — Контакты',
      ogDescription: 'Способы связи с разработчиком CybLight: электронная почта, Telegram, GitHub и сообщество.',
    },
    uk: {
      title: 'CybLight — Контакти',
      description: 'Контакти CybLight: електронна пошта, Telegram, YouTube та GitHub для питань щодо розумного дому, IoT, мікроконтролерів та співпраці.',
      ogTitle: 'CybLight — Контакти',
      ogDescription: 'Способи звʼязку з розробником CybLight: електронна пошта, Telegram, GitHub та спільнота.',
    },
    en: {
      title: 'CybLight — Contacts',
      description: 'Contact CybLight via email, Telegram, YouTube, and GitHub for inquiries regarding smart home automation, IoT hardware, and development.',
      ogTitle: 'CybLight — Contacts',
      ogDescription: 'Get in touch with CybLight developers via email, Telegram, GitHub, and our community channels.',
    },
  },
  'projects/index.html': {
    ru: {
      title: 'CybLight — Проекты',
      description: 'Проекты CybLight: Smart Home Hub, мобильное Android-приложение, прошивки для микроконтроллеров, облачные сервисы и открытые веб-решения.',
      ogTitle: 'CybLight — Проекты',
      ogDescription: 'Обзор открытых и прикладных проектов CybLight: умный дом, мобильные приложения, сервисы авторизации и IoT.',
    },
    uk: {
      title: 'CybLight — Проєкти',
      description: 'Проєкти CybLight: Smart Home Hub, мобільний Android-додаток, прошивки для мікроконтролерів, хмарні сервіси та відкриті веб-рішення.',
      ogTitle: 'CybLight — Проєкти',
      ogDescription: 'Огляд відкритих і прикладних проєктів CybLight: розумний дім, мобільні додатки, сервіси авторизації та IoT.',
    },
    en: {
      title: 'CybLight — Projects',
      description: 'Explore CybLight solutions: Smart Home Hub, Android application, IoT microcontroller firmware, cloud services, and open-source web apps.',
      ogTitle: 'CybLight — Projects',
      ogDescription: 'Overview of open-source and engineering projects by CybLight: smart home, mobile apps, auth services, and IoT.',
    },
  },
  'downloads/index.html': {
    ru: {
      title: 'CybLight — Мобильное приложение для Android',
      description: 'Скачайте официальное приложение CybLight для Android: прямое управление Smart Home Hub, защищённый вход, E2EE синхронизация и прямая загрузка APK.',
      ogTitle: 'CybLight — Мобильное приложение для Android',
      ogDescription: 'Официальное мобильное приложение CybLight для Android: прямое управление Smart Home Hub, E2EE синхронизация и безопасность.',
    },
    uk: {
      title: 'CybLight — Мобільний додаток для Android',
      description: 'Завантажте офіційний додаток CybLight для Android: пряме керування Smart Home Hub, захищений вхід, E2EE синхронізація та завантаження APK.',
      ogTitle: 'CybLight — Мобільний додаток для Android',
      ogDescription: 'Офіційний мобільний додаток CybLight для Android: пряме керування Smart Home Hub, E2EE синхронізація та безпека.',
    },
    en: {
      title: 'CybLight — Android Mobile App',
      description: 'Download the official CybLight Android app: direct Smart Home Hub controls, secure account login, E2EE synchronization, and direct APK download.',
      ogTitle: 'CybLight — Android Mobile App',
      ogDescription: 'Official CybLight mobile app for Android: Smart Home Hub control, E2EE synchronization, and device management.',
    },
  },
  'pricing/index.html': {
    ru: {
      title: 'CybLight Premium — Тарифы и подписки',
      description: 'Тарифные планы CybLight Premium: безлимитный Smart Home Hub, увеличенные лимиты Cloud API, сквозная E2EE синхронизация и приоритетная поддержка.',
      ogTitle: 'CybLight Premium — Тарифы и подписки',
      ogDescription: 'Разблокируйте полный потенциал Smart Home Hub, сквозной синхронизации, API и эксклюзивных премиум-функций.',
    },
    uk: {
      title: 'CybLight Premium — Тарифи та підписка',
      description: 'Тарифні плани CybLight Premium: безлімітний Smart Home Hub, збільшені ліміти Cloud API, наскрізна E2EE синхронізація та пріоритетна підтримка.',
      ogTitle: 'CybLight Premium — Тарифи та підписка',
      ogDescription: 'Розблокуйте повний потенціал Smart Home Hub, наскрізної синхронізації, API та ексклюзивних преміум-функцій.',
    },
    en: {
      title: 'CybLight Premium — Pricing & Plans',
      description: 'Choose your CybLight Premium subscription: unlimited Smart Home Hub, increased Cloud API limits, end-to-end E2EE synchronization, and priority support.',
      ogTitle: 'CybLight Premium — Pricing & Plans',
      ogDescription: 'Unlock the full potential of Smart Home Hub, end-to-end synchronization, Cloud API, and exclusive premium features.',
    },
  },
  'status/index.html': {
    ru: {
      title: 'Статус платформы CybLight — Мониторинг сервисов и аптайм',
      description: 'Статус работоспособности сервисов CybLight: Cloud API, авторизация login.cyblight.org, Smart Home Hub, E2EE шлюзы и CDN в реальном времени.',
      ogTitle: 'Статус платформы CybLight — Мониторинг сервисов и аптайм',
      ogDescription: 'Текущий статус работоспособности сервисов CybLight: Cloud API, авторизация login.cyblight.org, Smart Home Hub и шлюзы в реальном времени.',
    },
    uk: {
      title: 'Статус платформи CybLight — Моніторинг сервісів та аптайм',
      description: 'Статус працездатності сервісів CybLight: Cloud API, авторизація login.cyblight.org, Smart Home Hub, E2EE шлюзи та CDN у реальному часі.',
      ogTitle: 'Статус платформи CybLight — Моніторинг сервісів та аптайм',
      ogDescription: 'Поточний статус працездатності сервісів CybLight: Cloud API, авторизація login.cyblight.org, Smart Home Hub та шлюзи в реальному часі.',
    },
    en: {
      title: 'CybLight Platform Status — Service Uptime & Health',
      description: 'Real-time health status of CybLight services: Cloud API, login.cyblight.org authentication, Smart Home Hub, E2EE gateways, and CDN uptime.',
      ogTitle: 'CybLight Platform Status — Service Uptime & Health',
      ogDescription: 'Real-time status of CybLight platform services: Cloud API, login authentication, Smart Home Hub, E2EE gateways, and CDN uptime.',
    },
  },
  'privacy/index.html': {
    ru: {
      title: 'Политика конфиденциальности — CybLight',
      description: 'Политика конфиденциальности CybLight: принципы обработки данных, безопасность учётной записи, E2EE шифрование, cookies и права пользователей.',
      ogTitle: 'Политика конфиденциальности — CybLight',
      ogDescription: 'Политика обработки персональных данных и защиты конфиденциальности в сервисах платформы CybLight.',
    },
    uk: {
      title: 'Політика конфіденційності — CybLight',
      description: 'Політика конфіденційності CybLight: принципи обробки даних, безпека облікового запису, E2EE шифрування, cookies та права користувачів.',
      ogTitle: 'Політика конфіденційності — CybLight',
      ogDescription: 'Політика обробки персональних даних та захисту конфіденційності в сервісах платформи CybLight.',
    },
    en: {
      title: 'Privacy Policy — CybLight',
      description: 'CybLight Privacy Policy: personal data handling principles, account security, E2EE encryption, cookie usage, and user privacy rights.',
      ogTitle: 'Privacy Policy — CybLight',
      ogDescription: 'Personal data processing policy and privacy protection across CybLight platform services and apps.',
    },
  },
  'terms/index.html': {
    ru: {
      title: 'Условия использования — CybLight',
      description: 'Пользовательское соглашение CybLight: правила использования веб-сайта, Smart Home Hub, мобильного Android-приложения и публичного API.',
      ogTitle: 'Условия использования — CybLight',
      ogDescription: 'Пользовательское соглашение и условия использования веб-сайта, приложений и сервисов CybLight.',
    },
    uk: {
      title: 'Умови використання — CybLight',
      description: 'Угода користувача CybLight: правила використання веб-сайту, Smart Home Hub, мобільного Android-додатка та публічного API.',
      ogTitle: 'Умови використання — CybLight',
      ogDescription: 'Угода користувача та умови використання веб-сайту, додатків і сервісів CybLight.',
    },
    en: {
      title: 'Terms of Use — CybLight',
      description: 'CybLight Terms of Use: agreement and rules governing the use of the website, Smart Home Hub software, Android mobile app, and public APIs.',
      ogTitle: 'Terms of Use — CybLight',
      ogDescription: 'User agreement and terms governing the use of the website, applications, and services of CybLight.',
    },
  },
  'refund/index.html': {
    ru: {
      title: 'Политика возврата средств — CybLight',
      description: 'Политика возврата средств CybLight: условия платежей, отмена платных подписок, цифровой доступ и порядок действий при технических сбоях.',
      ogTitle: 'Политика возврата средств — CybLight',
      ogDescription: 'Условия возврата средств и отмены цифровых подписок в экосистеме CybLight.',
    },
    uk: {
      title: 'Політика повернення коштів — CybLight',
      description: 'Політика повернення коштів CybLight: умови платежів, скасування платних підписок, цифровий доступ та порядок дій при технічних збоях.',
      ogTitle: 'Політика повернення коштів — CybLight',
      ogDescription: 'Умови повернення коштів та скасування цифрових підписок в екосистемі CybLight.',
    },
    en: {
      title: 'Refund & Cancellation Policy — CybLight',
      description: 'CybLight Refund & Subscription Cancellation Policy: payment conditions, subscription billing terms, digital access, and technical resolution.',
      ogTitle: 'Refund & Cancellation Policy — CybLight',
      ogDescription: 'Terms of refunds and digital subscription cancellations in the CybLight ecosystem.',
    },
  },
};
