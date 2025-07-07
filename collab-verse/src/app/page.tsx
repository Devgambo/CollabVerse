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
  Palette,
  Rocket,
  Star,
  CheckCircle,
} from "lucide-react";
import { useRouter } from "next/navigation";

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
        "See changes instantly as your team codes together with zero lag",
      color: "from-yellow-400 to-orange-500",
      delay: 0.1,
    },
    {
      icon: <Shield className="w-6 h-6" />,
      title: "Secure by Design",
      description: "Enterprise-grade security with end-to-end encryption",
      color: "from-green-400 to-emerald-500",
      delay: 0.2,
    },
    {
      icon: <Palette className="w-6 h-6" />,
      title: "Beautiful Interface",
      description:
        "Crafted for developers who value aesthetics and productivity",
      color: "from-purple-400 to-pink-500",
      delay: 0.3,
    },
    {
      icon: <Terminal className="w-6 h-6" />,
      title: "Developer-First",
      description: "Built by developers, for developers, with love",
      color: "from-blue-400 to-cyan-500",
      delay: 0.4,
    },
  ];

  const benefits = [
    "Instant setup in under 60 seconds",
    "Works with all major languages",
    "Integrated chat and video calls",
    "Real-time cursor tracking",
    "Advanced syntax highlighting",
    "Built-in version control",
  ];

  const stats = [
    { number: "50K+", label: "Active Developers" },
    { number: "99.9%", label: "Uptime" },
    { number: "10M+", label: "Lines of Code" },
    { number: "24/7", label: "Support" },
  ];

  return (
    <div className="relative overflow-hidden bg-gradient-to-br from-slate-950 via-slate-900 to-slate-800 min-h-screen">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-3/4 left-1/3 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl animate-pulse delay-500"></div>
      </div>

      {/* Hero Section */}
      <div className="relative">
        <div className="container mx-auto px-6 py-20 lg:py-32">
          <motion.div
            className="max-w-5xl mx-auto text-center"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: "easeOut" }}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2, duration: 0.8 }}
            >
              <Badge className="mb-8 bg-gradient-to-r from-blue-500/20 to-purple-500/20 text-blue-300 border-blue-500/30 px-6 py-2 text-sm font-medium">
                <Sparkles className="w-4 h-4 mr-2" />
                Free Trial Available • No Credit Card Required
              </Badge>
            </motion.div>

            <motion.h1
              className="text-5xl md:text-7xl lg:text-8xl font-black mb-8 leading-tight"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.8 }}
            >
              <span className="bg-gradient-to-r from-white via-slate-200 to-slate-400 bg-clip-text text-transparent">
                Code Together
              </span>
              <br />
              <span className="text-4xl md:text-6xl lg:text-7xl bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 bg-clip-text text-transparent">
                in Perfect Harmony
              </span>
            </motion.h1>

            <motion.p
              className="text-xl md:text-2xl text-slate-300 mb-12 max-w-4xl mx-auto leading-relaxed"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.8 }}
            >
              The collaborative code editor that{" "}
              <span className="text-white font-semibold">actually works</span>{" "}
              for developers, bootcamp mentors, and modern development teams
            </motion.p>

            <motion.div
              className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-12"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.8 }}
            >
              <SignedOut>
                <SignUpButton mode="modal">
                  <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-10 py-5 rounded-2xl text-lg font-bold transform hover:scale-105 transition-all duration-300 shadow-2xl shadow-blue-500/25 relative overflow-hidden group">
                    <span className="relative z-10 flex items-center">
                      Start Free Trial
                      <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                    </span>
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  </Button>
                </SignUpButton>
                <SignInButton mode="modal">
                  <Button
                    variant="outline"
                    className="bg-slate-800/30 border-slate-600 text-slate-300 hover:bg-slate-700 hover:text-white px-10 py-5 rounded-2xl text-lg font-semibold backdrop-blur-sm transition-all duration-300"
                  >
                    Sign In
                  </Button>
                </SignInButton>
              </SignedOut>
              <SignedIn>
                <Button
                  onClick={handleNav}
                  className="bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white px-10 py-5 rounded-2xl text-lg font-bold transform hover:scale-105 transition-all duration-300"
                >
                  Go to Dashboard
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
                <UserButton />
              </SignedIn>
            </motion.div>

            {/* Stats */}
            <motion.div
              className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-3xl mx-auto"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.8 }}
            >
              {stats.map((stat, index) => (
                <motion.div
                  key={index}
                  className="text-center"
                  initial={{ opacity: 0, scale: 0.5 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.7 + index * 0.1, duration: 0.5 }}
                >
                  <div className="text-2xl md:text-3xl font-bold text-white mb-1">
                    {stat.number}
                  </div>
                  <div className="text-slate-400 text-sm">{stat.label}</div>
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
          <h2 className="text-4xl md:text-5xl font-bold mb-6 text-white">
            Built for Modern Development Teams
          </h2>
          <p className="text-slate-400 text-xl max-w-3xl mx-auto leading-relaxed">
            Every feature designed with developer experience and team
            productivity in mind
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-7xl mx-auto">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.9 + feature.delay, duration: 0.6 }}
              whileHover={{ y: -10 }}
              className="h-full"
            >
              <Card className="bg-slate-900/50 border-slate-700 hover:border-slate-600 transition-all duration-300 group h-full backdrop-blur-sm hover:shadow-2xl hover:shadow-slate-900/50">
                <CardContent className="p-8 text-center h-full flex flex-col">
                  <motion.div
                    className={`w-16 h-16 rounded-2xl bg-gradient-to-r ${feature.color} flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300`}
                    whileHover={{ rotate: 5 }}
                  >
                    <div className="text-white">{feature.icon}</div>
                  </motion.div>
                  <h3 className="text-xl font-bold mb-4 text-white group-hover:text-blue-300 transition-colors">
                    {feature.title}
                  </h3>
                  <p className="text-slate-400 text-base leading-relaxed flex-grow">
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
          className="max-w-4xl mx-auto"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.2, duration: 0.8 }}
        >
          <Card className="bg-gradient-to-r from-slate-900/80 to-slate-800/80 border-slate-700 backdrop-blur-lg">
            <CardContent className="p-12">
              <div className="text-center mb-12">
                <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                  Why Developers Choose Us
                </h2>
                <p className="text-slate-300 text-lg">
                  Everything you need for seamless collaboration
                </p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {benefits.map((benefit, index) => (
                  <motion.div
                    key={index}
                    className="flex items-center space-x-3"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 1.3 + index * 0.1, duration: 0.5 }}
                  >
                    <CheckCircle className="w-5 h-5 text-emerald-400 flex-shrink-0" />
                    <span className="text-slate-300">{benefit}</span>
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
          <Card className="bg-gradient-to-r from-slate-900 to-slate-800 border-slate-700 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 to-purple-600/10"></div>
            <CardContent className="p-16 relative z-10">
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 1.5, duration: 0.8 }}
              >
                <div className="flex justify-center mb-6">
                  <div className="flex space-x-1">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className="w-6 h-6 text-yellow-400 fill-current"
                      />
                    ))}
                  </div>
                </div>
                <h2 className="text-4xl md:text-5xl font-bold mb-6 text-white">
                  Join 50,000+ Developers
                </h2>
                <p className="text-slate-300 text-xl mb-10 max-w-2xl mx-auto">
                  Experience the future of collaborative coding today. Start
                  your free trial and see why teams love us.
                </p>
                <SignedOut>
                  <SignUpButton mode="modal">
                    <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-12 py-6 rounded-2xl text-xl font-bold transform hover:scale-105 transition-all duration-300 shadow-2xl shadow-blue-500/25 relative overflow-hidden group">
                      <span className="relative z-10 flex items-center">
                        Start Your Free Trial
                        <Rocket className="w-6 h-6 ml-3 group-hover:translate-x-1 transition-transform" />
                      </span>
                      <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    </Button>
                  </SignUpButton>
                </SignedOut>
                <SignedIn>
                  <Button
                    onClick={handleNav}
                    className="bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white px-12 py-6 rounded-2xl text-xl font-bold transform hover:scale-105 transition-all duration-300"
                  >
                    Go to Dashboard
                    <ArrowRight className="w-6 h-6 ml-3" />
                  </Button>
                </SignedIn>
                <p className="text-slate-500 mt-6 text-lg">
                  No commitment • Cancel anytime • Setup in under 60 seconds
                </p>
              </motion.div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
