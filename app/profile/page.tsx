import { User, Settings, Bell, Bookmark, Heart, MapPin } from 'lucide-react';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Profile',
  description: 'Your Ummah Hub profile and preferences.',
};

// Mock user for demo
const MOCK_USER = {
  name: 'Guest User',
  email: 'guest@example.com',
  city: 'Teaneck',
  state: 'NJ',
  interests: ['Quran', 'Youth', 'Volunteering', 'Education'],
  followedOrgs: ['Masjid Al-Wadud', 'Teaneck MYA'],
};

export default function ProfilePage() {
  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-6">

      {/* Profile header */}
      <div className="bg-gradient-to-br from-emerald-600 to-teal-700 rounded-3xl p-6 text-white text-center mb-6">
        <div className="w-20 h-20 rounded-full bg-white/20 flex items-center justify-center mx-auto mb-3">
          <User className="w-10 h-10 text-white" />
        </div>
        <h1 className="text-xl font-bold">{MOCK_USER.name}</h1>
        <div className="flex items-center justify-center gap-1 text-emerald-100 text-sm mt-1">
          <MapPin className="w-3.5 h-3.5" />
          {MOCK_USER.city}, {MOCK_USER.state}
        </div>
        <button className="mt-4 bg-white/20 hover:bg-white/30 text-white px-6 py-2 rounded-xl text-sm font-medium transition-colors">
          Sign In / Create Account
        </button>
      </div>

      {/* Interests */}
      <div className="bg-white rounded-2xl border border-stone-100 shadow-sm p-4 mb-4">
        <h2 className="font-semibold text-stone-900 mb-3 flex items-center gap-2">
          <Heart className="w-4 h-4 text-emerald-600" />
          My Interests
        </h2>
        <div className="flex flex-wrap gap-2">
          {MOCK_USER.interests.map(interest => (
            <span key={interest} className="px-3 py-1 bg-emerald-50 text-emerald-700 rounded-full text-sm font-medium">
              {interest}
            </span>
          ))}
          <button className="px-3 py-1 bg-stone-100 text-stone-500 rounded-full text-sm hover:bg-stone-200 transition-colors">
            + Add
          </button>
        </div>
      </div>

      {/* Followed orgs */}
      <div className="bg-white rounded-2xl border border-stone-100 shadow-sm p-4 mb-4">
        <h2 className="font-semibold text-stone-900 mb-3 flex items-center gap-2">
          🕌 Following
        </h2>
        <div className="space-y-2">
          {MOCK_USER.followedOrgs.map(org => (
            <div key={org} className="flex items-center justify-between py-2 border-b border-stone-100 last:border-0">
              <span className="text-sm text-stone-700">{org}</span>
              <button className="text-xs text-stone-400 hover:text-red-500 transition-colors">Unfollow</button>
            </div>
          ))}
        </div>
      </div>

      {/* Settings */}
      <div className="bg-white rounded-2xl border border-stone-100 shadow-sm overflow-hidden">
        {[
          { icon: Bookmark, label: 'Saved Events & Resources' },
          { icon: Bell, label: 'Notification Preferences' },
          { icon: MapPin, label: 'Change City' },
          { icon: Settings, label: 'Settings' },
        ].map(({ icon: Icon, label }) => (
          <button
            key={label}
            className="w-full flex items-center gap-3 px-4 py-3.5 text-sm text-stone-700 hover:bg-stone-50 transition-colors border-b border-stone-100 last:border-0 text-left"
          >
            <Icon className="w-4 h-4 text-emerald-600" />
            {label}
            <span className="ml-auto text-stone-300">›</span>
          </button>
        ))}
      </div>

      {/* Version note */}
      <p className="text-center text-xs text-stone-400 mt-6">
        Ummah Hub · Teaneck, NJ · Authentication coming soon
      </p>
    </div>
  );
}
