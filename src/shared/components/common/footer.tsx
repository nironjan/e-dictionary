import { APP_CONSTANTS } from "../../../lib/constants/constants";

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t bg-muted/40">
      <div className="max-w-7xl mx-auto py-8">
        <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
          <h1>e-Dictionary</h1>
          <p className="text-sm text-muted-foreground">
            © {currentYear} {APP_CONSTANTS.APP_NAME}. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
