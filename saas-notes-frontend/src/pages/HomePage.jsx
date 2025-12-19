import React, { useState } from "react";
import {
  Bug,
  Layout,
  CheckCircle,
  Zap,
  Star,
  Menu,
  X,
  ArrowRight,
  GitPullRequest
} from "lucide-react";
import { Link } from "react-router";
import { motion } from "framer-motion";
import usePageTitle from "../Hooks/usePageTitle";


const HomePage = () => {
  usePageTitle("Home");
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-slate-900 via-slate-950 to-purple-950 text-white font-sans overflow-hidden">
      {/* === NAVBAR === */}
      <header className="sticky top-0 z-50 p-5 backdrop-blur-xl bg-white/5 border-b border-white/10">
        <nav className="container mx-auto flex justify-between items-center">
          <Link
            to="/"
            className="text-2xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-400 tracking-tight flex items-center gap-2"
          >
            <Bug className="text-blue-400" />
            <span>BugTracker</span>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex space-x-8 text-sm font-medium">
            {["Features", "Testimonials", "Contact"].map((item) => (
              <a
                key={item}
                href={`#${item.toLowerCase()}`}
                className="hover:text-blue-400 transition-colors duration-200"
              >
                {item}
              </a>
            ))}
            <div className="space-x-3">
              <Link
                to="/login"
                className="text-blue-400 font-semibold hover:underline transition-colors"
              >
                Login
              </Link>
              <span className="opacity-40">|</span>
              <Link
                to="/register"
                className="text-blue-400 font-semibold hover:underline transition-colors"
              >
                Sign Up
              </Link>
            </div>
          </div>

          {/* Mobile Button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden text-white focus:outline-none"
          >
            {isMenuOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </nav>
      </header>

      {/* === MOBILE MENU === */}
      <div
        className={`md:hidden fixed inset-0 z-40 bg-slate-900/95 backdrop-blur-lg transform transition-transform duration-300 ${isMenuOpen ? "translate-x-0" : "-translate-x-full"
          }`}
      >
        <div className="p-8 pt-24 flex flex-col space-y-6 text-2xl">
          {["Features", "Testimonials", "Contact"].map((item) => (
            <a
              key={item}
              href={`#${item.toLowerCase()}`}
              onClick={() => setIsMenuOpen(false)}
              className="hover:text-blue-400 transition-colors"
            >
              {item}
            </a>
          ))}
          <div className="flex flex-col gap-3 mt-6">
            <Link
              to="/login"
              onClick={() => setIsMenuOpen(false)}
              className="bg-blue-600 hover:bg-blue-700 rounded-lg py-2 text-center font-semibold"
            >
              Login
            </Link>
            <Link
              to="/register"
              onClick={() => setIsMenuOpen(false)}
              className="bg-purple-600 hover:bg-purple-700 rounded-lg py-2 text-center font-semibold"
            >
              Sign Up
            </Link>
          </div>
        </div>
      </div>

      {/* === HERO === */}
      <section
        id="hero"
        className="container mx-auto py-20 md:py-28 px-6 grid md:grid-cols-2 gap-14 items-center"
      >
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
        >
          <h1 className="text-5xl md:text-6xl font-extrabold leading-tight mb-6 bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-purple-400">
            Ship Faster.
            <br /> Squash Bugs.
          </h1>
          <p className="text-lg text-slate-300 mb-8 max-w-md">
            The modern issue tracking platform for agile teams. Manage projects, track bugs, and collaborate in real-time.
          </p>

          <div className="flex gap-4">
            <Link
              to="/login"
              className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl font-medium shadow-md hover:scale-105 transition-transform"
            >
              Get Started <ArrowRight className="ml-2 w-4 h-4" />
            </Link>
            <a
              href="#features"
              className="px-6 py-3 border border-white/30 rounded-xl hover:bg-white/10 transition-all"
            >
              Learn More
            </a>
          </div>
        </motion.div>

        {/* Hero Animation Placeholder */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1 }}
          className="hidden md:flex justify-center items-center"
        >
          <div className="relative w-full max-w-md aspect-square bg-gradient-to-tr from-blue-500/20 to-purple-500/20 rounded-full blur-3xl absolute" />
          <div className="relative z-10 p-6 bg-slate-900 border border-slate-700 rounded-xl shadow-2xl w-full">
            <div className="flex justify-between items-center mb-4 border-b border-slate-700 pb-2">
              <span className="text-sm font-mono text-blue-400">PROJ-102</span>
              <span className="px-2 py-0.5 rounded bg-red-500/20 text-red-400 text-xs">High Priority</span>
            </div>
            <h3 className="font-semibold text-lg mb-2">Fix production login crash</h3>
            <div className="flex gap-2 mb-4">
              <span className="px-2 py-1 rounded bg-slate-800 text-xs text-slate-400">Bug</span>
              <span className="px-2 py-1 rounded bg-slate-800 text-xs text-slate-400">Backend</span>
            </div>
            <div className="flex justify-between items-center mt-4">
              <div className="flex -space-x-2">
                <div className="w-8 h-8 rounded-full bg-blue-500 border-2 border-slate-900"></div>
                <div className="w-8 h-8 rounded-full bg-purple-500 border-2 border-slate-900"></div>
              </div>
              <span className="px-3 py-1 bg-blue-600 text-xs rounded-full">In Progress</span>
            </div>
          </div>
        </motion.div>
      </section>

      {/* === FEATURES === */}
      <section
        id="features"
        className="container mx-auto py-24 px-6 text-center"
      >
        <h2 className="text-4xl font-bold mb-12 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-400">
          Built for Developers
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
          {[
            {
              icon: Layout,
              title: "Kanban Boards",
              text: "Visualize your workflow with interactive drag-and-drop boards.",
              color: "text-blue-400",
            },
            {
              icon: Bug,
              title: "Issue Tracking",
              text: "Create, assign, and track bugs and tasks with ease.",
              color: "text-red-400",
            },
            {
              icon: CheckCircle,
              title: "Project Mgmt",
              text: "Organize work into projects with dedicated keys and managers.",
              color: "text-green-400",
            },
            {
              icon: Zap,
              title: "Real-time Updates",
              text: "Stay in sync with instant status updates and comments.",
              color: "text-yellow-400",
            },
          ].map(({ icon: Icon, title, text, color }, idx) => (
            <motion.div
              key={idx}
              whileHover={{ scale: 1.05 }}
              className="p-8 rounded-2xl bg-white/10 border border-white/10 backdrop-blur-md shadow-md transition-all duration-300"
            >
              <Icon size={48} className={`${color} mx-auto mb-4`} />
              <h3 className="text-xl font-semibold mb-2">{title}</h3>
              <p className="text-slate-300 text-sm">{text}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* === TESTIMONIALS === */}
      <section
        id="testimonials"
        className="container mx-auto py-24 px-6 text-center"
      >
        <h2 className="text-4xl font-bold mb-12 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-400">
          Loved by Engineering Teams
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {[
            {
              name: "Sarah J.",
              role: "Product Manager",
              quote:
                "“BugTracker is simple yet powerful. It helped us streamline our sprint planning significantly.”",
            },
            {
              name: "David K.",
              role: "Lead Developer",
              quote:
                "“Finally, an issue tracker that doesn't feel bloated. The UI is fast and intuitive.”",
            },
          ].map((t, i) => (
            <motion.div
              key={i}
              whileHover={{ scale: 1.03 }}
              className="p-8 bg-white/10 rounded-2xl border border-white/20 shadow-lg backdrop-blur-lg"
            >
              <div className="flex justify-center text-yellow-400 mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} size={18} fill="currentColor" />
                ))}
              </div>
              <p className="italic text-slate-300 mb-4">{t.quote}</p>
              <div>
                <p className="font-semibold">{t.name}</p>
                <p className="text-sm text-slate-400">{t.role}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* === CTA === */}
      <section
        id="cta"
        className="container mx-auto py-24 px-6 text-center relative"
      >
        <div className="absolute inset-0 bg-gradient-to-br from-blue-600/20 to-purple-800/30 blur-3xl"></div>
        <div className="relative bg-white/10 p-12 rounded-2xl backdrop-blur-md border border-white/20 shadow-2xl">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-400">
            Start shipping better software today.
          </h2>
          <p className="text-lg text-slate-300 mb-8 max-w-2xl mx-auto">
            Join efficient teams who trust BugTracker to deliver quality code.
          </p>
          <Link
            to="/register"
            className="inline-block px-8 py-4 font-bold rounded-full text-lg shadow-lg transform transition-transform bg-gradient-to-r from-blue-500 to-purple-500 hover:scale-105 hover:shadow-xl"
          >
            Start For Free
          </Link>
        </div>
      </section>

      {/* === FOOTER === */}
      <footer className="py-8 px-6 text-center text-slate-400 border-t border-white/10">
        <p>© {new Date().getFullYear()} BugTracker. All Rights Reserved.</p>
      </footer>
    </div>
  );
};

export default HomePage;
