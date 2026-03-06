import { useEffect, useRef, useState } from "react";
import { GoogleProfile } from "@/types/auth";

declare global {
  interface Window {
    google?: {
      accounts: {
        id: {
          initialize: (config: {
            client_id: string;
            callback: (response: { credential?: string }) => void;
          }) => void;
          renderButton: (
            element: HTMLElement,
            options: {
              type?: "standard" | "icon";
              theme?: "outline" | "filled_blue" | "filled_black";
              size?: "large" | "medium" | "small";
              text?: string;
              shape?: string;
              width?: number;
            },
          ) => void;
        };
      };
    };
  }
}

const GOOGLE_SCRIPT_ID = "google-gsi-script";

function decodeGoogleCredential(credential: string): GoogleProfile | null {
  try {
    const payload = credential.split(".")[1];
    if (!payload) return null;
    const base64 = payload.replace(/-/g, "+").replace(/_/g, "/");
    const padded = `${base64}${"=".repeat((4 - (base64.length % 4)) % 4)}`;
    const decoded = atob(padded);
    const data = JSON.parse(decoded) as { email?: string; name?: string; picture?: string };
    if (!data.email) return null;
    return {
      email: data.email,
      name: data.name || data.email.split("@")[0],
      picture: data.picture,
    };
  } catch {
    return null;
  }
}

interface GoogleSignInButtonProps {
  onSuccess: (profile: GoogleProfile) => void;
  onError: (message: string) => void;
}

export default function GoogleSignInButton({ onSuccess, onError }: GoogleSignInButtonProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID as string | undefined;

  useEffect(() => {
    if (!clientId) {
      setErrorMessage("Define VITE_GOOGLE_CLIENT_ID to enable Google sign-in.");
      return;
    }

    let mounted = true;

    const mountButton = () => {
      if (!mounted || !containerRef.current || !window.google?.accounts?.id) return;
      window.google.accounts.id.initialize({
        client_id: clientId,
        callback: (response) => {
          if (!response.credential) {
            onError("Google login failed. Please try again.");
            return;
          }
          const profile = decodeGoogleCredential(response.credential);
          if (!profile) {
            onError("Google response could not be parsed.");
            return;
          }
          onSuccess(profile);
        },
      });
      containerRef.current.innerHTML = "";
      window.google.accounts.id.renderButton(containerRef.current, {
        type: "standard",
        theme: "outline",
        size: "large",
        shape: "pill",
        text: "continue_with",
        width: 320,
      });
      setErrorMessage(null);
    };

    if (window.google?.accounts?.id) {
      mountButton();
      return () => {
        mounted = false;
      };
    }

    const existing = document.getElementById(GOOGLE_SCRIPT_ID) as HTMLScriptElement | null;
    const script = existing || document.createElement("script");
    if (!existing) {
      script.id = GOOGLE_SCRIPT_ID;
      script.src = "https://accounts.google.com/gsi/client";
      script.async = true;
      script.defer = true;
      document.body.appendChild(script);
    }

    const onLoad = () => mountButton();
    const onErrorScript = () => setErrorMessage("Google script failed to load.");

    script.addEventListener("load", onLoad);
    script.addEventListener("error", onErrorScript);

    return () => {
      mounted = false;
      script.removeEventListener("load", onLoad);
      script.removeEventListener("error", onErrorScript);
    };
  }, [clientId, onError, onSuccess]);

  return (
    <div className="space-y-2">
      <div ref={containerRef} className="flex min-h-10 justify-center sm:justify-start" />
      {errorMessage && <p className="text-xs text-amber-600">{errorMessage}</p>}
    </div>
  );
}
