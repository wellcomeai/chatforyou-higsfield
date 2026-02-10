
import React, { useState, useMemo } from 'react';
import { useI18n } from '../i18n';

const Pricing: React.FC = () => {
  const [isAnnual, setIsAnnual] = useState(true);
  const { lang, t } = useI18n();

  const symbol = lang === 'ru' ? '₽' : '$';

  const plans = useMemo(() => [
    {
      name: 'Basic',
      description: lang === 'ru' ? 'Для новичков, начинающих свой путь в AI' : 'For beginners first exploring AI creation',
      price: lang === 'ru' ? (isAnnual ? 850 : 1200) : (isAnnual ? 9 : 14),
      originalPrice: null,
      billedInfo: isAnnual ? t.pricing.billedYear : t.pricing.monthly,
      features: lang === 'ru' ? [
        'Доступ только к выбранным моделям',
        'Одновременно: до 2 Видео, 2 Фото, 1 Персонаж',
      ] : [
        'Access to selected models only',
        'Concurrent: up to 2 Videos, 2 Images, 1 Character'
      ],
      unavailable: lang === 'ru' ? [
        'Доступ ко всем функциям',
        'Ранний доступ к новым AI функциям',
        'Без бесплатных генераций в Cinematic Bundle',
        'Минимальная стоимость за кредит',
        'Скидка на дополнительные кредиты'
      ] : [
        'Access to all features',
        'Early access to advanced AI features',
        'No Free generations with Cinematic Bundle',
        'Lowest cost per credit',
        'Discount for extra credits'
      ],
      credits: `150 ${t.pricing.creditsMonth}`,
      creditsSub: '= 75 Nano Banana Pro',
      exclusive: [
        { name: 'Kling 3.0', status: t.pricing.noAccess },
        { name: 'Kling 3.0 Omni', status: t.pricing.noAccess },
        { name: 'Nano Banana Pro', status: t.pricing.noAccess },
      ],
      color: 'gray'
    },
    {
      name: 'Pro',
      description: lang === 'ru' ? 'Для энтузиастов, создающих контент время от времени' : 'For enthusiasts creating occasionally',
      price: lang === 'ru' ? (isAnnual ? 1650 : 2800) : (isAnnual ? 19 : 32),
      originalPrice: lang === 'ru' ? (isAnnual ? 2800 : null) : (isAnnual ? 32 : null),
      billedInfo: isAnnual ? t.pricing.billedYear : t.pricing.monthly,
      features: lang === 'ru' ? [
        'Доступ ко всем моделям',
        'Одновременно: до 3 Видео, 4 Фото, 2 Персонажа',
        'Доступ ко всем функциям',
      ] : [
        'Access to all models',
        'Concurrent: up to 3 Videos, 4 Images, 2 Characters',
        'Access to all features'
      ],
      unavailable: lang === 'ru' ? [
        'Ранний доступ к новым AI функциям',
        'Без бесплатных генераций в Cinematic Bundle',
        'Минимальная стоимость за кредит',
        'Скидка на дополнительные кредиты'
      ] : [
        'Early access to advanced AI features',
        'No Free generations with Cinematic Bundle',
        'Lowest cost per credit',
        'Discount for extra credits'
      ],
      credits: `600 ${t.pricing.creditsMonth}`,
      creditsSub: '= 300 Nano Banana Pro',
      exclusive: [
        { name: 'Kling 3.0', status: t.pricing.noAccess },
        { name: 'Kling 3.0 Omni', status: t.pricing.noAccess },
        { name: 'Nano Banana Pro', status: t.pricing.noUnlimited, gray: true },
      ],
      color: 'teal',
      savings: lang === 'ru' ? 'Экономия 13 500₽ по сравнению с месячным' : 'Save $139 compared to monthly'
    },
    {
      name: 'Ultimate',
      description: lang === 'ru' ? 'Умный выбор для профи, создающих контент ежедневно' : 'The smart choice for pros creating daily',
      price: lang === 'ru' ? (isAnnual ? 2300 : 4600) : (isAnnual ? 29 : 54),
      originalPrice: lang === 'ru' ? (isAnnual ? 4600 : null) : (isAnnual ? 54 : null),
      badge: lang === 'ru' ? 'ПОПУЛЯРНЫЙ' : 'MOST POPULAR',
      subBadge: 'EXCLUSIVE KLING 3.0',
      limitedOffer: 'LIMITED OFFER',
      discount: '50% OFF',
      billedInfo: isAnnual ? t.pricing.billedYear : t.pricing.monthly,
      features: lang === 'ru' ? [
        'Доступ ко всем моделям',
        'Одновременно: до 4 Видео, 8 Фото, 3 Персонажа',
        'Доступ ко всем функциям',
        'Ранний доступ к новым AI функциям',
        'Cinematic Bundle (30 БЕСПЛ. ГЕН)',
      ] : [
        'Access to all models',
        'Concurrent: up to 4 Videos, 8 Images, 3 Characters',
        'Access to all features',
        'Early access to advanced AI features',
        'Cinematic Bundle (30 FREE GENS)'
      ],
      unavailable: lang === 'ru' ? [
        'Минимальная стоимость за кредит',
        'Скидка на дополнительные кредиты'
      ] : [
        'Lowest cost per credit',
        'Discount for extra credits'
      ],
      credits: `1 200 ${t.pricing.creditsMonth}`,
      creditsSub: '+ 365 UNLIMITED Nano Banana Pro',
      exclusive: [
        { name: 'Kling 3.0', status: t.pricing.unlimited, neon: true },
        { name: 'Kling 3.0 Omni', status: t.pricing.access, yellow: true },
        { name: 'Nano Banana Pro', status: t.pricing.yearUnlim, yellow: true, quality: '2K' },
      ],
      color: 'neon',
      savings: lang === 'ru' ? 'Экономия 27 500₽ по сравнению с месячным' : 'Save $294 compared to monthly'
    },
    {
      name: 'Creator',
      description: lang === 'ru' ? 'Для экспертов, масштабирующих производство на максимум' : 'For experts scaling production to the max',
      price: lang === 'ru' ? (isAnnual ? 3500 : 23500) : (isAnnual ? 49 : 249),
      originalPrice: lang === 'ru' ? (isAnnual ? 23500 : null) : (isAnnual ? 249 : null),
      badge: lang === 'ru' ? 'ПРЕДЛОЖЕНИЕ НА 2 ГОДА' : '2-YEAR OFFER',
      subBadge: 'EXCLUSIVE KLING 3.0',
      limitedOffer: 'LIMITED OFFER',
      discount: '85% OFF',
      billedInfo: t.pricing.billedDouble,
      features: lang === 'ru' ? [
        'Доступ ко всем моделям',
        'Одновременно: до 8 Видео, 8 Фото, 6 Персонажей',
        'Доступ ко всем функциям',
        'Ранний доступ к новым AI функциям',
        'Cinematic Bundle (110 БЕСПЛ. ГЕН)',
        'Минимальная стоимость за кредит',
        '15% скидка на доп. кредиты',
      ] : [
        'Access to all models',
        'Concurrent: up to 8 Videos, 8 Images, 6 Characters',
        'Access to all features',
        'Early access to advanced AI features',
        'Cinematic Bundle (110 FREE GENS)',
        'Lowest cost per credit',
        '15% off extra credits'
      ],
      credits: `6 000 ${t.pricing.creditsMonth}`,
      creditsSub: '+ 365 UNLIMITED Nano Banana Pro',
      exclusive: [
        { name: 'Kling 3.0', status: t.pricing.unlimited, neon: true },
        { name: 'Kling 3.0 Omni', status: t.pricing.access, yellow: true },
        { name: 'Nano Banana Pro', status: t.pricing.yearUnlim, yellow: true, quality: '2K' },
      ],
      color: 'pink',
      savings: lang === 'ru' ? 'Экономия 240 000₽ по сравнению с месячным' : 'Save $2704 compared to monthly'
    }
  ], [lang, isAnnual, t]);

  return (
    <div className="min-h-screen bg-[#050505] text-white pt-32 pb-20 px-4 md:px-8">
      {/* Toggle */}
      <div className="flex justify-center items-center gap-4 mb-16">
        <span className={`text-sm font-medium ${!isAnnual ? 'text-white' : 'text-gray-500'}`}>{t.pricing.monthly}</span>
        <button 
          onClick={() => setIsAnnual(!isAnnual)}
          className="w-12 h-6 bg-white/10 rounded-full relative flex items-center px-1 transition-colors"
        >
          <div className={`w-4 h-4 bg-white rounded-full transition-transform duration-300 ${isAnnual ? 'translate-x-6' : 'translate-x-0'}`} />
        </button>
        <span className={`text-sm font-medium ${isAnnual ? 'text-white' : 'text-gray-500'}`}>{t.pricing.annual}</span>
        <span className="bg-pink-500 text-white text-[10px] font-bold px-2 py-1 rounded-full">85% {t.pricing.off}</span>
      </div>

      {/* Grid */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {plans.map((plan, idx) => (
          <div 
            key={idx} 
            className={`relative rounded-[32px] p-6 flex flex-col h-full border transition-all duration-500 ${
              plan.color === 'neon' ? 'bg-[#0e1a05] border-[#DFFF00]/30 shadow-[0_0_40px_rgba(223,255,0,0.1)]' :
              plan.color === 'pink' ? 'bg-[#1a0510] border-pink-500/30 shadow-[0_0_40px_rgba(255,0,127,0.1)]' :
              plan.color === 'teal' ? 'bg-[#05161a] border-teal-500/20' :
              'bg-[#121212] border-white/5'
            }`}
          >
            {/* Badges */}
            <div className="absolute -top-4 left-0 right-0 flex justify-center gap-2">
              {plan.badge && (
                <span className={`text-[10px] font-black px-4 py-1.5 rounded-full uppercase tracking-tighter ${plan.color === 'neon' ? 'bg-[#DFFF00] text-black' : 'bg-pink-500 text-white'}`}>
                  <span className="mr-1">✦</span> {plan.badge}
                </span>
              )}
              {plan.subBadge && (
                <span className="text-[10px] font-black bg-white text-black px-4 py-1.5 rounded-full uppercase tracking-tighter">
                  {plan.subBadge}
                </span>
              )}
            </div>

            <div className="mb-8">
              <h3 className="text-2xl font-black mb-1 tracking-tight">{plan.name}</h3>
              <p className="text-gray-500 text-[11px] font-medium leading-tight">{plan.description}</p>
            </div>

            <div className="mb-6 flex flex-col">
              <div className="flex items-baseline gap-2">
                {plan.originalPrice && (
                  <span className="text-pink-500 line-through text-2xl font-bold opacity-80">{symbol}{plan.originalPrice}</span>
                )}
                <span className="text-4xl font-black">{symbol}{plan.price}</span>
                <span className="text-gray-500 text-sm">/{lang === 'ru' ? 'мес' : 'mo'}</span>
              </div>
              <span className="text-gray-600 text-[10px] font-bold mt-1 uppercase tracking-wider">{plan.billedInfo}</span>
            </div>

            <button className={`w-full py-4 rounded-2xl font-black text-sm mb-4 transition-all hover:scale-[1.02] active:scale-95 ${
              plan.color === 'neon' ? 'bg-[#DFFF00] text-black shadow-[0_4px_20px_rgba(223,255,0,0.3)]' :
              plan.color === 'pink' ? 'bg-pink-500 text-white shadow-[0_4px_20px_rgba(255,0,127,0.3)]' :
              'bg-white text-black'
            }`}>
              {t.pricing.selectPlan}
            </button>

            {plan.savings && (
              <div className={`text-[10px] font-black py-2 px-3 rounded-lg mb-6 flex items-center justify-center gap-2 uppercase tracking-tighter ${
                plan.color === 'neon' ? 'bg-[#DFFF00]/10 text-[#DFFF00]' :
                plan.color === 'pink' ? 'bg-pink-500/10 text-pink-500' :
                'bg-white/5 text-gray-400'
              }`}>
                <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24"><path d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"/></svg>
                {plan.savings}
              </div>
            )}

            <div className="mb-8">
              <div className="flex items-center gap-2 mb-1">
                <span className={`${plan.color === 'pink' ? 'text-pink-500' : 'text-[#DFFF00]'} text-lg`}>✦</span>
                <span className="text-sm font-black tracking-tight">{plan.credits}</span>
              </div>
              <p className="text-gray-500 text-[10px] ml-6 font-bold uppercase tracking-wider">{plan.creditsSub}</p>
            </div>

            {/* Exclusive Section */}
            <div className="bg-white/5 rounded-3xl p-5 mb-8 border border-white/5">
              <div className="flex items-center gap-2 mb-4">
                <svg className="w-3 h-3 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 00-2 2z" strokeWidth="2" strokeLinecap="round"/></svg>
                <span className="text-[10px] font-black uppercase text-gray-400 tracking-widest">{t.pricing.exclusiveOffer}</span>
              </div>
              <div className="space-y-3">
                {plan.exclusive.map((item, i) => (
                  <div key={i} className="flex items-center justify-between group">
                    <div className="flex items-center gap-2">
                       <div className="w-6 h-6 rounded-lg bg-white/5 flex items-center justify-center opacity-40">
                         <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2L2 7l10 5 10-5-10-5z"/></svg>
                       </div>
                       <span className="text-[11px] font-bold text-gray-400">{item.name}</span>
                       {item.quality && <span className="bg-white/10 text-[8px] font-black px-1.5 rounded text-gray-300">{item.quality}</span>}
                    </div>
                    <span className={`text-[8px] font-black px-2 py-0.5 rounded uppercase ${
                      item.neon ? 'bg-[#DFFF00] text-black' :
                      item.yellow ? 'bg-[#DFFF00]/20 text-[#DFFF00]' :
                      item.gray ? 'bg-white/10 text-gray-500' :
                      'bg-white/5 text-gray-600'
                    }`}>
                      {item.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Feature list */}
            <div className="flex-1 space-y-4">
              {plan.features.map((feat, i) => (
                <div key={i} className="flex items-start gap-3">
                  <svg className={`w-4 h-4 mt-0.5 shrink-0 ${plan.color === 'neon' ? 'text-[#DFFF00]' : plan.color === 'pink' ? 'text-pink-500' : 'text-gray-400'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M5 13l4 4L19 7" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/></svg>
                  <span className="text-[11px] font-bold text-gray-300 leading-tight">{feat}</span>
                </div>
              ))}
              {plan.unavailable?.map((feat, i) => (
                <div key={i} className="flex items-start gap-3 opacity-30 grayscale">
                  <svg className="w-4 h-4 mt-0.5 shrink-0 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M6 18L18 6M6 6l12 12" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/></svg>
                  <span className="text-[11px] font-bold text-gray-500 leading-tight">{feat}</span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Pricing;
