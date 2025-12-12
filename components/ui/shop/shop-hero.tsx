import { Coffee } from "lucide-react";

export function ShopHero() {
  return (
    <div className="bg-gradient-to-r from-amber-900 to-amber-800 text-white py-12 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div>
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Ceruela Coffee Collection
            </h1>
            <p className="text-xl text-amber-100 max-w-2xl">
              Experience the art of coffee with our carefully curated
              selection of Ceruela signature roasts. Each batch is roasted
              with precision to highlight unique flavor profiles.
            </p>
          </div>
          <div className="mt-6 md:mt-0">
            <div className="flex items-center bg-white/10 backdrop-blur-sm rounded-full p-4">
              <Coffee className="h-16 w-16 text-amber-200 mr-4" />
              <div>
                <p className="text-sm text-amber-200">Est. 2010</p>
                <p className="text-xl font-bold">Artisanal Roasting</p>
                <p className="text-amber-200 text-sm">Since Day One</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}