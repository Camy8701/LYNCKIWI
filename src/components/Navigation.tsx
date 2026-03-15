// US-001: Stub — fully rebuilt in US-017 with KYSS public/worker/employer nav
// Removed: servicesData, landingPageContent, useLanguage, serviceIcons imports
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Moon, Sun, Menu } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

const Navigation = () => {
  const [theme, setTheme] = useState<"dark" | "light">("dark");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme") as "dark" | "light" | null;
    if (savedTheme) {
      setTheme(savedTheme);
      document.documentElement.classList.toggle("dark", savedTheme === "dark");
    } else {
      document.documentElement.classList.add("dark");
    }
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === "dark" ? "light" : "dark";
    setTheme(newTheme);
    localStorage.setItem("theme", newTheme);
    document.documentElement.classList.toggle("dark", newTheme === "dark");
  };

  return (
    <nav className="sticky top-0 z-50 flex items-center justify-between px-4 md:px-6 lg:px-8 py-4 bg-background/80 backdrop-blur-md border-b border-border">
      <Link to="/" className="text-xl font-bold text-foreground">
        KYSS Vision
      </Link>

      {/* Desktop Nav */}
      <div className="hidden lg:flex items-center gap-6">
        <Link to="/how-it-works" className="text-sm text-muted-foreground hover:text-foreground transition-colors">How It Works</Link>
        <Link to="/guide" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Guide</Link>
        <Link to="/blog" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Blog</Link>
        <Link to="/for-employers" className="text-sm text-muted-foreground hover:text-foreground transition-colors">For Employers</Link>
        <Link to="/auth/sign-in" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Sign In</Link>
        <Link to="/auth/sign-up" className="inline-flex items-center px-4 py-2 bg-primary text-primary-foreground text-sm font-semibold rounded-lg hover:bg-primary/90 transition-colors">
          Get Started →
        </Link>
        <button onClick={toggleTheme} className="p-2 hover:bg-accent rounded-lg transition-colors">
          {theme === "dark" ? <Moon className="w-5 h-5 text-muted-foreground" /> : <Sun className="w-5 h-5 text-muted-foreground" />}
        </button>
      </div>

      {/* Mobile Nav */}
      <div className="flex lg:hidden items-center gap-2">
        <button onClick={toggleTheme} className="p-2 hover:bg-accent rounded-lg transition-colors">
          {theme === "dark" ? <Moon className="w-5 h-5 text-foreground" /> : <Sun className="w-5 h-5 text-foreground" />}
        </button>
        <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
          <SheetTrigger asChild>
            <button className="p-2 hover:bg-accent rounded-lg transition-colors">
              <Menu className="w-6 h-6 text-foreground" />
            </button>
          </SheetTrigger>
          <SheetContent side="right" className="w-[280px] bg-background border-border">
            <div className="flex flex-col gap-4 mt-8">
              <Link to="/how-it-works" onClick={() => setMobileMenuOpen(false)} className="text-sm text-foreground hover:text-primary py-2">How It Works</Link>
              <Link to="/guide" onClick={() => setMobileMenuOpen(false)} className="text-sm text-foreground hover:text-primary py-2">Guide</Link>
              <Link to="/blog" onClick={() => setMobileMenuOpen(false)} className="text-sm text-foreground hover:text-primary py-2">Blog</Link>
              <Link to="/for-employers" onClick={() => setMobileMenuOpen(false)} className="text-sm text-foreground hover:text-primary py-2">For Employers</Link>
              <Link to="/auth/sign-in" onClick={() => setMobileMenuOpen(false)} className="text-sm text-foreground hover:text-primary py-2">Sign In</Link>
              <Link to="/auth/sign-up" onClick={() => setMobileMenuOpen(false)} className="inline-flex items-center justify-center px-4 py-2 bg-primary text-primary-foreground text-sm font-semibold rounded-lg mt-2">Get Started →</Link>
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </nav>
  );
};

export default Navigation;
