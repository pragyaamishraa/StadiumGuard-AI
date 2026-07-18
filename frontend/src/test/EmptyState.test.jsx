import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import EmptyState from "../components/EmptyState.jsx";

describe("EmptyState", () => {
  it("renders title and description", () => {
    render(<EmptyState title="No routes yet" description="Try searching for a route." />);
    expect(screen.getByText("No routes yet")).toBeInTheDocument();
    expect(screen.getByText("Try searching for a route.")).toBeInTheDocument();
  });

  it("renders without a description", () => {
    render(<EmptyState title="Nothing here" />);
    expect(screen.getByText("Nothing here")).toBeInTheDocument();
  });
});
