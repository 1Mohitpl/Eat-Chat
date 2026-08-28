import { getOrderStage, isDelivered } from "../orderslice";

const orderAt = (secAgo) => ({ id: "ORD1", placedAt: Date.now() - secAgo * 1000 });

describe("getOrderStage", () => {
  test("starts at 'placed' immediately after ordering", () => {
    const stage = getOrderStage(orderAt(0));
    expect(stage.key).toBe("placed");
    expect(stage.index).toBe(0);
  });

  test("advances through each stage boundary", () => {
    expect(getOrderStage(orderAt(5)).key).toBe("placed");
    expect(getOrderStage(orderAt(10)).key).toBe("confirmed");
    expect(getOrderStage(orderAt(31)).key).toBe("preparing");
    expect(getOrderStage(orderAt(76)).key).toBe("on_the_way");
    expect(getOrderStage(orderAt(151)).key).toBe("delivered");
  });

  test("is delivered after the final timeline", () => {
    const order = orderAt(200);
    expect(isDelivered(order)).toBe(true);
  });

  test("clamps future timestamps to 'placed' instead of crashing", () => {
    const order = { id: "ORD2", placedAt: Date.now() + 60000 };
    expect(getOrderStage(order).key).toBe("placed");
    expect(isDelivered(order)).toBe(false);
  });
});
