import Hero from "./components/Hero"
import Projects from "./components/Projects"
export default function Home(){
    return(
        <div className="min-h-screen w-full bg-[url('/bg.png')] flex flex-col">
            <Hero/>
            <Projects/>
        </div>
    )
}