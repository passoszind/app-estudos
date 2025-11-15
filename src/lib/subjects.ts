// Dados de matérias e conteúdos

import { Subject, Lesson } from './types';

export const subjects: Subject[] = [
  {
    id: 'matematica',
    name: 'Matemática',
    icon: 'Calculator',
    color: 'from-blue-500 to-cyan-500',
    description: 'Números, álgebra, geometria e muito mais',
    totalLessons: 12,
  },
  {
    id: 'portugues',
    name: 'Português',
    icon: 'BookOpen',
    color: 'from-purple-500 to-pink-500',
    description: 'Gramática, literatura e interpretação',
    totalLessons: 10,
  },
  {
    id: 'ciencias',
    name: 'Ciências',
    icon: 'Microscope',
    color: 'from-green-500 to-emerald-500',
    description: 'Biologia, química e física',
    totalLessons: 15,
  },
  {
    id: 'historia',
    name: 'História',
    icon: 'Landmark',
    color: 'from-amber-500 to-orange-500',
    description: 'Eventos históricos e civilizações',
    totalLessons: 8,
  },
  {
    id: 'geografia',
    name: 'Geografia',
    icon: 'Globe',
    color: 'from-teal-500 to-cyan-500',
    description: 'Mundo, países e fenômenos naturais',
    totalLessons: 9,
  },
  {
    id: 'ingles',
    name: 'Inglês',
    icon: 'Languages',
    color: 'from-indigo-500 to-blue-500',
    description: 'Vocabulário, gramática e conversação',
    totalLessons: 11,
  },
];

export const sampleLessons: Lesson[] = [
  {
    id: 'mat-001',
    subjectId: 'matematica',
    title: 'Introdução às Frações',
    description: 'Aprenda o conceito básico de frações de forma visual',
    contentType: 'interativo',
    content: 'Frações representam partes de um todo. Por exemplo, 1/2 significa uma parte de duas partes iguais.',
    duration: 15,
    difficulty: 'facil',
  },
  {
    id: 'port-001',
    subjectId: 'portugues',
    title: 'Classes Gramaticais',
    description: 'Entenda substantivos, verbos e adjetivos',
    contentType: 'video',
    content: 'As classes gramaticais são categorias que classificam as palavras.',
    duration: 20,
    difficulty: 'medio',
  },
];
