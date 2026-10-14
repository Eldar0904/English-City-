import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import YouTubeLab from "./YouTubeLab";

vi.mock("react-youtube", () => ({
  default: ({ videoId }: { videoId: string }) => <div data-testid="youtube-player">{videoId}</div>,
}));

describe("YouTube Learning Lab", () => {
  it("shows the verified source and delayed shadowing phrase", () => {
    render(<YouTubeLab kk={false} />);
    expect(screen.getByTestId("youtube-player")).toHaveTextContent("UNP03fDSj1U");
    expect(screen.queryByText("I decided to try something new for 30 days.")).not.toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: /reveal phrase/i }));
    expect(screen.getByText("I decided to try something new for 30 days.")).toBeInTheDocument();
  });
});
