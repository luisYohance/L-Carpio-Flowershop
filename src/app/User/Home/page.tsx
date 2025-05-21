import { Button } from "~/components/ui/button";

export default function HomePage() {
  return (
    <div className="bg-zinc-50 font-sans text-[#333]">
      {/* Hero Section */}
      <section
        className="relative h-[600px] bg-cover bg-center opacity-90"
        style={{ backgroundImage: "url('/Pictures/Banner-2.jpg')" }}
      >
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/40 px-4 text-center">
          <h1 className="mb-6 text-4xl font-bold text-white md:text-6xl">
            Gorgeous Flowers for Your Special Event
          </h1>
          <a href="/User/Shop">
            <Button className="rounded bg-[#f6a29d] px-6 py-3 font-semibold text-white hover:bg-[#e69087]">
              Shop Now
            </Button>
          </a>
        </div>
      </section>

      {/* About Section */}
      <section className="bg-zinc-100 px-6 py-16">
        <div className="mx-auto flex max-w-6xl flex-col items-center gap-12 md:flex-row">
          <img
            src="/Pictures/Lcarpio-logo.jpg"
            alt="About"
            className="rounded-m h-80 md:w-1/2"
          />
          <div>
            <h2 className="mb-4 text-2xl font-semibold">
              Welcome to Lcarpio's Flower Shop
            </h2>
            <p className="mb-4 leading-relaxed text-gray-700">
              We sell different kinds of flowers for all occasions. Our flowers
              are sourced from China and are guaranteed to be fresh and of the
              highest quality. Whether you're looking for a bouquet for a
              wedding or a gift for a loved one, we can create it for you
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
