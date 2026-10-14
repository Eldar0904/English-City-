import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { YouTubeMicroLesson, YouTubeSpeakingModel } from "./VideoActivities";

vi.mock("react-youtube", () => ({
  default: ({ videoId }: { videoId: string }) => <div data-testid="youtube-player">{videoId}</div>,
}));

describe("video-led activities", () => {
  it("moves from gist listening to chunk reconstruction", () => {
    render(<YouTubeMicroLesson kk={false} />);
    fireEvent.click(screen.getByRole("button", { name: /try something new for 30 days/i }));
    expect(screen.getByText(/rebuild the key sentence/i)).toBeInTheDocument();
    for (const chunk of ["I decided", "to try something new", "for 30 days."]) {
      fireEvent.click(screen.getByRole("button", { name: chunk }));
    }
    expect(screen.getByText(/shadow the complete sentence/i)).toBeInTheDocument();
  });

  it("pairs the speaking scaffold with the authentic clip", () => {
    render(<YouTubeSpeakingModel kk={true} />);
    expect(screen.getByText("I’ve always wanted to…")).toBeInTheDocument();
    expect(screen.getByTestId("youtube-player")).toHaveTextContent("UNP03fDSj1U");
  });
});
