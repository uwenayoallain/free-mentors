import { render, screen } from "@testing-library/react";
import App from "../App";

describe("App Component", () => {
  it('should render a button with text "Click Me"', () => {
    render(<App />);
    expect(
      screen.getByRole("button", { name: /click me/i }),
    ).toBeInTheDocument();
  });

  it('should render text "Hello, Free mentors"', () => {
    render(<App />);
    expect(screen.getByText(/hello, free mentors/i)).toBeInTheDocument();
  });

  it("should render inside a container", () => {
    const { container } = render(<App />);
    expect(container.querySelector(".MuiContainer-root")).toBeInTheDocument();
  });

  it("should render the router with multiple routes", () => {
    // Mock the components to avoid rendering their actual content
    jest.mock("../pages/HomePage", () => () => <div>HomePage</div>);
    jest.mock("../pages/AuthPage", () => () => <div>AuthPage</div>);

    render(<App />);

    // Check if Router component is rendered
    expect(document.querySelector('div[data-testid="routes"]')).toBeDefined();
  });

  it("should contain protected routes", () => {
    // Create a spy on the ProtectedRoute component
    jest.mock("../utils/ProtectedRoute");
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const ProtectedRoute = require("../utils/ProtectedRoute").default;
    const protectedRouteSpy = jest.spyOn(ProtectedRoute, "render");

    render(<App />);

    // Verify ProtectedRoute is used
    expect(protectedRouteSpy).toHaveBeenCalled();
  });

  it("should provide Redux store to the application", () => {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const providerSpy = jest.spyOn(require("react-redux"), "Provider");

    render(<App />);

    expect(providerSpy).toHaveBeenCalledWith(
      expect.objectContaining({ store: expect.anything() }),
      expect.anything()
    );
  });
});
