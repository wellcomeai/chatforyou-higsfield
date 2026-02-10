
import { useState, createContext, useContext } from 'react';

export type Language = 'en' | 'ru';

export const translations = {
  en: {
    common: {
      features: 'Features',
      models: 'Models',
      best: 'BEST',
      top: 'TOP',
      new: 'NEW',
      processing: 'Processing...',
      transcribing: 'Transcribing audio...',
      holdToRecord: 'Hold to record voice',
      noFeatures: 'No specialized features',
      noModels: 'No specific models',
      change: 'Change',
      optional: 'Optional',
      history: 'History',
      howItWorks: 'How it works',
      langName: 'English',
      openOriginal: 'Open Original',
      download: 'Download',
      share: 'Share',
      promoText: 'Created with NeuroForge AI — Your Ultimate AI Creative Studio. Join the future of creativity at https://neuroforge.ai',
      myGenerations: 'My Generations',
      creditsBalance: 'Credits Balance',
      addCredits: 'Add Credits',
      noGenerations: 'No generations yet',
      startNow: 'Start Creating Now',
      loadingHistory: 'Loading history...'
    },
    auth: {
      loginTitle: 'Welcome Back',
      registerTitle: 'Join NeuroForge',
      email: 'Email address',
      password: 'Password',
      fullName: 'Full Name',
      loginBtn: 'Login',
      registerBtn: 'Create Account',
      switchLogin: 'Already have an account? Login',
      switchRegister: "Don't have an account? Sign Up",
      error: 'Authentication failed',
      insufficientCredits: 'Not enough credits! (Need 2)',
      loginRequired: 'Please login to generate',
      successReg: 'Account created successfully!',
      loading: 'Please wait...'
    },
    navbar: {
      explore: 'Explore',
      image: 'Image',
      video: 'Video',
      music: 'Music',
      apps: 'Apps',
      pricing: 'Pricing',
      login: 'Login',
      signup: 'Sign up',
      vibeMotion: 'Vibe Motion'
    },
    video: {
      create: 'Create Video',
      edit: 'Edit Video',
      motion: 'Motion Control',
      uploadTitle: 'Upload image or generate it',
      uploadDesc: 'PNG, JPG or Paste from clipboard',
      promptPlaceholder: 'Describe the scene you imagine, with details.',
      enhance: 'Enhance on',
      audio: 'Audio',
      model: 'Model',
      duration: 'Duration',
      aspectRatio: 'Aspect Ratio',
      generate: 'Generate',
      heroTitle: 'MAKE VIDEOS IN ONE CLICK',
      heroDesc: '250+ presets for camera control, framing, and high-quality VFX - or use the general preset for manual control.',
      step1Title: 'ADD IMAGE',
      step1Desc: 'Upload or generate an image to start your animation',
      step2Title: 'CHOOSE PRESET',
      step2Desc: 'Pick a preset to control your image movement',
      step3Title: 'GET VIDEO',
      step3Desc: 'Click generate to create your final animated video!'
    },
    workspace: {
      placeholder: 'Describe the scene you imagine',
      draw: 'Draw',
      generate: 'Generate',
      subtitle: 'Create stunning, high-aesthetic content in seconds',
      steps: 'steps',
      underDevelopment: 'This tool is currently under development.'
    },
    pricing: {
      monthly: 'Monthly',
      annual: 'Annual',
      save: 'Save',
      selectPlan: 'Select Plan',
      exclusiveOffer: 'Exclusive Offer',
      billedYear: 'Billed for 12 months',
      billedDouble: 'Billed for 12+12 months',
      off: 'OFF',
      creditsMonth: 'credits per month',
      noAccess: 'NO ACCESS',
      unlimited: 'UNLIMITED',
      access: 'ACCESS',
      noUnlimited: 'NO UNLIMITED',
      yearUnlim: '2-YEAR UNLIMITED',
      savings: 'Savings'
    },
    home: {
      promoSubtitle: 'Limited offer',
      promoTitle1: 'Experience the',
      promoTitle2: 'Future of AI',
      promoTitle3: 'Creativity',
      promoDesc: 'Unlock your imagination with the most advanced AI tools on the market.',
      promoOffer: 'Special offer ends in:',
      promoButton: 'Start Creating Now',
      viewAll: 'View All',
      unlimited: 'Unlimited',
      earlyAccess: 'Early Access',
      motionGraphics: 'Motion Graphics',
      motionDesc: 'Dynamic AI-powered video elements',
      grokDesc: 'Advanced reasoning and image generation',
      createTitle: 'What will you create today? Explore the possibilities',
      createSubtitle: 'Browse our collection of industry-leading AI models',
      exploreTools: 'Explore Tools',
      topChoice: 'Top Choice',
      seeAll: 'See all'
    },
    footer: {
      terms: 'Terms',
      privacy: 'Privacy',
      api: 'API',
      discord: 'Discord',
      rights: 'All rights reserved.'
    }
  },
  ru: {
    common: {
      features: 'Функции',
      models: 'Модели',
      best: 'ЛУЧШЕЕ',
      top: 'ТОП',
      new: 'НОВОЕ',
      processing: 'Обработка...',
      transcribing: 'Транскрибация аудио...',
      holdToRecord: 'Удерживайте для записи',
      noFeatures: 'Нет спец. функций',
      noModels: 'Нет спец. моделей',
      change: 'Изменить',
      optional: 'Опционально',
      history: 'История',
      howItWorks: 'Как это работает',
      langName: 'Русский',
      openOriginal: 'Открыть оригинал',
      download: 'Скачать',
      share: 'Поделиться',
      promoText: 'Создано в NeuroForge AI — вашей ультимативной креативной AI-студии. Присоединяйтесь к будущему на https://neuroforge.ai',
      myGenerations: 'Мои генерации',
      creditsBalance: 'Баланс кредитов',
      addCredits: 'Пополнить',
      noGenerations: 'У вас пока нет генераций',
      startNow: 'Начать создание',
      loadingHistory: 'Загрузка истории...'
    },
    auth: {
      loginTitle: 'С возвращением',
      registerTitle: 'Присоединиться к NeuroForge',
      email: 'Email адрес',
      password: 'Пароль',
      fullName: 'Полное имя',
      loginBtn: 'Войти',
      registerBtn: 'Создать аккаунт',
      switchLogin: 'Уже есть аккаунт? Войти',
      switchRegister: 'Нет аккаунта? Регистрация',
      error: 'Ошибка авторизации',
      insufficientCredits: 'Недостаточно кредитов! (Нужно 2)',
      loginRequired: 'Пожалуйста, войдите, чтобы создавать',
      successReg: 'Аккаунт успешно создан!',
      loading: 'Пожалуйста, подождите...'
    },
    navbar: {
      explore: 'Обзор',
      image: 'Фото',
      video: 'Видео',
      music: 'Музыка',
      apps: 'Приложения',
      pricing: 'Тарифы',
      login: 'Вход',
      signup: 'Регистрация',
      vibeMotion: 'Vibe Motion'
    },
    video: {
      create: 'Создать видео',
      edit: 'Редактировать',
      motion: 'Управление движением',
      uploadTitle: 'Загрузите фото или создайте его',
      uploadDesc: 'PNG, JPG или вставьте из буфера',
      promptPlaceholder: 'Опишите сцену, которую вы представляете, в деталях.',
      enhance: 'Улучшение вкл.',
      audio: 'Аудио',
      model: 'Модель',
      duration: 'Длительность',
      aspectRatio: 'Соотношение',
      generate: 'Создать',
      heroTitle: 'СОЗДАВАЙТЕ ВИДЕО В ОДИН КЛИК',
      heroDesc: 'Более 250 пресетов для управления камерой, кадрирования и высококачественных VFX эффектов.',
      step1Title: 'ДОБАВЬТЕ ФОТО',
      step1Desc: 'Загрузите или создайте изображение для начала анимации',
      step2Title: 'ВЫБЕРИТЕ ПРЕСЕТ',
      step2Desc: 'Выберите пресет для управления движением изображения',
      step3Title: 'ПОЛУЧИТЕ ВИДЕО',
      step3Desc: 'Нажмите кнопку Создать для получения финального видео!'
    },
    workspace: {
      placeholder: 'Опишите вашу идею...',
      draw: 'Рисовать',
      generate: 'Создать',
      subtitle: 'Создавайте потрясающий контент за считанные секунды',
      steps: 'шага',
      underDevelopment: 'Этот инструмент находится в разработке.'
    },
    pricing: {
      monthly: 'Ежемесячно',
      annual: 'Ежегодно',
      save: 'Скидка',
      selectPlan: 'Выбрать план',
      exclusiveOffer: 'Эксклюзивное предложение',
      billedYear: 'Счет за 12 месяцев',
      billedDouble: 'Счет за 12+12 месяцев',
      off: 'СКИДКА',
      creditsMonth: 'кредитов в месяц',
      noAccess: 'НЕТ ДОСТУПА',
      unlimited: 'БЕЗЛИМИТ',
      access: 'ДОСТУП',
      noUnlimited: 'НЕТ БЕЗЛИМИТА',
      yearUnlim: '2 ГОДА БЕЗЛИМИТА',
      savings: 'Экономия'
    },
    home: {
      promoSubtitle: 'Ограниченное предложение',
      promoTitle1: 'Почувствуйте',
      promoTitle2: 'Будущее AI',
      promoTitle3: 'Творчества',
      promoDesc: 'Раскройте воображение с самыми продвинутыми AI-инструментами на рынке.',
      promoOffer: 'Спецпредложение закончится через:',
      promoButton: 'Начать создание',
      viewAll: 'Смотреть все',
      unlimited: 'Безлимит',
      earlyAccess: 'Ранний доступ',
      motionGraphics: 'Моушн Графика',
      motionDesc: 'Динамические видео-элементы на базе AI',
      grokDesc: 'Продвинутое рассуждение и генерация изображений',
      createTitle: 'Что вы создадите сегодня? Откройте возможности',
      createSubtitle: 'Просмотрите нашу коллекцию передовых AI-моделей',
      exploreTools: 'Исследовать инструменты',
      topChoice: 'Лучший выбор',
      seeAll: 'Смотреть все'
    },
    footer: {
      terms: 'Условия',
      privacy: 'Конфиденциальность',
      api: 'API',
      discord: 'Discord',
      rights: 'Все права защищены.'
    }
  }
};

interface I18nContextProps {
  lang: Language;
  setLang: (l: Language) => void;
  t: typeof translations.en;
}

export const I18nContext = createContext<I18nContextProps | undefined>(undefined);

export const useI18n = () => {
  const context = useContext(I18nContext);
  if (!context) throw new Error('useI18n must be used within I18nProvider');
  return context;
};
