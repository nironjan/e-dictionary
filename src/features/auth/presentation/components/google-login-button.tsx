"use client";

import { Button } from "@/shared/components/ui/button";
import { APP_CONSTANTS } from "../../../../lib/constants/constants";

export function GoogleLoginButton() {
  const handleGoogleLogin = () => {
    window.location.assign(`${APP_CONSTANTS.APP_BASE_URL}/auth/google`);
  };

  return (
    <Button
      type="button"
      variant="outline"
      className="w-full"
      onClick={handleGoogleLogin}
    >
      Continue with Google
    </Button>
  );
}
