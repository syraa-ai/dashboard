import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="flex items-center mb-4 md:mb-0">
            <span className="font-bold">Syraa Health</span>
          </div>
          <nav className="flex flex-wrap justify-center md:justify-end space-x-4 text-sm text-muted-foreground mb-4 md:mb-0">
            <Link to="/team" className="hover:text-primary">Team</Link>
            <Link to="/privacy" className="hover:text-primary">Privacy Policy</Link>
            <Link to="/terms" className="hover:text-primary">Terms of Service</Link>
            <Link to="/careers" className="hover:text-primary">Careers</Link>
            <Link to="/pricing" className="hover:text-primary">Pricing</Link>
            <Link to="/guides" className="hover:text-primary">Guides</Link>
            <a href="https://app.syraa.com" target="_blank" rel="noopener noreferrer" className="hover:text-primary">Log In</a>
          </nav>
        </div>
        <div className="text-center text-sm text-muted-foreground mt-6 pt-6 border-t">
          <a href="mailto:founders@syraa.com" className="hover:text-primary">founders@syraa.com</a>
          <span className="mx-2">|</span>
          <span>San Francisco, CA</span>
          <span className="mx-2">|</span>
          <span>© {currentYear} Syrra Health, Inc.</span>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
