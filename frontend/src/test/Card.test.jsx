import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import Card from "../components/Card.jsx";

describe("Card", () => {
  it("renders children content", () => {
    render(<Card>Hello Stadium</Card>);
    expect(screen.getByText("Hello Stadium")).toBeInTheDocument();
  });

  it("applies custom className alongside defaults", () => {
    render(<Card className="custom-class">Content</Card>);
    const el = screen.getByText("Content");
    expect(el).toHaveClass("custom-class");
    expect(el).toHaveClass("rounded-2xl");
  });
});
