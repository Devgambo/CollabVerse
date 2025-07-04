"use client";

import {
  SignedIn,
  SignedOut,
  SignUpButton,
  SignInButton,
  UserButton,
} from "@clerk/nextjs";
import Link from "next/link";
import { motion } from "framer-motion";
import { Button } from "@/src/components/ui/button";
import { Card, CardContent } from "@/src/components/ui/card";
import { Badge } from "@/src/components/ui/badge";
import {
  Code2,
  Zap,
  Shield,
  Sparkles,
  ArrowRight,
  Terminal,
  Palette,
} from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-white">
      <SignedIn>
        <RedirectToDashboard />
      </SignedIn>
      <SignedOut>
        <LandingPage />
      </SignedOut>
    </div>
  );
}

function RedirectToDashboard() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <motion.div
        className="text-center space-y-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
          <Code2 className="w-8 h-8 text-white" />
        </div>
        <h1 className="text-3xl font-bold">Welcome back!</h1>
        <p className="text-slate-400 max-w-md">
          Ready to continue your collaborative coding journey?
        </p>
        <div className="flex flex-row justify-center space-y-8">
          <Link href="/home">
            <Button
              variant="ghost"
              className="mx-4 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-4 rounded-xl font-semibold transform hover:scale-105 transition-all duration-200 shadow-lg shadow-blue-500/25"
            >
              Go to Dashboard
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          </Link>
          <div className="flex justify-center">
            <div className="size-3 hover:scale-110">
              <UserButton />
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

function LandingPage() {
  const features = [
    {
      icon: <Zap className="w-6 h-6" />,
      title: "Real-time Collaboration",
      description: "See changes instantly as your team codes together",
      color: "from-yellow-400 to-orange-500",
    },
    {
      icon: <Shield className="w-6 h-6" />,
      title: "Secure by Design",
      description: "Enterprise-grade security for your code",
      color: "from-green-400 to-emerald-500",
    },
    {
      icon: <Palette className="w-6 h-6" />,
      title: "Beautiful Interface",
      description: "Crafted for developers who value aesthetics",
      color: "from-purple-400 to-pink-500",
    },
    {
      icon: <Terminal className="w-6 h-6" />,
      title: "Developer-First",
      description: "Built by developers, for developers",
      color: "from-blue-400 to-cyan-500",
    },
  ];

  return (
    <div className="relative overflow-hidden">
      {/* Hero Section */}
      <div className="relative">
        <div className="absolute bg-gradient-to-r from-slate-900 to-slate-800 border-slate-700"></div>
        <div className="relative container mx-auto px-6 py-20">
          <motion.div
            className="max-w-4xl mx-auto text-center"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <Badge className="mb-6 bg-gradient-to-r from-blue-500/20 to-purple-500/20 text-blue-300 border-blue-500/30">
              <Sparkles className="w-4 h-4 mr-2" />
              Free Trial Available
            </Badge>

            <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-white via-slate-200 to-slate-400 bg-clip-text text-transparent leading-tight">
              Code Together
              <br />
              <span className="text-4xl md:text-6xl bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
                in Perfect Harmony
              </span>
            </h1>

            <p className="text-xl md:text-2xl text-slate-300 mb-12 max-w-3xl mx-auto leading-relaxed">
              The collaborative code editor that <strong>actually works</strong>{" "}
              for developers and bootcamp mentors
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <SignUpButton mode="modal">
                <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-4 rounded-xl text-lg font-semibold transform hover:scale-105 transition-all duration-200 shadow-lg shadow-blue-500/25">
                  Start Free Trial
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </SignUpButton>
              <SignInButton mode="modal">
                <Button
                  variant="outline"
                  className="bg-gray-800/20 border-slate-700 text-slate-300 hover:bg-slate-800 hover:text-white px-8 py-4 rounded-xl text-lg font-medium"
                >
                  Sign In
                </Button>
              </SignInButton>
            </div>

            <p className="text-slate-500 mt-4">
              Setup in under 60 seconds • No credit card required
            </p>
          </motion.div>
        </div>
      </div>

      {/* Features Grid */}
      <div className="container mx-auto px-6 py-20">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Built for Modern Development Teams
          </h2>
          <p className="text-slate-400 text-lg max-w-2xl mx-auto">
            Every feature designed with developer experience and team
            productivity in mind
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 * index }}
            >
              <Card className="bg-slate-900/50 border-slate-800 hover:border-slate-700 transition-colors group">
                <CardContent className="p-6 text-center">
                  <div
                    className={`w-12 h-12 rounded-xl bg-gradient-to-r ${feature.color} flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform`}
                  >
                    {feature.icon}
                  </div>
                  <h3 className="text-lg font-semibold mb-2 text-white">
                    {feature.title}
                  </h3>
                  <p className="text-slate-400 text-sm">
                    {feature.description}
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Code Preview Section */}
      {/* <div className="container mx-auto px-6 py-20">
        <motion.div
          className="max-w-5xl mx-auto"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        ></motion.div>
      </div> */}

      {/* Final CTA */}
      <div className="container mx-auto px-6 py-20">
        <motion.div
          className="max-w-3xl mx-auto text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          <Card className="bg-gradient-to-r from-slate-900 to-slate-800 border-slate-700">
            <CardContent className="p-12">
              <h2 className="text-3xl text-white md:text-4xl font-bold mb-6">
                Join Thousands of Developers
              </h2>
              <p className="text-slate-300 text-lg mb-8">
                Experience the future of collaborative coding today
              </p>
              <SignUpButton mode="modal">
                <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-10 py-4 rounded-xl text-lg font-semibold transform hover:scale-105 transition-all duration-200 shadow-lg shadow-blue-500/25">
                  Start Your Free Trial
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </SignUpButton>
              <p className="text-slate-500 mt-4">
                No commitment • Cancel anytime • Setup in 1 minute
              </p>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
