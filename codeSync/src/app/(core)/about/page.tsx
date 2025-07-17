"use client";

import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
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
  Terminal,
  Globe,
  MessageSquare,
} from "lucide-react";
import Link from "next/link";
import emailjs from "@emailjs/browser";
import { toast } from "sonner";

// ======== Component: AnimatedBackground ========
const AnimatedBackground = () => (
  <div className="absolute inset-0 overflow-hidden pointer-events-none">
    <div className="absolute top-10 left-1/4 w-[500px] h-[500px] bg-gradient-to-r from-purple-600/10 to-pink-600/10 rounded-full blur-3xl animate-pulse"></div>
    <div className="absolute bottom-40 right-1/3 w-[600px] h-[600px] bg-gradient-to-r from-pink-600/10 to-purple-600/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
    <div className="absolute top-2/3 left-1/5 w-[400px] h-[400px] bg-gradient-to-r from-violet-600/10 to-fuchsia-600/10 rounded-full blur-3xl animate-pulse delay-500"></div>

    {/* Subtle grid pattern overlay */}
    <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>

    {/* Animated particles */}
    <div className="absolute inset-0">
      {[...Array(20)].map((_, i) => (
        <div
          key={i}
          className="absolute rounded-full bg-white"
          style={{
            width: Math.random() * 3 + 1 + "px",
            height: Math.random() * 3 + 1 + "px",
            top: Math.random() * 100 + "%",
            left: Math.random() * 100 + "%",
            opacity: Math.random() * 0.3 + 0.1,
            animation: `float ${Math.random() * 10 + 10}s linear infinite`,
            animationDelay: `${Math.random() * 5}s`,
          }}
        />
      ))}
    </div>
  </div>
);

// ======== Component: StatsSection ========
const StatsSection = () => {
  const stats = [
    { number: "10K+", label: "Active Developers" },
    { number: "50+", label: "Programming Languages" },
    { number: "99.9%", label: "Uptime Guarantee" },
    { number: "24/7", label: "Support Available" },
  ];

  return (
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
  );
};

// ======== Component: FeaturesSection ========
const FeaturesSection = () => {
  const features = [
    {
      icon: <Code className="w-8 h-8" />,
      title: "Real-time Collaboration",
      description:
        "Work on the same codebase with your team in real-time with perfect synchronization.",
      color: "from-fuchsia-400 to-pink-500",
    },
    {
      icon: <Terminal className="w-8 h-8" />,
      title: "Integrated Chat",
      description:
        "Communicate with your team without leaving the editor with built-in messaging.",
      color: "from-purple-500 to-indigo-500",
    },
    {
      icon: <Globe className="w-8 h-8" />,
      title: "Modern Tech Stack",
      description:
        "Built with Next.js, Tailwind CSS, Convex, and cutting-edge technologies.",
      color: "from-pink-500 to-rose-500",
    },
  ];

  return (
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
          Every feature crafted to enhance your development workflow and team
          collaboration
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
  );
};

// ======== Component: MissionSection ========
const MissionSection = () => {
  return (
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
              We believe that great software is built by great teams. Our
              mission is to empower developers worldwide to collaborate
              effortlessly, share knowledge seamlessly, and create solutions
              that shape the future. By removing barriers and enhancing
              communication, we help teams unlock their full potential and build
              extraordinary things together.
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
  );
};

// ======== Component: TeamMemberCard ========
type TeamMember = {
  name: string;
  role: string;
  bio: string;
  email: string;
  github: string;
  linkedin: string;
  twitter: string;
  avatar: React.ReactNode;
  gradientBg: string;
  borderColor: string;
  avatarGradient: string;
  bgColor: string;
  nameGradient: string;
  iconColor: string;
  iconHoverColor: string;
  shadowColor: string;
};

const TeamMemberCard = ({ member }: { member: TeamMember }) => {
  return (
    <motion.div
      whileHover={{
        y: -10,
        boxShadow: `0 20px 30px -10px ${member.shadowColor}`,
      }}
      className="transition-all duration-300"
    >
      <Card
        className={`bg-gradient-to-br ${member.gradientBg} border-${member.borderColor} backdrop-blur-sm h-full`}
      >
        <CardContent className="p-8 text-center flex flex-col items-center">
          <div
            className={`w-32 h-32 rounded-full bg-gradient-to-r ${member.avatarGradient} p-1 mb-6`}
          >
            <div
              className={`w-full h-full rounded-full overflow-hidden bg-${member.bgColor} flex items-center justify-center`}
            >
              {member.avatar}
              {/* Use Image component if you have profile images */}
            </div>
          </div>
          <h3
            className={`text-2xl font-semibold mb-2 bg-gradient-to-r ${member.nameGradient} bg-clip-text text-transparent`}
          >
            {member.name}
          </h3>
          <p className="text-white font-medium mb-2">{member.role}</p>
          <p className="text-purple-200 mb-6">{member.bio}</p>
          <div className="flex justify-center space-x-4 mt-auto">
            <a
              href={`mailto:${member.email}`}
              className={`text-${member.iconColor} hover:text-${member.iconHoverColor} transition-all transform hover:scale-110`}
            >
              <FaEnvelope size={20} />
            </a>
            <a
              href={member.github}
              target="_blank"
              rel="noopener noreferrer"
              className={`text-${member.iconColor} hover:text-${member.iconHoverColor} transition-all transform hover:scale-110`}
            >
              <FaGithub size={20} />
            </a>
            <a
              href={member.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className={`text-${member.iconColor} hover:text-${member.iconHoverColor} transition-all transform hover:scale-110`}
            >
              <FaLinkedin size={20} />
            </a>
            <a
              href={member.twitter}
              target="_blank"
              rel="noopener noreferrer"
              className={`text-${member.iconColor} hover:text-${member.iconHoverColor} transition-all transform hover:scale-110`}
            >
              <FaTwitter size={20} />
            </a>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

// ======== Component: TeamSection ========
const TeamSection = () => {
  const teamMembers = [
    {
      name: "Priyanshu Kumar Rai",
      role: "Full-Stack Developer",
      bio: "Passionate developer dedicated to creating tools that make developers' lives easier and more productive.",
      email: "priyanshukrai626@gmail.com",
      github: "https://github.com/priyanshu",
      linkedin: "https://linkedin.com/in/priyanshu",
      twitter: "https://twitter.com/priyanshu",
      avatar: <Coffee className="w-16 h-16 text-pink-300" />,
      gradientBg: "from-purple-900/40 to-pink-900/40",
      borderColor: "purple-500/30",
      avatarGradient: "from-purple-500 to-pink-500",
      bgColor: "purple-950",
      nameGradient: "from-purple-400 to-pink-400",
      iconColor: "purple-300",
      iconHoverColor: "pink-300",
      shadowColor: "rgba(159, 122, 234, 0.3)",
    },
    {
      name: "Adithya",
      role: "Frontend Engineer",
      bio: "UI/UX enthusiast with a passion for creating beautiful, intuitive interfaces and powerful developer experiences.",
      email: "adithya@example.com",
      github: "https://github.com/adithya",
      linkedin: "https://linkedin.com/in/adithya",
      twitter: "https://twitter.com/adithya",
      avatar: <Code className="w-16 h-16 text-purple-300" />,
      gradientBg: "from-pink-900/40 to-purple-900/40",
      borderColor: "pink-500/30",
      avatarGradient: "from-pink-500 to-purple-500",
      bgColor: "pink-950",
      nameGradient: "from-pink-400 to-purple-400",
      iconColor: "pink-300",
      iconHoverColor: "purple-300",
      shadowColor: "rgba(236, 72, 153, 0.3)",
    },
  ];

  return (
    <motion.section
      className="mb-20"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, delay: 0.8 }}
    >
      <div className="text-center mb-12">
        <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
          Meet the Team
        </h2>
        <p className="text-purple-200 text-xl max-w-3xl mx-auto">
          The passionate developers behind CodeSync who are dedicated to
          creating a better collaboration experience
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
        {teamMembers.map((member, index) => (
          <TeamMemberCard key={index} member={member} />
        ))}
      </div>
    </motion.section>
  );
};

// ======== Component: ContactForm ========
const ContactForm = () => {
  // EmailJS configuration
  const EMAILJS_PUBLIC_KEY =
    process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY || "YOUR_PUBLIC_KEY";
  const EMAILJS_SERVICE_ID =
    process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID || "YOUR_SERVICE_ID";
  const EMAILJS_TEMPLATE_ID =
    process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID || "YOUR_TEMPLATE_ID";

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<
    "idle" | "success" | "error"
  >("idle");
  const formRef = useRef<HTMLFormElement>(null);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Form validation
    if (
      !formData.name ||
      !formData.email ||
      !formData.subject ||
      !formData.message
    ) {
      toast("Please fill in all fields to send your message.");
      return;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      toast("Please enter a valid email address.");
      return;
    }

    setIsSubmitting(true);
    setSubmitStatus("idle");

    try {
      // Initialize EmailJS with your public key
      emailjs.init(EMAILJS_PUBLIC_KEY);

      const result = await emailjs.send(
        EMAILJS_SERVICE_ID,
        EMAILJS_TEMPLATE_ID,
        {
          from_name: formData.name,
          from_email: formData.email,
          subject: formData.subject,
          message: formData.message,
          to_email: "priyanshukrai626@gmail.com",
          reply_to: formData.email,
        },
      );

      if (result.status === 200) {
        setSubmitStatus("success");
        setFormData({ name: "", email: "", subject: "", message: "" });
        toast(
          "Message sent! Thank you for reaching out. We'll respond shortly.",
        );
      }
    } catch (error) {
      console.error("EmailJS error:", error);
      setSubmitStatus("error");
      toast(
        "Message failed to send. Please try again or contact us directly via email.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <motion.section
      className="mb-20"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, delay: 1 }}
    >
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <Badge className="bg-gradient-to-r from-purple-500/20 to-pink-500/20 text-white border-purple-500/30 px-6 py-2 text-sm font-medium mb-6">
            <MessageSquare className="w-4 h-4 mr-2" />
            Contact Us
          </Badge>
          <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
            Get in Touch
          </h2>
          <p className="text-purple-200 text-xl">
            Have questions, suggestions, or just want to say hello? We&apos;d
            love to hear from you!
          </p>
        </div>

        <Card className="bg-gradient-to-br from-purple-900/40 to-pink-900/40 border-purple-500/30 backdrop-blur-sm overflow-hidden relative">
          {/* Background glow effect */}
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute -top-40 -left-40 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl"></div>
            <div className="absolute -bottom-40 -right-40 w-80 h-80 bg-pink-500/10 rounded-full blur-3xl"></div>
          </div>

          <CardContent className="p-8 md:p-12 relative z-10">
            <form ref={formRef} onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                >
                  <label className="block text-purple-200 text-sm font-medium mb-2">
                    Name
                  </label>
                  <Input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="bg-purple-900/30 border-purple-500/40 text-white placeholder-purple-300/50 focus:border-pink-500 focus:ring-pink-500 transition-all duration-300"
                    placeholder="Your full name"
                    required
                  />
                </motion.div>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                >
                  <label className="block text-purple-200 text-sm font-medium mb-2">
                    Email
                  </label>
                  <Input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="bg-purple-900/30 border-purple-500/40 text-white placeholder-purple-300/50 focus:border-pink-500 focus:ring-pink-500 transition-all duration-300"
                    placeholder="your.email@example.com"
                    required
                  />
                </motion.div>
              </div>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                <label className="block text-purple-200 text-sm font-medium mb-2">
                  Subject
                </label>
                <Input
                  type="text"
                  name="subject"
                  value={formData.subject}
                  onChange={handleInputChange}
                  className="bg-purple-900/30 border-purple-500/40 text-white placeholder-purple-300/50 focus:border-pink-500 focus:ring-pink-500 transition-all duration-300"
                  placeholder="What's this about?"
                  required
                />
              </motion.div>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
              >
                <label className="block text-purple-200 text-sm font-medium mb-2">
                  Message
                </label>
                <Textarea
                  name="message"
                  value={formData.message}
                  onChange={handleInputChange}
                  className="bg-purple-900/30 border-purple-500/40 text-white placeholder-purple-300/50 focus:border-pink-500 focus:ring-pink-500 min-h-[150px] transition-all duration-300"
                  placeholder="Tell us more about your thoughts, questions, or feedback..."
                  required
                />
              </motion.div>

              <motion.div
                className="text-center"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
              >
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-12 py-6 rounded-2xl text-lg font-semibold transform hover:scale-105 transition-all duration-300 shadow-xl shadow-purple-500/20 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
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
              </motion.div>

              {/* Success/Error Messages */}
              <AnimatePresence>
                {submitStatus === "success" && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="text-center p-6 bg-green-500/20 border border-green-500/30 rounded-xl"
                  >
                    <CheckCircle className="w-8 h-8 text-green-400 mx-auto mb-2" />
                    <p className="text-green-400 font-medium text-lg">
                      Message sent successfully! We&apos;ll get back to you
                      soon.
                    </p>
                  </motion.div>
                )}

                {submitStatus === "error" && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="text-center p-6 bg-red-500/20 border border-red-500/30 rounded-xl"
                  >
                    <p className="text-red-400 font-medium text-lg">
                      Failed to send message. Please try again or contact us
                      directly at{" "}
                      <a
                        href="mailto:priyanshukrai626@gmail.com"
                        className="underline hover:text-red-300"
                      >
                        priyanshukrai626@gmail.com
                      </a>
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </form>
          </CardContent>
        </Card>
      </div>
    </motion.section>
  );
};

// ======== Component: ContactInfo ========
const ContactInfo = () => {
  return (
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
            <h3 className="text-lg font-semibold text-white mb-2">
              Response Time
            </h3>
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
  );
};

// ======== Component: Footer ========
const Footer = () => {
  return (
    <footer className="bg-gradient-to-r from-purple-950 to-pink-950 border-t border-purple-500/20 py-12 relative z-10">
      <div className="container mx-auto px-6">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="flex items-center space-x-4 mb-6 md:mb-0">
            <img className="w-24 h-auto" src="/logo.png" alt="CodeSync" />
            <div>
              <p className="text-purple-200">
                Built with passion for developers
              </p>
              <p className="text-purple-300 text-sm">
                © 2024 CodeSync. All rights reserved.
              </p>
            </div>
          </div>
          <div className="flex justify-center space-x-6">
            <a
              href="#"
              className="text-purple-300 hover:text-pink-300 transition-colors"
            >
              <FaTwitter size={24} />
            </a>
            <a
              href="#"
              className="text-purple-300 hover:text-pink-300 transition-colors"
            >
              <FaGithub size={24} />
            </a>
            <a
              href="#"
              className="text-purple-300 hover:text-pink-300 transition-colors"
            >
              <FaLinkedin size={24} />
            </a>
            <a
              href="#"
              className="text-purple-300 hover:text-pink-300 transition-colors"
            >
              <FaDiscord size={24} />
            </a>
            <a
              href="mailto:priyanshukrai626@gmail.com"
              className="text-purple-300 hover:text-pink-300 transition-colors"
            >
              <FaEnvelope size={24} />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

// ======== Main Component ========
export default function AboutPage() {
  // Add this CSS to page to support animations
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-950 via-slate-900 to-pink-950 text-white">
      {/* Animated background */}
      <AnimatedBackground />

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
        </div>
      </nav>

      <main className="container mx-auto px-6 py-16 relative z-10">
        {/* Hero Section */}
        <motion.section
          className="flex flex-col items-center justify-center min-h-[60vh] text-center mb-20"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <img className="w-24 h-auto mb-2" src="/logo.png" alt="CodeSync" />
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
            CodeSync is a next-generation collaborative platform designed to
            transform how developers work together. We provide a seamless,
            intelligent environment where creativity meets productivity,
            enabling teams to build extraordinary software solutions.
          </p>
        </motion.section>

        {/* Stats Section */}
        <StatsSection />

        {/* Features Section */}
        <FeaturesSection />

        {/* Mission Section */}
        <MissionSection />

        {/* Team Section - Now with both creators */}
        <TeamSection />

        {/* Contact Form with EmailJS */}
        <ContactForm />

        {/* Contact Info */}
        <ContactInfo />
      </main>

      {/* Footer */}
      <Footer />

      {/* CSS for animation */}
      <style jsx global>{`
        @keyframes float {
          0% {
            transform: translateY(0) translateX(0);
          }
          50% {
            transform: translateY(-20px) translateX(10px);
          }
          100% {
            transform: translateY(0) translateX(0);
          }
        }

        .bg-grid-pattern {
          background-image:
            linear-gradient(
              to right,
              rgba(255, 255, 255, 0.05) 1px,
              transparent 1px
            ),
            linear-gradient(
              to bottom,
              rgba(255, 255, 255, 0.05) 1px,
              transparent 1px
            );
          background-size: 20px 20px;
        }

        .glass-card {
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
        }
      `}</style>
    </div>
  );
}
