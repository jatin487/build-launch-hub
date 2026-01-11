import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Code2, LogIn, LayoutDashboard } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useAuth } from '@/hooks/useAuth';

const navLinks = [
  { href: '/#services', label: 'Services' },
  { href: '/#packages', label: 'Packages' },
  { href: '/#portfolio', label: 'Portfolio' },
  { href: '/blog', label: 'Blog' },
  { href: '/jobs', label: 'Jobs' },
  { href: '/#contact', label: 'Contact' },
];

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const { user, role, signOut } = useAuth();

  const getDashboardLink = () => '/dashboard';

  const handleNavClick = (href: string) => {
    setIsOpen(false);
    if (href.startsWith('/#')) {
      const elementId = href.substring(2);
      const element = document.getElementById(elementId);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-border bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/80">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary">
              <Code2 className="h-5 w-5 text-primary-foreground" />
            </div>
            <span className="text-xl font-bold text-foreground">Atoolsera</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden items-center gap-1 md:flex">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                to={link.href}
                onClick={() => handleNavClick(link.href)}
                className={cn(
                  "px-4 py-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground",
                  location.pathname === link.href && "text-foreground"
                )}
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* CTA Buttons */}
          <div className="hidden items-center gap-2 md:flex">
            {user ? (
              <>
                <Button variant="ghost" asChild>
                  <Link to={getDashboardLink()}>
                    <LayoutDashboard className="mr-2 h-4 w-4" />
                    Dashboard
                  </Link>
                </Button>
                <Button variant="outline" onClick={signOut}>
                  Sign Out
                </Button>
              </>
            ) : (
              <Button variant="outline" asChild>
                <Link to="/auth">
                  <LogIn className="mr-2 h-4 w-4" />
                  Login
                </Link>
              </Button>
            )}
            <Button asChild>
              <Link to="/start-project">Start Your Project</Link>
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="flex items-center justify-center md:hidden"
            onClick={() => setIsOpen(!isOpen)}
            aria-label="Toggle menu"
          >
            {isOpen ? (
              <X className="h-6 w-6 text-foreground" />
            ) : (
              <Menu className="h-6 w-6 text-foreground" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isOpen && (
        <div className="border-t border-border bg-card md:hidden">
          <div className="container mx-auto px-4 py-4">
            <div className="flex flex-col gap-2">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  to={link.href}
                  onClick={() => handleNavClick(link.href)}
                  className="px-4 py-3 text-base font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-foreground rounded-lg"
                >
                  {link.label}
                </Link>
              ))}
              <div className="mt-4 pt-4 border-t border-border flex flex-col gap-2">
                {user ? (
                  <>
                    <Button variant="ghost" asChild className="w-full justify-start">
                      <Link to={getDashboardLink()} onClick={() => setIsOpen(false)}>
                        <LayoutDashboard className="mr-2 h-4 w-4" />
                        Dashboard
                      </Link>
                    </Button>
                    <Button variant="outline" className="w-full" onClick={() => { signOut(); setIsOpen(false); }}>
                      Sign Out
                    </Button>
                  </>
                ) : (
                  <Button variant="outline" asChild className="w-full">
                    <Link to="/auth" onClick={() => setIsOpen(false)}>
                      <LogIn className="mr-2 h-4 w-4" />
                      Login
                    </Link>
                  </Button>
                )}
                <Button asChild className="w-full">
                  <Link to="/start-project" onClick={() => setIsOpen(false)}>
                    Start Your Project
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
