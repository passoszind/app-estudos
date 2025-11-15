'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { 
  ArrowLeft, 
  Play, 
  CheckCircle2, 
  Circle,
  BookOpen,
  Video,
  Headphones,
  Gamepad2,
  Clock,
  Award
} from 'lucide-react';
import { subjects } from '@/lib/subjects';
import { getStudyProgress, updateStudyProgress, getUserStats, updateUserStats } from '@/lib/storage';
import { StudyProgress } from '@/lib/types';

export default function MateriaDetailPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [progress, setProgress] = useState<StudyProgress | null>(null);
  const [mounted, setMounted] = useState(false);
  const [selectedLesson, setSelectedLesson] = useState<number | null>(null);

  const subject = subjects.find(s => s.id === params.id);

  useEffect(() => {
    setMounted(true);
    if (!subject) {
      router.push('/materias');
      return;
    }

    const allProgress = getStudyProgress();
    const subjectProgress = allProgress.find(p => p.subjectId === params.id);
    setProgress(subjectProgress || null);
  }, [params.id, subject, router]);

  if (!mounted || !subject) return null;

  const lessons = Array.from({ length: subject.totalLessons }, (_, i) => ({
    id: `${subject.id}-lesson-${i + 1}`,
    number: i + 1,
    title: `Aula ${i + 1}: ${getLessonTitle(subject.id, i + 1)}`,
    duration: 15,
    type: getLessonType(i),
    completed: progress?.completedLessons.includes(`${subject.id}-lesson-${i + 1}`) || false,
  }));

  function getLessonTitle(subjectId: string, lessonNumber: number): string {
    const titles: Record<string, string[]> = {
      matematica: ['Números e Operações', 'Frações e Decimais', 'Álgebra Básica', 'Geometria', 'Estatística'],
      portugues: ['Gramática Essencial', 'Interpretação de Texto', 'Redação', 'Literatura', 'Ortografia'],
      ciencias: ['Método Científico', 'Biologia Celular', 'Física Básica', 'Química', 'Ecologia'],
      historia: ['Pré-História', 'Idade Antiga', 'Idade Média', 'Idade Moderna', 'Idade Contemporânea'],
      geografia: ['Cartografia', 'Relevo e Clima', 'População', 'Economia', 'Geopolítica'],
      ingles: ['Gramática Básica', 'Vocabulário', 'Conversação', 'Leitura', 'Escrita'],
    };
    return titles[subjectId]?.[lessonNumber - 1] || `Conteúdo ${lessonNumber}`;
  }

  function getLessonType(index: number): 'texto' | 'video' | 'audio' | 'interativo' {
    const types: ('texto' | 'video' | 'audio' | 'interativo')[] = ['texto', 'video', 'audio', 'interativo'];
    return types[index % 4];
  }

  const handleCompleteLesson = (lessonId: string) => {
    if (!progress) return;

    const updatedProgress = {
      ...progress,
      completedLessons: [...progress.completedLessons, lessonId],
      progress: Math.round(((progress.completedLessons.length + 1) / subject.totalLessons) * 100),
      lastAccessed: new Date().toISOString(),
    };

    updateStudyProgress(updatedProgress);
    setProgress(updatedProgress);

    // Adicionar pontos
    const stats = getUserStats();
    if (stats) {
      updateUserStats({
        ...stats,
        totalPoints: stats.totalPoints + 20,
        level: Math.floor((stats.totalPoints + 20) / 100),
      });
    }

    setSelectedLesson(null);
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'texto': return <BookOpen className="w-4 h-4" />;
      case 'video': return <Video className="w-4 h-4" />;
      case 'audio': return <Headphones className="w-4 h-4" />;
      case 'interativo': return <Gamepad2 className="w-4 h-4" />;
      default: return <BookOpen className="w-4 h-4" />;
    }
  };

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'texto': return 'Texto';
      case 'video': return 'Vídeo';
      case 'audio': return 'Áudio';
      case 'interativo': return 'Interativo';
      default: return 'Conteúdo';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-indigo-950">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <div className="container mx-auto px-4 py-4">
          <Button
            variant="ghost"
            onClick={() => router.push('/materias')}
            className="mb-2"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Voltar
          </Button>
          
          <div className="flex items-start gap-4">
            <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${subject.color} flex items-center justify-center text-3xl flex-shrink-0`}>
              {subject.icon}
            </div>
            <div className="flex-1">
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">
                {subject.name}
              </h1>
              <p className="text-gray-600 dark:text-gray-400">
                {subject.description}
              </p>
            </div>
          </div>

          {/* Progress */}
          {progress && (
            <div className="mt-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Progresso: {progress.completedLessons.length}/{subject.totalLessons} aulas
                </span>
                <span className="text-sm font-bold text-purple-600 dark:text-purple-400">
                  {progress.progress}%
                </span>
              </div>
              <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                <div
                  className={`h-full bg-gradient-to-r ${subject.color} transition-all duration-500`}
                  style={{ width: `${progress.progress}%` }}
                />
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Lessons List */}
        <div className="space-y-4">
          {lessons.map((lesson) => (
            <div
              key={lesson.id}
              className={`bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border-2 transition-all ${
                lesson.completed
                  ? 'border-green-500 dark:border-green-600'
                  : 'border-gray-200 dark:border-gray-700 hover:border-purple-300 dark:hover:border-purple-600'
              }`}
            >
              <div className="flex items-start gap-4">
                {/* Status Icon */}
                <div className="flex-shrink-0 mt-1">
                  {lesson.completed ? (
                    <CheckCircle2 className="w-6 h-6 text-green-500" />
                  ) : (
                    <Circle className="w-6 h-6 text-gray-400" />
                  )}
                </div>

                {/* Content */}
                <div className="flex-1">
                  <div className="flex items-start justify-between gap-4 mb-2">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                        {lesson.title}
                      </h3>
                      <div className="flex items-center gap-4 mt-1 text-sm text-gray-600 dark:text-gray-400">
                        <div className="flex items-center gap-1">
                          {getTypeIcon(lesson.type)}
                          <span>{getTypeLabel(lesson.type)}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          <span>{lesson.duration} min</span>
                        </div>
                      </div>
                    </div>

                    {lesson.completed && (
                      <div className="flex items-center gap-1 px-3 py-1 bg-green-100 dark:bg-green-900/30 rounded-full">
                        <Award className="w-4 h-4 text-green-600 dark:text-green-400" />
                        <span className="text-sm font-semibold text-green-600 dark:text-green-400">
                          +20 pts
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Lesson Content Preview */}
                  {selectedLesson === lesson.number && !lesson.completed && (
                    <div className="mt-4 p-4 bg-gray-50 dark:bg-gray-900 rounded-xl">
                      <p className="text-gray-700 dark:text-gray-300 mb-4">
                        {getLessonContent(lesson.type)}
                      </p>
                      <Button
                        onClick={() => handleCompleteLesson(lesson.id)}
                        className="w-full sm:w-auto bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700"
                      >
                        <CheckCircle2 className="w-4 h-4 mr-2" />
                        Marcar como Concluída
                      </Button>
                    </div>
                  )}

                  {/* Action Button */}
                  {!lesson.completed && (
                    <Button
                      onClick={() => setSelectedLesson(selectedLesson === lesson.number ? null : lesson.number)}
                      className="mt-4 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
                    >
                      <Play className="w-4 h-4 mr-2" />
                      {selectedLesson === lesson.number ? 'Fechar' : 'Começar Aula'}
                    </Button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Complete All Button */}
        {progress && progress.progress === 100 && (
          <div className="mt-8 p-6 bg-gradient-to-r from-green-600 to-emerald-600 rounded-2xl text-white text-center">
            <Award className="w-12 h-12 mx-auto mb-4" />
            <h3 className="text-2xl font-bold mb-2">Parabéns! 🎉</h3>
            <p className="mb-4">Você completou todas as aulas de {subject.name}!</p>
            <Button
              onClick={() => router.push('/jogos')}
              className="bg-white text-green-600 hover:bg-gray-100"
            >
              Testar Conhecimento no Quiz
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}

function getLessonContent(type: string): string {
  const contents: Record<string, string> = {
    texto: 'Nesta aula, você aprenderá através de textos explicativos e resumos práticos. O conteúdo foi adaptado para facilitar sua compreensão e fixação.',
    video: 'Assista ao vídeo explicativo com exemplos práticos e visualizações que facilitam o entendimento do conteúdo.',
    audio: 'Ouça a explicação em áudio, perfeito para estudar enquanto faz outras atividades ou para quem aprende melhor ouvindo.',
    interativo: 'Participe de uma experiência interativa com exercícios práticos, simulações e atividades que tornam o aprendizado mais dinâmico.',
  };
  return contents[type] || 'Conteúdo educativo adaptado ao seu estilo de aprendizado.';
}
