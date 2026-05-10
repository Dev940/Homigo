export default function Footer() {
  return (
    <footer className="bg-surface-container-low px-6 py-10 text-sm text-on-surface-variant">
      <div className="mx-auto grid max-w-7xl gap-8 md:grid-cols-4">
        <div>
          <p className="font-headline text-2xl font-black italic text-primary">Homigo</p>
          <p className="mt-3">Curating your next chapter.</p>
        </div>
        {["Platform", "Company", "Social"].map((title) => (
          <div key={title}>
            <p className="mb-4 font-headline font-bold text-on-surface">{title}</p>
            <div className="space-y-2">
              <p>Find Roommates</p>
              <p>List Your Space</p>
              <p>Support</p>
            </div>
          </div>
        ))}
      </div>
    </footer>
  );
}
