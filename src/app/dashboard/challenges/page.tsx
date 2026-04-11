'use client'

import { useState } from 'react'
import DashboardLayout from '../../../components/mobile/DashboardLayout'

interface Challenge {
  id: string
  title: string
  description: string
  xp: number
  credits: number
  timeLeft: string
  difficulty: 'easy' | 'medium' | 'hard'
  progress: number
  total: number
  completed: boolean
  type: 'daily' | 'weekly' | 'special'
  icon: string
}

interface Achievement {
  id: string
  title: string
  description: string
  icon: string
  unlocked: boolean
  progress?: number
  total?: number
  xp: number
  rarity: 'common' | 'rare' | 'epic' | 'legendary'
}

const CHALLENGES: Challenge[] = [
  { id: '1', title: 'Morning Creator', description: 'Publish a post before 10 AM', xp: 50, credits: 2, timeLeft: '4h 23m', difficulty: 'easy', progress: 0, total: 1, completed: false, type: 'daily', icon: '☀️' },
  { id: '2', title: 'Trend Surfer', description: 'Create content using a trending hashtag', xp: 150, credits: 5, timeLeft: '4h 23m', difficulty: 'medium', progress: 0, total: 1, completed: false, type: 'daily', icon: '🏄' },
  { id: '3', title: 'AI Power User', description: 'Generate 3 videos today', xp: 200, credits: 8, timeLeft: '4h 23m', difficulty: 'hard', progress: 1, total: 3, completed: false, type: 'daily', icon: '🤖' },
  { id: '4', title: 'Cross-Platform Blitz', description: 'Publish to 3 different platforms this week', xp: 500, credits: 20, timeLeft: '3d 4h', difficulty: 'medium', progress: 2, total: 3, completed: false, type: 'weekly', icon: '🌐' },
  { id: '5', title: 'Streak Keeper', description: 'Maintain a 7-day publishing streak', xp: 750, credits: 30, timeLeft: '3d 4h', difficulty: 'hard', progress: 5, total: 7, completed: false, type: 'weekly', icon: '🔥' },
  { id: '6', title: 'Viral Moment', description: 'Get 10,000 views on a single post this week', xp: 1000, credits: 50, timeLeft: '3d 4h', difficulty: 'hard', progress: 3420, total: 10000, completed: false, type: 'weekly', icon: '📈' },
  { id: '7', title: 'First Viral', description: 'Get 1,000 views on your first post', xp: 100, credits: 5, timeLeft: 'Completed!', difficulty: 'easy', progress: 1, total: 1, completed: true, type: 'special', icon: '🌟' },
  { id: '8', title: '7-Day Streak', description: 'Publish every day for a week', xp: 300, credits: 15, timeLeft: 'Completed!', difficulty: 'medium', progress: 7, total: 7, completed: true, type: 'special', icon: '🎯' },
]

const ACHIEVEMENTS: Achievement[] = [
  { id: '1', title: 'First Mint', description: 'Generate your first AI video', icon: '🎬', unlocked: true, xp: 50, rarity: 'common' },
  { id: '2', title: 'Brand Builder', description: 'Set up your brand kit', icon: '🎨', unlocked: true, xp: 100, rarity: 'common' },
  { id: '3', title: 'Connected Creator', description: 'Connect 3 social accounts', icon: '🔗', unlocked: true, xp: 150, rarity: 'common' },
  { id: '4', title: 'On Fire', description: 'Maintain a 7-day streak', icon: '🔥', unlocked: true, xp: 300, rarity: 'rare' },
  { id: '5', title: 'Trendsetter', description: 'Create content on a trending topic', icon: '🏄', unlocked: true, xp: 200, rarity: 'rare' },
  { id: '6', title: 'Viral Mint', description: 'Get 100,000 total views', icon: '💫', unlocked: false, progress: 48200, total: 100000, xp: 1000, rarity: 'epic' },
  { id: '7', title: 'Content Machine', description: 'Generate 100 AI videos', icon: '⚡', unlocked: false, progress: 32, total: 100, xp: 750, rarity: 'epic' },
  { id: '8', title: 'Platform Dominator', description: 'Connect all 6 platforms', icon: '🌍', unlocked: false, progress: 4, total: 6, xp: 500, rarity: 'rare' },
  { id: '9', title: 'ViralMint Legend', description: 'Reach 1,000,000 total views', icon: '👑', unlocked: false, progress: 48200, total: 1000000, xp: 5000, rarity: 'legendary' },
]

const RANKS = [
  { name: 'Rookie', min: 0, max: 500, color: '#9CA3AF', icon: '🌱' },
  { name: 'Creator', min: 500, max: 2000, color: '#6366F1', icon: '✏️' },
  { name: 'Grinder', min: 2000, max: 5000, color: '#F59E0B', icon: '⚡' },
  { name: 'Viral', min: 5000, max: 15000, color: '#EF4444', icon: '🔥' },
  { name: 'Legend', min: 15000, max: Infinity, color: '#F59E0B', icon: '👑' },
]

const RARITY_COLORS = { common: '#9CA3AF', rare: '#6366F1', epic: '#A855F7', legendary: '#F59E0B' }
const DIFFICULTY_COLORS = { easy: '#10B981', medium: '#F59E0B', hard: '#EF4444' }

export default function ChallengesPage() {
  const [tab, setTab] = useState<'challenges' | 'achievements' | 'leaderboard'>('challenges')
  const [xp] = useState(2840)
  const [streak] = useState(14)
  const [credits] = useState(127)

  const currentRank = RANKS.findLast(r => xp >= r.min) || RANKS[0]
  const nextRank = RANKS.find(r => xp < r.max) || RANKS[RANKS.length - 1]
  const rankProgress = nextRank.max === Infinity ? 100 : ((xp - currentRank.min) / (nextRank.max - currentRank.min)) * 100

  const dailyChallenges = CHALLENGES.filter(c => c.type === 'daily' && !c.completed)
  const weeklyChallenges = CHALLENGES.filter(c => c.type === 'weekly')
  const completedChallenges = CHALLENGES.filter(c => c.completed)
  const unlockedAchievements = ACHIEVEMENTS.filter(a => a.unlocked)
  const lockedAchievements = ACHIEVEMENTS.filter(a => !a.unlocked)

  return (
    <DashboardLayout>
      <div style={{ padding: 16, maxWidth: 900, margin: '0 auto' }}>

        {/* Profile card */}
        <div style={{ padding: 20, background: 'linear-gradient(135deg, rgba(245,158,11,0.1), rgba(239,68,68,0.06))', border: '1px solid rgba(245,158,11,0.2)', borderRadius: 20, marginBottom: 20 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 16 }}>
            <div style={{ width: 56, height: 56, borderRadius: '50%', background: 'linear-gradient(135deg,#F59E0B,#EF4444)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20, fontWeight: 900, color: '#000', flexShrink: 0 }}>CK</div>
            <div style={{ flex: 1 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                <span style={{ fontSize: 18, fontWeight: 800, color: '#fff' }}>Charly K.</span>
                <span style={{ fontSize: 14 }}>{currentRank.icon}</span>
                <span style={{ fontSize: 12, fontWeight: 700, color: currentRank.color }}>{currentRank.name}</span>
              </div>
              <div style={{ display: 'flex', gap: 16 }}>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: 18, fontWeight: 900, color: '#F59E0B' }}>🔥 {streak}</div>
                  <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.3)' }}>Day streak</div>
                </div>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: 18, fontWeight: 900, color: '#fff' }}>{xp.toLocaleString()}</div>
                  <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.3)' }}>Total XP</div>
                </div>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: 18, fontWeight: 900, color: '#10B981' }}>{credits}</div>
                  <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.3)' }}>Credits</div>
                </div>
              </div>
            </div>
          </div>

          {/* XP Progress */}
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, color: 'rgba(255,255,255,0.4)', marginBottom: 6 }}>
              <span>{currentRank.name}</span>
              <span>{xp.toLocaleString()} / {nextRank.max === Infinity ? '∞' : nextRank.max.toLocaleString()} XP</span>
              <span>{nextRank.name}</span>
            </div>
            <div style={{ height: 8, background: 'rgba(255,255,255,0.08)', borderRadius: 4, overflow: 'hidden' }}>
              <div style={{ height: '100%', width: `${Math.min(rankProgress, 100)}%`, background: 'linear-gradient(90deg,#F59E0B,#EF4444)', borderRadius: 4, transition: 'width 0.5s' }} />
            </div>
          </div>
        </div>

        {/* Streak shield notification */}
        <div style={{ padding: '10px 14px', background: 'rgba(239,68,68,0.06)', border: '1px solid rgba(239,68,68,0.15)', borderRadius: 12, marginBottom: 16, display: 'flex', alignItems: 'center', gap: 10 }}>
          <span style={{ fontSize: 20 }}>🛡️</span>
          <div>
            <div style={{ fontSize: 13, fontWeight: 600, color: '#fff' }}>You have 1 streak shield left</div>
            <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.35)' }}>Post today to keep your 14-day streak. Shield auto-activates if you miss a day.</div>
          </div>
        </div>

        {/* Tabs */}
        <div style={{ display: 'flex', gap: 4, background: 'rgba(255,255,255,0.04)', borderRadius: 12, padding: 4, marginBottom: 20 }}>
          {(['challenges', 'achievements', 'leaderboard'] as const).map(t => (
            <button key={t} onClick={() => setTab(t)}
              style={{ flex: 1, padding: '9px', borderRadius: 8, border: 'none', background: tab === t ? 'rgba(255,255,255,0.1)' : 'transparent', color: tab === t ? '#fff' : 'rgba(255,255,255,0.35)', fontSize: 13, fontWeight: 600, cursor: 'pointer', textTransform: 'capitalize', transition: 'all 0.15s' }}>
              {t === 'challenges' ? '🎯' : t === 'achievements' ? '🏆' : '🏅'} {t.charAt(0).toUpperCase() + t.slice(1)}
            </button>
          ))}
        </div>

        {tab === 'challenges' && (
          <>
            {/* Daily */}
            <div style={{ marginBottom: 24 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
                <div style={{ fontSize: 12, fontWeight: 700, color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Daily Challenges</div>
                <div style={{ padding: '2px 8px', background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)', borderRadius: 20, fontSize: 11, color: '#EF4444', fontWeight: 700 }}>Resets in 4h 23m</div>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {dailyChallenges.map(c => (
                  <ChallengeCard key={c.id} challenge={c} />
                ))}
              </div>
            </div>

            {/* Weekly */}
            <div style={{ marginBottom: 24 }}>
              <div style={{ fontSize: 12, fontWeight: 700, color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 12 }}>Weekly Challenges</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {weeklyChallenges.map(c => (
                  <ChallengeCard key={c.id} challenge={c} />
                ))}
              </div>
            </div>

            {/* Completed */}
            {completedChallenges.length > 0 && (
              <div>
                <div style={{ fontSize: 12, fontWeight: 700, color: 'rgba(255,255,255,0.3)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 12 }}>Completed ✓</div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8, opacity: 0.5 }}>
                  {completedChallenges.map(c => (
                    <ChallengeCard key={c.id} challenge={c} />
                  ))}
                </div>
              </div>
            )}
          </>
        )}

        {tab === 'achievements' && (
          <>
            <div style={{ marginBottom: 20 }}>
              <div style={{ fontSize: 12, fontWeight: 700, color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 12 }}>Unlocked — {unlockedAchievements.length} achievements</div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))', gap: 10 }}>
                {unlockedAchievements.map(a => (
                  <AchievementCard key={a.id} achievement={a} />
                ))}
              </div>
            </div>
            <div>
              <div style={{ fontSize: 12, fontWeight: 700, color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 12 }}>Locked — {lockedAchievements.length} remaining</div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))', gap: 10, opacity: 0.5 }}>
                {lockedAchievements.map(a => (
                  <AchievementCard key={a.id} achievement={a} />
                ))}
              </div>
            </div>
          </>
        )}

        {tab === 'leaderboard' && (
          <div>
            <div style={{ fontSize: 12, fontWeight: 700, color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 12 }}>Top Creators This Week</div>
            {[
              { rank: 1, name: 'Adaeze O.', xp: 9840, streak: 28, avatar: 'AO', color: '#F59E0B' },
              { rank: 2, name: 'Emeka C.', xp: 7620, streak: 21, avatar: 'EC', color: '#8B5CF6' },
              { rank: 3, name: 'Funmi A.', xp: 6100, streak: 18, avatar: 'FA', color: '#EF4444' },
              { rank: 4, name: 'Charly K.', xp: 2840, streak: 14, avatar: 'CK', color: '#F59E0B', isYou: true },
              { rank: 5, name: 'Ifeoma B.', xp: 2640, streak: 12, avatar: 'IB', color: '#06B6D4' },
              { rank: 6, name: 'Kemi N.', xp: 1980, streak: 8, avatar: 'KN', color: '#10B981' },
            ].map(user => (
              <div key={user.rank} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 14px', marginBottom: 8, borderRadius: 12, background: user.isYou ? 'rgba(245,158,11,0.08)' : 'rgba(255,255,255,0.02)', border: `1px solid ${user.isYou ? 'rgba(245,158,11,0.2)' : 'rgba(255,255,255,0.06)'}` }}>
                <div style={{ width: 28, textAlign: 'center', fontSize: user.rank <= 3 ? 20 : 14, fontWeight: user.rank > 3 ? 700 : undefined, color: user.rank > 3 ? 'rgba(255,255,255,0.3)' : undefined }}>
                  {user.rank === 1 ? '🥇' : user.rank === 2 ? '🥈' : user.rank === 3 ? '🥉' : `#${user.rank}`}
                </div>
                <div style={{ width: 36, height: 36, borderRadius: '50%', background: user.color, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 700, color: '#000', flexShrink: 0 }}>{user.avatar}</div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 14, fontWeight: 600, color: user.isYou ? '#F59E0B' : '#fff' }}>{user.name} {user.isYou && '(you)'}</div>
                  <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.3)' }}>🔥 {user.streak}-day streak</div>
                </div>
                <div style={{ fontSize: 16, fontWeight: 800, color: '#fff' }}>{user.xp.toLocaleString()} XP</div>
              </div>
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  )
}

function ChallengeCard({ challenge: c }: { challenge: Challenge }) {
  const progressPct = Math.min((c.progress / c.total) * 100, 100)
  return (
    <div style={{ padding: '14px 16px', background: c.completed ? 'rgba(16,185,129,0.05)' : 'rgba(255,255,255,0.03)', border: `1px solid ${c.completed ? 'rgba(16,185,129,0.2)' : 'rgba(255,255,255,0.07)'}`, borderRadius: 14 }}>
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12 }}>
        <span style={{ fontSize: 24, flexShrink: 0 }}>{c.icon}</span>
        <div style={{ flex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4, flexWrap: 'wrap' }}>
            <span style={{ fontSize: 14, fontWeight: 700, color: '#fff' }}>{c.title}</span>
            <span style={{ fontSize: 10, padding: '2px 6px', borderRadius: 10, fontWeight: 700, background: `${DIFFICULTY_COLORS[c.difficulty]}18`, color: DIFFICULTY_COLORS[c.difficulty] }}>{c.difficulty}</span>
            {c.completed && <span style={{ fontSize: 10, color: '#10B981' }}>✓ Done</span>}
          </div>
          <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.4)', margin: '0 0 10px', lineHeight: 1.4 }}>{c.description}</p>
          {!c.completed && c.total > 1 && (
            <div style={{ marginBottom: 8 }}>
              <div style={{ height: 4, background: 'rgba(255,255,255,0.08)', borderRadius: 2, overflow: 'hidden' }}>
                <div style={{ height: '100%', width: `${progressPct}%`, background: 'linear-gradient(90deg,#F59E0B,#EF4444)', borderRadius: 2 }} />
              </div>
              <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.3)', marginTop: 4 }}>{c.progress} / {c.total.toLocaleString()}</div>
            </div>
          )}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', gap: 10 }}>
              <span style={{ fontSize: 12, color: '#F59E0B', fontWeight: 600 }}>⚡ +{c.xp} XP</span>
              <span style={{ fontSize: 12, color: '#10B981', fontWeight: 600 }}>+{c.credits} credits</span>
            </div>
            {!c.completed && <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.25)' }}>⏱ {c.timeLeft}</span>}
          </div>
        </div>
      </div>
    </div>
  )
}

const RARITY_COLORS_MAP = { common: '#9CA3AF', rare: '#6366F1', epic: '#A855F7', legendary: '#F59E0B' }

function AchievementCard({ achievement: a }: { achievement: Achievement }) {
  const rarityColor = RARITY_COLORS_MAP[a.rarity]
  return (
    <div style={{ padding: 14, borderRadius: 14, background: a.unlocked ? 'rgba(255,255,255,0.04)' : 'rgba(255,255,255,0.01)', border: `1px solid ${a.unlocked ? rarityColor + '44' : 'rgba(255,255,255,0.06)'}`, textAlign: 'center' }}>
      <div style={{ fontSize: 30, marginBottom: 6, filter: a.unlocked ? 'none' : 'grayscale(1)' }}>{a.icon}</div>
      <div style={{ fontSize: 12, fontWeight: 700, color: a.unlocked ? '#fff' : 'rgba(255,255,255,0.3)', marginBottom: 4 }}>{a.title}</div>
      <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.25)', marginBottom: 6, lineHeight: 1.4 }}>{a.description}</div>
      {a.progress !== undefined && !a.unlocked && (
        <div>
          <div style={{ height: 3, background: 'rgba(255,255,255,0.08)', borderRadius: 2, overflow: 'hidden', marginBottom: 3 }}>
            <div style={{ height: '100%', width: `${(a.progress / (a.total || 1)) * 100}%`, background: rarityColor, borderRadius: 2 }} />
          </div>
          <div style={{ fontSize: 9, color: 'rgba(255,255,255,0.2)' }}>{a.progress.toLocaleString()} / {(a.total || 0).toLocaleString()}</div>
        </div>
      )}
      <div style={{ fontSize: 10, color: rarityColor, fontWeight: 700, marginTop: 4 }}>+{a.xp} XP · {a.rarity}</div>
    </div>
  )
}