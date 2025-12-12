
export function ShopStory() {
    return (
      <div className="mt-12 pt-8 border-t border-gray-200">
        <div className="grid md:grid-cols-2 gap-8 items-center">
          <div>
            <h2 className="text-3xl font-bold text-amber-900 mb-4">
              The Ceruela Story
            </h2>
            <p className="text-gray-700 mb-4">
              Founded in 2010, Ceruela Coffee Shop began as a small artisanal
              roastery with a simple mission: to bring exceptional coffee to
              discerning palates. Today, we continue that tradition with every
              batch we roast.
            </p>
            <p className="text-gray-700">
              Our name "Ceruela" comes from the Spanish word for "cherry" - a
              nod to the coffee cherry that starts every great cup. From bean
              selection to final roast, we honor this fruit and the farmers
              who cultivate it with care and respect.
            </p>
          </div>
  
          <div className="bg-amber-100 p-8 rounded-2xl">
            <h3 className="text-xl font-bold text-amber-900 mb-4">
              Our Roasting Promise
            </h3>
            <ul className="space-y-3">
              {[
                "Small batch roasting for quality control",
                "Direct trade relationships with farmers",
                "Freshness guaranteed - always roasted to order",
                "30-day freshness guarantee for every bag",
              ].map((item, index) => (
                <li key={index} className="flex items-start">
                  <div className="bg-amber-600 text-white rounded-full p-1 mr-3 mt-1">
                    <svg
                      className="h-4 w-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="3"
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  </div>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    );
  }