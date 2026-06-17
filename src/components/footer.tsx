
export function Footer() {
  return (
    <footer className="bg-primary text-white py-16">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 border-b border-white/10 pb-12 mb-12">
          <div className="space-y-4">
            <h3 className="text-2xl font-headline font-bold">SIKSHA WALLAH HUB</h3>
            <p className="text-white/70 max-w-xs">
              Providing professional guidance for students in Bihar and beyond to find their ideal academic career since 2010.
            </p>
          </div>
          <div>
            <h4 className="font-bold text-lg mb-6">Quick Links</h4>
            <ul className="space-y-3 text-white/70">
              <li><a href="#courses" className="hover:text-accent transition-colors">Course Navigator</a></li>
              <li><a href="#ai-advisor" className="hover:text-accent transition-colors">AI Advisor</a></li>
              <li><a href="#inquiry" className="hover:text-accent transition-colors">Inquiry Portal</a></li>
              <li><a href="#location" className="hover:text-accent transition-colors">Office Location</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold text-lg mb-6">Contact Admin</h4>
            <ul className="space-y-3 text-white/70">
              <li>Rajesh Sah (Director)</li>
              <li>Forbesganj, Araria, Bihar</li>
              <li>+91 99346 54XXX</li>
              <li>contact@sikshawallah.com</li>
            </ul>
          </div>
        </div>
        <div className="flex flex-col md:flex-row justify-between items-center text-sm text-white/50">
          <p>© {new Date().getFullYear()} Siksha Wallah Hub. All Rights Reserved.</p>
          <p className="mt-4 md:mt-0 font-medium">Empowering Education in Forbesganj</p>
        </div>
      </div>
    </footer>
  );
}
