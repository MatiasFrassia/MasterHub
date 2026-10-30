export interface EstadoDnD {
  nombre: string;
  alias: string[];
  descripcion: string[];
}

export const ESTADOS_DND: Record<string, EstadoDnD> = {
  agarrado: {
    nombre: 'Agarrado',
    alias: ['agarrado', 'agarrada', 'agarrados', 'agarradas', 'agarre'],
    descripcion: [
      'La velocidad de una criatura agarrada es 0 y no puede aumentar por encima de ese valor.',
      'Este estado termina si quien agarra queda incapacitado.',
      'Termina si un efecto aleja a la criatura de quien la tiene agarrada.'
    ]
  },
  apresado: {
    nombre: 'Apresado',
    alias: ['apresado', 'apresada', 'apresados', 'apresadas'],
    descripcion: [
      'La velocidad de una criatura apresada es 0 y no puede aumentar por encima de ese valor.',
      'Las tiradas de ataque contra la criatura tienen ventaja y sus ataques tienen desventaja.',
      'La criatura tiene desventaja en las tiradas de salvación de Destreza.'
    ]
  },
  asustado: {
    nombre: 'Asustado',
    alias: ['asustado', 'asustada', 'asustados', 'asustadas'],
    descripcion: [
      'Una criatura asustada tiene desventaja en pruebas de característica y tiradas de ataque mientras pueda ver a la fuente de su miedo.',
      'La criatura no puede acercarse a la fuente de su miedo voluntariamente.'
    ]
  },
  aturdido: {
    nombre: 'Aturdido',
    alias: ['aturdido', 'aturdida', 'aturdidos', 'aturdidas'],
    descripcion: [
      'Una criatura aturdida está incapacitada, no puede moverse y solo es capaz de hablar con voz entrecortada.',
      'La criatura falla automáticamente las tiradas de salvación de Fuerza y Destreza.',
      'Las tiradas de ataque contra la criatura tienen ventaja.'
    ]
  },
  cegado: {
    nombre: 'Cegado',
    alias: ['cegado', 'cegada', 'cegados', 'cegadas'],
    descripcion: [
      'Una criatura cegada no puede ver y falla automáticamente todas las pruebas de característica que requieran la vista.',
      'Las tiradas de ataque contra la criatura tienen ventaja y sus ataques tienen desventaja.'
    ]
  },
  derribado: {
    nombre: 'Derribado',
    alias: ['derribado', 'derribada', 'derribados', 'derribadas'],
    descripcion: [
      'Una criatura derribada solo podrá moverse arrastrándose, a no ser que se levante.',
      'La criatura tiene desventaja en las tiradas de ataque.',
      'Las tiradas de ataque contra la criatura tienen ventaja si el atacante está a 5 pies o menos. Si está a más distancia, tienen desventaja.'
    ]
  },
  ensordecido: {
    nombre: 'Ensordecido',
    alias: ['ensordecido', 'ensordecida', 'ensordecidos', 'ensordecidas'],
    descripcion: [
      'Una criatura ensordecida no puede oír y falla automáticamente todas las pruebas de característica que requieran el oído.'
    ]
  },
  envenenado: {
    nombre: 'Envenenado',
    alias: ['envenenado', 'envenenada', 'envenenados', 'envenenadas'],
    descripcion: [
      'Una criatura envenenada tiene desventaja en las tiradas de ataque y en las pruebas de característica.'
    ]
  },
  hechizado: {
    nombre: 'Hechizado',
    alias: ['hechizado', 'hechizada', 'hechizados', 'hechizadas'],
    descripcion: [
      'Una criatura hechizada no puede atacar ni elegir como objetivo de efectos dañinos o mágicos a quien la hechizó.',
      'Quien la hechizó tiene ventaja en las pruebas de característica para interaccionar socialmente con ella.'
    ]
  },
  incapacitado: {
    nombre: 'Incapacitado',
    alias: ['incapacitado', 'incapacitada', 'incapacitados', 'incapacitadas'],
    descripcion: [
      'Una criatura incapacitada no puede llevar a cabo acciones ni reacciones.'
    ]
  },
  inconsciente: {
    nombre: 'Inconsciente',
    alias: ['inconsciente', 'inconscientes'],
    descripcion: [
      'Una criatura inconsciente está incapacitada, no puede moverse o hablar y no es consciente de su entorno.',
      'La criatura deja caer cualquier cosa que esté sujetando y cae derribada.',
      'Falla automáticamente las tiradas de salvación de Fuerza y Destreza.',
      'Las tiradas de ataque contra ella tienen ventaja y cualquier impacto a 5 pies o menos es crítico automático.'
    ]
  },
  invisible: {
    nombre: 'Invisible',
    alias: ['invisible', 'invisibles'],
    descripcion: [
      'Es imposible ver a una criatura invisible sin ayuda de magia o sentidos especiales.',
      'Las tiradas de ataque contra la criatura tienen desventaja y sus tiradas de ataque tienen ventaja.'
    ]
  },
  paralizado: {
    nombre: 'Paralizado',
    alias: ['paralizado', 'paralizada', 'paralizados', 'paralizadas'],
    descripcion: [
      'Una criatura paralizada está incapacitada y no puede moverse ni hablar.',
      'Falla automáticamente las tiradas de salvación de Fuerza y Destreza.',
      'Las tiradas de ataque contra la criatura tienen ventaja e impactos a 5 pies o menos son críticos.'
    ]
  },
  petrificado: {
    nombre: 'Petrificado',
    alias: ['petrificado', 'petrificada', 'petrificados', 'petrificadas'],
    descripcion: [
      'Transformada junto con sus objetos en una sustancia sólida e inanimada (piedra).',
      'Está incapacitada, no puede moverse ni hablar y no es consciente de su entorno.',
      'Tiene resistencia contra todo el daño e inmunidad al veneno y la enfermedad.'
    ]
  },
  cansancio: {
    nombre: 'Cansancio',
    alias: ['cansancio'],
    descripcion: [
      'Nivel 1: Desventaja en pruebas de característica.',
      'Nivel 2: Velocidad reducida a la mitad.',
      'Nivel 3: Desventaja en tiradas de ataque y de salvación.',
      'Nivel 4: Puntos de golpe máximos reducidos a la mitad.',
      'Nivel 5: Velocidad reducida a 0.',
      'Nivel 6: Muerte.'
    ]
  }
};