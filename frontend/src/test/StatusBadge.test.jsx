import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import StatusBadge from "../components/StatusBadge.jsx";

describe("StatusBadge", () => {
  it("renders the status text when no custom label is given", () => {
    render(<StatusBadge status="high" />);
    expect(screen.getByText("high")).toBeInTheDocument();
  });

  it("renders a custom label when provided", () => {
    render(<StatusBadge status="critical" label="critical priority" />);
    expect(screen.getByText("critical priority")).toBeInTheDocument();
  });

  it("falls back to moderate styling for unknown statuses", () => {
    render(<StatusBadge status="unknown-status" />);
    expect(screen.getByText("unknown-status")).toBeInTheDocument();
  });
});
