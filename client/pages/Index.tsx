import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Loader2, Github, QrCode, Star, GitFork, Download } from "lucide-react";
import QRCode from "qrcode";

interface GitHubRepo {
  id: number;
  name: string;
  full_name: string;
  description: string;
  html_url: string;
  stargazers_count: number;
  forks_count: number;
  language: string;
  updated_at: string;
}

interface GitHubUser {
  login: string;
  avatar_url: string;
  name: string;
  bio: string;
  public_repos: number;
  followers: number;
  following: number;
}

export default function Index() {
  const [username, setUsername] = useState("khushalmishra11");
  const [user, setUser] = useState<GitHubUser | null>(null);
  const [repos, setRepos] = useState<GitHubRepo[]>([]);
  const [selectedRepo, setSelectedRepo] = useState<GitHubRepo | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [qrCodeUrl, setQrCodeUrl] = useState<string | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Fetch user data and repos on component mount
  useEffect(() => {
    fetchUserData();
  }, []);

  // Generate QR code when selected repo changes
  useEffect(() => {
    if (selectedRepo && user) {
      generateRealtimeQRCode(selectedRepo.html_url);
    }
  }, [selectedRepo, user]);

  const fetchUserData = async (searchUsername = username) => {
    setLoading(true);
    setError(null);
    
    try {
      // Fetch user info
      const userResponse = await fetch(`https://api.github.com/users/${searchUsername}`);
      if (!userResponse.ok) {
        throw new Error("User not found");
      }
      const userData = await userResponse.json();
      setUser(userData);

      // Fetch user repositories
      const reposResponse = await fetch(`https://api.github.com/users/${searchUsername}/repos?sort=updated&per_page=30`);
      if (!reposResponse.ok) {
        throw new Error("Failed to fetch repositories");
      }
      const reposData = await reposResponse.json();
      setRepos(reposData);
      
      // Auto-select first repo
      if (reposData.length > 0) {
        setSelectedRepo(reposData[0]);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
      setUser(null);
      setRepos([]);
      setSelectedRepo(null);
    } finally {
      setLoading(false);
    }
  };

  const generateRealtimeQRCode = async (repoUrl: string) => {
    try {
      const canvas = canvasRef.current;
      if (!canvas || !user) return;

      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      // Set canvas size
      canvas.width = 400;
      canvas.height = 400;

      // Generate QR code
      const qrCodeDataUrl = await QRCode.toDataURL(repoUrl, {
        width: 400,
        margin: 2,
        color: {
          dark: "#1f2937",
          light: "#ffffff"
        }
      });

      // Draw QR code
      const qrImg = new Image();
      qrImg.onload = () => {
        ctx.drawImage(qrImg, 0, 0, 400, 400);

        // Draw white circle for avatar background
        const centerX = 200;
        const centerY = 200;
        const avatarRadius = 50;

        ctx.fillStyle = "white";
        ctx.beginPath();
        ctx.arc(centerX, centerY, avatarRadius + 6, 0, 2 * Math.PI);
        ctx.fill();

        // Load and draw user avatar in center
        const avatarImg = new Image();
        avatarImg.crossOrigin = "anonymous";
        avatarImg.onload = () => {
          ctx.save();
          ctx.beginPath();
          ctx.arc(centerX, centerY, avatarRadius, 0, 2 * Math.PI);
          ctx.clip();
          ctx.drawImage(avatarImg, centerX - avatarRadius, centerY - avatarRadius, avatarRadius * 2, avatarRadius * 2);
          ctx.restore();

          // Convert to data URL for display
          setQrCodeUrl(canvas.toDataURL());
        };
        avatarImg.src = user.avatar_url;
      };
      qrImg.src = qrCodeDataUrl;
    } catch (err) {
      console.error("Failed to generate QR code:", err);
    }
  };

  const downloadQRCode = () => {
    if (qrCodeUrl && selectedRepo) {
      const link = document.createElement("a");
      link.download = `${selectedRepo.name}-qr-code.png`;
      link.href = qrCodeUrl;
      link.click();
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (username.trim()) {
      fetchUserData(username.trim());
    }
  };

  const handleRepoSelect = (repoId: string) => {
    const repo = repos.find(r => r.id.toString() === repoId);
    if (repo) {
      setSelectedRepo(repo);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
        <div className="absolute top-40 left-1/2 w-80 h-80 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
      </div>

      <div className="relative z-10 container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="p-3 bg-white/10 backdrop-blur-sm rounded-full">
              <Github className="h-8 w-8 text-white" />
            </div>
            <div className="p-3 bg-white/10 backdrop-blur-sm rounded-full">
              <QrCode className="h-8 w-8 text-white" />
            </div>
          </div>
          <h1 className="text-4xl font-bold text-white mb-4 bg-gradient-to-r from-white to-purple-200 bg-clip-text text-transparent">
            GitHub QR Generator
          </h1>
          <p className="text-lg text-purple-200 max-w-2xl mx-auto">
            Generate beautiful QR codes for your GitHub repositories with your avatar in the center
          </p>
        </div>

        {/* Search Form */}
        <form onSubmit={handleSearch} className="max-w-md mx-auto mb-8">
          <div className="flex gap-2">
            <Input
              type="text"
              placeholder=""
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="bg-white/10 backdrop-blur-sm border-white/20 text-white placeholder:text-purple-200 focus:border-purple-400"
            />
            <Button 
              type="submit" 
              disabled={loading}
              className="bg-purple-600 hover:bg-purple-700 text-white px-8"
            >
              {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Search"}
            </Button>
          </div>
        </form>

        {error && (
          <div className="max-w-md mx-auto mb-8">
            <Card className="bg-red-500/10 backdrop-blur-sm border-red-500/20">
              <CardContent className="pt-6">
                <p className="text-red-200 text-center">{error}</p>
              </CardContent>
            </Card>
          </div>
        )}

        {user && (
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* User Info & Repository Selection */}
              <div className="space-y-6">
                {/* User Profile */}
                <Card className="bg-white/10 backdrop-blur-sm border-white/20 text-white">
                  <CardHeader>
                    <div className="flex items-center gap-6">
                      <Avatar className="h-16 w-16">
                        <AvatarImage src={user.avatar_url} />
                        <AvatarFallback>{user.login[0].toUpperCase()}</AvatarFallback>
                      </Avatar>
                      <div>
                        <CardTitle className="text-xl">{user.name || user.login}</CardTitle>
                        <CardDescription className="text-purple-200">@{user.login}</CardDescription>
                        {user.bio && <p className="mt-1 text-purple-100 text-sm">{user.bio}</p>}
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="flex gap-6 text-sm">
                      <span><strong>{user.public_repos}</strong> repositories</span>
                      <span><strong>{user.followers}</strong> followers</span>
                      <span><strong>{user.following}</strong> following</span>
                    </div>
                  </CardContent>
                </Card>

                {/* Repository Dropdown */}
                <Card className="bg-white/10 backdrop-blur-sm border-white/20 text-white">
                  <CardHeader>
                    <CardTitle className="text-lg">Select Repository</CardTitle>
                    <CardDescription className="text-purple-200">
                      Choose a repository to generate its QR code
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Select value={selectedRepo?.id.toString()} onValueChange={handleRepoSelect}>
                      <SelectTrigger className="bg-white/10 border-white/20 text-white">
                        <SelectValue placeholder="Select a repository" />
                      </SelectTrigger>
                      <SelectContent className="bg-slate-800 border-slate-700">
                        {repos.map((repo) => (
                          <SelectItem 
                            key={repo.id} 
                            value={repo.id.toString()}
                            className="text-white hover:bg-slate-700 focus:bg-slate-700"
                          >
                            <div className="flex items-center gap-2">
                              <span className="font-medium">{repo.name}</span>
                              {repo.language && (
                                <Badge variant="secondary" className="bg-purple-600/20 text-purple-200 text-xs">
                                  {repo.language}
                                </Badge>
                              )}
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </CardContent>
                </Card>
              </div>

              {/* QR Code Preview */}
              <Card className="bg-white/10 backdrop-blur-sm border-white/20 text-white">
                <CardHeader>
                  <CardTitle className="text-xl flex items-center gap-2">
                    <QrCode className="h-5 w-5" />
                    QR Code Preview
                  </CardTitle>
                  <CardDescription className="text-purple-200">
                    {selectedRepo ? `QR code for ${selectedRepo.name}` : "Select a repository to preview"}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-col items-center">
                    {selectedRepo ? (
                      <>
                        <div className="bg-white p-4 rounded-lg mb-6 shadow-lg">
                          {qrCodeUrl ? (
                            <img 
                              src={qrCodeUrl} 
                              alt={`QR Code for ${selectedRepo.name}`}
                              className="w-64 h-64 object-contain"
                            />
                          ) : (
                            <div className="w-64 h-64 flex items-center justify-center bg-gray-100">
                              <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
                            </div>
                          )}
                        </div>
                        
                        <div className="text-center mb-6">
                          <h3 className="text-lg font-semibold text-white mb-2">{selectedRepo.name}</h3>
                          <p className="text-sm text-purple-200 mb-3">
                            {selectedRepo.description || "No description available"}
                          </p>
                          <div className="flex items-center justify-center gap-4 text-sm text-purple-300">
                            <div className="flex items-center gap-1">
                              <Star className="h-4 w-4" />
                              {selectedRepo.stargazers_count}
                            </div>
                            <div className="flex items-center gap-1">
                              <GitFork className="h-4 w-4" />
                              {selectedRepo.forks_count}
                            </div>
                            {selectedRepo.language && (
                              <Badge variant="secondary" className="bg-purple-600/20 text-purple-200">
                                {selectedRepo.language}
                              </Badge>
                            )}
                          </div>
                        </div>

                        <div className="flex gap-3 w-full">
                          <Button
                            variant="outline"
                            className="flex-1 bg-white/10 border-white/20 text-white hover:bg-white/20"
                            onClick={() => window.open(selectedRepo.html_url, "_blank")}
                          >
                            <Github className="h-4 w-4 mr-2" />
                            View Repo
                          </Button>
                          <Button
                            className="flex-1 bg-purple-600 hover:bg-purple-700 text-white"
                            onClick={downloadQRCode}
                            disabled={!qrCodeUrl}
                          >
                            <Download className="h-4 w-4 mr-2" />
                            Download QR
                          </Button>
                        </div>
                      </>
                    ) : (
                      <div className="w-64 h-64 flex items-center justify-center bg-white/5 rounded-lg border-2 border-dashed border-white/20">
                        <div className="text-center">
                          <QrCode className="h-12 w-12 text-purple-300 mx-auto mb-3" />
                          <p className="text-purple-200">Select a repository</p>
                          <p className="text-sm text-purple-300">to see QR code preview</p>
                        </div>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        )}

        {/* Hidden canvas for QR code generation */}
        <canvas ref={canvasRef} style={{ display: "none" }} />
      </div>
    </div>
  );
}
