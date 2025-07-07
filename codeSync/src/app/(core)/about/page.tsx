"use client";

import { useState, useRef } from "react";
import { motion } from "framer-motion";
import { Button } from "@/src/components/ui/button";
import { Card, CardContent } from "@/src/components/ui/card";
import { Input } from "@/src/components/ui/input";
import { Textarea } from "@/src/components/ui/textarea";
import { Badge } from "@/src/components/ui/badge";
import {
  FaGithub,
  FaLinkedin,
  FaTwitter,
  FaDiscord,
  FaEnvelope,
} from "react-icons/fa";
import {
  ArrowLeft,
  Mail,
  // Phone,
  // MapPin,
  Send,
  CheckCircle,
  Loader2,
  Code,
  Users,
  Lightbulb,
  Target,
  Award,
  Heart,
  Coffee,
  // Sparkles,
  // Zap,
  // Shield,
  Terminal,
  // Palette,
  Globe,
  MessageSquare,
  // Star,
} from "lucide-react";
import Link from "next/link";
import emailjs from "@emailjs/browser";
import Image from "next/image";

export default function AboutPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<"idle" | "success" | "error">("idle");
  const formRef = useRef<HTMLFormElement>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus("idle");

    try {
      // Initialize EmailJS with your public key
      emailjs.init("YOUR_PUBLIC_KEY"); // Replace with your actual public key

      const result = await emailjs.send(
        "YOUR_SERVICE_ID", // Replace with your EmailJS service ID
        "YOUR_TEMPLATE_ID", // Replace with your EmailJS template ID
        {
          from_name: formData.name,
          from_email: formData.email,
          subject: formData.subject,
          message: formData.message,
          to_email: "priyanshukrai626@gmail.com",
        }
      );

      if (result.status === 200) {
        setSubmitStatus("success");
        setFormData({ name: "", email: "", subject: "", message: "" });
      }
    } catch (error) {
      console.error("EmailJS error:", error);
      setSubmitStatus("error");
    } finally {
      setIsSubmitting(false);
    }
  };

  const features = [
    {
      icon: <Code className="w-8 h-8" />,
      title: "Real-time Collaboration",
      description: "Work on the same codebase with your team in real-time with perfect synchronization.",
      color: "from-fuchsia-400 to-pink-500",
    },
    {
      icon: <Terminal className="w-8 h-8" />,
      title: "Integrated Chat",
      description: "Communicate with your team without leaving the editor with built-in messaging.",
      color: "from-purple-500 to-indigo-500",
    },
    {
      icon: <Globe className="w-8 h-8" />,
      title: "Modern Tech Stack",
      description: "Built with Next.js, Tailwind CSS, Convex, and cutting-edge technologies.",
      color: "from-pink-500 to-rose-500",
    },
  ];

  const stats = [
    { number: "10K+", label: "Active Developers" },
    { number: "50+", label: "Programming Languages" },
    { number: "99.9%", label: "Uptime Guarantee" },
    { number: "24/7", label: "Support Available" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-950 via-slate-900 to-pink-950 text-white">
      {/* Animated Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-gradient-to-r from-pink-500/20 to-purple-500/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-3/4 left-1/3 w-64 h-64 bg-gradient-to-r from-violet-500/20 to-fuchsia-500/20 rounded-full blur-3xl animate-pulse delay-500"></div>
      </div>

      {/* Navigation */}
      <nav className="relative z-50 px-6 py-4">
        <div className="container mx-auto flex justify-between items-center">
          <Link href="/">
            <Button
              variant="ghost"
              className="text-white hover:text-pink-300 hover:bg-purple-800/30 transition-all duration-300 flex items-center"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Home
            </Button>
          </Link>
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
          >
            <Image className="w-32 h-auto" src="/logo.png" alt="CodeSync" />
          </motion.div>
        </div>
      </nav>

      <main className="container mx-auto px-6 py-16 relative z-10">
        {/* Hero Section */}
        <motion.section
          className="text-center mb-20"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <Badge className="bg-gradient-to-r from-purple-500/20 to-pink-500/20 text-white border-purple-500/30 px-6 py-2 text-sm font-medium mb-6">
            <Heart className="w-4 h-4 mr-2" />
            About CodeSync
          </Badge>
          <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
            Revolutionizing
            <br />
            Developer Collaboration
          </h1>
          <p className="text-lg md:text-xl text-purple-200 max-w-4xl mx-auto leading-relaxed">
            CodeSync is a next-generation collaborative platform designed to transform how developers work together. 
            We provide a seamless, intelligent environment where creativity meets productivity, enabling teams to build 
            extraordinary software solutions.
          </p>
        </motion.section>

        {/* Stats Section */}
        <motion.section
          className="mb-20"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto">
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                className="text-center p-6 rounded-2xl bg-gradient-to-br from-purple-900/40 to-pink-900/40 border border-purple-500/20 backdrop-blur-sm"
                whileHover={{ scale: 1.05, y: -5 }}
                transition={{ duration: 0.3 }}
              >
                <div className="text-3xl md:text-4xl font-bold text-white mb-2">
                  {stat.number}
                </div>
                <div className="text-purple-200 text-sm md:text-base">
                  {stat.label}
                </div>
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* Features Section */}
        <motion.section
          className="mb-20"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
              Powerful Features
            </h2>
            <p className="text-purple-200 text-xl max-w-3xl mx-auto">
              Every feature crafted to enhance your development workflow and team collaboration
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.5 + index * 0.1 }}
                whileHover={{ y: -10 }}
              >
                <Card className="bg-gradient-to-br from-purple-900/40 to-pink-900/40 border-purple-500/30 hover:border-pink-500/50 transition-all duration-300 h-full backdrop-blur-sm">
                  <CardContent className="p-8 text-center">
                    <motion.div
                      className={`w-20 h-20 rounded-2xl bg-gradient-to-r ${feature.color} flex items-center justify-center mx-auto mb-6`}
                      whileHover={{ rotate: 5, scale: 1.1 }}
                      transition={{ duration: 0.3 }}
                    >
                      <div className="text-white">{feature.icon}</div>
                    </motion.div>
                    <h3 className="text-xl font-bold mb-4 text-white">
                      {feature.title}
                    </h3>
                    <p className="text-purple-200 leading-relaxed">
                      {feature.description}
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* Mission Section */}
        <motion.section
          className="mb-20"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
        >
          <Card className="bg-gradient-to-r from-purple-900/60 to-pink-900/60 border-purple-500/40 backdrop-blur-lg relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-purple-600/10 to-pink-600/10"></div>
            <CardContent className="p-12 relative z-10">
              <div className="text-center max-w-4xl mx-auto">
                <Target className="w-16 h-16 text-pink-400 mx-auto mb-6" />
                <h2 className="text-4xl md:text-5xl font-bold mb-8 bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                  Our Mission
                </h2>
                <p className="text-lg md:text-xl text-purple-200 leading-relaxed mb-8">
                  We believe that great software is built by great teams. Our mission is to empower developers 
                  worldwide to collaborate effortlessly, share knowledge seamlessly, and create solutions that 
                  shape the future. By removing barriers and enhancing communication, we help teams unlock their 
                  full potential and build extraordinary things together.
                </p>
                <div className="flex flex-wrap justify-center gap-4">
                  <Badge className="bg-purple-500/20 text-purple-200 border-purple-500/30 px-4 py-2">
                    <Lightbulb className="w-4 h-4 mr-2" />
                    Innovation
                  </Badge>
                  <Badge className="bg-pink-500/20 text-pink-200 border-pink-500/30 px-4 py-2">
                    <Users className="w-4 h-4 mr-2" />
                    Collaboration
                  </Badge>
                  <Badge className="bg-violet-500/20 text-violet-200 border-violet-500/30 px-4 py-2">
                    <Award className="w-4 h-4 mr-2" />
                    Excellence
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.section>

        {/* Creator Section */}
        <motion.section
          className="mb-20"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.8 }}
        >
          <Card className="bg-gradient-to-br from-purple-900/40 to-pink-900/40 border-purple-500/30 backdrop-blur-sm">
            <CardContent className="p-12 text-center">
              <div className="w-32 h-32 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full mx-auto mb-6 flex items-center justify-center">
                <Coffee className="w-16 h-16 text-white" />
              </div>
              <h2 className="text-3xl font-bold mb-4 text-white">Meet the Creator</h2>
              <h3 className="text-2xl font-semibold mb-2 bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                Priyanshu Kumar Rai
              </h3>
              <p className="text-purple-200 mb-6 max-w-2xl mx-auto">
                Passionate full-stack developer and tech enthusiast dedicated to creating tools that make 
                developers lives easier and more productive. Built with ❤️ for the developer community.
              </p>
              <div className="flex justify-center space-x-4 mb-6">
                <a href="mailto:priyanshukrai626@gmail.com" className="text-purple-300 hover:text-pink-300 transition-colors">
                  <FaEnvelope size={24} />
                </a>
                <a href="#" className="text-purple-300 hover:text-pink-300 transition-colors">
                  <FaGithub size={24} />
                </a>
                <a href="#" className="text-purple-300 hover:text-pink-300 transition-colors">
                  <FaLinkedin size={24} />
                </a>
                <a href="#" className="text-purple-300 hover:text-pink-300 transition-colors">
                  <FaTwitter size={24} />
                </a>
              </div>
            </CardContent>
          </Card>
        </motion.section>

        {/* Contact Form Section */}
        <motion.section
          className="mb-20"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1 }}
        >
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                Get in Touch
              </h2>
              <p className="text-purple-200 text-xl">
                Have questions, suggestions, or just want to say hello? We d love to hear from you!
              </p>
            </div>

            <Card className="bg-gradient-to-br from-purple-900/40 to-pink-900/40 border-purple-500/30 backdrop-blur-sm">
              <CardContent className="p-12">
                <form ref={formRef} onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-purple-200 text-sm font-medium mb-2">
                        Name
                      </label>
                      <Input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        className="bg-purple-900/30 border-purple-500/40 text-white placeholder-purple-300 focus:border-pink-500 focus:ring-pink-500"
                        placeholder="Your full name"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-purple-200 text-sm font-medium mb-2">
                        Email
                      </label>
                      <Input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        className="bg-purple-900/30 border-purple-500/40 text-white placeholder-purple-300 focus:border-pink-500 focus:ring-pink-500"
                        placeholder="your.email@example.com"
                        required
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-purple-200 text-sm font-medium mb-2">
                      Subject
                    </label>
                    <Input
                      type="text"
                      name="subject"
                      value={formData.subject}
                      onChange={handleInputChange}
                      className="bg-purple-900/30 border-purple-500/40 text-white placeholder-purple-300 focus:border-pink-500 focus:ring-pink-500"
                      placeholder="Whats this about?"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-purple-200 text-sm font-medium mb-2">
                      Message
                    </label>
                    <Textarea
                      name="message"
                      value={formData.message}
                      onChange={handleInputChange}
                      className="bg-purple-900/30 border-purple-500/40 text-white placeholder-purple-300 focus:border-pink-500 focus:ring-pink-500 min-h-[150px]"
                      placeholder="Tell us more about your thoughts, questions, or feedback..."
                      required
                    />
                  </div>
                  
                  <div className="text-center">
                    <Button
                      type="submit"
                      disabled={isSubmitting}
                      className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-12 py-4 rounded-2xl text-lg font-semibold transform hover:scale-105 transition-all duration-300 shadow-2xl shadow-purple-500/25 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                    >
                      {isSubmitting ? (
                        <>
                          <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                          Sending...
                        </>
                      ) : (
                        <>
                          <Send className="w-5 h-5 mr-2" />
                          Send Message
                        </>
                      )}
                    </Button>
                  </div>

                  {/* Success/Error Messages */}
                  {submitStatus === "success" && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="text-center p-4 bg-green-500/20 border border-green-500/30 rounded-lg"
                    >
                      <CheckCircle className="w-6 h-6 text-green-400 mx-auto mb-2" />
                      <p className="text-green-400 font-medium">
                        Message sent successfully! We ll get back to you soon.
                      </p>
                    </motion.div>
                  )}

                  {submitStatus === "error" && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="text-center p-4 bg-red-500/20 border border-red-500/30 rounded-lg"
                    >
                      <p className="text-red-400 font-medium">
                        Failed to send message. Please try again or contact us directly.
                      </p>
                    </motion.div>
                  )}
                </form>
              </CardContent>
            </Card>
          </div>
        </motion.section>

        {/* Contact Info */}
        <motion.section
          className="mb-20"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.2 }}
        >
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <Card className="bg-gradient-to-br from-purple-900/40 to-pink-900/40 border-purple-500/30 backdrop-blur-sm text-center">
              <CardContent className="p-8">
                <Mail className="w-12 h-12 text-pink-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-white mb-2">Email</h3>
                <p className="text-purple-200">priyanshukrai626@gmail.com</p>
              </CardContent>
            </Card>
            
            <Card className="bg-gradient-to-br from-purple-900/40 to-pink-900/40 border-purple-500/30 backdrop-blur-sm text-center">
              <CardContent className="p-8">
                <MessageSquare className="w-12 h-12 text-purple-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-white mb-2">Response Time</h3>
                <p className="text-purple-200">Within 24 hours</p>
              </CardContent>
            </Card>
            
            <Card className="bg-gradient-to-br from-purple-900/40 to-pink-900/40 border-purple-500/30 backdrop-blur-sm text-center">
              <CardContent className="p-8">
                <Globe className="w-12 h-12 text-pink-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-white mb-2">Support</h3>
                <p className="text-purple-200">24/7 Community</p>
              </CardContent>
            </Card>
          </div>
        </motion.section>
      </main>

      {/* Footer */}
      <footer className="bg-gradient-to-r from-purple-950 to-pink-950 border-t border-purple-500/20 py-12 relative z-10">
        <div className="container mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center space-x-4 mb-6 md:mb-0">
              <img className="w-24 h-auto" src="/logo.png" alt="CodeSync" />
              <div>
                <p className="text-purple-200">Built with passion for developers</p>
                <p className="text-purple-300 text-sm">© 2024 CodeSync. All rights reserved.</p>
              </div>
            </div>
            <div className="flex justify-center space-x-6">
              <a href="#" className="text-purple-300 hover:text-pink-300 transition-colors">
                <FaTwitter size={24} />
              </a>
              <a href="#" className="text-purple-300 hover:text-pink-300 transition-colors">
                <FaGithub size={24} />
              </a>
              <a href="#" className="text-purple-300 hover:text-pink-300 transition-colors">
                <FaLinkedin size={24} />
              </a>
              <a href="#" className="text-purple-300 hover:text-pink-300 transition-colors">
                <FaDiscord size={24} />
              </a>
              <a href="mailto:priyanshukrai626@gmail.com" className="text-purple-300 hover:text-pink-300 transition-colors">
                <FaEnvelope size={24} />
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}