import Footer from "../components/layout/Footer";
import MaterialIcon from "../components/ui/MaterialIcon";

const heroImages = [
  "https://lh3.googleusercontent.com/aida-public/AB6AXuAoRHqMDXWrghWtRRktGlye-IQsu6IgcSACxHTxR-kofYPc2JNjy5_XxeyiUN81X6dOp51IDWFEoG8IbMtaF3Gz6IzXAAhrzxJtmrtcfcW1GP50RZTe3OalMcA_bxsG1VGWsmEADdjBlI4JHQKgYCPvqUXtUz8sH7zuiufuGQ3sTXYCaYist1qCnHFLQnl_-K0d0100lOWOeCwko7koXvyozVDTsJK2hxfDE0s4noUUzqT-uAcOs4EtUwxp5v2kBydQxJBbXAgKYVZA",
  "https://lh3.googleusercontent.com/aida-public/AB6AXuDsuH45pcIbpoD2IchdROAlYBFcTfcVgIEAZybtSdVqZLIdQkH5HauuFuEqVo-6hf_fxc9fb0mVBshOcFL5y4vuW_7ErC8mrHR0zGhLLtoo6i6hMBq5W7GtV-j1m2IDGAFQvrZof5ZgOTaVjR33HKW51U85fL5azj3X7oXkJ5uRqa3QaVlzHRt3JtoOWtYPuJ_mnL5w0HU8qQSL_uzaGcqDitQNZ448b02FpLbVWT53_0aFW_ZKtyoFj3OQxqbKWjHuBl0Px9HkpwEU",
  "https://lh3.googleusercontent.com/aida-public/AB6AXuA0wIgUEhEFE-V2hPllExThv-taJNj6CRvRMNP7-bhye9AgllgVZrHXouoZ9__Zik8k41F-p8xWgpzrVEYRukMmrlnKxrIcQqeNt3nfXcAUKBCyFtJoJm3prW3WkSUFTJ8EsVD4ng_JKvZZ8C1lLRsTEVER9NU98t_x-jzzLhZc9wJ3-xy9VPoDWtgT8sFt1itqMbEwMfUlZ5U8pbG52xEQwCb0NUawRAKQeSRmhf-7VHIEC1q3pppHE2yGCOdZfJKnjG66RYgf2W1z",
];

type PageProps = { onNavigate: (page: string) => void };

export default function LandingPage({ onNavigate }: PageProps) {
  return (
    <>
      <main className="pt-20">
        <section className="mx-auto grid max-w-7xl items-center gap-12 px-6 py-16 md:grid-cols-2 md:py-24">
          <div>
            <h1 className="font-headline text-5xl font-extrabold leading-tight tracking-tight md:text-7xl">
              Life is better <span className="block italic text-primary">shared beautifully.</span>
            </h1>
            <p className="mt-6 max-w-lg text-lg leading-relaxed text-on-surface-variant">
              Find vetted roommates, premium homes, and safer co-living experiences curated around your lifestyle.
            </p>
            <div className="mt-10 flex flex-col gap-4 sm:flex-row">
              <button onClick={() => onNavigate("role")} className="btn-primary">Get started</button>
              <button onClick={() => onNavigate("accommodation")} className="btn-tonal">Explore homes</button>
            </div>
            <p className="mt-6 text-sm font-medium text-on-surface-variant">Joined by <span className="font-bold text-primary">2,400+</span> curators this month</p>
          </div>
          <div className="relative min-h-[520px]">
            {heroImages.map((image, index) => (
              <img
                key={image}
                src={image}
                alt="Curated Homigo lifestyle"
                className={`absolute rounded-lg object-cover shadow-ambient ${index === 0 ? "left-0 top-10 h-72 w-56" : index === 1 ? "right-4 top-0 h-96 w-72" : "bottom-0 left-24 h-64 w-80"}`}
              />
            ))}
            <div className="absolute bottom-16 left-0 rounded-lg bg-white/85 p-5 shadow-ambient backdrop-blur-xl">
              <p className="font-headline font-bold">Morning Coffee & Design Talk</p>
              <p className="text-sm text-on-surface-variant">Williamsburg, NY - $1,850/mo</p>
            </div>
          </div>
        </section>
        <section className="bg-surface-container-low px-6 py-20">
          <div className="mx-auto max-w-7xl">
            <h2 className="font-headline text-4xl font-extrabold tracking-tight">Fast, Safe, & <span className="italic text-primary">Intuitive.</span></h2>
            <p className="mt-4 max-w-xl text-lg text-on-surface-variant">A living experience built around human connection, verification, and lifestyle fit.</p>
            <div className="mt-12 grid gap-6 md:grid-cols-3">
              {[
                ["verified", "Vetted Communities", "Every member goes through profile and identity verification."],
                ["psychology", "Smart Matching", "Lifestyle, cleanliness, timing, and social habits guide every recommendation."],
                ["payments", "Secure Transactions", "Digital leases and rent workflows keep your move simple."],
              ].map(([icon, title, text]) => (
                <div key={title} className="card">
                  <MaterialIcon name={icon} className="text-4xl text-primary" fill />
                  <h3 className="mt-6 font-headline text-xl font-bold">{title}</h3>
                  <p className="mt-3 leading-relaxed text-on-surface-variant">{text}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
        <section className="mx-auto max-w-5xl px-6 py-20 text-center">
          <div className="rounded-xl bg-gradient-to-br from-primary to-primary-container px-8 py-16 text-white">
            <h2 className="font-headline text-4xl font-extrabold">Ready to find your next home?</h2>
            <p className="mx-auto mt-4 max-w-xl text-lg text-white/80">Join thousands of people who found their perfect living situation through Homigo.</p>
            <button onClick={() => onNavigate("role")} className="mt-8 rounded-full bg-white px-8 py-3 font-bold text-primary">Start matching</button>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
