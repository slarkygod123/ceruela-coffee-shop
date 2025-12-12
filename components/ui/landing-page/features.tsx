import { Clock, Leaf, Star } from "lucide-react";
import { Card, CardContent } from "../card";

export default function FeaturesSection(){
    return (
        <section className="py-16 px-4 bg-amber-50">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl font-bold text-center text-amber-900 mb-12">
            Why Choose Our Coffee?
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <Card className="border-0 shadow-lg bg-white">
              <CardContent className="p-8 text-center">
                <div className="bg-amber-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Star className="h-8 w-8 text-amber-700" />
                </div>
                <h3 className="text-xl font-bold text-amber-900 mb-2">
                  Premium Quality
                </h3>
                <p className="text-gray-600">
                  Directly sourced from sustainable farms worldwide, ensuring
                  the finest quality beans.
                </p>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg bg-white">
              <CardContent className="p-8 text-center">
                <div className="bg-amber-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Clock className="h-8 w-8 text-amber-700" />
                </div>
                <h3 className="text-xl font-bold text-amber-900 mb-2">
                  Freshly Roasted
                </h3>
                <p className="text-gray-600">
                  Roasted in small batches and shipped within 24 hours for
                  maximum freshness.
                </p>
              </CardContent>
            </Card>
            <Card className="border-0 shadow-lg bg-white">
              <CardContent className="p-8 text-center">
                <div className="bg-amber-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Leaf className="h-8 w-8 text-amber-700" />
                </div>
                <h3 className="text-xl font-bold text-amber-900 mb-2">
                  Ethically Sourced
                </h3>
                <p className="text-gray-600">
                  Directly partnered with sustainable farms ensuring fair wages
                  and environmental care.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>


    );
}