import Hero from "./components/Hero"

export default function Home(){
    return(
        <div className="min-h-screen w-full bg-[url('/bg.png')] flex flex-col">
            <Hero/>
            
        </div>
    )
}