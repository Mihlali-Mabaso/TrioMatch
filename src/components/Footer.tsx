import { Zap, Heart } from "lucide-react";

const Footer = () => {
    const scrollTo = (id: string) => {
        document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
    };

    return (
        <footer className="bg-card border-t border-border py-12">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex flex-col md:flex-row items-center justify-between gap-8">
                    {/* Logo */}
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-primary flex items-center justify-center">
                            <Zap className="w-5 h-5 text-primary-foreground" />
                        </div>
                        <span className="font-heading text-lg font-black uppercase italic tracking-tight text-foreground">
                            Trio<span className="text-gradient">Match</span>
                        </span>
                    </div>

                    {/* Links */}
                    <div className="flex items-center gap-6">
                        <button onClick={() => scrollTo("hero")} className="font-body text-sm text-muted-foreground hover:text-primary transition-colors">
                            Home
                        </button>
                        <button onClick={() => scrollTo("billboard")} className="font-body text-sm text-muted-foreground hover:text-primary transition-colors">
                            Billboard
                        </button>
                        <button onClick={() => scrollTo("lotto")} className="font-body text-sm text-muted-foreground hover:text-primary transition-colors">
                            Daily Lotto
                        </button>
                        <button onClick={() => scrollTo("pool")} className="font-body text-sm text-muted-foreground hover:text-primary transition-colors">
                            Pool
                        </button>
                        <button onClick={() => scrollTo("join")} className="font-body text-sm text-muted-foreground hover:text-primary transition-colors">
                            Join
                        </button>
                    </div>

                    {/* Credit */}
                    <div className="flex items-center gap-1 font-body text-xs text-muted-foreground">
                        <span>Made with</span>
                        <Heart className="w-3 h-3 text-destructive fill-destructive" />
                        <span>for UFS Students</span>
                    </div>
                </div>

                <div className="mt-8 pt-6 border-t border-border text-center">
                    <p className="font-body text-xs text-muted-foreground/60 uppercase tracking-widest">
                        &copy; {new Date().getFullYear()} TrioMatch — Create On Base Initiative
                    </p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;