 import Hero from "@/components/home/HeroSection";
 import FeaturedPlants from "@/components/home/FeaturedPlants";
 import Categories from "@/components/home/Categories";
 import CareTips from "@/components/home/CareTips";
 import Statistics from "@/components/home/Statistics";
 import FAQ from "@/components/home/FAQ";
 import Newsletter from "@/components/home/Newsletter";

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