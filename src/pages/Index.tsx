import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import BillboardSection from "@/components/BillboardSection";
import DailyLottoSection from "@/components/DailyLottoSection";
import WaitingPoolSection from "@/components/WaitingPoolSection";
import JoinFormSection from "@/components/JoinFormSection";
import Footer from "@/components/Footer";

const Index = () => {
    return (
        <div className="min-h-screen bg-background">
            <Navbar />
            <HeroSection />
            <BillboardSection />
            <DailyLottoSection />
            <WaitingPoolSection />
            <JoinFormSection />
            <Footer />
        </div>
    );
};

export default Index;
