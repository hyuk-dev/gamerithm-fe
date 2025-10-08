"use client"

import { useState } from "react"
import { Navigation } from "@/components/navigation"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Slider } from "@/components/ui/slider"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { User, SettingsIcon, Shield, Bell, LinkIcon } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

type Section = "account" | "preferences" | "privacy" | "notifications" | "connected"

export default function SettingsPage() {
  const [activeSection, setActiveSection] = useState<Section>("account")
  const { toast } = useToast()

  const handleSave = () => {
    toast({
      title: "Settings saved successfully!",
      description: "Your changes have been applied.",
    })
  }

  return (
    <div className="min-h-screen bg-[#0f0f23] text-white">
      <Navigation />

      <main className="pt-20">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <h1 className="text-3xl md:text-4xl font-bold mb-8">Settings</h1>

          <div className="flex flex-col lg:flex-row gap-8">
            <Sidebar activeSection={activeSection} setActiveSection={setActiveSection} />

            <div className="flex-1">
              {activeSection === "account" && <AccountSection onSave={handleSave} />}
              {activeSection === "preferences" && <PreferencesSection onSave={handleSave} />}
              {activeSection === "privacy" && <PrivacySection onSave={handleSave} />}
              {activeSection === "notifications" && <NotificationsSection onSave={handleSave} />}
              {activeSection === "connected" && <ConnectedServicesSection />}
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

function Sidebar({
  activeSection,
  setActiveSection,
}: {
  activeSection: Section
  setActiveSection: (section: Section) => void
}) {
  const sections = [
    { id: "account" as Section, label: "Account", icon: User },
    { id: "preferences" as Section, label: "Preferences", icon: SettingsIcon },
    { id: "privacy" as Section, label: "Privacy", icon: Shield },
    { id: "notifications" as Section, label: "Notifications", icon: Bell },
    { id: "connected" as Section, label: "Connected Services", icon: LinkIcon },
  ]

  return (
    <Card className="bg-gray-900/50 border-gray-800 p-4 h-fit lg:w-64 backdrop-blur-sm">
      <nav className="space-y-2">
        {sections.map((section) => {
          const Icon = section.icon
          return (
            <button
              key={section.id}
              onClick={() => setActiveSection(section.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                activeSection === section.id
                  ? "bg-purple-600 text-white"
                  : "text-gray-400 hover:bg-gray-800 hover:text-white"
              }`}
            >
              <Icon className="w-5 h-5" />
              <span className="font-medium">{section.label}</span>
            </button>
          )
        })}
      </nav>
    </Card>
  )
}

function AccountSection({ onSave }: { onSave: () => void }) {
  const [showDeleteModal, setShowDeleteModal] = useState(false)

  return (
    <div className="space-y-6">
      <Card className="bg-gray-900/50 border-gray-800 p-6 backdrop-blur-sm">
        <h2 className="text-2xl font-bold mb-6">Account Settings</h2>

        <div className="space-y-6">
          <div className="flex items-center gap-6">
            <div className="relative">
              <img src="/diverse-gaming-avatars.png" alt="Profile" className="w-24 h-24 rounded-full bg-gray-800" />
              <Button size="sm" className="absolute bottom-0 right-0 rounded-full bg-purple-600 hover:bg-purple-700">
                Edit
              </Button>
            </div>
            <div>
              <h3 className="font-semibold mb-1">Profile Picture</h3>
              <p className="text-sm text-gray-400">Upload a new profile picture</p>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="displayName">Display Name</Label>
            <Input
              id="displayName"
              defaultValue="ProGamer2024"
              className="bg-gray-800 border-gray-700 focus:border-purple-500"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              defaultValue="progamer@steam.com"
              disabled
              className="bg-gray-800 border-gray-700 opacity-50 cursor-not-allowed"
            />
            <p className="text-sm text-gray-400">Email is synced from your Steam account</p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="steamId">Steam ID</Label>
            <Input
              id="steamId"
              defaultValue="76561198012345678"
              disabled
              className="bg-gray-800 border-gray-700 opacity-50 cursor-not-allowed"
            />
          </div>

          <div className="flex gap-3 pt-4">
            <Button onClick={onSave} className="bg-purple-600 hover:bg-purple-700">
              Save Changes
            </Button>
          </div>
        </div>
      </Card>

      <Card className="bg-gray-900/50 border-gray-800 border-red-900/50 p-6 backdrop-blur-sm">
        <h3 className="text-xl font-bold text-red-400 mb-4">Danger Zone</h3>
        <p className="text-gray-400 mb-4">Once you delete your account, there is no going back. Please be certain.</p>
        <Button variant="destructive" onClick={() => setShowDeleteModal(true)} className="bg-red-600 hover:bg-red-700">
          Delete Account
        </Button>
      </Card>

      {showDeleteModal && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
          <Card className="bg-gray-900 border-gray-800 p-6 max-w-md w-full">
            <h3 className="text-xl font-bold mb-4">Confirm Account Deletion</h3>
            <p className="text-gray-400 mb-6">
              Are you sure you want to delete your account? This action cannot be undone.
            </p>
            <div className="flex gap-3">
              <Button variant="outline" onClick={() => setShowDeleteModal(false)} className="flex-1">
                Cancel
              </Button>
              <Button variant="destructive" className="flex-1 bg-red-600 hover:bg-red-700">
                Delete
              </Button>
            </div>
          </Card>
        </div>
      )}
    </div>
  )
}

function PreferencesSection({ onSave }: { onSave: () => void }) {
  const [priceRange, setPriceRange] = useState([60])
  const genres = ["Action", "RPG", "Strategy", "Indie", "Simulation", "Sports", "Racing", "Horror"]

  return (
    <Card className="bg-gray-900/50 border-gray-800 p-6 backdrop-blur-sm">
      <h2 className="text-2xl font-bold mb-6">Preferences</h2>

      <div className="space-y-8">
        <div>
          <h3 className="text-lg font-semibold mb-4">Recommendation Settings</h3>
          <div className="space-y-4">
            <div>
              <Label className="mb-3 block">Genre Preferences</Label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {genres.map((genre) => (
                  <div key={genre} className="flex items-center space-x-2">
                    <Checkbox id={genre} />
                    <label htmlFor={genre} className="text-sm cursor-pointer">
                      {genre}
                    </label>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex items-center justify-between py-3">
              <div>
                <Label htmlFor="earlyAccess">Include Early Access games</Label>
                <p className="text-sm text-gray-400">Show games still in development</p>
              </div>
              <Switch id="earlyAccess" />
            </div>

            <div className="flex items-center justify-between py-3">
              <div>
                <Label htmlFor="ownedGames">Show games I already own</Label>
                <p className="text-sm text-gray-400">Include owned games in recommendations</p>
              </div>
              <Switch id="ownedGames" />
            </div>

            <div className="space-y-3">
              <Label>Price Range: ${priceRange[0]}+</Label>
              <Slider value={priceRange} onValueChange={setPriceRange} max={60} step={5} className="w-full" />
              <div className="flex justify-between text-sm text-gray-400">
                <span>Free</span>
                <span>$60+</span>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-800 pt-6">
          <h3 className="text-lg font-semibold mb-4">General Settings</h3>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="language">Language</Label>
              <Select defaultValue="en">
                <SelectTrigger className="bg-gray-800 border-gray-700">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="en">English</SelectItem>
                  <SelectItem value="ko">Korean</SelectItem>
                  <SelectItem value="ja">Japanese</SelectItem>
                  <SelectItem value="es">Spanish</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center justify-between py-3">
              <div>
                <Label htmlFor="theme">Dark Mode</Label>
                <p className="text-sm text-gray-400">Currently enabled</p>
              </div>
              <Switch id="theme" defaultChecked />
            </div>
          </div>
        </div>

        <Button onClick={onSave} className="bg-purple-600 hover:bg-purple-700">
          Save Preferences
        </Button>
      </div>
    </Card>
  )
}

function PrivacySection({ onSave }: { onSave: () => void }) {
  return (
    <Card className="bg-gray-900/50 border-gray-800 p-6 backdrop-blur-sm">
      <h2 className="text-2xl font-bold mb-6">Privacy Settings</h2>

      <div className="space-y-6">
        <div className="flex items-center justify-between py-4 border-b border-gray-800">
          <div>
            <Label htmlFor="publicLibrary">Make my library public</Label>
            <p className="text-sm text-gray-400">Allow others to view your game library</p>
          </div>
          <Switch id="publicLibrary" />
        </div>

        <div className="flex items-center justify-between py-4 border-b border-gray-800">
          <div>
            <Label htmlFor="analyzePlaytime">Allow AI to analyze my playtime</Label>
            <p className="text-sm text-gray-400">Used to improve recommendation accuracy</p>
          </div>
          <Switch id="analyzePlaytime" defaultChecked />
        </div>

        <div className="flex items-center justify-between py-4 border-b border-gray-800">
          <div>
            <Label htmlFor="shareRecommendations">Share recommendations with friends</Label>
            <p className="text-sm text-gray-400">Let friends see your recommended games</p>
          </div>
          <Switch id="shareRecommendations" />
        </div>

        <Button onClick={onSave} className="bg-purple-600 hover:bg-purple-700 mt-4">
          Save Privacy Settings
        </Button>
      </div>
    </Card>
  )
}

function NotificationsSection({ onSave }: { onSave: () => void }) {
  return (
    <Card className="bg-gray-900/50 border-gray-800 p-6 backdrop-blur-sm">
      <h2 className="text-2xl font-bold mb-6">Notification Settings</h2>

      <div className="space-y-6">
        <div>
          <h3 className="text-lg font-semibold mb-4">Email Notifications</h3>
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <Checkbox id="newRecommendations" defaultChecked />
              <div>
                <label htmlFor="newRecommendations" className="font-medium cursor-pointer">
                  New recommendations available
                </label>
                <p className="text-sm text-gray-400">Get notified when new games match your preferences</p>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <Checkbox id="wishlistSale" defaultChecked />
              <div>
                <label htmlFor="wishlistSale" className="font-medium cursor-pointer">
                  Game on wishlist is on sale
                </label>
                <p className="text-sm text-gray-400">Alert when wishlist items go on sale</p>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <Checkbox id="weeklySummary" />
              <div>
                <label htmlFor="weeklySummary" className="font-medium cursor-pointer">
                  Weekly summary
                </label>
                <p className="text-sm text-gray-400">Receive a weekly digest of your gaming activity</p>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-800 pt-6">
          <h3 className="text-lg font-semibold mb-4">Browser Notifications</h3>
          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="browserNotifications">Enable browser notifications</Label>
              <p className="text-sm text-gray-400">Get real-time updates in your browser</p>
            </div>
            <Switch id="browserNotifications" />
          </div>
        </div>

        <Button onClick={onSave} className="bg-purple-600 hover:bg-purple-700 mt-4">
          Save Notification Settings
        </Button>
      </div>
    </Card>
  )
}

function ConnectedServicesSection() {
  return (
    <Card className="bg-gray-900/50 border-gray-800 p-6 backdrop-blur-sm">
      <h2 className="text-2xl font-bold mb-6">Connected Services</h2>

      <div className="space-y-6">
        <div className="flex items-start gap-4 p-4 bg-gray-800/50 rounded-lg border border-gray-700">
          <div className="w-16 h-16 bg-gray-700 rounded-lg flex items-center justify-center">
            <svg className="w-10 h-10 text-white" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2a10 10 0 0 0-10 10 10 10 0 0 0 10 10 10 10 0 0 0 10-10A10 10 0 0 0 12 2zm0 1.5a8.5 8.5 0 0 1 8.5 8.5 8.5 8.5 0 0 1-8.5 8.5A8.5 8.5 0 0 1 3.5 12 8.5 8.5 0 0 1 12 3.5zm-1.5 3v1.793L7.707 11.086a2 2 0 0 0-1.414.586l-1.5 1.5a2 2 0 0 0 0 2.828 2 2 0 0 0 2.828 0l1.5-1.5a2 2 0 0 0 .586-1.414L12.5 10.293V6.5h-2z" />
            </svg>
          </div>

          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <h3 className="text-lg font-semibold">Steam</h3>
              <span className="px-2 py-1 bg-green-600 text-xs rounded-full">Connected</span>
            </div>
            <p className="text-sm text-gray-400 mb-1">ProGamer2024</p>
            <p className="text-sm text-gray-400 mb-3">Steam ID: 76561198012345678</p>
            <p className="text-xs text-gray-500">Last synced: 2 hours ago</p>
          </div>

          <div className="flex flex-col gap-2">
            <Button variant="outline" size="sm" className="border-gray-700 hover:bg-gray-800 bg-transparent">
              Sync Now
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="border-red-700 text-red-400 hover:bg-red-900/20 bg-transparent"
            >
              Disconnect
            </Button>
          </div>
        </div>

        <div className="p-4 bg-gray-800/30 rounded-lg border border-gray-700 border-dashed">
          <p className="text-gray-400 text-center">More integrations coming soon!</p>
        </div>
      </div>
    </Card>
  )
}
