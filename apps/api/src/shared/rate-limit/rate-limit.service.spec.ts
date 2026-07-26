import { RequestRateLimiter } from "./rate-limit.service";

describe("RequestRateLimiter", () => {
  it("blocks requests above the limit and reports the remaining wait time", () => {
    jest.spyOn(Date, "now").mockReturnValue(1_000);
    const rateLimiter = new RequestRateLimiter();
    const limit = { maxRequests: 2, windowMs: 60_000, message: "Limite" };

    expect(rateLimiter.consume("assistant:127.0.0.1", limit)).toMatchObject({ allowed: true });
    expect(rateLimiter.consume("assistant:127.0.0.1", limit)).toMatchObject({ allowed: true });
    expect(rateLimiter.consume("assistant:127.0.0.1", limit)).toEqual({
      allowed: false,
      retryAfterSeconds: 60,
    });
  });
});
