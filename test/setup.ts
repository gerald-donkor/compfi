import "@testing-library/jest-dom/vitest"
import * as React from "react"
import { vi } from "vitest"

class TestResizeObserver implements ResizeObserver {
  observe() {}
  unobserve() {}
  disconnect() {}
}

class TestIntersectionObserver implements IntersectionObserver {
  readonly root = null
  readonly rootMargin = "0px"
  readonly thresholds = [0]
  observe() {}
  unobserve() {}
  disconnect() {}
  takeRecords() { return [] }
}

globalThis.ResizeObserver ??= TestResizeObserver
globalThis.IntersectionObserver ??= TestIntersectionObserver
globalThis.matchMedia ??= (() => ({
  matches: false,
  media: "",
  onchange: null,
  addListener() {},
  removeListener() {},
  addEventListener() {},
  removeEventListener() {},
  dispatchEvent: () => true,
}))

// Clerk test state
export const testClerkState = {
  isSignedIn: false,
  userId: null as string | null,
}

export function setTestClerkState(state: { isSignedIn: boolean; userId?: string | null }) {
  testClerkState.isSignedIn = state.isSignedIn
  testClerkState.userId = state.isSignedIn ? (state.userId ?? "user_test_compfi_123") : null
}

export function resetTestClerkState() {
  testClerkState.isSignedIn = false
  testClerkState.userId = null
}

vi.mock("@clerk/nextjs", () => {
  return {
    ClerkProvider: ({ children }: { children: React.ReactNode }) => children,
    Show: ({ when, children, fallback }: { when: unknown; children?: React.ReactNode; fallback?: React.ReactNode }) => {
      const signedIn = testClerkState.isSignedIn
      if (when === "signed-in") {
        return signedIn ? children : (fallback ?? null)
      }
      if (when === "signed-out") {
        return !signedIn ? children : (fallback ?? null)
      }
      return fallback ?? null
    },
    SignInButton: ({ children }: { children?: React.ReactNode }) =>
      children ?? React.createElement("button", { type: "button" }, "Sign In"),
    SignUpButton: ({ children }: { children?: React.ReactNode }) =>
      children ?? React.createElement("button", { type: "button" }, "Sign Up"),
    UserButton: (props: React.ComponentProps<"button">) =>
      React.createElement(
        "button",
        {
          type: "button",
          "aria-label": "Open user account menu",
          "data-slot": "user-button",
          ...props,
        },
        "User Account"
      ),
    UserProfile: () =>
      React.createElement("div", { "data-slot": "user-profile" }, "User Profile Component"),
    SignIn: () =>
      React.createElement("div", { "data-slot": "sign-in" }, "Sign In Component"),
    SignUp: () =>
      React.createElement("div", { "data-slot": "sign-up" }, "Sign Up Component"),
    useAuth: () => ({
      isAuthenticated: testClerkState.isSignedIn,
      userId: testClerkState.userId,
      isLoaded: true,
    }),
    useUser: () => ({
      isSignedIn: testClerkState.isSignedIn,
      user: testClerkState.isSignedIn ? { id: testClerkState.userId, firstName: "Compfi", lastName: "Member" } : null,
      isLoaded: true,
    }),
    useClerk: () => ({
      openSignIn: vi.fn(),
      openSignUp: vi.fn(),
      signOut: vi.fn(),
    }),
  }
})

vi.mock("@clerk/nextjs/server", () => ({
  auth: vi.fn(async () => ({
    isAuthenticated: testClerkState.isSignedIn,
    userId: testClerkState.userId,
    protect: vi.fn(),
  })),
  clerkMiddleware: vi.fn((handler) => handler),
  createRouteMatcher: vi.fn((patterns: string[]) => (req: { nextUrl?: { pathname: string }; url?: string }) => {
    const pathname = req?.nextUrl?.pathname || req?.url || ""
    return patterns.some((p: string) => {
      const regexPattern = p.replace(/\(\.\*\)/g, ".*")
      return new RegExp(`^${regexPattern}`).test(pathname)
    })
  }),
}))
