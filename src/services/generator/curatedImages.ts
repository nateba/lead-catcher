export interface NicheImageSet {
  hero: string;
  about: string;
  feature: string;
  altHero: string;
  altAbout: string;
}

export const CURATED_NICHE_IMAGES: Record<string, NicheImageSet> = {
  hvac: {
    hero: 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?auto=format&fit=crop&w=1200&q=80',
    about: 'https://images.unsplash.com/photo-1581092921461-eab62e97a780?auto=format&fit=crop&w=800&q=80',
    feature: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=800&q=80',
    altHero: 'Serviço profissional de instalação e manutenção de climatização',
    altAbout: 'Equipamento técnico e atendimento especializado',
  },
  barbershop: {
    hero: 'https://images.unsplash.com/photo-1503951914875-452162b0f3f1?auto=format&fit=crop&w=1200&q=80',
    about: 'https://images.unsplash.com/photo-1585747860715-2ba37e788b70?auto=format&fit=crop&w=800&q=80',
    feature: 'https://images.unsplash.com/photo-1622286342621-4bd786c2447c?auto=format&fit=crop&w=800&q=80',
    altHero: 'Ambiente moderno de barbearia e cuidados com o estilo',
    altAbout: 'Cortes clássicos e modernos realizados com precisão',
  },
  clinic: {
    hero: 'https://images.unsplash.com/photo-1629909613654-28e377c37b09?auto=format&fit=crop&w=1200&q=80',
    about: 'https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&w=800&q=80',
    feature: 'https://images.unsplash.com/photo-1588776814546-1ffcf47267a5?auto=format&fit=crop&w=800&q=80',
    altHero: 'Consultório moderno e acolhedor para atendimento em saúde',
    altAbout: 'Ambiente higienizado com foco no cuidado e bem-estar',
  },
  law: {
    hero: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1200&q=80',
    about: 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=800&q=80',
    feature: 'https://images.unsplash.com/photo-1450133064473-71024230f91b?auto=format&fit=crop&w=800&q=80',
    altHero: 'Ambiente corporativo e assessoria jurídica institucional',
    altAbout: 'Espaço profissional dedicado à análise criteriosa de casos',
  },
  restaurant: {
    hero: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=1200&q=80',
    about: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=800&q=80',
    feature: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=800&q=80',
    altHero: 'Ambiente gastronômico acolhedor e pratos preparados com dedicação',
    altAbout: 'Ingredientes frescos e experiência gastronômica agradável',
  },
  workshop: {
    hero: 'https://images.unsplash.com/photo-1486006920555-c77dce18193b?auto=format&fit=crop&w=1200&q=80',
    about: 'https://images.unsplash.com/photo-1619642751034-765dfdf7c58e?auto=format&fit=crop&w=800&q=80',
    feature: 'https://images.unsplash.com/photo-1530046339160-ce3e530c7d2f?auto=format&fit=crop&w=800&q=80',
    altHero: 'Oficina mecânica equipada para revisão e manutenção automotiva',
    altAbout: 'Equipe técnica focada em diagnóstico preciso e segurança',
  },
  fitness: {
    hero: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=1200&q=80',
    about: 'https://images.unsplash.com/photo-1518611012118-696072aa579a?auto=format&fit=crop&w=800&q=80',
    feature: 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?auto=format&fit=crop&w=800&q=80',
    altHero: 'Espaço de treino moderno, motivador e equipado para seu condicionamento',
    altAbout: 'Ambiente focado em saúde, movimento e bem-estar físico',
  },
  realestate: {
    hero: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80',
    about: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=800&q=80',
    feature: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=800&q=80',
    altHero: 'Imóveis selecionados e atendimento exclusivo para locação e compra',
    altAbout: 'Assessoria imobiliária com transparência e segurança em cada etapa',
  },
  pet: {
    hero: 'https://images.unsplash.com/photo-1548767797-d8c844163c4c?auto=format&fit=crop&w=1200&q=80',
    about: 'https://images.unsplash.com/photo-1535268647677-300dbf3d78d1?auto=format&fit=crop&w=800&q=80',
    feature: 'https://images.unsplash.com/photo-1576201836106-db1758fd1c97?auto=format&fit=crop&w=800&q=80',
    altHero: 'Cuidados dedicados e carinhosos para o bem-estar do seu pet',
    altAbout: 'Ambiente seguro e equipe atenciosa com cada animal de estimação',
  },
  business: {
    hero: 'https://images.unsplash.com/photo-1497366811353-6870744d04b2?auto=format&fit=crop&w=1200&q=80',
    about: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=800&q=80',
    feature: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=800&q=80',
    altHero: 'Atendimento profissional e soluções dedicadas para clientes locais',
    altAbout: 'Espaço estruturado para oferecer excelência em cada atendimento',
  },
};

export function getNicheImages(nicheTheme: string): NicheImageSet {
  return CURATED_NICHE_IMAGES[nicheTheme] || CURATED_NICHE_IMAGES.business;
}
