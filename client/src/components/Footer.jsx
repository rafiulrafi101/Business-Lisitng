const Footer = () => (
  <footer className="border-t border-slate-200 bg-white">
    <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-2 px-4 py-6 text-center text-sm text-slate-500 md:flex-row">
      <p>&copy; {new Date().getFullYear()} Local Listings. All rights reserved.</p>
      <p>
        Built with <span className="font-semibold text-blue-600">MERN</span> for local communities.
      </p>
    </div>
  </footer>
);

export default Footer;
