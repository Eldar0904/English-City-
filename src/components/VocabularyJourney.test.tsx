import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { vocabulary } from "../course";
import VocabularyJourney from "./VocabularyJourney";

vi.mock("react-youtube", () => ({
  default: ({ videoId }: { videoId: string }) => <div>{videoId}</div>,
}));

describe("vocabulary journey", () => {
  it("requires learners to reveal every phrase before retrieval", () => {
    render(<VocabularyJourney words={vocabulary} kk={false} />);
    const next = screen.getByRole("button", { name: /start retrieval/i });
    expect(next).toBeDisabled();
    for (const [phrase] of vocabulary) {
      fireEvent.click(screen.getByRole("button", { name: new RegExp(phrase, "i") }));
    }
    expect(next).toBeEnabled();
    fireEvent.click(next);
    expect(screen.getByText(/which scene shows/i)).toHaveTextContent("settle in");
  });
});
