const Footer = () => {
  return (
    <footer className="border-t border-border py-8">
      <div className="container mx-auto px-4 text-center">
        <div className="flex items-center justify-center gap-1 mb-2">
          <span className="text-muted-foreground">©</span>
          <span className="font-heading font-black text-tedx-red">TED</span>
          <sup className="font-heading font-black text-tedx-red text-xs">x</sup>
          <span className="font-heading font-bold text-foreground ml-1">KPRCAS</span>
        </div>
        <p className="text-muted-foreground text-sm">
          This independent TEDx event is operated under license from TED.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
