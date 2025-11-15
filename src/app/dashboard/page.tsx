'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { 
  BookOpen, 
  Trophy, 
  Users, 
  Target, 
  TrendingUp, 
  Award,
  Clock,
  Zap,
  LogOut,
  Settings
} from 'lucide-react';
import { 
  getUserProfile, 
  getUserStats, 
  getStudyProgress,
  isOnboardingCompleted 
} from '@/lib/storage';
import { subjects } from '@/lib/subjects';
import { UserProfile, UserStats, StudyProgress } from '@/lib/types';

export default function DashboardPage() {
  const router = useRouter();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [stats, setStats] = useState<UserStats | null>(null);
  const [progress, setProgress] = useState<StudyProgress[]>([]);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    
    if (!isOnboardingCompleted()) {
      router.push('/');
      return;
    }

    const userProfile = getUserProfile();
    const userStats = getUserStats();
    const studyProgress = getStudyProgress();

    if (!userProfile) {
      router.push('/cadastro');
      return;
    }

    setProfile(userProfile);
    setStats(userStats);
    setProgress(studyProgress);
  }, [router]);

  if (!mounted || !profile || !stats) {
    return null;
  }

  const handleLogout = () => {
    if (confirm('Tem certeza que deseja sair?')) {
      localStorage.clear();
      router.push('/');
    }
  };

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Bom dia';
    if (hour < 18) return 'Boa tarde';
    return 'Boa noite';
  };

  const getLevelProgress = () => {
    const pointsForNextLevel = (stats.level + 1) * 100;
    const currentLevelPoints = stats.totalPoints % 100;
    return (currentLevelPoints / pointsForNextLevel) * 100;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-indigo-950">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">
                {getGreeting()}, {profile.name.split(' ')[0]}! 👋
              </h1>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Continue sua jornada de aprendizado
              </p>
            </div>
            <div className="flex gap-2">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => router.push('/configuracoes')}
              >
                <Settings className="w-5 h-5" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={handleLogout}
              >
                <LogOut className="w-5 h-5" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6 sm:py-8 space-y-6">
        {/* Stats Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl p-6 text-white shadow-lg">
            <div className="flex items-center justify-between mb-2">
              <Trophy className="w-8 h-8" />
              <span className="text-2xl font-bold">{stats.totalPoints}</span>
            </div>
            <p className="text-purple-100 text-sm">Pontos Totais</p>
          </div>

          <div className="bg-gradient-to-br from-blue-500 to-cyan-500 rounded-2xl p-6 text-white shadow-lg">
            <div className="flex items-center justify-between mb-2">
              <Award className="w-8 h-8" />
              <span className="text-2xl font-bold">{stats.level}</span>
            </div>
            <p className="text-blue-100 text-sm">Nível Atual</p>
          </div>

          <div className="bg-gradient-to-br from-orange-500 to-red-500 rounded-2xl p-6 text-white shadow-lg">
            <div className="flex items-center justify-between mb-2">
              <Zap className="w-8 h-8" />
              <span className="text-2xl font-bold">{stats.streak}</span>
            </div>
            <p className="text-orange-100 text-sm">Dias Seguidos</p>
          </div>

          <div className="bg-gradient-to-br from-green-500 to-emerald-500 rounded-2xl p-6 text-white shadow-lg">
            <div className="flex items-center justify-between mb-2">
              <Users className="w-8 h-8" />
              <span className="text-2xl font-bold">{stats.friendsInvited}</span>
            </div>
            <p className="text-green-100 text-sm">Amigos Convidados</p>
          </div>
        </div>

        {/* Level Progress */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-100 dark:border-gray-700">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Progresso de Nível
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Nível {stats.level} → Nível {stats.level + 1}
              </p>
            </div>
            <div className="text-right">
              <p className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                {stats.totalPoints % 100}/{(stats.level + 1) * 100}
              </p>
              <p className="text-xs text-gray-500">pontos</p>
            </div>
          </div>
          <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-purple-600 to-pink-600 transition-all duration-500"
              style={{ width: `${getLevelProgress()}%` }}
            />
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Button
            onClick={() => router.push('/materias')}
            className="h-24 bg-gradient-to-br from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white shadow-lg"
          >
            <div className="flex flex-col items-center gap-2">
              <BookOpen className="w-6 h-6" />
              <span className="font-semibold">Estudar Agora</span>
            </div>
          </Button>

          <Button
            onClick={() => router.push('/jogos')}
            className="h-24 bg-gradient-to-br from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white shadow-lg"
          >
            <div className="flex flex-col items-center gap-2">
              <Trophy className="w-6 h-6" />
              <span className="font-semibold">Jogar Quiz</span>
            </div>
          </Button>

          <Button
            onClick={() => router.push('/comunidade')}
            className="h-24 bg-gradient-to-br from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white shadow-lg"
          >
            <div className="flex flex-col items-center gap-2">
              <Users className="w-6 h-6" />
              <span className="font-semibold">Comunidade</span>
            </div>
          </Button>
        </div>

        {/* Study Progress */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-100 dark:border-gray-700">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold text-gray-900 dark:text-white">
              Suas Matérias
            </h3>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => router.push('/materias')}
            >
              Ver Todas
            </Button>
          </div>

          <div className="space-y-4">
            {progress.slice(0, 4).map((item) => {
              const subject = subjects.find(s => s.id === item.subjectId);
              if (!subject) return null;

              return (
                <div
                  key={item.subjectId}
                  className="p-4 rounded-xl border-2 border-gray-200 dark:border-gray-700 hover:border-purple-300 dark:hover:border-purple-600 transition-all cursor-pointer"
                  onClick={() => router.push(`/materias/${item.subjectId}`)}
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${subject.color} flex items-center justify-center text-2xl`}>
                        {subject.icon}
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900 dark:text-white">
                          {subject.name}
                        </h4>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          {item.completedLessons.length}/{item.totalLessons} aulas
                        </p>
                      </div>
                    </div>
                    <span className="text-lg font-bold text-purple-600 dark:text-purple-400">
                      {item.progress}%
                    </span>
                  </div>
                  <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                    <div
                      className={`h-full bg-gradient-to-r ${subject.color} transition-all duration-500`}
                      style={{ width: `${item.progress}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Study Goals */}
        <div className="bg-gradient-to-br from-purple-600 to-pink-600 rounded-2xl p-6 text-white shadow-lg">
          <div className="flex items-start gap-4">
            <Target className="w-8 h-8 flex-shrink-0" />
            <div>
              <h3 className="text-lg font-semibold mb-2">Seus Objetivos</h3>
              <p className="text-purple-100">{profile.studyGoals}</p>
            </div>
          </div>
        </div>

        {/* Recommendations */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-100 dark:border-gray-700">
          <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
            Recomendado para Você
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-4 rounded-xl bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 border border-purple-200 dark:border-purple-800">
              <Clock className="w-6 h-6 text-purple-600 dark:text-purple-400 mb-2" />
              <h4 className="font-semibold text-gray-900 dark:text-white mb-1">
                Sessão de Estudo
              </h4>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                Continue de onde parou em Matemática
              </p>
              <Button
                size="sm"
                onClick={() => router.push('/materias/matematica')}
                className="w-full bg-purple-600 hover:bg-purple-700"
              >
                Continuar
              </Button>
            </div>

            <div className="p-4 rounded-xl bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20 border border-blue-200 dark:border-blue-800">
              <TrendingUp className="w-6 h-6 text-blue-600 dark:text-blue-400 mb-2" />
              <h4 className="font-semibold text-gray-900 dark:text-white mb-1">
                Desafio Diário
              </h4>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                Complete 3 quizzes hoje e ganhe 50 pontos
              </p>
              <Button
                size="sm"
                onClick={() => router.push('/jogos')}
                className="w-full bg-blue-600 hover:bg-blue-700"
              >
                Aceitar Desafio
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
