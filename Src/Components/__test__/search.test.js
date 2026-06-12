import { render, screen, waitFor } from "@testing-library/react";
import Body from "../Body";
import { Provider } from "react-redux";
import store from "../../../utils/store";
import { StaticRouter } from "react-router-dom/server";
import { restaData } from "../../mocks/data";
import  "@testing-library/jest-dom";

global.fetch = jest.fn(() => {
  return Promise.resolve({
    ok: true,
    status: 200,
    statusText: "OK",
    json: () => Promise.resolve(restaData),
  });
});


test("Shimmer is loaded on rendering", async () => {
  render(
    <StaticRouter>
      <Provider store={store}>
        <Body />
      </Provider>
    </StaticRouter>
  );

  const shimmer = screen.getByTestId("shimmer");
  expect(shimmer.children.length).toBe(20);

  await waitFor(() => expect(screen.queryByTestId("shimmer")).not.toBeInTheDocument());
});