import { Users, BarChart3, Zap, ArrowDown } from "lucide-react";

const HeroSection = () => {
    const scrollTo = (id: string) => {
        document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
    };

    return (
        <section id="hero" className="relative min-h-screen flex items-center overflow-hidden pt-16">
            {/* Background effects */}
            <div className="absolute inset-0 diagonal-stripes" />
            <div className="absolute top-1/4 -left-32 w-96 h-96 bg-primary/10 rounded-full blur-[120px]" />
            <div className="absolute bottom-1/4 -right-32 w-96 h-96 bg-flame/10 rounded-full blur-[120px]" />

            <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full py-12 md:py-20">
                <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
                    {/* Left content */}
                    <div className="space-y-8">
                        <div className="inline-flex items-center gap-2 px-4 py-2 bg-card border border-border rounded-sm">
                            <Zap className="w-4 h-4 text-primary" />
                            <span className="font-body text-xs font-semibold uppercase tracking-widest text-primary">
                                UFS Student Matching
                            </span>
                        </div>

                        <h1 className="font-heading text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black uppercase italic leading-[1.1] tracking-tight">
                            Connect{" "}
                            <span className="text-gradient">Across Years</span>{" "}
                            With{" "}
                            <span className="relative inline-block">
                                Create On Base
                                <div className="absolute -bottom-2 left-0 w-full h-1 bg-gradient-energy" />
                            </span>
                        </h1>

                        <p className="font-body text-base sm:text-lg text-muted-foreground leading-relaxed max-w-lg">
                            Join hundreds of students forming trios for peer mentoring and social connections.
                            No login needed — just fill a form and get matched.
                        </p>

                        {/* CTA Buttons */}
                        <div className="flex flex-wrap gap-4">
                            <button
                                onClick={() => scrollTo("join")}
                                className="skew-btn bg-primary px-8 py-3.5 hover:bg-primary/90 transition-all duration-200 glow-yellow group"
                            >
                                <span className="skew-btn-inner flex items-center gap-2 font-heading text-sm font-black uppercase text-primary-foreground">
                                    <Users className="w-5 h-5" />
                                    Join the Pool
                                </span>
                            </button>

                            <button
                                onClick={() => scrollTo("billboard")}
                                className="skew-btn bg-transparent border-2 border-foreground/30 px-8 py-3.5 hover:border-primary hover:bg-primary/5 transition-all duration-200 group"
                            >
                                <span className="skew-btn-inner flex items-center gap-2 font-heading text-sm font-black uppercase text-foreground">
                                    <BarChart3 className="w-5 h-5" />
                                    View Stats
                                </span>
                            </button>
                        </div>

                        {/* Quick Stats */}
                        <div className="flex gap-8 pt-4">
                            <div>
                                <div className="font-heading text-2xl sm:text-3xl font-black text-primary">250+</div>
                                <div className="font-body text-xs uppercase tracking-wider text-muted-foreground">Students Joined</div>
                            </div>
                            <div>
                                <div className="font-heading text-2xl sm:text-3xl font-black text-flame">80+</div>
                                <div className="font-body text-xs uppercase tracking-wider text-muted-foreground">Trios Formed</div>
                            </div>
                            <div>
                                <div className="font-heading text-2xl sm:text-3xl font-black text-electric">5</div>
                                <div className="font-body text-xs uppercase tracking-wider text-muted-foreground">Faculties</div>
                            </div>
                        </div>
                    </div>

                    {/* Right mascot / image area */}
                    <div className="hidden lg:flex items-center justify-center">
                        <div className="relative">
                            {/* Double frame effect */}
                            <div className="absolute inset-0 translate-x-4 translate-y-4 bg-flame" />
                            <div className="relative border-2 border-foreground bg-card p-2 z-10">
                                <div className="w-80 h-96 bg-muted flex flex-col items-center justify-center gap-6 overflow-hidden">
                                    <div className="w-24 h-24 bg-primary/20 rounded-full flex items-center justify-center">
                                        <Users className="w-12 h-12 text-primary" />
                                    </div>
                                    <div className="text-center px-4">
                                        <h3 className="font-heading text-xl font-black uppercase italic text-foreground">TrioMatch</h3>
                                        <p className="font-body text-sm text-muted-foreground mt-2">
                                            3 Students. 3 Year Levels. 1 Connection.
                                        </p>
                                    </div>
                                    <div className="flex gap-3">
                                        {["1ST", "2ND", "3RD"].map((yr) => (
                                            <div key={yr} className="w-16 h-16 bg-card border border-primary/30 flex items-center justify-center">
                                                <span className="font-heading text-xs font-bold text-primary">{yr}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Scroll indicator */}
                <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-float">
                    <button onClick={() => scrollTo("billboard")} className="flex flex-col items-center gap-2 text-muted-foreground hover:text-primary transition-colors">
                        <span className="font-body text-xs uppercase tracking-widest">Scroll Down</span>
                        <ArrowDown className="w-4 h-4" />
                    </button>
                </div>
            </div>
        </section>
    );
};

export default HeroSection;
