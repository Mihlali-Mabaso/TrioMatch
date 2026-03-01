import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { addStudent } from "@/services/dataService";
import { UserPlus, CheckCircle, Zap, Users, Shield, MessageCircle } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";

const YEAR_LEVELS = ["1st Year", "2nd Year", "3rd Year", "4th Year", "Postgrad"];

const JoinFormSection = () => {
    const [formData, setFormData] = useState({
        full_name: "",
        whatsapp_number: "",
        year_level: "",
        faculty: "",
    });
    const [submitted, setSubmitted] = useState(false);
    const queryClient = useQueryClient();
    const { toast } = useToast();

    const mutation = useMutation({
        mutationFn: addStudent,
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (!formData.full_name || !formData.whatsapp_number || !formData.year_level) {
            toast({
                title: "Missing fields",
                description: "Please fill in all required fields.",
                variant: "destructive",
            });
            return;
        }

        mutation.mutate(formData, {
            onSuccess: () => {
                setSubmitted(true);
                queryClient.invalidateQueries({ queryKey: ["billboard"] });
                queryClient.invalidateQueries({ queryKey: ["waitingPool"] });
                queryClient.invalidateQueries({ queryKey: ["stats"] });
                toast({
                    title: "You're in! 🎉",
                    description: "We'll WhatsApp you when matched into a trio.",
                });
                console.log("Student successfully added to pool");
            },
            onError: (error: any) => {
                console.log("Error adding student:", error);
                toast({
                    title: "Something went wrong",
                    description: "Please try again.",
                    variant: "destructive",
                });
            },
        });
    };

    return (
        <section id="join" className="relative py-20 sm:py-28 overflow-hidden">
            {/* Background glow */}
            <div className="absolute bottom-0 left-0 w-full h-1/2 bg-gradient-to-t from-primary/5 to-transparent" />
            <div className="absolute -bottom-48 left-1/4 w-96 h-96 bg-primary/8 rounded-full blur-[150px]" />

            <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
                    {/* Left: Value props */}
                    <div className="space-y-8">
                        <div>
                            <h2 className="font-heading text-3xl sm:text-4xl md:text-5xl font-black uppercase italic text-foreground leading-tight">
                                Ready to{" "}
                                <span className="text-gradient">Join?</span>
                            </h2>
                            <p className="font-body text-muted-foreground mt-4 max-w-md leading-relaxed">
                                Fill out the form and get matched with two other students from different year levels. It's completely free and takes 30 seconds.
                            </p>
                        </div>

                        <div className="space-y-5">
                            <BenefitItem
                                icon={<Users className="w-4 h-4" />}
                                text="Get matched with students from different year levels"
                            />
                            <BenefitItem
                                icon={<MessageCircle className="w-4 h-4" />}
                                text="Receive your match details via WhatsApp"
                            />
                            <BenefitItem
                                icon={<Shield className="w-4 h-4" />}
                                text="No account or password needed — just one simple form"
                            />
                            <BenefitItem
                                icon={<Zap className="w-4 h-4" />}
                                text="Matching happens every few days automatically"
                            />
                        </div>
                    </div>

                    {/* Right: Form */}
                    <div>
                        {submitted ? (
                            <div className="bg-card border border-border p-8 sm:p-12 text-center animate-slide-up">
                                <div className="w-16 h-16 bg-success/20 rounded-full flex items-center justify-center mx-auto mb-6">
                                    <CheckCircle className="w-8 h-8 text-success" />
                                </div>
                                <h3 className="font-heading text-2xl font-black uppercase text-foreground mb-3">
                                    You're In!
                                </h3>
                                <p className="font-body text-muted-foreground max-w-sm mx-auto">
                                    We'll WhatsApp you when you've been matched into a trio. Check the billboard and waiting pool to see your name!
                                </p>
                                <button
                                    onClick={() => {
                                        setSubmitted(false);
                                        setFormData({ full_name: "", whatsapp_number: "", year_level: "", faculty: "" });
                                    }}
                                    className="mt-6 font-body text-sm font-semibold uppercase tracking-wider text-primary hover:text-primary/80 transition-colors"
                                >
                                    Submit another entry
                                </button>
                            </div>
                        ) : (
                            <form onSubmit={handleSubmit} className="bg-foreground p-6 sm:p-8 lg:p-10 space-y-5">
                                <div className="text-center mb-6">
                                    <h3 className="font-heading text-xl font-black uppercase text-background">
                                        Join the Waiting Pool
                                    </h3>
                                    <p className="font-body text-sm text-background/60 mt-1">
                                        All fields marked with * are required
                                    </p>
                                </div>

                                <div className="space-y-2">
                                    <Label className="font-heading text-xs font-bold uppercase tracking-wider text-background/70">
                                        Full Name *
                                    </Label>
                                    <Input
                                        placeholder="e.g. Thabo Mokoena"
                                        value={formData.full_name}
                                        onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                                        className="bg-background/10 border-background/20 text-background placeholder:text-background/40 focus:border-primary focus:ring-primary/30 rounded-sm h-11"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label className="font-heading text-xs font-bold uppercase tracking-wider text-background/70">
                                        WhatsApp Number *
                                    </Label>
                                    <Input
                                        placeholder="e.g. +27612345678"
                                        value={formData.whatsapp_number}
                                        onChange={(e) => setFormData({ ...formData, whatsapp_number: e.target.value })}
                                        className="bg-background/10 border-background/20 text-background placeholder:text-background/40 focus:border-primary focus:ring-primary/30 rounded-sm h-11"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label className="font-heading text-xs font-bold uppercase tracking-wider text-background/70">
                                        Year Level *
                                    </Label>
                                    <select
                                        value={formData.year_level}
                                        onChange={(e) => setFormData({ ...formData, year_level: e.target.value })}
                                        className="w-full h-11 px-3 bg-background/10 border border-background/20 text-background rounded-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30 font-body text-sm"
                                    >
                                        <option value="" className="text-foreground bg-card">Select year level</option>
                                        {YEAR_LEVELS.map((level) => (
                                            <option key={level} value={level} className="text-foreground bg-card">
                                                {level}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                <div className="space-y-2">
                                    <Label className="font-heading text-xs font-bold uppercase tracking-wider text-background/70">
                                        Faculty
                                    </Label>
                                    <Input
                                        placeholder="e.g. Engineering"
                                        value={formData.faculty}
                                        onChange={(e) => setFormData({ ...formData, faculty: e.target.value })}
                                        className="bg-background/10 border-background/20 text-background placeholder:text-background/40 focus:border-primary focus:ring-primary/30 rounded-sm h-11"
                                    />
                                </div>

                                <button
                                    type="submit"
                                    disabled={mutation.isPending}
                                    className="w-full bg-flame hover:bg-flame/90 text-flame-foreground py-3.5 font-heading text-sm font-black uppercase tracking-wider transition-all disabled:opacity-60 rounded-sm flex items-center justify-center gap-2"
                                >
                                    {mutation.isPending ? (
                                        <>
                                            <div className="w-4 h-4 border-2 border-flame-foreground border-t-transparent rounded-full animate-spin" />
                                            Submitting...
                                        </>
                                    ) : (
                                        <>
                                            <UserPlus className="w-4 h-4" />
                                            Join Waiting Pool
                                        </>
                                    )}
                                </button>
                            </form>
                        )}
                    </div>
                </div>
            </div>
        </section>
    );
};

function BenefitItem({ icon, text }: { icon: React.ReactNode; text: string }) {
    return (
        <div className="flex items-start gap-3">
            <div className="w-8 h-8 bg-electric/20 rounded-full flex items-center justify-center shrink-0 mt-0.5">
                <span className="text-electric">{icon}</span>
            </div>
            <span className="font-body text-sm text-muted-foreground leading-relaxed">{text}</span>
        </div>
    );
}

export default JoinFormSection;