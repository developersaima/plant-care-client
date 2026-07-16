import CareTips from "@/components/home/CareTips";
import Categories from "@/components/home/Categories";
import FAQ from "@/components/home/FAQ";
import FeaturedPlants from "@/components/home/FeaturedPlants";
import Hero from "@/components/home/HeroSection";
import Newsletter from "@/components/home/Newsletter";
import Statistics from "@/components/home/Statistics";


export default function HomePage() {
  return (
    <>
        <Hero/> 
       <FeaturedPlants />
       <Categories />
      <CareTips />
       <Statistics />  
       <FAQ/> 
       <Newsletter/>
    </>
  );
}