import React from 'react';
import RegisterTenant from './RegisterTenant'; // Assuming this is your component
import {
  Notebook,
  Users,
  Lock,
  Zap,
  Star,
  Menu,
  X,
} from 'lucide-react';
import { Link } from 'react-router';

const HomePage = () => {
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);

  return (
    <div className='relative min-h-screen bg-gradient-to-br from-slate-900 via-slate-900 to-purple-900 text-white font-sans overflow-hidden'>
      {/* --- Navigation --- */}
      <header className='sticky top-0 z-50 p-6 backdrop-blur-md bg-white/10'>
        <nav className='container mx-auto flex justify-between items-center'>
          <h1 className='text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-400'>
            NoteSpace
          </h1>
          <div className='hidden md:flex space-x-8'>
            <a href='#features' className='hover:text-blue-400 transition-colors'>Features</a>
            <a href='#testimonials' className='hover:text-blue-400 transition-colors'>Testimonials</a>
            <a href='#cta' className='hover:text-blue-400 transition-colors'>Contact</a>
            <span>
              <Link to="/login" className='hover:text-blue-600 transition-colors '>
                Login
              </Link>
              <><span className='mx-2'>|</span></>
              <Link to="/register" className='hover:text-blue-600 transition-colors'>
                Sign Up
              </Link>
            </span>

          </div>
          <div className='md:hidden'>
            <button onClick={() => setIsMenuOpen(!isMenuOpen)}>
              {isMenuOpen ? <X size={28} /> : <Menu size={28} />}
            </button>
          </div>
        </nav>
      </header>

      {/* Mobile Menu */}
      <div className={`md:hidden fixed inset-0 z-40 bg-slate-900/95 backdrop-blur-md transform transition-transform duration-300 ease-in-out ${isMenuOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className='p-6 pt-24 flex flex-col space-y-6 text-2xl'>
          <a href='#features' onClick={() => setIsMenuOpen(false)} className='hover:text-blue-400 transition-colors'>Features</a>
          <a href='#testimonials' onClick={() => setIsMenuOpen(false)} className='hover:text-blue-400 transition-colors'>Testimonials</a>
          <a href='#cta' onClick={() => setIsMenuOpen(false)} className='hover:text-blue-400 transition-colors'>Contact</a>
        </div>
      </div>

      {/* --- Hero Section --- */}
      <section className='container mx-auto py-20 px-6 md:py-32 grid md:grid-cols-2 gap-12 items-center'>
        <div>
          <h2 className='text-4xl md:text-6xl font-extrabold leading-tight tracking-tight mb-4 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-400 animate-pulse'>
            Unlock Your Potential with Our Platform
          </h2>
          <p className='text-lg md:text-xl text-slate-300 mb-8'>
            Experience seamless collaboration, secure data, and blazing fast performance.
          </p>
          <div className='bg-white/10 p-6 rounded-2xl backdrop-blur-md border border-white/20 shadow-lg transition-all duration-300 hover:scale-[1.02]'>
            <RegisterTenant />
          </div>
        </div>
        <div className='hidden md:block relative'>
          <div className='w-full h-80 rounded-3xl bg-white/10 backdrop-blur-lg border border-white/20 shadow-2xl animate-spin-slow' style={{ animationDuration: '40s' }}></div>
          <div className='absolute inset-10 w-full h-full rounded-3xl bg-gradient-to-br from-blue-400 to-purple-400 animate-spin-slow-reverse' style={{ animationDuration: '30s' }}></div>
        </div>
      </section>

      {/* --- Features Grid --- */}
      <section id='features' className='container mx-auto py-20 px-6'>
        <h2 className='text-3xl md:text-4xl font-bold text-center mb-12 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-400'>
          Power-Packed Features
        </h2>
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8'>
          {/* Feature 1 */}
          <div className='bg-white/10 p-8 rounded-2xl backdrop-blur-md border border-white/20 shadow-lg transition-all duration-300 hover:scale-[1.05] hover:shadow-2xl'>
            <Notebook size={48} className='text-blue-400 mb-4' />
            <h3 className='text-xl font-semibold mb-2'>Smart Note Taking</h3>
            <p className='text-slate-300'>Capture your ideas effortlessly with our intuitive note-taking tools.</p>
          </div>
          {/* Feature 2 */}
          <div className='bg-white/10 p-8 rounded-2xl backdrop-blur-md border border-white/20 shadow-lg transition-all duration-300 hover:scale-[1.05] hover:shadow-2xl'>
            <Users size={48} className='text-purple-400 mb-4' />
            <h3 className='text-xl font-semibold mb-2'>Team Collaboration</h3>
            <p className='text-slate-300'>Work together seamlessly with real-time collaboration features.</p>
          </div>
          {/* Feature 3 */}
          <div className='bg-white/10 p-8 rounded-2xl backdrop-blur-md border border-white/20 shadow-lg transition-all duration-300 hover:scale-[1.05] hover:shadow-2xl'>
            <Lock size={48} className='text-blue-400 mb-4' />
            <h3 className='text-xl font-semibold mb-2'>Enterprise Security</h3>
            <p className='text-slate-300'>Your data is safe with our top-tier encryption and security protocols.</p>
          </div>
          {/* Feature 4 */}
          <div className='bg-white/10 p-8 rounded-2xl backdrop-blur-md border border-white/20 shadow-lg transition-all duration-300 hover:scale-[1.05] hover:shadow-2xl'>
            <Zap size={48} className='text-purple-400 mb-4' />
            <h3 className='text-xl font-semibold mb-2'>Lightning Fast Performance</h3>
            <p className='text-slate-300'>Experience a blazing fast platform that never slows you down.</p>
          </div>
        </div>
      </section>

      {/* --- Testimonials --- */}
      <section id='testimonials' className='container mx-auto py-20 px-6'>
        <h2 className='text-3xl md:text-4xl font-bold text-center mb-12 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-400'>
          What Our Users Say
        </h2>
        <div className='grid grid-cols-1 md:grid-cols-2 gap-8'>
          {/* Testimonial 1 */}
          <div className='bg-white/10 p-8 rounded-2xl backdrop-blur-md border border-white/20 shadow-lg'>
            <div className='flex items-center text-yellow-400 mb-4'>
              <Star size={20} /><Star size={20} /><Star size={20} /><Star size={20} /><Star size={20} />
            </div>
            <p className='text-slate-300 italic mb-4'>
              "This platform has completely transformed how our team collaborates. The security features are top-notch, and the performance is incredible."
            </p>
            <p className='font-semibold'>- Alex M.</p>
          </div>
          {/* Testimonial 2 */}
          <div className='bg-white/10 p-8 rounded-2xl backdrop-blur-md border border-white/20 shadow-lg'>
            <div className='flex items-center text-yellow-400 mb-4'>
              <Star size={20} /><Star size={20} /><Star size={20} /><Star size={20} /><Star size={20} />
            </div>
            <p className='text-slate-300 italic mb-4'>
              "The design is beautiful and intuitive. I love the clean interface and the seamless note-taking experience."
            </p>
            <p className='font-semibold'>- Samantha L.</p>
          </div>
        </div>
      </section>

      {/* --- Call-to-Action --- */}
      <section id='cta' className='container mx-auto py-20 px-6 text-center'>
        <div className='bg-white/10 p-12 rounded-2xl backdrop-blur-md border border-white/20 shadow-2xl'>
          <h2 className='text-3xl md:text-4xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-400'>
            Ready to Get Started?
          </h2>
          <p className='text-lg md:text-xl text-slate-300 mb-8'>
            Join thousands of happy users and elevate your productivity today.
          </p>
          <a href='#hero' className='inline-block px-8 py-4 font-bold rounded-full text-lg shadow-lg transform transition-transform duration-300 ease-in-out bg-gradient-to-r from-blue-500 to-purple-500 hover:scale-105 hover:shadow-xl hover:from-blue-600 hover:to-purple-600'>
            Start Your Free Trial
          </a>
        </div>
      </section>

      {/* --- Footer --- */}
      <footer className='py-8 px-6 text-center text-slate-400'>
        <p>&copy; 2025 NoteSpace. All Rights Reserved.</p>
      </footer>
    </div>
  );
};

export default HomePage;