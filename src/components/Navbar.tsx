import { Zap, Users, Menu, X } from "lucide-react";
import { useState } from "react";

const Navbar = () => {
    const [mobileOpen, setMobileOpen] = useState(false);

    const scrollTo = (id: string) => {
        document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
        setMobileOpen(false);
    };

    return (
        <nav className="fixed top-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-md border-b border-border">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    {/* Logo */}
                    <div className="flex items-center gap-2 cursor-pointer" onClick={() => scrollTo("hero")}>
                        <div className="w-8 h-8 bg-primary flex items-center justify-center">
                            <Zap className="w-5 h-5 text-primary-foreground" />
                        </div>
                        <span className="font-heading text-lg font-black uppercase italic tracking-tight text-foreground">
                            Trio<span className="text-gradient">Match</span>
                        </span>
                    </div>

                    {/* Desktop Nav */}
                    <div className="hidden md:flex items-center gap-8">
                        <button onClick={() => scrollTo("billboard")} className="font-body text-sm font-semibold uppercase tracking-wider text-muted-foreground hover:text-primary transition-colors">
                            Billboard
                        </button>
                        <button onClick={() => scrollTo("lotto")} className="font-body text-sm font-semibold uppercase tracking-wider text-muted-foreground hover:text-primary transition-colors">
                            Daily Lotto
                        </button>
                        <button onClick={() => scrollTo("pool")} className="font-body text-sm font-semibold uppercase tracking-wider text-muted-foreground hover:text-primary transition-colors">
                            Waiting Pool
                        </button>
                    </div>

                    {/* CTA */}
                    <div className="hidden md:block">
                        <button
                            onClick={() => scrollTo("join")}
                            className="skew-btn bg-primary px-6 py-2.5 hover:bg-primary/90 transition-all duration-200 group"
                        >
                            <span className="skew-btn-inner flex items-center gap-2 font-heading text-sm font-black uppercase text-primary-foreground">
                                <Users className="w-4 h-4" />
                                Join Now
                            </span>
                        </button>
                    </div>

                    {/* Mobile menu */}
                    <button className="md:hidden text-foreground" onClick={() => setMobileOpen(!mobileOpen)}>
                        {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                    </button>
                </div>
            </div>

            {/* Mobile dropdown */}
            {mobileOpen && (
                <div className="md:hidden bg-card border-t border-border px-4 pb-4 pt-2 space-y-3 animate-slide-up">
                    <button onClick={() => scrollTo("billboard")} className="block w-full text-left font-body text-sm font-semibold uppercase tracking-wider text-muted-foreground hover:text-primary py-2">
                        Billboard
                    </button>
                    <button onClick={() => scrollTo("lotto")} className="block w-full text-left font-body text-sm font-semibold uppercase tracking-wider text-muted-foreground hover:text-primary py-2">
                        Daily Lotto
                    </button>
                    <button onClick={() => scrollTo("pool")} className="block w-full text-left font-body text-sm font-semibold uppercase tracking-wider text-muted-foreground hover:text-primary py-2">
                        Waiting Pool
                    </button>
                    <button
                        onClick={() => scrollTo("join")}
                        className="skew-btn bg-primary w-full px-6 py-2.5"
                    >
                        <span className="skew-btn-inner flex items-center justify-center gap-2 font-heading text-sm font-black uppercase text-primary-foreground">
                            <Users className="w-4 h-4" />
                            Join Now
                        </span>
                    </button>
                </div>
            )}
        </nav>
    );
};

export default Navbar;
