'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  ArrowLeft, 
  Users, 
  Trophy, 
  UserPlus,
  Search,
  Crown,
  Award,
  TrendingUp
} from 'lucide-react';
import { getUserStats, getUserProfile, updateUserStats } from '@/lib/storage';
import { UserStats } from '@/lib/types';

interface Friend {
  id: string;
  name: string;
  level: number;
  points: number;
  streak: number;
}

export default function ComunidadePage() {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [stats, setStats] = useState<UserStats | null>(null);
  const [profile, setProfile] = useState<any>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [friends, setFriends] = useState<Friend[]>([]);

  useEffect(() => {
    setMounted(true);
    const userStats = getUserStats();
    const userProfile = getUserProfile();
    
    if (!userStats || !userProfile) {
      router.push('/cadastro');
      return;
    }
    
    setStats(userStats);
    setProfile(userProfile);

    // Simular amigos para demonstração
    const mockFriends: Friend[] = [
      { id: '1', name: 'Ana Silva', level: 12, points: 1250, streak: 15 },
      { id: '2', name: 'Carlos Santos', level: 10, points: 980, streak: 8 },
      { id: '3', name: 'Maria Oliveira', level: 15, points: 1520, streak: 22 },
      { id: '4', name: 'João Costa', level: 8, points: 750, streak: 5 },
      { id: '5', name: 'Paula Lima', level: 11, points: 1100, streak: 12 },
    ];
    setFriends(mockFriends);
  }, [router]);

  if (!mounted || !stats || !profile) return null;

  const handleInviteFriend = () => {
    const newStats = {
      ...stats,
      friendsInvited: stats.friendsInvited + 1,
      totalPoints: stats.totalPoints + 50,
    };
    updateUserStats(newStats);
    setStats(newStats);
    alert('Convite enviado! Você ganhou 50 pontos de bônus! 🎉');
  };

  const allUsers = [
    { id: profile.id, name: profile.name, level: stats.level, points: stats.totalPoints, streak: stats.streak },
    ...friends,
  ].sort((a, b) => b.points - a.points);

  const userRank = allUsers.findIndex(u => u.id === profile.id) + 1;

  const filteredFriends = friends.filter(friend =>
    friend.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-indigo-950">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <div className="container mx-auto px-4 py-4">
          <Button
            variant="ghost"
            onClick={() => router.push('/dashboard')}
            className="mb-2"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Voltar
          </Button>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">
            Comunidade
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Conecte-se com amigos e compita no ranking
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8 space-y-6">
        {/* User Rank Card */}
        <div className="bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl p-6 text-white shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-purple-100 mb-1">Sua Posição no Ranking</p>
              <div className="flex items-center gap-3">
                <span className="text-5xl font-bold">#{userRank}</span>
                <div>
                  <p className="font-semibold">{profile.name}</p>
                  <p className="text-sm text-purple-100">Nível {stats.level} • {stats.totalPoints} pontos</p>
                </div>
              </div>
            </div>
            <Trophy className="w-16 h-16 opacity-80" />
          </div>
        </div>

        {/* Invite Friends */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-100 dark:border-gray-700">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-green-500 to-emerald-500 flex items-center justify-center flex-shrink-0">
              <UserPlus className="w-6 h-6 text-white" />
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">
                Convide Amigos
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                Ganhe 50 pontos para cada amigo que aceitar seu convite!
              </p>
              <Button
                onClick={handleInviteFriend}
                className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700"
              >
                <UserPlus className="w-4 h-4 mr-2" />
                Enviar Convite
              </Button>
            </div>
          </div>
        </div>

        {/* Ranking Global */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-100 dark:border-gray-700">
          <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
            <Trophy className="w-6 h-6 text-yellow-500" />
            Ranking Global
          </h3>

          <div className="space-y-3">
            {allUsers.slice(0, 10).map((user, index) => {
              const isCurrentUser = user.id === profile.id;
              const rankColors = ['from-yellow-500 to-orange-500', 'from-gray-400 to-gray-500', 'from-orange-600 to-red-600'];
              
              return (
                <div
                  key={user.id}
                  className={`p-4 rounded-xl border-2 transition-all ${
                    isCurrentUser
                      ? 'border-purple-500 bg-purple-50 dark:bg-purple-900/20'
                      : 'border-gray-200 dark:border-gray-700'
                  }`}
                >
                  <div className="flex items-center gap-4">
                    {/* Rank */}
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center font-bold text-white ${
                      index < 3
                        ? `bg-gradient-to-br ${rankColors[index]}`
                        : 'bg-gray-400 dark:bg-gray-600'
                    }`}>
                      {index < 3 ? <Crown className="w-5 h-5" /> : index + 1}
                    </div>

                    {/* User Info */}
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-semibold text-gray-900 dark:text-white">
                          {user.name}
                        </span>
                        {isCurrentUser && (
                          <span className="px-2 py-0.5 bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 text-xs font-semibold rounded-full">
                            Você
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
                        <span className="flex items-center gap-1">
                          <Award className="w-4 h-4" />
                          Nível {user.level}
                        </span>
                        <span className="flex items-center gap-1">
                          <TrendingUp className="w-4 h-4" />
                          {user.streak} dias
                        </span>
                      </div>
                    </div>

                    {/* Points */}
                    <div className="text-right">
                      <div className="text-xl font-bold text-purple-600 dark:text-purple-400">
                        {user.points}
                      </div>
                      <div className="text-xs text-gray-500">pontos</div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Friends List */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-100 dark:border-gray-700">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
              <Users className="w-6 h-6 text-blue-500" />
              Seus Amigos ({friends.length})
            </h3>
          </div>

          {/* Search */}
          <div className="relative mb-6">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <Input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Buscar amigos..."
              className="pl-10"
            />
          </div>

          {/* Friends Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {filteredFriends.map((friend) => (
              <div
                key={friend.id}
                className="p-4 rounded-xl border-2 border-gray-200 dark:border-gray-700 hover:border-purple-300 dark:hover:border-purple-600 transition-all"
              >
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white font-bold text-lg">
                    {friend.name.charAt(0)}
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 dark:text-white">
                      {friend.name}
                    </h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Nível {friend.level}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600 dark:text-gray-400">
                    {friend.points} pontos
                  </span>
                  <span className="flex items-center gap-1 text-orange-600 dark:text-orange-400">
                    <TrendingUp className="w-4 h-4" />
                    {friend.streak} dias
                  </span>
                </div>
              </div>
            ))}
          </div>

          {filteredFriends.length === 0 && (
            <div className="text-center py-8 text-gray-500 dark:text-gray-400">
              {searchQuery ? 'Nenhum amigo encontrado' : 'Você ainda não tem amigos. Convide alguém!'}
            </div>
          )}
        </div>

        {/* Challenges */}
        <div className="bg-gradient-to-br from-blue-600 to-cyan-600 rounded-2xl p-6 text-white shadow-lg">
          <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <Trophy className="w-6 h-6" />
            Desafios da Comunidade
          </h3>
          <div className="space-y-3">
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
              <h4 className="font-semibold mb-1">Desafio Semanal</h4>
              <p className="text-sm text-blue-100 mb-2">
                Complete 20 quizzes esta semana e ganhe 200 pontos extras
              </p>
              <div className="flex items-center gap-2">
                <div className="flex-1 h-2 bg-white/20 rounded-full overflow-hidden">
                  <div className="h-full bg-white rounded-full" style={{ width: '45%' }} />
                </div>
                <span className="text-sm font-semibold">9/20</span>
              </div>
            </div>

            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
              <h4 className="font-semibold mb-1">Desafio Mensal</h4>
              <p className="text-sm text-blue-100 mb-2">
                Estude por 30 dias consecutivos e ganhe um badge exclusivo
              </p>
              <div className="flex items-center gap-2">
                <div className="flex-1 h-2 bg-white/20 rounded-full overflow-hidden">
                  <div className="h-full bg-white rounded-full" style={{ width: '30%' }} />
                </div>
                <span className="text-sm font-semibold">{stats.streak}/30</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
