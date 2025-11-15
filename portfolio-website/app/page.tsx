import Achievements from "./components/Achievements"
import Footer from "./components/Footer"
import Hero from "./components/Hero"
import Projects from "./components/Projects"
import WorkExperience from "./components/WorkExperience"
export default function Home(){
    return(
        <div className="min-h-screen w-full bg-[url('/bg.png')] flex flex-col">
            <Hero/>
            <Projects/>
            <WorkExperience/>
            <Achievements/>
            <Footer/>
        </div>
    )
}