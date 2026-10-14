import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { SentenceBuilder, VisualListening } from "./Activities";

describe("immersive activities", () => {
  it("gives feedback for the localized visual listening choice", () => {
    render(<VisualListening kk={false} />);
    fireEvent.click(screen.getByRole("button", { name: "Dana reads a poster while waiting for a bus." }));
    expect(screen.getByText("Exactly — she was at the bus stop.")).toBeInTheDocument();
  });

  it("lets the learner reconstruct the model sentence", () => {
    render(<SentenceBuilder kk={false} />);
    for (const chunk of ["While Dana was waiting", "for a bus,", "she noticed a poster", "for a photography walk."]) {
      fireEvent.click(screen.getByRole("button", { name: chunk }));
    }
    fireEvent.click(screen.getByRole("button", { name: /check sentence/i }));
    expect(screen.getByText(/Perfect. Now say the complete sentence/)).toBeInTheDocument();
  });
});
