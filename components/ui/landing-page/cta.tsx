import { ChevronRight } from "lucide-react";
import { Button } from "../button";
import Link from "next/link";

export default function CTASection({isLoggedIn}: { isLoggedIn: boolean }) {
    return (
        <section className="py-20 px-4 bg-gradient-to-r from-amber-800 to-amber-900 text-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Ready to Brew Something Amazing?
          </h2>
          <p className="text-xl text-amber-100 mb-10 max-w-2xl mx-auto">
            Join thousands of Filipino coffee lovers who start their day with
            our premium beans.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              size="lg"
              className="bg-white text-amber-900 hover:bg-amber-100 text-lg px-8 py-6"
            >
              <Link href="/shop" className="flex items-center">
                Start Shopping
                <ChevronRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
            {!isLoggedIn && (
              <Button
                size="lg"
                variant="outline"
                className="border-white text-amber-900 hover:bg-amber-100 text-lg px-8 py-6"
              >
                <Link href="/register">Create Free Account</Link>
              </Button>
            )}
          </div>
        </div>
      </section>
    );
}