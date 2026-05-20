import { createBrowserClient } from "@supabase/ssr";
import { getSupabasePublicEnv } from "@/lib/env";

type BrowserClientOptions = {
  persistent?: boolean;
};

type BrowserCookieOptions = {
  domain?: string;
  expires?: string | number | Date;
  httpOnly?: boolean;
  maxAge?: number;
  path?: string;
  sameSite?: boolean | "lax" | "strict" | "none";
  secure?: boolean;
};

type BrowserCookieWrite = {
  name: string;
  options: BrowserCookieOptions;
  value: string;
};

function readBrowserCookies() {
  if (typeof document === "undefined") {
    return [];
  }

  return document.cookie
    .split(";")
    .map((cookie) => cookie.trim())
    .filter(Boolean)
    .map((cookie) => {
      const separatorIndex = cookie.indexOf("=");
      const name = separatorIndex >= 0 ? cookie.slice(0, separatorIndex) : cookie;
      const value = separatorIndex >= 0 ? cookie.slice(separatorIndex + 1) : "";

      return { name, value };
    });
}

function serializeCookie(
  name: string,
  value: string,
  options?: BrowserCookieOptions
) {
  const parts = [`${name}=${value}`];

  if (options?.path) {
    parts.push(`Path=${options.path}`);
  }

  if (options?.domain) {
    parts.push(`Domain=${options.domain}`);
  }

  if (typeof options?.maxAge === "number") {
    parts.push(`Max-Age=${options.maxAge}`);
  }

  if (options?.expires) {
    const expires =
      options.expires instanceof Date ? options.expires.toUTCString() : new Date(options.expires).toUTCString();
    parts.push(`Expires=${expires}`);
  }

  if (options?.sameSite) {
    const sameSite =
      options.sameSite === true
        ? "Strict"
        : `${options.sameSite}`.charAt(0).toUpperCase() + `${options.sameSite}`.slice(1);
    parts.push(`SameSite=${sameSite}`);
  }

  if (options?.secure) {
    parts.push("Secure");
  }

  if (options?.httpOnly) {
    parts.push("HttpOnly");
  }

  return parts.join("; ");
}

export function createSupabaseBrowserClient(options?: BrowserClientOptions) {
  const { url, publishableKey } = getSupabasePublicEnv();
  const persistent = options?.persistent ?? true;

  return createBrowserClient(url, publishableKey, {
    isSingleton: false,
    cookies: {
      getAll() {
        return readBrowserCookies();
      },
      setAll(cookiesToSet: BrowserCookieWrite[]) {
        if (typeof document === "undefined") {
          return;
        }

        cookiesToSet.forEach(({ name, value, options: cookieOptions }: BrowserCookieWrite) => {
          const nextOptions = persistent
            ? cookieOptions
            : {
                ...cookieOptions,
                expires: undefined,
                maxAge: undefined
              };

          document.cookie = serializeCookie(name, value, nextOptions);
        });
      }
    }
  });
}
