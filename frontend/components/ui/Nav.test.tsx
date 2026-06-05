import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import Nav from "./Nav";

// Mock Next.js Link
vi.mock("next/link", () => ({
  default: ({ href, children }: { href: string; children: React.ReactNode }) => (
    <a href={href}>{children}</a>
  ),
}));

describe("Nav", () => {
  it("renders the brand name", () => {
    render(<Nav />);
    expect(screen.getByText(/FinCoach/i)).toBeTruthy();
  });

  it("renders navigation links", () => {
    render(<Nav />);
    expect(screen.getByText("AI Coach")).toBeTruthy();
    expect(screen.getByText("Prompt Lab")).toBeTruthy();
    expect(screen.getByText("HR Insights")).toBeTruthy();
  });
});
