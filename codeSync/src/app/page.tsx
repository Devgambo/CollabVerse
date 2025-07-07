"use client";

import {
  SignedOut,
  SignUpButton,
  SignInButton,
  useUser,
  SignedIn,
  UserButton,
} from "@clerk/nextjs";
import { motion } from "framer-motion";
import { Button } from "@/src/components/ui/button";
import { Card, CardContent } from "@/src/components/ui/card";
import { Badge } from "@/src/components/ui/badge";
import {
  Zap,
  Shield,
  Sparkles,
  ArrowRight,
  Terminal,
  // Palette,
  Rocket,
  Star,
  // CheckCircle,
  // Mail,
  // Phone,
  // MapPin,
  Github,
  Linkedin,
  Twitter,
  // MessageSquare,
  Code,
  Users,
  Globe,
  Heart,
  // Coffee,
  // Lightbulb,
  // Target,
  // Award,
  TrendingUp,
} from "lucide-react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";

export default function Home() {
  const user = useUser();
  const router = useRouter();

  const handleNav = () => {
    if (user) {
      router.push("/home");
    }
  };

  const features = [
    {
      icon: <Zap className="w-6 h-6" />,
      title: "Real-time Collaboration",
      description:
        "See changes instantly as your team codes together with zero lag and perfect synchronization",
      color: "from-purple-400 to-pink-500",
      delay: 0.1,
    },
    {
      icon: <Shield className="w-6 h-6" />,
      title: "Enterprise Security",
      description: "Bank-level security with end-to-end encryption and advanced threat protection",
      color: "from-pink-400 to-rose-500",
      delay: 0.2,
    },
    {
      icon: <Sparkles className="w-6 h-6" />,
      title: "AI-Powered Coding",
      description:
        "Intelligent code suggestions and auto-completion powered by cutting-edge AI technology",
      color: "from-violet-400 to-purple-500",
      delay: 0.3,
    },
    {
      icon: <Terminal className="w-6 h-6" />,
      title: "Developer-First Experience",
      description: "Built by developers, for developers, with every detail crafted for productivity",
      color: "from-fuchsia-400 to-pink-500",
      delay: 0.4,
    },
    {
      icon: <Users className="w-6 h-6" />,
      title: "Team Management",
      description: "Advanced team collaboration tools with role-based permissions and project organization",
      color: "from-purple-500 to-indigo-500",
      delay: 0.5,
    },
    {
      icon: <Globe className="w-6 h-6" />,
      title: "Global Accessibility",
      description: "Work from anywhere with cloud-based infrastructure and lightning-fast performance",
      color: "from-pink-500 to-rose-500",
      delay: 0.6,
    },
  ];

  const benefits = [
    "⚡ Instant setup in under 60 seconds",
    "🔥 Works with 10+ programming languages",
    "💬 Integrated chat",
    "🤖 Ai Powered",
    "🎯 Real-time cursor tracking",
    "🌈 Advanced syntax highlighting",
    "🚀 Live code execution",
    "🔒 Private and secure workspaces",
  ];

  const stats = [
    { number: "10K+", label: "Developers", icon: <Users className="w-6 h-6" /> },
    { number: "50+", label: "Languages", icon: <Code className="w-6 h-6" /> },
    { number: "99.9%", label: "Uptime", icon: <TrendingUp className="w-6 h-6" /> },
    { number: "24/7", label: "Support", icon: <Heart className="w-6 h-6" /> },
  ];

  return (
    <div className="relative overflow-hidden bg-gradient-to-br from-purple-950 via-slate-900 to-pink-950 min-h-screen">
      {/* Enhanced Animated Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-gradient-to-r from-pink-500/20 to-purple-500/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-3/4 left-1/3 w-64 h-64 bg-gradient-to-r from-violet-500/20 to-fuchsia-500/20 rounded-full blur-3xl animate-pulse delay-500"></div>
        <div className="absolute top-1/2 right-1/3 w-48 h-48 bg-gradient-to-r from-rose-500/20 to-pink-500/20 rounded-full blur-3xl animate-pulse delay-700"></div>
      </div>

      {/* Navigation */}
      <nav className="relative z-50 px-6 py-4">
        <div className="container mx-auto flex justify-between items-center">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Image className="w-32 h-auto" src="/logo.png" alt="CodeSync" />
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="flex items-center space-x-4"
          >
            <Link href="/about">
              <Button
                variant="ghost"
                className="text-white hover:text-pink-300 hover:bg-purple-800/30 transition-all duration-300"
              >
                About
              </Button>
            </Link>
            <SignedOut>
              <SignInButton mode="modal">
                <Button
                  variant="ghost"
                  className="text-white hover:text-pink-300 hover:bg-purple-800/30 transition-all duration-300"
                >
                  Sign In
                </Button>
              </SignInButton>
            </SignedOut>
            <SignedIn>
              <UserButton />
            </SignedIn>
          </motion.div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="relative">
        <div className="container mx-auto px-6 py-10 lg:py-8">
          <motion.div
            className="max-w-6xl mx-auto text-center"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: "easeOut" }}
          >
            <motion.div
              className="flex justify-center mb-8"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2, duration: 0.8 }}
            >
              <Badge className="bg-gradient-to-r from-purple-500/20 to-pink-500/20 text-white border-purple-500/30 px-6 py-2 text-sm font-medium">
                ✨ The Future of Collaborative Coding
              </Badge>
            </motion.div>

            <motion.h1
              className="text-5xl md:text-7xl lg:text-8xl font-black mb-8 leading-tight"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.8 }}
            >
              <span className="bg-gradient-to-r from-white via-purple-200 to-pink-200 bg-clip-text text-transparent">
                Code Together
              </span>
              <br />
              <span className="text-4xl md:text-6xl lg:text-7xl bg-gradient-to-r from-purple-400 via-pink-500 to-rose-500 bg-clip-text text-transparent">
                Build the Future
              </span>
            </motion.h1>

            <motion.p
              className="text-xl md:text-2xl text-purple-100 mb-12 max-w-4xl mx-auto leading-relaxed"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.8 }}
            >
              The most advanced collaborative code editor that{" "}
              <span className=" font-semibold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                transforms how teams code
              </span>{" "}
              together. Built for developers, bootcamp mentors, and modern development teams.
            </motion.p>

            <motion.div
              className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-16"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.8 }}
            >
              <SignedOut>
                <SignUpButton mode="modal">
                  <Button className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-12 py-6 rounded-2xl text-lg font-bold transform hover:scale-105 transition-all duration-300 shadow-2xl shadow-purple-500/25 relative overflow-hidden group">
                    <span className="relative z-10 flex items-center">
                      <Sparkles className="w-5 h-5 mr-2" />
                      Start Free Trial
                      <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                    </span>
                    <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-pink-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  </Button>
                </SignUpButton>
                <SignInButton mode="modal">
                  <Button
                    variant="outline"
                    className="bg-purple-900/30 border-purple-500/50 text-purple-100 hover:bg-purple-800/50 hover:text-white px-12 py-6 rounded-2xl text-lg font-semibold backdrop-blur-sm transition-all duration-300 hover:border-pink-500/50"
                  >
                    Sign In
                  </Button>
                </SignInButton>
              </SignedOut>
              <SignedIn>
                <Button
                  onClick={handleNav}
                  className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-12 py-6 rounded-2xl text-lg font-bold transform hover:scale-105 transition-all duration-300"
                >
                  <Terminal className="w-5 h-5 mr-2" />
                  Go to Dashboard
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
                <UserButton />
              </SignedIn>
            </motion.div>

            {/* Stats Section */}
            <motion.div
              className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.8 }}
            >
              {stats.map((stat, index) => (
                <motion.div
                  key={index}
                  className="text-center group"
                  whileHover={{ scale: 1.05 }}
                  transition={{ duration: 0.2 }}
                >
                  <div className="flex justify-center mb-2 text-pink-400 group-hover:text-purple-400 transition-colors">
                    {stat.icon}
                  </div>
                  <div className="text-3xl font-bold text-white mb-1">{stat.number}</div>
                  <div className="text-purple-200 text-sm">{stat.label}</div>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>
        </div>
      </div>

      {/* Features Grid */}
      <div className="container mx-auto px-6 py-20">
        <motion.div
          className="text-center mb-20"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.8 }}
        >
          <h2 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
            Revolutionary Features
          </h2>
          <p className="text-purple-200 text-xl max-w-3xl mx-auto leading-relaxed">
            Every feature crafted with precision for the ultimate developer experience and team productivity
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.9 + feature.delay, duration: 0.6 }}
              whileHover={{ y: -10, scale: 1.02 }}
              className="h-full"
            >
              <Card className="bg-gradient-to-br from-purple-900/40 to-pink-900/40 border-purple-500/30 hover:border-pink-500/50 transition-all duration-300 group h-full backdrop-blur-sm hover:shadow-2xl hover:shadow-purple-500/25">
                <CardContent className="p-8 text-center h-full flex flex-col">
                  <motion.div
                    className={`w-16 h-16 rounded-2xl bg-gradient-to-r ${feature.color} flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg`}
                    whileHover={{ rotate: 5 }}
                  >
                    <div className="text-white">{feature.icon}</div>
                  </motion.div>
                  <h3 className="text-xl font-bold mb-4 text-white group-hover:text-pink-300 transition-colors">
                    {feature.title}
                  </h3>
                  <p className="text-purple-200 text-base leading-relaxed flex-grow">
                    {feature.description}
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Benefits Section */}
      <div className="container mx-auto px-6 py-20">
        <motion.div
          className="max-w-5xl mx-auto"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.2, duration: 0.8 }}
        >
          <Card className="bg-gradient-to-r from-purple-900/60 to-pink-900/60 border-purple-500/40 backdrop-blur-lg relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-purple-600/10 to-pink-600/10"></div>
            <CardContent className="p-12 relative z-10">
              <div className="text-center mb-12">
                <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
                  Why Developers Love CodeSync
                </h2>
                <p className="text-purple-200 text-lg">
                  Everything you need for seamless collaboration and productivity
                </p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {benefits.map((benefit, index) => (
                  <motion.div
                    key={index}
                    className="flex items-center space-x-4 p-3 rounded-lg hover:bg-purple-800/30 transition-all duration-300 group"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 1.3 + index * 0.1, duration: 0.5 }}
                    whileHover={{ scale: 1.02 }}
                  >
                    <div className="text-2xl group-hover:scale-110 transition-transform">
                      {benefit.split(' ')[0]}
                    </div>
                    <span className="text-purple-200 group-hover:text-white transition-colors">
                      {benefit.split(' ').slice(1).join(' ')}
                    </span>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Final CTA */}
      <div className="container mx-auto px-6 py-20">
        <motion.div
          className="max-w-4xl mx-auto text-center"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.4, duration: 0.8 }}
        >
          <Card className="bg-gradient-to-r from-purple-900/80 to-pink-900/80 border-purple-500/50 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-purple-600/10 to-pink-600/10"></div>
            <CardContent className="p-16 relative z-10">
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 1.5, duration: 0.8 }}
              >
                <div className="flex justify-center mb-6">
                  <div className="flex space-x-1">
                    {[...Array(5)].map((_, i) => (
                      <motion.div
                        key={i}
                        initial={{ opacity: 0, scale: 0 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 1.6 + i * 0.1, duration: 0.3 }}
                      >
                        <Star className="w-8 h-8 text-yellow-400 fill-current" />
                      </motion.div>
                    ))}
                  </div>
                </div>
                <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                  Join 10,000+ Happy Developers
                </h2>
                <p className="text-purple-200 text-xl mb-10 max-w-2xl mx-auto">
                  Experience the future of collaborative coding today. Transform how your team builds software.
                </p>
                <SignedOut>
                  <SignUpButton mode="modal">
                    <Button className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-16 py-8 rounded-2xl text-2xl font-bold transform hover:scale-105 transition-all duration-300 shadow-2xl shadow-purple-500/25 relative overflow-hidden group">
                      <span className="relative z-10 flex items-center">
                        <Rocket className="w-8 h-8 mr-4" />
                        Start Your Free Trial
                        <ArrowRight className="w-8 h-8 ml-4 group-hover:translate-x-1 transition-transform" />
                      </span>
                      <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-pink-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    </Button>
                  </SignUpButton>
                </SignedOut>
                <SignedIn>
                  <Button
                    onClick={handleNav}
                    className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-16 py-8 rounded-2xl text-2xl font-bold transform hover:scale-105 transition-all duration-300"
                  >
                    <Terminal className="w-8 h-8 mr-4" />
                    Go to Dashboard
                    <ArrowRight className="w-8 h-8 ml-4" />
                  </Button>
                </SignedIn>
                <p className="text-purple-300 mt-8 text-lg">
                  ✨ No commitment • Cancel anytime • Setup in under 60 seconds
                </p>
              </motion.div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Footer */}
      <footer className="bg-gradient-to-r from-purple-950 to-pink-950 border-t border-purple-500/20 py-16">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
            <div className="space-y-4">
              <Image className="w-32 h-auto" src="/logo.png" alt="CodeSync" />
              <p className="text-purple-200">
                The future of collaborative coding. Built for developers who dream big.
              </p>
              <div className="flex space-x-4">
                <a href="#" className="text-purple-300 hover:text-pink-300 transition-colors">
                  <Twitter className="w-5 h-5" />
                </a>
                <a href="#" className="text-purple-300 hover:text-pink-300 transition-colors">
                  <Github className="w-5 h-5" />
                </a>
                <a href="#" className="text-purple-300 hover:text-pink-300 transition-colors">
                  <Linkedin className="w-5 h-5" />
                </a>
              </div>
            </div>
            
            <div>
              <h4 className="text-white font-semibold mb-4">Product</h4>
              <ul className="space-y-2">
                <li><a href="#" className="text-purple-200 hover:text-pink-300 transition-colors">Features</a></li>
                <li><a href="#" className="text-purple-200 hover:text-pink-300 transition-colors">Pricing</a></li>
                <li><a href="#" className="text-purple-200 hover:text-pink-300 transition-colors">Documentation</a></li>
                <li><a href="#" className="text-purple-200 hover:text-pink-300 transition-colors">API</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="text-white font-semibold mb-4">Company</h4>
              <ul className="space-y-2">
                <li><Link href="/about" className="text-purple-200 hover:text-pink-300 transition-colors">About</Link></li>
                <li><a href="#" className="text-purple-200 hover:text-pink-300 transition-colors">Blog</a></li>
                <li><a href="#" className="text-purple-200 hover:text-pink-300 transition-colors">Careers</a></li>
                <li><a href="#" className="text-purple-200 hover:text-pink-300 transition-colors">Contact</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="text-white font-semibold mb-4">Support</h4>
              <ul className="space-y-2">
                <li><a href="#" className="text-purple-200 hover:text-pink-300 transition-colors">Help Center</a></li>
                <li><a href="#" className="text-purple-200 hover:text-pink-300 transition-colors">Community</a></li>
                <li><a href="#" className="text-purple-200 hover:text-pink-300 transition-colors">Status</a></li>
                <li><a href="#" className="text-purple-200 hover:text-pink-300 transition-colors">Privacy</a></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-purple-500/20 mt-12 pt-8 text-center">
            <p className="text-purple-300">
              &copy; 2024 CodeSync. All rights reserved. Made with <Heart className="w-4 h-4 inline text-pink-400" /> by developers, for developers.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}